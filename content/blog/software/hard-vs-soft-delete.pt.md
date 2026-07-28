---
date: '2026-07-27T20:00:00-03:00'
draft: false
title: 'Como Excluir Usuários em SaaS Mantendo Solidez do Banco de Dados Sem Infringir a Lei'
summary: 'Framework correto sobre como pensar e estruturar dados sensíveis de usuários em um SaaS para cumprir a lei mas manter os vínculos necessários ao sistema.'
categories:
- Desenvolvimento de Software
- Segurança
- Proteção de Dados
- Tecnologia
tags:
---

Todo SaaS precisa decidir o que fazer quando um usuário clica em "excluir minha conta". Se fizer um simples `DELETE FROM users WHERE id = ?` provavelmente ou você vai bater numa `constraint` de banco de dados, ou deixará linhas "órfãs" em outra tabela. A próxima solução geralmente é adicionar uma coluna chamada `deleted_at` e fazer o que se chama de *"soft delete"*. Ou seja, os dados continuam lá, porém escondidos do usuário.

Esse não é o framework correto para tomar esse tipo de decisão. "Hard delete ou soft delete?" é uma pergunta sobre como você apaga uma linha. Ela não diz nada sobre se você **pode** guardar o que está nela, nem se você é **obrigado** a guardar.

Este artigo é sobre o framework correto.

{{< callout type="warning" >}}
Isto não é um parecer jurídico completo. Sou um engenheiro que passou por esses problemas e passo aqui a visão geralmente segura e de boa prática, mas não sou o seu advogado. Os frameworks aqui são como eu raciocino sobre ciclo de vida de dados enquanto arquiteto. Para sistemas em grande escala ou com dados muito sensíveis (financeiro, saúde) valide em detalhe com o seu jurídico ou DPO.
{{< /callout >}}

## A pergunta de verdade não é "hard ou soft"

Hard delete e soft delete são *técnicas de implementação*. Elas ficam bem no fim de uma decisão. O desenvolvedor apela para elas primeiro porque são a parte que aparece no código, mas a técnica certa é inteiramente determinada por duas perguntas anteriores:

1. **Isso ainda é dado pessoal?** Dados que identificam uma pessoa viva diretamente (nome, e-mail, CPF) ou indiretamente (um IP com um horário, um ID de dispositivo, uma combinação de atributos que afunila até uma única pessoa) se enquadram no escopo da lei geral de proteção de dados. Dados que tiveram *de forma irreversível* qualquer vínculo com a pessoa removido, não se enquadram.

2. **Existe base legal para mantê-lo?** Um contrato assinado, uma obrigação fiscal, um litígio em curso, um consentimento que não foi revogado. Se há um motivo lícito e documentado para reter o dado, você mantém.

Ou seja, se:

- Ainda é pessoal e há base legal que me obriga a manter? → mantenha (um soft delete só esconde o dado da operação).
- Ainda é pessoal, mas a base acabou? → apague (hard delete, ou anonimização irreversível).
- Não é mais dado pessoal → a lei deixa de se importar; guarde para sempre se for útil (analytics, agregados).

## O espectro de exclusão não é binário

Não são duas opções, são cinco, e elas formam um espectro que vai de "continua tudo lá" até "fisicamente apagado". Conhecer as cinco é necessário para escolher a melhor para o seu caso.

**Soft delete** — vira uma flag (`deleted_at`, `is_active`). A linha, e cada byte de dado pessoal nela, continuam no banco. Você só escondeu da aplicação. Juridicamente, *nada foi excluído* — continua sendo dado pessoal, continua no escopo, continua sendo seu passivo se vazar. Soft delete é conveniência operacional (desfazer, auditoria, segurança referencial), nunca uma resposta de conformidade.

**Pseudonimização** — troca os identificadores diretos por um token e guarda um mapeamento separado capaz de reverter. A LGPD trata a pseudonimização (`Art. 13, §4`) como medida de segurança que reduz risco — mas dado pseudonimizado *ainda é dado pessoal*, porque a chave de reidentificação existe. Útil para limitar o raio do estrago e para analytics sobre dados com forma de produção, mas não tira você do escopo.

**Anonimização** — transforma o dado de modo que a reidentificação deixe de ser razoavelmente possível, por qualquer um, inclusive você. Agregação, generalização, k-anonimato, descarte definitivo das chaves de ligação. A régua é alta e o "irreversível" está trabalhando de verdade nessa frase — anonimização fraca, que se desfaz cruzando duas tabelas, é só pseudonimização fantasiada. Mas quando ela de fato se sustenta, **dado anonimizado sai inteiramente do escopo da lei** (a LGPD diz isso no `Art. 12`: dado anonimizado não é dado pessoal, salvo se o processo for reversível). É a porta de saída: a única transformação que deixa você guardar informação útil para sempre, sem nenhuma obrigação contínua.

