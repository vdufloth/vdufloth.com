---
date: '2026-11-22'
draft: false
title: 'Como preparei um SaaS para o próximo pico de demanda'
summary: 'Uma abertura de vendas trouxe dez vezes a demanda das anteriores. Como usei k6, AWS e rodadas de teste para preparar a plataforma para a próxima.'
categories:
- Desenvolvimento de Software
- Tecnologia
---

Na abertura das vendas para uma semifinal de futsal, a plataforma de ingressos de uma startup que eu assessorava recebeu **dez vezes a demanda das aberturas anteriores**. O clube abriu a venda sem avisar a equipe da plataforma. Quando percebemos o tamanho da procura, entre 60% e 70% das tentativas de compra já falhavam com a mensagem de que havia muita gente disputando o lote. O gateway de pagamentos bloqueou a conta por excesso de chamadas e, por 14 minutos, nenhum Pix foi gerado.

O primeiro suspeito foi o pool de conexões do PostgREST, que aparecia nos logs. Olhando o fluxo inteiro, encontrei três problemas acontecendo juntos. A reserva de ingressos segurava a trava do lote enquanto fazia chamadas HTTP, o serviço de pagamentos recalculava a mesma chave criptográfica várias vezes por compra e cada Pix exigia de seis a nove chamadas ao gateway. Como o limite do fornecedor era por conta, colocar mais servidores para fazer as mesmas chamadas só faria a conta chegar mais rápido ao limite.

A venda voltou quando o gateway liberou a conta. Para a próxima abertura, eu precisava saber quantas pessoas o sistema conseguiria atender por minuto, quanto elas esperariam e se cada pagamento confirmado ainda terminaria com um ingresso válido.

## Recriar a abertura de vendas

Um teste de estresse leva o sistema além da carga habitual para descobrir onde ele começa a degradar e o que acontece com as operações em andamento. Nesse caso, o teste tinha que reproduzir a disputa por ingressos. Quando um lote esgota, a pessoa tenta o próximo. Enquanto espera o Pix, o portal consulta o status. Cada comprador gera trabalho em várias partes do sistema.

