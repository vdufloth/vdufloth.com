---
date: '2026-07-28T16:00:00-03:00'
draft: false
title: 'Arquitetando um PDV Mobile Multiadquirente'
summary: 'Como projetei a arquitetura de um PDV mobile com uma única UI sobre várias adquirentes, pagamento local e deploy sem passar pela loja'
categories:
- Desenvolvimento de Software
- Tecnologia
- Mobile
tags:
- best
---

Fui procurado pelo CEO de uma startup de tecnologia esportiva para arquitetar um aplicativo de PDV (Ponto de Venda) mobile. A ideia era vender ingressos e produtos direto na catraca dos eventos, na mão de um operador, usando as maquininhas de cartão que ele já tinha em campo.

O pedido parecia simples — "um PDV no celular" — mas escondia três problemas que definiriam toda a arquitetura:

1. **Uma só UI e uma só regra de negócio rodando sobre adquirentes diferentes:** Cada adquirente (no caso, Getnet e Fiserv) tem seu próprio SDK, seu próprio hardware de maquininha, suas próprias regras de negócio, seu próprio processo de homologação e distribuição do app para as lojas.
2. **O pagamento não passa pelo servidor:** Quem aprova a transação é a maquininha, ali, localmente. O servidor não pode ser a fonte da verdade da cobrança. Mesmo assim, os ingressos e as comandas precisam manter consistência.
3. **Conseguir mudar o app rápido:** Para responder às demandas do cliente sem ter que passar pelo processo inteiro de submissão e homologação na loja a cada ajuste.

Este artigo é sobre como resolvi cada um deles.

## O formato do problema

Não é um checkout web. O operador está parado numa entrada de evento, com um terminal dedicado na mão, conectividade que vai e volta, e uma fila de gente esperando. O app precisa ser rápido, funcionar quando a rede oscila e nunca, em hipótese alguma, cobrar um cartão sem entregar o ingresso correspondente.

Some a isso o fato de que cada adquirente trata o terminal como uma plataforma própria: a Getnet roda em maquininhas Ingenico e equivalentes, a Fiserv (via Clover/SiTef) tem seu próprio app de vendas e seu próprio processo de publicação no dashboard dela. São mundos de homologação e de deploy distintos para a mesma funcionalidade.

A stack que escolhi foi **React Native com Expo**, em TypeScript, com a camada nativa em Kotlin para as bibliotecas das adquirentes. A escolha do Expo não foi por estética — ela resolve diretamente o terceiro problema, como vou mostrar mais adiante.

## Desafio 1 — Um app, várias adquirentes

A solução teve duas camadas. Na camada de **JavaScript**, todo pagamento passa por uma única interface — uma `Strategy`. A UI e a lógica de negócio só conhecem essa interface; não sabem qual adquirente está por trás.

Isso é necessário por um motivo bem prático: cada adquirente entrega uma biblioteca com nomes, assinaturas e formatos próprios. Uma pede o valor em centavos, a outra em reais; uma devolve o NSU num campo do topo, a outra o esconde dentro de um objeto de resposta; a impressora de uma aceita um bitmap pronto, a da outra espera comandos linha a linha. Sem uma interface no meio, essas diferenças vazam para dentro das telas — e cada tela passa a saber em qual maquininha está rodando.

