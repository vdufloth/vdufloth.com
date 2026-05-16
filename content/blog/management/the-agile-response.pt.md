---
date: '2026-04-04T20:35:36-03:00'
draft: false
title: 'A Resposta Ágil: Scrum, Extreme Programming e o Manifesto'
summary: 'Como os anos 1990 responderam ao fracasso dos projetos orientados a plano: a ascensão do Ágil, a experiência estruturada do Scrum, a disciplina técnica do Extreme Programming, a origem dos Story Points e o Manifesto que amarrou tudo.'
categories:
- Desenvolvimento de Software
- Gestão
- Tecnologia
---

*Segundo da série. O [primeiro artigo](../why-managing-software-is-different/) traçou por que software resiste ao planejamento rígido e como o modelo cascata ruiu diante dessa realidade. A década de 1990 respondeu com algo fundamentalmente diferente.*

## A gestão de incertezas: A ascensão do Ágil

Diante do colapso constante de projetos orientados a planos rígidos, a década de 1990 catalisou uma revolução metodológica na engenharia de software. O paradigma Ágil abandonou a tentativa fútil de eliminar a incerteza através de planejamento exaustivo prévio.

Em vez de planejar tudo no início e entregar somente no final, a abordagem adotou ciclos curtos e iterativos: planejar um pouco, construir, mostrar o incremento, coletar feedback real, ajustar a rota e repetir o processo.

A incerteza não é eliminada neste modelo; ela é gerenciada em doses muito menores. Essa quebra de cadência transforma cada retrabalho, que inerentemente existe no desenvolvimento, em algo muito menos custoso e traumático. Duas correntes principais lideraram essa revolução: o Scrum, focado na estrutura de gestão e no controle do processo, e o Extreme Programming (XP), focado mais em práticas de engenharia de software.

### A experiência prática estruturada do Scrum (1993-1995)
As sementes do Scrum foram plantadas muito antes do manifesto formal da agilidade, originando-se de um artigo publicado na Harvard Business Review em 1986, escrito por  Hirotaka Takeuchi e Ikujiro Nonaka e intitulado “The New New Product Development Game”. 

Analisando empresas japonesas e americanas altamente inovadoras no desenvolvimento de produtos físicos, os autores notaram que equipes excepcionalmente rápidas não trabalhavam de forma sequencial, como em uma corrida de revezamento. Em vez disso, atuavam de forma coesa, adaptativa e sobreposta, avançando juntas como uma unidade em um campo de jogo — uma analogia direta à formação scrum do rugby.

Inspirado por essa dinâmica de equipe autogerenciável e multidisciplinar, Jeff Sutherland adaptou o conceito para o desenvolvimento de software em 1993, durante seu trabalho na Easel Corporation. Sutherland compreendeu que gráficos preditivos clássicos raramente refletiam o estado real de um sistema complexo em construção. Trabalhando em conjunto com Ken Schwaber, Sutherland formalizou o framework Scrum, apresentando-o publicamente à comunidade acadêmica e profissional em 1995, na conferência OOPSLA (Object-Oriented Programming, Systems, Languages & Applications).

A teoria por trás do Scrum baseia-se no Controle de Processo Empírico, que afirma que o conhecimento advém da experiência e as decisões devem ser baseadas no que é factualmente observado, em vez de planos teóricos. Para atingir previsibilidade em um ambiente instável, o trabalho ágil no dia a dia do Scrum é organizado através de ciclos fixos e protegidos, denominados Sprints.

| Característica das Sprints no Scrum<br><br> | Implicação no Desenvolvimento de Produto<br><br>                                                                                                                                               |
|---------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Ciclos de Tempo Fixo (Timeboxes)<br><br>    | Uma a quatro semanas. Limite do que pode falhar em um ciclo.<br><br>        |
| Previsibilidade e Ritmo<br><br>             | Time se compromete com a entrega do ciclo; cadência estável para stakeholders.<br><br>          |
| Proteção de Escopo Iterativo<br><br>        | Escopo congelado durante a Sprint. Mudanças externas aguardam o próximo planejamento.<br><br> |

Sprints funcionam de maneira excepcional para o desenvolvimento de produtos inovadores, onde o estabelecimento de um ritmo e a previsibilidade a curto prazo importam. A equipe inspeciona o que foi feito no final de cada iteração, ajustando não apenas o produto, mas também o próprio modo de trabalho da mesma.

## A excelência técnica e o Extreme Programming (1996-1999)