Usei o [k6](https://grafana.com/oss/k6/) porque conseguia descrever essa jornada em código, controlar o ritmo de chegada e repetir o cenário a cada mudança. Preparei 8.500 compradores simulados disputando cerca de 5.490 ingressos. Cinco mil chegavam nos primeiros cinco minutos. Os demais entravam nos dez minutos seguintes. As rodadas mais completas incluíam a sala de espera, a troca de lote, a compra e as consultas do portal até a confirmação do Pix.

Para gerar essa carga, eu precisava de bastante CPU por pouco tempo. Na AWS, subia uma instância temporária de EC2, carregava os processos do k6 e o simulador do gateway, rodava o ensaio e encerrava a instância ao fim do ciclo. O gerador ficava separado da aplicação, sem disputar CPU com o sistema que eu queria medir.

Na plataforma, criei o **clube de estresse**, com compradores, ingressos e cobranças de teste. As exceções de segurança necessárias ao ensaio, como dispensar o rate limit da própria plataforma para o tráfego simulado, ficavam restritas a esse clube. Do lado do pagamento, o simulador reproduzia as cotas do fornecedor e entregava as confirmações uma por vez, como ocorria na operação real. A produção era compartilhada com outros clubes, então havia monitoramento e um mecanismo para interromper o teste se a operação real começasse a degradar.

## O que cada rodada revelou

Antes de rodar, defini o que contava como sucesso. Medi **compras por minuto, tempo de espera na fila e tempo entre a admissão e o QR do Pix na tela**. Usei as métricas do k6 para ver o que o comprador experimentava e as do Prometheus e do Grafana para localizar a saturação. No fim, cruzei as cobranças do simulador com os registros no banco. A compra só fechava se o pagamento confirmado tivesse o ingresso correspondente, sem cobrança duplicada nem venda acima do estoque.

Antes das rodadas maiores, trabalhei no caminho de compra. Para reduzir o trabalho por compra, passei a derivar a chave criptográfica uma vez por processo, reutilizei o cadastro de clientes recorrentes e reduzi o fluxo desses clientes a duas chamadas ao gateway. Também tirei o envio de e-mail da confirmação de pagamento, passei a gravar o identificador da cobrança antes de buscar o QR e coloquei uma sala de espera na entrada da venda. Mesmo com esses ajustes, as primeiras rajadas na VPS antiga tiveram entre **40% e 56% de timeouts**. Corrigi também a consulta de lotes esgotados, que fazia o status da fila estourar seu prazo. Em uma rodada seguinte, a plataforma chegou a **266 compras por minuto**, com espera média de **6 min 37 s**.

Com esse patamar medido, fui atrás de onde o tempo ainda era gasto. Ajustei o limitador interno aos limites confirmados pelo fornecedor. Em outra rodada, troquei as chamadas HTTP ao PostgREST por conexões diretas ao PostgreSQL e reduzi o trabalho de logs e Redis. Com esse conjunto de mudanças, o tempo de compra após a admissão caiu de 4,9 s para 2,7 s. Também criei índices para consultas que percorriam tabelas inteiras. Incluir as consultas de status do Pix no cenário mostrou quanta carga o portal ainda gerava depois que a cobrança já tinha sido criada.

Com esses ajustes, o teste passou no domingo à noite. Quando repeti a rodada na segunda, com o mesmo código e a mesma carga, o sistema colapsou. A diferença apareceu no *CPU steal*, o tempo em que a máquina virtual está pronta para executar, mas o hipervisor está usando o processador em outro lugar. Na VPS antiga, chegamos a medir **41% de steal com a máquina ociosa**. Para comparar as máquinas na AWS, usei cópias da mesma stack e fixei a meta de 500 admissões por minuto com a carga completa. Escolhi a configuração mais barata que passou.

## A taxa que foi para a venda

Depois da migração, a carga do portal revelou que a disponibilidade dos lotes era recontada a cada consulta. Coloquei um cache de dois segundos para absorver as leituras repetidas e mantive a consulta atualizada na escolha ou na troca de lote. Na rodada seguinte, ajustei também o cenário para que os arquivos estáticos seguissem o caminho real pela CDN.

Uma rodada em produção com compradores já cadastrados no simulador completou **5.068 compras em cerca de 11 minutos**, aproximadamente **470 por minuto**. A espera no p95 ficou em **4 min 03 s**. Uma vez admitido, o comprador via o QR em **3,9 s na mediana**. Os registros do simulador e do banco bateram, e a rodada terminou sem respostas 5xx ou 429.

Testei também 600 admissões por minuto. A fila andou mais rápido, mas a compra ficou mais lenta depois da admissão e outro clube registrou uma falha durante o pico. Mantive **500 admissões por minuto** para a abertura real.

Na venda seguinte, fila, compra, Pix e liberação do ingresso funcionaram de ponta a ponta, sem intervenção manual. Antes de abrir, eu já sabia quanto tráfego deixar entrar, o que acompanhar durante o pico e em que condição reduzir a entrada para proteger os outros clubes.

## Da máquina única à escala sob demanda

No início da operação, a startup colocou a plataforma no ar rapidamente usando uma instalação própria do Supabase. A mudança para a AWS manteve essa arquitetura em funcionamento. Propus essa transição e agora estamos substituindo, aos poucos, os acessos feitos pelo PostgREST por APIs próprias. O serviço de pagamentos já deu o primeiro passo com a conexão direta ao PostgreSQL.

O próximo passo é separar as aplicações do banco e preparar o serviço de pagamentos para rodar em várias réplicas. Em uma arquitetura mais nativa da AWS, a capacidade das aplicações poderá crescer na abertura de vendas e voltar a cair quando a procura passar. O mesmo cenário de carga vai servir para verificar quanto cada configuração sustenta e quanto tempo os compradores esperam.

Quando o teste passou no domingo e falhou na segunda, a carga e o código eram os mesmos. Medir a CPU que a VPS de fato entregava explicou por que o resultado mudou. O valor de simular um pico está em poder repetir esse tipo de comparação antes da próxima venda. A primeira rodada mostra onde investigar. A medição orienta a hipótese e a mudança. A rodada seguinte mostra se o sistema atende mais gente, se a espera diminui e se cada pagamento continua terminando com um ingresso válido.