```typescript {filename="IPaymentStrategy.ts"}
export interface PaymentRequest {
  amountCents: number;
  installments: number;
  method: 'CREDIT' | 'DEBIT' | 'PIX' | 'CASH';
  merchantTaxId?: string; // usado por uma adquirente, ignorado por outra
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

Uma *factory* decide qual implementação devolver com base no tipo de PDV daquele build; para o resto do app, isso é transparente:

```typescript {filename="PaymentService.ts"}
function resolveStrategy(posType: PosType): IPaymentStrategy {
  switch (posType) {
    case 'getnet': return new GetNetPaymentStrategy();
    case 'clover': return new CloverPaymentStrategy(); // Fiserv / SiTef
    case 'cash':   return new CashPaymentStrategy();
    default:       return new MockPaymentStrategy();    // emulador / testes
  }
}
```

A camada de **JavaScript** resolve a *forma* da abstração. Mas o SDK nativo de cada adquirente ainda precisa entrar no binário — e é aí que está o truque. Dava para escolher o SDK em tempo de execução, com um `if`, mas isso obriga a empacotar **todos** os SDKs em **todos** os APKs e mistura requisitos de homologação de adquirentes diferentes num binário só. Em vez de carregar tudo em todo lugar, usei **product flavors** do Android (Gradle). Cada flavor é compilado num APK independente, e o Gradle só inclui o código-fonte daquele flavor.

A regra é simples: `src/main` carrega a **interface** da ponte nativa (a "tomada"); cada `src/<flavor>` carrega a **implementação** que se encaixa nela. Classes de mesmo pacote no flavor sobrescrevem as de `main` na hora do build.

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

No Gradle, os flavors são declarados e cada `assemble<Flavor>Release` produz um APK enxuto, com apenas o SDK daquela adquirente:

```groovy {filename="android/app/build.gradle"}
android {
  flavorDimensions "acquirer"
  productFlavors {
    getnet  { dimension "acquirer" }
    clover  { dimension "acquirer" } // Fiserv / SiTef
    generic { dimension "acquirer" }
    mock    { dimension "acquirer" } // só emulador
  }
}
```

Isso resolve a parte **estática** (qual SDK existe no binário). Falta a parte **dinâmica**: a mesma adquirente atende várias lojas, cada uma com seu CNPJ, seu código de estabelecimento e suas regras de pagamento (aceita dinheiro? aceita parcelado?). Esses dados não pertencem ao build — pertencem ao lojista. Eles vêm do nosso próprio backend no login e ficam num contexto de lojista que abastece a estratégia de pagamento em tempo de execução.

O resultado: **um único APK por adquirente** atende todas as lojas dela; trocar de loja é trocar de configuração, não de binário.

## Desafio 2 — O dinheiro acontece fora do servidor

A cobrança é aprovada na própria maquininha, localmente. Quando o terminal devolve "aprovado" com um NSU, o dinheiro **já entrou** — independente de o servidor saber disso ou não. O servidor não pode ser a fonte da verdade da transação financeira; no máximo, ele registra a cobrança depois.

Mas o evento vende ingressos com lotes finitos. Se eu cobrasse primeiro e tentasse reservar o ingresso depois, poderia acabar cobrando um cartão para um lote que já esgotou, o que não pode acontecer.

A solução é um protocolo de três fases, com a reserva **antes** da cobrança:

```text
Fase 1 — Reservar   POST /pos/reserve   → servidor segura a vaga sob lock
Fase 2 — Cobrar     terminal local       → maquininha aprova/recusa
Fase 3a — Confirmar POST /pos/confirm    → promove reserva e registra pagamento (se aprovado)
Fase 3b — Liberar   POST /pos/release    → devolve a vaga ao lote (se recusado)
```

A reserva vem **antes** de acionar a maquininha. Se o lote esgotou, o terminal nem é chamado — assim nunca se cobra um cartão sem ter o ingresso para entregar.

Todo esse ciclo de vida é coordenado por uma **saga local** persistida no dispositivo. A saga é uma pequena máquina de estados que sobrevive a fechamento de app, queda de rede e desligamento do terminal:

```text
PENDING_PAYMENT ──aprovado──▶ COMPLETED
        │
        ├──recusado──▶ DECLINED   (dispara a liberação da reserva)
        │
        ├──falha pós-cobrança──▶ NEEDS_ATTENTION
        │
        └──abortado──▶ CANCELLED