**Crypto-shredding (apagamento criptográfico)** — criptografe o dado com uma chave única daquela entidade e, quando precisar "excluir", destrua a chave em vez do dado. O texto cifrado continua, mas vira ruído irrecuperável. O NIST SP 800-88 reconhece o *Cryptographic Erase* como método de sanitização válido, e a europa aceita a destruição de chave como caminho de eliminação. É a resposta para o problema que todo mundo enfrenta: dado espalhado por réplicas, snapshots e **backups imutáveis** que você não consegue editar cirurgicamente. Você não dá `UPDATE` num backup de 2024 — mas se a única chave que decifra as linhas daquele usuário sumiu, o backup também está apagado para ele. Porém você vai querer fazer backup da chave criptográfica também, o que causa um problema parecido.

**Hard delete** — `DELETE FROM`. A linha some fisicamente. Limpo e sem ambiguidade no banco principal, mas é a técnica que mais colide com foreign keys e com os backups que ainda guardam uma cópia dos dados.

## O que a lei realmente exige

Vou ancorar isso na **LGPD (Lei 13.709/2018)**, porque é a lei que a maioria dos times de SaaS brasileiros precisa cumprir primeiro — mas o formato é o mesmo no **GDPR** europeu e no mosaico de leis estaduais dos EUA (a **CCPA/CPRA** da Califórnia e a lista crescente que adota). Uma arquitetura feita para satisfazer a LGPD cumpre as demais na esmagadora maioria dos casos.

**O direito de eliminação existe — e não é absoluto.** A LGPD garante ao titular pedir a eliminação dos seus dados (`Art. 18`, em especial a eliminação de dados desnecessários, excessivos ou tratados em desconformidade, e a eliminação dos dados tratados com base no consentimento), e o padrão é que você atenda. Mas o `Art. 16` lista as hipóteses de conservação, e elas pesam tanto quanto o direito. O dado pode ser conservado para:

- **Cumprimento de obrigação legal ou regulatória.** Se uma lei manda guardar, você guarda. Registros fiscais e contábeis são o caso clássico.
- **Estudo por órgão de pesquisa**, garantida, sempre que possível, a anonimização.
- **Uso exclusivo do controlador**, vedado o acesso por terceiro e desde que anonimizados.

**Os prazos de retenção são fixados por outras leis, não pela lei de privacidade.** É a parte que o engenheiro sempre erra: a LGPD não manda guardar a nota fiscal por N anos, ela manda eliminar *quando nenhuma finalidade justificar a manutenção* — e é uma *outra* lei (código tributário, legislação comercial, norma de saúde) que define esse *N*. Ordens de grandeza concretas e comumente citadas:

| Classe de dado | Origem do prazo de retenção | Ordem de grandeza |
|---|---|---|
| Notas fiscais, registros fiscais/contábeis | Legislação tributária e comercial | ~5 anos (decadência/prescrição tributária) |
| Contratos e registros relacionados | Prazos prescricionais civis | Anos, até as pretensões prescreverem |
| Prontuário médico | Norma de saúde (CFM) | Muito longo (na casa de décadas) |
| Logs de consentimento de marketing | Prova do consentimento | Vida do consentimento + margem |
| Logs de aplicação/segurança com PII | Necessidade de segurança | Curto — meses, não anos |

(São ilustrativos e aproximados. Sua jurisdição e seu setor fixam os números reais — confirme com seu jurídico.)

**O titular tem que fazer a parte dele.** Um pedido de eliminação válido exige **verificação de identidade** — você não pode apagar (nem divulgar) dados por causa de um e-mail não autenticado, porque isso vira um vetor de ataque. Confirme que quem pede é o titular, e então aja.

**Você tem que propagar e tem que registrar.** Duas obrigações que o desenvolvedor esquece:

- **Propagar.** Se você compartilhou o dado com operadores (seus suboperadores — gateway de pagamento, provedor de e-mail, analytics) ou outros destinatários, precisa repassar a eliminação. O operador trata os dados conforme as instruções do controlador (`Art. 39`); apagar a sua linha enquanto uma cópia sobrevive num sistema de terceiro que você controla não é "feito".
- **Registrar.** A *accountability* (prestação de contas) é, ela própria, um dever legal. A LGPD exige que controlador e operador mantenham **registro das operações de tratamento** (`Art. 37`) e, em casos de risco, o **Relatório de Impacto à Proteção de Dados (RIPD)**. Na prática, você precisa conseguir mostrar, por classe de dado, por que o mantém e quando ele sai. É o equivalente direto do RoPA do GDPR.

**Prazos de resposta.** LGPD: a resposta pode ser *imediata* (declaração simplificada) ou em até **15 dias** (declaração completa). GDPR: **um mês**, prorrogável por mais dois em casos complexos. CCPA/CPRA: **45 dias**, prorrogável para 90. Construa o SLA em torno do prazo mais curto a que você está sujeito.

