---
date: '2026-07-27T20:00:00-03:00'
draft: false
title: 'How to Delete Users in SaaS Without Breaking Your Database or the Law'
summary: 'The right framework for thinking about and structuring sensitive user data in a SaaS, so you comply with the law while keeping the references your system needs.'
categories:
- Software Development
- Security
- Data Protection
- Technology
tags:
---

Every SaaS has to decide what happens when a user clicks "delete my account". Run a plain `DELETE FROM users WHERE id = ?` and you'll most likely either hit a database constraint or leave orphaned rows in some other table. The usual next move is to add a column called `deleted_at` and do what's known as a *"soft delete"*: the data is still there, just hidden from the user.

That's not the right framework for making this kind of decision. "Hard delete or soft delete?" is a question about *how* you erase a row. It says nothing about whether you **may** keep what's in it, or whether you're **required** to.

This article is about the right framework.

{{< callout type="warning" >}}
This isn't full legal advice. I'm an engineer who has hit these problems, passing on what's generally safe and good practice, but I'm not your lawyer. The frameworks here are how I reason about data lifecycle as an architect. For large-scale systems or very sensitive data (finance, health), validate the details with your legal team or DPO.
{{< /callout >}}

## The real question isn't "hard or soft"

Hard delete and soft delete are *implementation techniques*. They sit at the very end of a decision. Developers reach for them first because they're the part that shows up in the code, but the right technique is entirely determined by two prior questions:

1. **Is this still personal data?** Data that identifies a living person directly (name, email, tax ID) or indirectly (an IP plus a timestamp, a device ID, a combination of attributes that narrows down to one person) is in scope for data-protection law. Data that has had every link to the person *irreversibly* removed is not.

2. **Is there a legal basis to keep it?** A signed contract, a tax obligation, an ongoing dispute, consent that hasn't been withdrawn. If a lawful, documented reason to retain the data exists, you keep it.

So:

- Still personal, and a legal basis forces me to keep it? → keep it (a soft delete only hides the data from the operation).
- Still personal, but the basis is gone? → erase it (hard delete, or irreversible anonymization).
- No longer personal data → the law stops caring; keep it forever if it's useful (analytics, aggregates).

## The deletion spectrum is not binary

There aren't two options, there are five, and they form a spectrum running from "still fully there" to "physically gone". You need to know all five to pick the best one for your case.

**Soft delete** — it becomes a flag (`deleted_at`, `is_active`). The row, and every byte of personal data in it, stay in the database. All you did was hide it from the application. Legally, *nothing was deleted* — it's still personal data, still in scope, still your liability if it leaks. Soft delete is operational convenience (undo, audit, referential safety), never a compliance answer.

**Pseudonymization** — swap the direct identifiers for a token and keep a separate mapping capable of reversing it. The LGPD treats pseudonymization (`Art. 13, §4`) as a security measure that reduces risk, but pseudonymized data *is still personal data*, because the re-identification key exists. Useful for limiting the blast radius and for analytics on production-shaped data, but it doesn't take you out of scope.

**Anonymization** — transform the data so that re-identification is no longer reasonably possible, by anyone, yourself included. Aggregation, generalization, k-anonymity, permanently discarding the linking keys. The bar is high and "irreversible" is doing real work in that sentence — weak anonymization, the kind a join across two tables undoes, is just pseudonymization in disguise. But when it genuinely holds up, **anonymized data leaves the scope of the law entirely** (the LGPD says so in `Art. 12`: anonymized data is not personal data, unless the process can be reversed). It's the escape hatch: the only transformation that lets you keep useful information forever, with no ongoing obligation.

**Crypto-shredding (cryptographic erasure)** — encrypt the data with a key unique to that entity and, when you need to "delete", destroy the key instead of the data. The ciphertext stays, but turns into unrecoverable noise. NIST SP 800-88 recognizes *Cryptographic Erase* as a valid sanitization method, and European practice accepts key destruction as an erasure path. It's the answer to the problem everyone runs into: data spread across replicas, snapshots and **immutable backups** that you can't edit surgically. You don't run an `UPDATE` against a backup from 2024, but if the only key that decrypts that user's rows is gone, the backup is erased for them too. You will want to back up the encryption key as well, though, which creates a similar problem.

**Hard delete** — `DELETE FROM`. The row is physically gone. Clean and unambiguous in the primary database, but it's the technique that collides most with foreign keys and with the backups that still hold a copy of the data.

## What the law actually requires

I'll anchor this in the **LGPD (Law 13.709/2018)**, Brazil's general data protection law, because it's the one most Brazilian SaaS teams have to comply with first — but the shape is the same in the European **GDPR** and in the patchwork of US state laws (California's **CCPA/CPRA** and the growing list that follows it). An architecture built to satisfy the LGPD covers the others in the overwhelming majority of cases.

**The right to erasure exists, and it isn't absolute.** The LGPD gives the data subject the right to ask for their data to be erased (`Art. 18`, in particular erasure of unnecessary or excessive data, or data processed in non-compliance, plus erasure of data processed on the basis of consent), and the default is that you honor it. But `Art. 16` lists the cases where data may be retained, and they carry as much weight as the right. Data may be kept for:

- **Compliance with a legal or regulatory obligation.** If a law says keep it, you keep it. Tax and accounting records are the classic case.
- **Study by a research body**, with anonymization guaranteed wherever possible.
- **Exclusive use by the controller**, with third-party access barred and provided the data is anonymized.

**Retention periods are set by other laws, not by the privacy law.** This is the part engineers always get wrong: the LGPD doesn't tell you to keep an invoice for N years, it tells you to erase *when no purpose justifies keeping the data* — and it's a *different* law (the tax code, commercial legislation, a health regulation) that defines that *N*. Some concrete, commonly cited orders of magnitude:

| Data class | Where the retention period comes from | Order of magnitude |
|---|---|---|
| Invoices, tax/accounting records | Tax and commercial law | ~5 years (tax assessment and limitation periods) |
| Contracts and related records | Civil limitation periods | Years, until claims expire |
| Medical records | Health regulation (Brazil's CFM) | Very long (decades) |
| Marketing consent logs | Proof of consent | Life of the consent plus a margin |
| App/security logs with PII | Security necessity | Short — months, not years |

(These are illustrative and approximate. Your jurisdiction and your sector set the real numbers — confirm with your legal team.)

**The data subject has to do their part.** A valid erasure request requires **identity verification** — you can't erase (or disclose) data on the strength of an unauthenticated email, because that's an attack vector. Confirm that whoever is asking is the data subject, then act.

**You have to propagate and you have to record.** Two obligations developers forget:

- **Propagate.** If you shared the data with processors (your sub-processors — payment gateway, email provider, analytics) or other recipients, you have to pass the erasure along. The processor handles data according to the controller's instructions (`Art. 39`); deleting your own row while a copy survives in a third-party system you control is not "done".
- **Record.** Accountability is itself a legal duty. The LGPD requires controllers and processors to keep a **record of processing operations** (`Art. 37`) and, in high-risk cases, a **Data Protection Impact Assessment (DPIA)**. In practice, you need to be able to show, per data class, why you hold it and when it leaves. It's the direct equivalent of the GDPR's RoPA.

**Response deadlines.** LGPD: the response can be *immediate* (simplified declaration) or within **15 days** (full declaration). GDPR: **one month**, extendable by two more in complex cases. CCPA/CPRA: **45 days**, extendable to 90. Build your SLA around the tightest deadline you're subject to.

## The hard problem: external references and referential integrity

Here's the case that breaks the naive `DELETE`: a user asks to be forgotten, but they have **payments** attached. You're legally obliged to keep those payment and invoice records for the fiscal retention period. You also can't delete the `users` row, because a dozen foreign keys point at it. So what do you do?

**Wrong answer:** hard-delete the user with a cascade. You just destroyed records you were required by law to keep, and broke your own financial history.

**Also wrong:** soft-delete the user and call it done. All the personal data is still there, fully in scope, indefinitely — you haven't honored the erasure at all.

**Right answer: don't delete the parent row — anonymize the identity *inside* it.** Keep the row and its primary key so the foreign keys stay valid; overwrite the personal, identifying fields with neutral tombstone values; preserve the non-identifying transactional facts the retained records need. The payment still points at user `4711`; user `4711` is now "Deleted user", no email, no name, no ID document — a tombstone.

> *"But what if I need to know who it was?"*

There are two very different things hiding in that sentence:

- **You just *want* to know** — to debug, for the "what if support asks", out of a vague sense that kept history is safer. There's no legal basis in *wanting*. Anonymize. The discomfort of not being able to look someone up later is not a retention purpose.
- **You *need* to, by obligation or by a legitimate, documented right** — the buyer's tax ID is mandatory on the invoice; an open fraud investigation needs the identity within the limitation period. Then you retain, but you *segregate*. Keeping what is lawful and required in the table it belongs to is one option; better still is a table dedicated to just those fields.

The structural way to make this easy is to **model in two layers from the start**: an identity/operational layer that you can tombstone wholesale, and a transactional/legal record layer that survives, carrying only the minimal identifiers some law actually mandates.

```sql {filename="two-layer model"}
-- Layer 1: identity / operational. Tombstoned on erasure.
CREATE TABLE users (
    id            BIGINT PRIMARY KEY,
    email         TEXT,
    full_name     TEXT,
    tax_id        TEXT,          -- moves OUT on erasure if no obligation needs it in this layer
    deleted_at    TIMESTAMPTZ,
    is_anonymized BOOLEAN NOT NULL DEFAULT FALSE
);

-- Layer 2: transactional / legal record. Survives the user, keeps FKs valid.
CREATE TABLE payments (
    id          BIGINT PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id),  -- FK preserved, never cascaded away
    amount      NUMERIC(12,2) NOT NULL,
    currency    CHAR(3) NOT NULL,
    paid_at     TIMESTAMPTZ NOT NULL,
    invoice_no  TEXT NOT NULL
);

-- Restricted store: only the identifiers a law actually mandates, with an expiry.
CREATE TABLE fiscal_identity_vault (
    payment_id   BIGINT PRIMARY KEY REFERENCES payments(id),
    legal_name   TEXT NOT NULL,
    tax_id       TEXT NOT NULL,
    retain_until DATE NOT NULL          -- the deletion job purges past this date
);
```

Erasure then becomes a tombstone `UPDATE`, not a `DELETE` — the foreign keys never even notice:

```sql {filename="tombstone on erasure"}
UPDATE users
SET email         = NULL,
    full_name     = 'Deleted user',
    tax_id        = NULL,
    is_anonymized = TRUE,
    deleted_at    = now()
WHERE id = 4711;
-- payments.user_id = 4711 still resolves. The transactional record is intact.
-- legal_name / tax_id survive ONLY in fiscal_identity_vault, and ONLY until retain_until.
```

The `payments` row keeps the system-level and fiscal history — amount, date, invoice number and a stable reference to a (now anonymous) customer. The identifying data lives in the restricted vault, scoped exactly to the records a law mandates, and the same "end-of-legal-basis" job that runs the tombstone also purges the vault once `retain_until` expires.

The master rule, if you remember nothing else: **minimize and segregate by legal basis.** For every piece of sensitive data that still exists *after* you've processed a deletion, you have to be able to point at the specific obligation that justifies keeping it. If you can't name the obligation, the data shouldn't be there.