```

A saga é gravada **antes** da maquininha ser acionada. Cada operação carrega uma `idempotencyKey`, e o backend tem uma restrição de unicidade nessa chave. Isso significa que repetir um `confirm` — por timeout, por retry, por reabertura do app — nunca registra o pagamento duas vezes.

E quando a cobrança é aprovada mas a gravação no backend falha (rede caiu no pior momento)? O pagamento **não se perde**. Ele entra numa fila local de pendências que é drenada no próximo boot do app. O NSU da maquininha é a prova de que o dinheiro entrou; o registro no servidor é consistência eventual. O operador também consegue reimprimir e reprocessar a partir do histórico. É esse o caso que leva a saga para `NEEDS_ATTENTION`: cobrança aprovada, mas alguma etapa posterior — gravar o ingresso, gravar o pagamento, imprimir todas as vias — não fechou. Não é erro terminal: é uma linha acionável na tela de histórico, com botão de retentar.

Terminais têm pouco armazenamento: logs e sagas acumuladas chegaram a ameaçar estourar o SQLite local — a correção foi manter logs de debug só em memória e eliminar sagas concluídas.

## Desafio 3 — Mudar rápido sem passar pela loja

Os dois primeiros desafios são de arquitetura. Este é de *velocidade* — e é onde o Expo justifica a escolha.

Distribuir um app de PDV é lento por natureza. Cada APK precisa passar pelo processo da adquirente: o portal da Getnet, o dashboard da Fiserv, a assinatura, a homologação. Isso leva dias. E o cliente, no meio de um evento, pede um ajuste de texto no recibo ou uma mudança numa regra de cobrança para *agora*.

A saída foi separar o deploy em **dois eixos independentes**:

- O **eixo nativo (APK)**, identificado pela `runtimeVersion`. Muda quando muda código nativo. É o eixo lento, com homologação.
- O **eixo do bundle JS (OTA)**, entregue via **EAS Update**. É o eixo rápido: um `eas update` publica um novo bundle JavaScript que os dispositivos baixam sozinhos no próximo boot, sem reinstalar nada e sem passar pela loja.

```bash {filename="terminal"}
# Correção de UI / regra de negócio — chega em minutos, sem reinstalar
eas update --branch production --message "ajuste no recibo"

# Mudança nativa — exige rebuild do APK e nova homologação
eas build --profile production
```

A linha que separa os dois eixos é clara:

{{< callout type="warning" >}}
OTA só atualiza o lado JavaScript. Mexer em interface nativa, adicionar um SDK de adquirente, pedir uma permissão nova do Android — tudo isso exige rebuild do APK e bump da `runtimeVersion`.
{{< /callout >}}

Na prática, **a esmagadora maioria das demandas do dia a dia é JavaScript**: layout de tela, chamadas de API, template de recibo, regras de split e parcelamento, feature flags. Tudo isso vai por OTA, em minutos. O processo lento de loja fica reservado só para o que realmente toca o nativo.

Claro, isso porque a arquitetura foi feita para funcionar assim. Tudo que podia ser parametrizável ou construível na parte nativa recebe objetos criados pela parte atualizável por OTA, o que deixa espaço para ajustar até as regras de comunicação com a adquirente e de impressão.

A impressão é o exemplo mais claro. O nativo não sabe o que é um ingresso: ele sabe executar `TEXT`, `IMAGE` e `QRCODE` naquele hardware. Quem monta o recibo — o que entra, em que ordem, com qual fonte e alinhamento — é uma lista de comandos construída em JavaScript:

```typescript {filename="services/printers/printTicket.ts"}
const commands: PrintCommand[] = [
  logoBase64
    ? { type: 'IMAGE', base64: logoBase64, align: 'CENTER' }
    : { type: 'IMAGE', source: 'app_logo', align: 'CENTER' },
  { type: 'TEXT', value: '─── INGRESSO ───', align: 'CENTER', font: 'MEDIUM' },
  { type: 'TEXT', value: teamsLabel ?? eventTitle, align: 'CENTER', font: 'SMALL' },
  { type: 'TEXT', value: loteName, align: 'CENTER', font: 'SMALL' },
  { type: 'TEXT', value: formatCurrency(priceCents), align: 'CENTER', font: 'MEDIUM' },
  { type: 'QRCODE', value: accessCode, align: 'CENTER', height: 376 },
  { type: 'TEXT', value: accessCode, align: 'CENTER', font: 'SMALL' },
];

await PrinterService.print(commands); // → PrinterModule.executeBatch(commands)
```

Do outro lado da ponte, o módulo nativo recebe esse array e delega para a implementação do flavor atual — nenhuma linha de Kotlin conhece o layout do ingresso. Trocar a ordem dos campos, adicionar a data do jogo no cabeçalho ou incluir a logo do evento é editar essa lista. Ou seja: `eas update`, não nova homologação.

O teste de verdade foi o evento de estreia: **2.700 ingressos vendidos** por esse código, com a operação fluindo na catraca do começo ao fim.