## O problema difícil: referências externas e integridade referencial

Aqui está o caso que quebra o `DELETE` ingênuo: um usuário pede para ser esquecido, mas tem **pagamentos** vinculados. Você é legalmente obrigado a guardar esses registros de pagamento e de nota fiscal pelo prazo de retenção fiscal. E também não pode apagar a linha de `users`, porque uma dúzia de foreign keys aponta para ela. E aí, o que você faz?

**Resposta errada:** dar hard delete no usuário com cascade. Você acabou de destruir registros que era obrigado a manter por lei, e quebrou o seu próprio histórico financeiro.

**Também errado:** dar soft delete no usuário e considerar resolvido. O dado pessoal continua todo lá, inteiramente no escopo, por tempo indefinido — você não atendeu à eliminação de jeito nenhum.

**Resposta certa: não apague a linha-pai — anonimize a identidade *dentro* dela.** Mantenha a linha e a chave primária para as foreign keys seguirem válidas; sobrescreva os campos pessoais e identificáveis com valores neutros de tombstone (lápide); preserve os fatos transacionais não identificáveis de que os registros retidos precisam. O pagamento continua apontando para o usuário `4711`; o usuário `4711` agora é "Usuário excluído", sem e-mail, sem nome, sem documento — uma lápide.

> *"E se eu precisar saber quem foi?"*

Há duas coisas bem diferentes escondidas nessa frase:

- **Você só *quer* saber** — para debugar, para o "e se o suporte perguntar", por uma sensação vaga de que histórico guardado é mais seguro. Não existe base legal em *querer*. Anonimize. O desconforto de não conseguir consultar alguém depois não é uma finalidade de retenção.
- **Você *precisa* por obrigação ou por um direito legítimo e documentado** — o CPF do comprador é obrigatório na nota fiscal; uma investigação de fraude em curso precisa da identidade dentro do prazo prescricional. Então você retém — mas *segrega*. Manter o que é legal e devido na tabela referente é uma opção, mas melhor ainda é criar uma tabela apenas para esses campos.

O jeito estrutural de tornar isso fácil é **modelar em duas camadas desde o começo**: uma camada de identidade/operacional, que você consegue transformar totalmente em tombstone, e uma camada de registro transacional/legal, que sobrevive, carregando só os identificadores mínimos que alguma lei de fato exige.

```sql {filename="modelo em duas camadas"}
-- Camada 1: identidade / operacional. Vira tombstone na eliminação.
CREATE TABLE users (
    id            BIGINT PRIMARY KEY,
    email         TEXT,
    full_name     TEXT,
    cpf           TEXT,          -- SAI daqui na eliminação se nenhuma obrigação exigir nesta camada
    deleted_at    TIMESTAMPTZ,
    is_anonymized BOOLEAN NOT NULL DEFAULT FALSE
);

-- Camada 2: registro transacional / legal. Sobrevive ao usuário, mantém as FKs válidas.
CREATE TABLE payments (
    id          BIGINT PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id),  -- FK preservada, nunca apagada por cascade
    amount      NUMERIC(12,2) NOT NULL,
    currency    CHAR(3) NOT NULL,
    paid_at     TIMESTAMPTZ NOT NULL,
    invoice_no  TEXT NOT NULL
);

-- Armazenamento restrito: só os identificadores que uma lei realmente exige, com expiração.
CREATE TABLE fiscal_identity_vault (
    payment_id   BIGINT PRIMARY KEY REFERENCES payments(id),
    legal_name   TEXT NOT NULL,
    cpf          TEXT NOT NULL,
    retain_until DATE NOT NULL          -- o job de eliminação expurga depois desta data
);
```

A eliminação então vira um `UPDATE` de tombstone, não um `DELETE` — as foreign keys nem percebem:

```sql {filename="tombstone na eliminação"}
UPDATE users
SET email         = NULL,
    full_name     = 'Usuário excluído',
    cpf           = NULL,
    is_anonymized = TRUE,
    deleted_at    = now()
WHERE id = 4711;
-- payments.user_id = 4711 ainda resolve. O registro transacional segue intacto.
-- legal_name / cpf sobrevivem APENAS em fiscal_identity_vault, e SÓ até retain_until.
```

A linha de `payments` mantém o histórico a nível de sistema e fiscal — valor, data, número da nota e uma referência estável a um cliente (agora anônimo). Os dados identificáveis vivem no cofre restrito, limitados exatamente aos registros que uma lei exige, e o mesmo job de "fim-de-base-legal" que roda o tombstone também expurga o cofre depois que `retain_until` expira.

A regra-mãe, se você não lembrar de mais nada: **minimize e segregue por base legal.** Para cada dado sensível que ainda existe *depois* de você ter processado uma exclusão, você precisa conseguir apontar a obrigação específica que justifica mantê-lo. Se não consegue nomear a obrigação, o dado não deveria estar ali.
