---
date: '2026-07-28T16:00:00-03:00'
draft: false
title: 'Engineering a Multi-Acquirer Mobile POS'
summary: 'How I designed a mobile POS architecture with one UI over many acquirers, on-device payments, and shipping without going through the store'
categories:
- Software Development
- Technology
- Mobile
tags:
- best
---

I was contacted by the CEO of a sports-tech startup to engineer a mobile POS (Point of Sale) application architecture. The idea was to sell tickets and products right at the event gate, in an operator's hand, using the card terminals he already had in the field.

The ask sounded simple — "a POS on a phone" — but it hid three problems that would shape the whole architecture:

1. **One UI and one set of business rules running on top of different acquirers:** Each acquirer (here, Getnet and Fiserv) has its own SDK, its own terminal hardware, its own business rules, its own certification and store-distribution process.
2. **Payments don't go through the server:** The terminal is what approves the transaction, right there, locally. The server cannot be the source of truth for the charge. Even so, tickets and orders have to stay consistent.
3. **Being able to change the app fast:** To respond to the customer's demands without going through the entire store submission and certification process for every tweak.

This article is about how I solved each of them.

## The shape of the problem

This isn't a web checkout. The operator is standing at an event entrance, holding a dedicated terminal, with connectivity that comes and goes and a line of people waiting. The app has to be fast, work when the network flickers, and never — under any circumstances — charge a card without delivering the matching ticket.

Add to that the fact that each acquirer treats the terminal as its own platform: Getnet runs on Ingenico-class handhelds, Fiserv (via Clover/SiTef) has its own sales app and its own publishing process through its dashboard. They are distinct worlds of certification and deployment for the very same feature.

The stack I chose was **React Native with Expo**, in TypeScript, with the native layer in Kotlin for the acquirers' libraries. The Expo choice wasn't aesthetic — it directly solves the third problem, as I'll get to later.

## Challenge 1 — One app, many acquirers

The solution had two layers. On the **JavaScript** side, every payment goes through a single interface — a `Strategy`. The UI and the business logic only ever know that interface; they have no idea which acquirer is behind it.

This is necessary for a rather prosaic reason: each acquirer ships a library with its own names, signatures and formats. One wants the amount in cents, the other as a decimal value; one returns the NSU in a top-level field, the other buries it inside a response object; one's printer takes a finished bitmap, the other expects line-by-line commands. Without an interface in between, those differences leak into the screens — and every screen ends up knowing which terminal it's running on.

```typescript {filename="IPaymentStrategy.ts"}
export interface PaymentRequest {
  amountCents: number;
  installments: number;
  method: 'CREDIT' | 'DEBIT' | 'PIX' | 'CASH';
  merchantTaxId?: string; // used by one acquirer, ignored by another
  idempotencyKey: string;
}

export interface PaymentResult {
  status: 'APPROVED' | 'DECLINED' | 'CANCELLED';
  nsu?: string;
  authCode?: string;
  brand?: string;
}

export interface IPaymentStrategy {
  pay(request: PaymentRequest): Promise<PaymentResult>;
}
```

A *factory* decides which implementation to return based on the POS type of that build; for the rest of the app, it's transparent:

```typescript {filename="PaymentService.ts"}
function resolveStrategy(posType: PosType): IPaymentStrategy {
  switch (posType) {
    case 'getnet': return new GetNetPaymentStrategy();
    case 'clover': return new CloverPaymentStrategy(); // Fiserv / SiTef
    case 'cash':   return new CashPaymentStrategy();
    default:       return new MockPaymentStrategy();    // emulator / tests
  }
}
```

The **JavaScript** layer solves the *shape* of the abstraction. But each acquirer's native SDK still has to make it into the binary — and that's where the trick is. I could have picked the SDK at runtime with an `if`, but that forces **every** SDK into **every** APK and mixes certification requirements from different acquirers into a single binary. Instead of loading everything everywhere, I used Android **product flavors** (Gradle). Each flavor compiles into its own independent APK, and Gradle only includes that flavor's source set.

The rule is simple: `src/main` carries the **interface** of the native bridge (the "socket"); each `src/<flavor>` carries the **implementation** that plugs into it. Same-package classes in the flavor override those in `main` at build time.