Enquanto o Scrum estabelecia o arcabouço de gestão e governança, Kent Beck formalizava, na mesma época, o Extreme Programming (XP). O XP surgiu diretamente das trincheiras do desenvolvimento de software em 1996, durante o problemático projeto do Sistema de Remuneração Abrangente da Chrysler (C3). O projeto estava estagnado, e Beck, trazido para salvá-lo, decidiu instituir disciplinas de engenharia de software ao extremo, formalizando a metodologia em seu livro de 1999, Extreme Programming Explained: Embrace Change.

A filosofia do XP parte do princípio de que se uma prática técnica é benéfica, ela deve ser executada continuamente. Se revisões de código evitam bugs, o código deve ser revisado em tempo real por dois desenvolvedores na mesma máquina (Programação em Par). Se testar garante a estabilidade, os testes devem ser escritos antes mesmo da codificação da funcionalidade (Test-Driven Development - TDD).

O XP estabeleceu práticas revolucionárias como ciclos de desenvolvimento curtíssimos, integração contínua do código várias vezes ao dia e, crucialmente, o envolvimento físico e direto do cliente sentando-se junto à equipe de desenvolvimento para guiar os negócios. 
Muitas dessas práticas e filosofias foram posteriormente absorvidas pela cultura geral do Manifesto Ágil e reaparecem em formas variadas no Scrum moderno, especialmente a ênfase no ritmo de entregas frequentes e no feedback constante e desimpedido do usuário final.

## O surgimento dos Story Points como unidade de complexidade
Um dos artefatos mais onipresentes na gestão ágil moderna é a estimativa baseada em Story Points. Curiosamente, embora seja considerada o padrão em planejamentos do Scrum atual, esta métrica não é uma prescrição oficial do Scrum Guide, mas sim uma herança direta das iterações iniciais do Extreme Programming.

Ron Jeffries, um dos criadores do XP que atuou ao lado de Beck no projeto da Chrysler, foi fundamental nesta evolução. No início da metodologia, a equipe estimava as Histórias de Usuário (requisitos descritos pela perspectiva do cliente) baseando-se no tempo real de execução. A métrica original chamava-se Ideal Days (Dias Ideais), conceituada como o tempo que levaria para uma dupla de programadores finalizar a tarefa assumindo que não houvesse absolutamente nenhuma interrupção, reunião ou burocracia. Para traduzir esse conceito em datas de calendário reais, a equipe multiplicava os dias ideais por um "fator de carga" (load factor), que estatisticamente girava em torno de três. Ou seja, eram necessários três dias literais de trabalho corporativo para concluir o esforço de um dia ideal.

A terminologia, no entanto, gerou profundo atrito social e psicológico com os stakeholders. A alta gerência questionava agressivamente por que um desenvolvedor exigia três semanas para entregar "cinco dias" de trabalho, interpretando a estimativa como ineficiência. Para neutralizar o embate político e a confusão semântica, Jeffries sugeriu abstrair a unidade de tempo, renomeando os "dias ideais" simplesmente para "pontos". Ao remover a conotação cronológica, a equipe focou exclusivamente na complexidade da tarefa. Uma história estimada em 3 pontos significava, de forma indireta, cerca de nove dias reais, e o termo abstrato eliminou a pressão executiva por cronogramas irreais. Na mesma época, outras unidades abstratas e lúdicas, como "Gummi Bears" (Ursos de Goma) e NUTs (Nebulous Units of Time), foram testadas pela comunidade para sublinhar o descolamento do tempo exato.

Hoje, os Story Points são definidos como a unidade de medida de complexidade e esforço relativo no ambiente ágil. Eles não representam horas, mas sim o risco, a incerteza e o volume de trabalho inerentes a um item do backlog. Uma tarefa de 8 pontos não consome necessariamente o dobro exato do tempo cronometrado de uma tarefa de 4 pontos, mas é reconhecida pela equipe como significativamente mais complexa e arriscada. Essa abstração elimina a ilusão gerencial perigosa de que estimativas em horas para trabalhos de conhecimento criativo são precisas. 

Times diferentes possuem níveis de maturidade técnica e velocidades intrínsecas diferentes, o que torna impossível comparar a "velocidade de pontos" entre equipes distintas. No entanto, a comparação dos pontos dentro de um mesmo time ao longo do tempo permanece estatisticamente consistente, permitindo um cálculo realista de capacidade para iterações futuras.

## O Manifesto Ágil (2001)

A transição da década de 1990 para os anos 2000 foi dominada pela fragmentação de "metodologias leves". Scrum, Extreme Programming (XP), Dynamic Systems Development Method (DSDM), Feature-Driven Development (FDD), Crystal e Adaptive Software Development competiam conceitualmente, mas seus criadores reconheciam que compartilhavam alguns valores éticos e operacionais.

Havia um consenso generalizado sobre a repulsa à governança estrita de comando e controle, à documentação como fim em si mesma e à microgestão ditada por contratos de escopo congelado.

Essa convergência ideológica culminou em um dos eventos mais importantes da história da tecnologia moderna. Entre os dias 11 e 13 de fevereiro de 2001, a convite do engenheiro Robert C. Martin (O "Uncle Bob"), dezessete profissionais altamente influentes reuniram-se no resort de esqui The Lodge at Snowbird, nas montanhas de Utah, Estados Unidos. Entre os presentes encontravam-se Kent Beck e Ron Jeffries (pelo XP), Jeff Sutherland e Ken Schwaber (pelo Scrum), além de outras figuras proeminentes como Martin Fowler, Alistair Cockburn e Jim Highsmith.

A expectativa de consenso era baixíssima; o próprio Cockburn descreveu o grupo como um ajuntamento de "anarquistas organizacionais" independentes. Contudo, a sinergia foi quase instantânea. Frustrados com processos burocráticos corporativos que sistematicamente mais atrapalhavam a entrega de software de qualidade do que ajudavam, eles elaboraram e assinaram o Manifesto para Desenvolvimento Ágil de Software (o termo "ágil" foi escolhido após debate, vencendo opções como "leve").
O Manifesto não impôs um novo framework técnico, nem ditou práticas de programação; ele redigiu a constituição cultural de uma nova forma de trabalho cognitivo. O documento foi erguido sobre 4 pilares inegociáveis, que delinearam formalmente a evolução da gestão de projetos de tecnologia :

| Os 4 Pilares do Manifesto Ágil<br><br><br><br>                                  | Interpretação e Aplicação na Gestão de Software<br><br><br><br>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|---------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1. Interações entre indivíduos acima de processos e ferramentas<br><br><br><br> | Dois desenvolvedores resolvendo um problema em 5 minutos de conversa ganham de ticket, triagem, e-mail e reunião sempre. Processos servem para dar escala à organização e registrar histórico, não para substituir comunicação viva. Qualquer processo que atrapalhe quem está mais perto do problema é o processo a questionar.<br><br><br><br>                                                                                                                                                                                              |
| 2. Software funcionando acima de documentação abrangente<br><br><br><br>        | Cascata celebrava centenas de páginas de especificação como progresso, sem código operante. O Manifesto inverte: documente o mínimo necessário para o trabalho ser compreendido e mantido. Não é "não documentar" — é priorizar valor real e testável sobre papel burocrático.<br><br><br><br>                                                                                                                                                                                                                                           |
| 3. Colaboração com o cliente acima de negociação de contratos<br><br>           | Tradicional: cliente assina especificações, transfere risco e espera a entrega final. Ágil: cliente é parceiro diário (eco do cliente on-site do XP). Sprint Reviews existem para demonstrar, receber feedback e corrigir a rota antes do próximo ciclo. Co-criação contínua substitui a entrega surpresa.<br><br>                                                                                                                                          |
| 4. Responder a mudanças acima de seguir um plano<br><br>                        | Planos são hipóteses para testar contra a realidade, não contratos. O imprevisto é a norma — concorrente lança função nova, cliente muda a estratégia, bug crítico aparece. O plano original é referência, nunca punição. Adaptar em tempo real vale mais que obediência a um roteiro velho.<br><br> |

Jim Highsmith, um dos signatários, notou que a rápida adoção das metodologias ágeis que se seguiu ao Manifesto ocorreu não por causa das mecânicas de programação em par ou quadros visuais, mas porque os valores permitiram ambientes organizacionais baseados em confiança, colaboração e respeito à inteligência humana dos desenvolvedores, libertando-os da cultura de microgerenciamento que penalizava a adaptação dinâmica.

---

*Parte 2 de [Gestão Moderna de Engenharia de Software](../tech-teams-management/). Anterior: [Por que gestão de software é diferente](../why-managing-software-is-different/). Próximo: [Além da Sprint](../beyond-the-sprint-kanban-and-flow/).*