{{< filetree/container >}}
  {{< filetree/folder name="services" >}}
    {{< filetree/folder name="payment" >}}
      {{< filetree/file name="IPaymentStrategy.ts" >}}
      {{< filetree/file name="PaymentService.ts" >}}
      {{< filetree/folder name="getnet" state="closed" >}}
        {{< filetree/file name="GetNetPaymentStrategy.ts" >}}
        {{< filetree/file name="GetNetConfig.ts" >}}
      {{< /filetree/folder >}}
      {{< filetree/folder name="clover" state="closed" >}}
        {{< filetree/file name="CloverPaymentStrategy.ts" >}}
        {{< filetree/file name="CloverConfig.ts" >}}
      {{< /filetree/folder >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
  {{< filetree/folder name="android/app/src" >}}
    {{< filetree/folder name="main" >}}
      {{< filetree/file name="PaymentInterface.kt" >}}
      {{< filetree/file name="PaymentModule.kt" >}}
    {{< /filetree/folder >}}
    {{< filetree/folder name="getnet" state="closed" >}}
      {{< filetree/file name="PaymentProvider.kt" >}}
      {{< filetree/file name="GetNetPaymentImpl.kt" >}}
    {{< /filetree/folder >}}
    {{< filetree/folder name="clover" state="closed" >}}
      {{< filetree/file name="PaymentProvider.kt" >}}
      {{< filetree/file name="CloverPaymentImpl.kt" >}}
    {{< /filetree/folder >}}
    {{< filetree/folder name="generic" state="closed" >}}
      {{< filetree/file name="PaymentProvider.kt" >}}
    {{< /filetree/folder >}}
    {{< filetree/folder name="mock" state="closed" >}}
      {{< filetree/file name="PaymentProvider.kt" >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
{{< /filetree/container >}}

In Gradle the flavors are declared, and each `assemble<Flavor>Release` produces a lean APK carrying only that acquirer's SDK:

```groovy {filename="android/app/build.gradle"}
android {
  flavorDimensions "acquirer"
  productFlavors {
    getnet  { dimension "acquirer" }
    clover  { dimension "acquirer" } // Fiserv / SiTef
    generic { dimension "acquirer" }
    mock    { dimension "acquirer" } // emulator only
  }
}
```

That handles the **static** part (which SDK exists in the binary). What's left is the **dynamic** part: the same acquirer serves many stores, each with its own tax ID, its own merchant code and its own tender rules (does it take cash? installments?). That data doesn't belong to the build — it belongs to the merchant. It comes from our own backend at login and lives in a merchant context that feeds the payment strategy at runtime.

The result: **a single APK per acquirer** serves all of that acquirer's stores; switching stores means switching configuration, not binaries.

## Challenge 2 — Money happens off the server

The charge is approved on the terminal itself, locally. When the terminal returns "approved" with an NSU, the money is **already in** — whether or not the server knows about it. The server cannot be the source of truth for the financial transaction; at most, it records the charge afterward.

But the event sells tickets in finite batches. If I charged first and tried to reserve the ticket afterward, I could end up charging a card for a batch that had already sold out, which can't happen.

The solution is a three-phase protocol, with the reservation **before** the charge:

```text
Phase 1 — Reserve   POST /pos/reserve   → server holds the slot under lock
Phase 2 — Charge    local terminal       → terminal approves/declines
Phase 3a — Confirm  POST /pos/confirm    → promotes reservation, records payment (if approved)
Phase 3b — Release  POST /pos/release    → returns the slot to the batch (if declined)
```

The reservation comes **before** triggering the terminal. If the batch has sold out, the terminal is never even called — so you never charge a card without a ticket to hand over.

This whole lifecycle is coordinated by a **local saga** persisted on the device. The saga is a small state machine that survives app closes, network drops and terminal shutdowns:

```text
PENDING_PAYMENT ──approved──▶ COMPLETED
        │
        ├──declined──▶ DECLINED   (triggers release of the reservation)
        │
        ├──post-charge failure──▶ NEEDS_ATTENTION
        │
        └──aborted──▶ CANCELLED
```

The saga is written **before** the terminal is triggered. Every operation carries an `idempotencyKey`, and the backend has a uniqueness constraint on that key. That means replaying a `confirm` — through a timeout, a retry, an app reopen — never records the payment twice.

And when the charge is approved but the backend write fails (the network dropped at the worst moment)? The payment is **not lost**. It goes into a local pending queue that is drained on the app's next boot. The terminal's NSU is the proof the money came in; the server record is eventual consistency. The operator can also reprint and reprocess from the history. That's what lands a saga in `NEEDS_ATTENTION`: the charge went through, but some later step — writing the ticket, writing the payment, printing every copy — didn't finish. It isn't a terminal error: it's an actionable row on the history screen, with a retry button.

Terminals have little storage: accumulated logs and sagas got close to filling the local SQLite — the fix was to keep debug logs in memory only and to delete completed sagas.

## Challenge 3 — Changing fast without going through the store

The first two challenges are about architecture. This one is about *speed* — and it's where Expo earns its place.

Distributing a POS app is slow by nature. Every APK has to go through the acquirer's process: Getnet's portal, Fiserv's dashboard, signing, certification. That takes days. And the customer, in the middle of an event, asks for a receipt text tweak or a change to a charging rule for *right now*.

The way out was to split the deploy into **two independent axes**:

- The **native axis (APK)**, identified by `runtimeVersion`. It changes when native code changes. It's the slow axis, with certification.
- The **JS-bundle axis (OTA)**, delivered via **EAS Update**. It's the fast axis: an `eas update` publishes a new JavaScript bundle that devices download on their own at next boot, with no reinstall and no trip through the store.

```bash {filename="terminal"}
# UI / business-rule fix — lands in minutes, no reinstall
eas update --branch production --message "receipt tweak"

# Native change — requires an APK rebuild and re-certification
eas build --profile production
```

The line between the two axes is sharp:

{{< callout type="warning" >}}
OTA only updates the JavaScript side. Touching a native interface, adding an acquirer SDK, requesting a new Android permission — all of that requires an APK rebuild and a `runtimeVersion` bump.
{{< /callout >}}

In practice, **the overwhelming majority of day-to-day demands are JavaScript**: screen layout, API calls, receipt templates, split and installment rules, feature flags. All of it ships over OTA, in minutes. The slow store process is reserved only for what genuinely touches native.

Of course, that's because the architecture was built to work that way. Everything that could be parameterized or assembled on the native side receives objects created by the OTA-updatable side, which leaves room to adjust even the rules for acquirer communication and printing.

Printing is the clearest example. Native has no idea what a ticket is: it knows how to execute `TEXT`, `IMAGE` and `QRCODE` on that hardware. What makes up the receipt — what goes in, in what order, with which font and alignment — is a command list built in JavaScript:

```typescript {filename="services/printers/printTicket.ts"}
const commands: PrintCommand[] = [
  logoBase64
    ? { type: 'IMAGE', base64: logoBase64, align: 'CENTER' }
    : { type: 'IMAGE', source: 'app_logo', align: 'CENTER' },
  { type: 'TEXT', value: '─── TICKET ───', align: 'CENTER', font: 'MEDIUM' },
  { type: 'TEXT', value: teamsLabel ?? eventTitle, align: 'CENTER', font: 'SMALL' },
  { type: 'TEXT', value: batchName, align: 'CENTER', font: 'SMALL' },
  { type: 'TEXT', value: formatCurrency(priceCents), align: 'CENTER', font: 'MEDIUM' },
  { type: 'QRCODE', value: accessCode, align: 'CENTER', height: 376 },
  { type: 'TEXT', value: accessCode, align: 'CENTER', font: 'SMALL' },
];

await PrinterService.print(commands); // → PrinterModule.executeBatch(commands)
```

On the other side of the bridge, the native module takes that array and delegates to the current flavor's implementation — not a single line of Kotlin knows the ticket layout. Reordering fields, adding the match date to the header or including the event logo is editing that list. Which means: `eas update`, not a new certification.

The real test was the debut event: **2,700 tickets sold** through this code, with the operation flowing at the gate from start to finish.
