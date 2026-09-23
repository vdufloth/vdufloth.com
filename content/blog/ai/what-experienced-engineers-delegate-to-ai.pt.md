---
date: '2026-09-23T10:00:00-03:00'
title: 'Como programadores experientes, pensadores e autores de tecnologia estão usando IA?'
summary: 'Como quinze engenheiros respeitados usam agentes de programação, o que ainda mantêm sob controle humano e em quais práticas realmente discordam.'
categories:
- Tecnologia
- Desenvolvimento de Software
tags:
- ai
---

## Introdução

O desenvolvimento assistido por Inteligência Artificial está mudando rápido o suficiente para que práticas que pareciam extremas há um ano estejam se tornando comuns. Quis descobrir se algum tipo de “senso comum” estava surgindo entre vários engenheiros cujo julgamento respeito. Ao final, tiro minhas próprias conclusões e as comparo com a minha experiência.

A questão interessante já não é se eles usam IA. Todos aqui usam. A pergunta é:

> **O que eles estão delegando à IA, e o que ainda sentem que precisam revisar de perto ou fazer manualmente?**

Considerei principalmente materiais de autoria própria publicados entre 2025 e setembro de 2026: textos, palestras, entrevistas, repositórios e instruções de projeto. As datas importam. Vários desses engenheiros mudaram substancialmente seus fluxos de trabalho em questão de meses.

> **TL;DR da minha conclusão:** A IA pode assumir a maior parte da implementação e, às vezes, até a revisão do código-fonte. Sistemas sérios, porém, ainda precisam de um humano responsável que compreenda o sistema, controle sua intenção e arquitetura, defina as evidências necessárias para confiar nele e tome as decisões finais. Meu fluxo mantém essas responsabilidades com o humano, registra-as em planos, instruções de projeto e verificações automatizadas, e então permite que agentes implementem e revisem enquanto planejo a próxima mudança. [O apêndice resume o que cada engenheiro delega e mantém sob controle.](#apêndice-conclusões-por-engenheiro)

## David Heinemeier Hansson - DHH

David Heinemeier Hansson criou o Ruby on Rails e é coproprietário técnico da 37signals, que desenvolve Basecamp e HEY. Mais recentemente, criou o Omarchy, uma distribuição Linux cujo desenvolvimento se tornou intimamente ligado a agentes de IA — e que estou usando neste momento. Sua opinião tem peso porque ele é responsável tanto por uma infraestrutura de desenvolvimento influente quanto por aplicações de produção longevas.

No início de 2026, DHH escreveu que os agentes de programação finalmente haviam ultrapassado o seu limiar para trabalho sério em produção. Ele havia rejeitado a assistência no estilo autocompletar, mas agora entregava tarefas reais a agentes do OpenCode, permitia que trabalhassem de forma autônoma e revisava o resultado. Ainda enfatizava que isso era engenharia supervisionada, não uma substituição de 90% dos desenvolvedores experientes quando qualidade e coesão importam ([“Promoting AI agents”](https://world.hey.com/dhh/promoting-ai-agents-3ee04945)).

Em meados de 2026, sua prática havia avançado ainda mais. Em uma longa entrevista, disse que toda a nova base de código do Omarchy Quattro havia sido escrita por agentes. Ele revisou a forma geral do sistema e inspecionou código crítico da camada de modelo, mas não dedicou tempo à leitura de grande parte da interface e da implementação auxiliar. Essa aceitação da implementação como caixa-preta era condicional. No Basecamp e no HEY, um conjunto de mudanças geradas por IA, individualmente plausíveis, havia prejudicado coletivamente a arquitetura e exigido limpeza manual. Portanto, sua distinção não é estritamente “a IA programa, humanos arquitetam” — agentes também podem tomar decisões locais de design —, mas o engenheiro experiente ainda precisa preservar a integridade conceitual do sistema e saber onde uma inspeção minuciosa é necessária ([transcrição da entrevista com Lex Fridman](https://lexfridman.com/?p=6512)).

## Robert C. Martin

Robert C. Martin foi um dos autores do Manifesto Ágil, popularizou os princípios SOLID e escreveu *Código Limpo* e *Arquitetura Limpa*. Grande parte de sua carreira se concentrou nas disciplinas que mantêm o software modificável mesmo à medida que um projeto continua crescendo e amadurecendo.

A evidência atual mais forte é seu [projeto público Empire](https://github.com/unclebob/empire-2025), acompanhado de uma série de vídeos de 2026 com Justin Martin sobre a aplicação das disciplinas de testes e refatoração com agentes ([“Agentic Discipline”](https://cleancoders.com/episode/agentic-discipline-1)). Trata-se, em parte, de um fluxo de trabalho observado, e não de uma declaração abrangente sobre IA: o repositório mostra o uso de agentes dentro de um processo de engenharia deliberadamente restrito.

As [instruções para agentes](https://github.com/unclebob/empire-2025/blob/master/AGENTS.md) tornam esse limite concreto. Cenários de aceitação não podem ser alterados sem permissão explícita. Mudanças de comportamento começam com cenários que falham, passam por testes unitários e implementação, e terminam com a execução completa dos testes. As regras arquiteturais são executáveis: o código de decisão da IA, por exemplo, pode ler o mapa do computador, mas não o mapa oculto do jogo. O agente pode implementar e refatorar agressivamente; não pode redefinir o comportamento aceito nem atravessar silenciosamente limites arquiteturais. Aqui, o controle é mantido menos pela escrita manual contínua e mais por testes, regras de dependência e especificações protegidas.

## Fábio Akita

Fábio Akita é um engenheiro de software e educador brasileiro, mais conhecido por sua influência na comunidade Ruby on Rails e por três décadas de trabalho prático com desenvolvimento.

Em fevereiro de 2026, ele documentou a construção de um sistema de produção com quatro aplicações usando Claude Code em oito dias: 274 commits, 1.323 testes, infraestrutura de implantação, trabalho de segurança e usuários reais. Apenas 37% dos commits eram funcionalidades. O restante era o trabalho menos fotogênico de robustecer, testar, corrigir, implantar, proteger e documentar. Ele descreve a relação como programação em par no estilo XP: o agente conduz a maior parte da implementação, enquanto ele fornece intenção, conhecimento do domínio, priorização e o freio quando o design fica elaborado demais ([retrospectiva completa do projeto](https://akitaonrails.com/en/2026/02/20/zero-to-post-production-in-1-week-using-ai-on-real-projects-behind-the-m-akita-chronicles/)).

O relato de Akita é excepcionalmente preciso sobre o que continua sendo humano. Ele escolheu os limites e as interfaces dos serviços, decidiu o que extrair durante a refatoração, validou o trabalho do agente e manteve todos os commits verdes por meio de testes, linting, auditoria de dependências e análise estática de segurança. Como contraponto, seu [projeto FrankMD](https://github.com/akitaonrails/FrankMD) acumulou um controller de quase 5.000 linhas quando ele relaxou essa disciplina. Sua conclusão não é que agentes sejam incapazes de produzir arquitetura, mas que tendem a estender o padrão mais próximo e fazer engenharia em excesso, a menos que um engenheiro experiente preserve o modelo mais amplo. Ele delega intensamente o *como*, mas não o *quê*, o *porquê*, a prioridade nem o padrão de qualidade.

## Kent Beck

Kent Beck criou o Extreme Programming, foi pioneiro do desenvolvimento orientado a testes e passou décadas refinando ciclos curtos de feedback e design incremental. Poucos engenheiros influenciaram tanto a maneira como programadores estruturam o ato de programar.

Beck chama sua prática atual de “programação aumentada”, separando-a deliberadamente de *vibe coding*. Ao construir uma árvore B+ com um agente, ele quase não digitou código, mas se preocupou com complexidade, testes, cobertura e design interno. Ficou atento a loops, funcionalidades desnecessárias, testes removidos e deterioração da estrutura, e interveio quando movimentos localmente sensatos do agente levaram a um código globalmente ruim. Seu prompt de sistema codifica Red/Green/Refactor, código mínimo, Tidy First e commits pequenos ([“Augmented Coding: Beyond the Vibes”](https://newsletter.kentbeck.com/p/augmented-coding-beyond-the-vibes)).

Seus experimentos de 2026 também expõem o custo da autonomia. Em sessões multiagente do “Genie”, ele se viu coordenando implementadores e verificadores enquanto mantinha o verdadeiro estado do trabalho na própria cabeça. O resultado desejado é menos coordenação humana, não um enxame teatral ([“Nobody Wants Agents”](https://newsletter.kentbeck.com/p/genie-lessons-nobody-wants-agents)). Ele está explorando especificações expressas como contratos — o que deve ser verdadeiro antes e depois de uma mudança — em vez de receitas detalhadas de implementação ([“Lessons from Genie Sessions”](https://newsletter.kentbeck.com/p/genie-lessons-from-genie-sessions)). A implementação é amplamente delegada; o discernimento de design, a concepção do feedback e a responsabilidade pela qualidade do código continuam sendo trabalho humano central.

## Linus Torvalds

Linus Torvalds criou o Linux e o Git e passou mais de três décadas mantendo uma das bases de código de sistemas mais importantes do mundo. Seus padrões são moldados por software que precisa continuar compreensível e manutenível por décadas.

Seu experimento mais concreto com programação por IA é o [AudioNoise](https://github.com/torvalds/AudioNoise), um visualizador de áudio pessoal em Python cujo README afirma ter sido criado em grande parte por *vibe coding* com o Google Antigravity. Em uma [mudança documentada](https://github.com/torvalds/AudioNoise/commit/93a72563cba609a414297b558cb46ddd3ce9d6b5), o agente implementou um mecanismo de seleção personalizado depois que Torvalds identificou que o comportamento nativo da biblioteca não era adequado. Ele delegou a implementação em uma linguagem e uma tecnologia de interface fora de sua principal especialidade, mas ainda definiu o problema comportamental e julgou o resultado.

Ele traça um limite muito mais rígido em torno de software de sistemas durável. Em sua [palestra principal no Open Source Summit de 2026](https://www.youtube.com/watch?v=fi29pfLcW4I&t=1725s), recebeu a IA como uma ferramenta útil, mas rejeitou a afirmação de que gerar a maior parte do texto equivale a fazer a maior parte da programação. **Em código que será mantido, alguém precisa compreender o resultado o suficiente para assumir responsabilidade por ele.** Sua própria evidência, portanto, sustenta ampla delegação em software pessoal e delimitado, não o tratamento do código do kernel ou da manutenibilidade de longo prazo como uma caixa-preta.

## Simon Willison

Simon Willison foi um dos criadores do Django e criou o Datasette e o ecossistema de linha de comando `llm`. Ele é tanto um usuário prolífico de agentes de programação quanto um dos cronistas públicos mais claros de seus modos de falha.

O fluxo de produção de Willison é intencionalmente controlador. Ele entrega aos agentes tarefas detalhadas, assinaturas, restrições e exemplos; depois os faz escrever testes e demonstrar o software em execução. Já descreveu o agente como um estagiário rápido e capaz sob um gerente autoritário: útil justamente porque o operador é explícito sobre o resultado desejado. A etapa não delegável é testar. Se ele não viu o comportamento em execução, não considera o trabalho concluído ([“Here's how I use LLMs to help me write code”](https://simonwillison.net/2025/Mar/11/using-llms-for-code/), [“Using coding agents”](https://simonwillison.net/2025/Jun/18/coding-agents/)).

Sua revisão de código-fonte é baseada em risco, não em doutrina. Ele pode usar um script descartável de baixo risco sem lê-lo, ao mesmo tempo que acompanha de perto uma mudança de implantação e assume o controle quando o agente deixa passar uma restrição sutil. Já entregou trabalho em produção somente por meio de prompts, sem editar o código manualmente, mas isso não significou abrir mão do controle dos arquivos, do comportamento ou da verificação ([“Coding without typing the code”](https://simonwillison.net/2025/Oct/16/coding-without-typing-the-code/)). Em agosto de 2026, argumentou que a revisão linha a linha é apenas uma técnica de verificação; testes, exploração manual, análise estática, rastros de execução e explicações produzidas por agentes podem, às vezes, fornecer evidências mais fortes ([“More than just code review”](https://simonwillison.net/2026/Aug/22/more-than-just-code-review/)). Ele aceita uma implementação como caixa-preta na proporção das consequências de ela estar errada, mas não aceita o comportamento como caixa-preta.

## Addy Osmani

Addy Osmani passou mais de catorze anos trabalhando na engenharia do Chrome e de ferramentas para desenvolvedores no Google, e agora trabalha no Claude Code na Anthropic. Seus textos conectam o uso prático de agentes às práticas operacionais de equipes maiores de engenharia.

No início de 2026, seu fluxo padrão começava com uma especificação que cobria requisitos, arquitetura, dados e testes. Em seguida, ele entregava pequenos blocos a um agente supervisionado, revisava o diff, executava os testes e frequentemente pedia a um segundo modelo que fizesse outra revisão. Naquele momento, ainda relatava ler o código gerado linha por linha, sobretudo porque o gargalo havia passado da produção do código para a sua avaliação ([“My AI coding workflow”](https://addyosmani.com/blog/ai-coding-workflow/)).

Seu trabalho posterior torna esse processo executável. [Agent Skills](https://addyosmani.com/blog/agent-skills/) codificam um caminho que vai da especificação ao planejamento, implementação, verificação, revisão e entrega, com critérios de saída baseados em evidências. Uma suíte de testes aprovada não é prova suficiente: o comportamento em execução, a saída visível, as verificações de segurança e o diff real ainda importam. É uma mudança de lembrar pessoalmente cada disciplina para instalar essas disciplinas ao redor do agente. **O humano ainda define a arquitetura e o escopo, decide quais evidências são adequadas e permanece responsável quando o *harness* deixa algo passar.**

## Andrej Karpathy

Andrej Karpathy é pesquisador e educador de IA, foi um dos pesquisadores fundadores da OpenAI e ex-diretor de IA da Tesla. Ele aborda agentes de programação tanto como desenvolvedor quanto como alguém que construiu os sistemas subjacentes.

Karpathy está entre os delegadores mais agressivos deste grupo. Em uma [entrevista ao No Priors](https://www.youtube.com/watch?v=kwSVtQ7dziU), em março de 2026, descreveu uma transição de escrever código manualmente para passar seu tempo expressando intenções aos agentes. Isso leva a ideia de *vibe coding*, que ele cunhou em 2025, muito além de projetos descartáveis de fim de semana: a atividade principal passa a ser descrever a mudança desejada, orientar as tentativas e avaliar os resultados, em vez de editar sintaxe.

Seu projeto [autoresearch](https://github.com/karpathy/autoresearch) mostra o que torna viável um alto grau de autonomia. O agente pode modificar um arquivo de treinamento, executar um experimento fixo de cinco minutos, medir uma única métrica de validação, manter as melhorias, reverter as regressões e repetir durante a noite. O humano edita o programa de pesquisa e controla os mecanismos imutáveis de preparação e avaliação. Trata-se de implementação autônoma dentro de um espaço de busca pequeno e explícito — não de propriedade autônoma sobre o objetivo científico ou as evidências. O código pode se tornar comparativamente opaco porque o comportamento experimental é excepcionalmente mensurável.

## Mitchell Hashimoto

Mitchell Hashimoto foi cofundador da HashiCorp e criou ferramentas como Vagrant e Terraform; hoje desenvolve o terminal Ghostty. Seu trabalho abrange ferramentas para desenvolvedores, software de sistemas e grandes comunidades de código aberto.

A adoção de Hashimoto foi gradual e empírica. A geração de código por chat inicialmente o decepcionou. Os agentes se tornaram úteis quando passaram a poder inspecionar o repositório, executar ferramentas, separar o planejamento da execução e verificar o resultado. Ele treinou o próprio julgamento pedindo a um agente que reproduzisse mudanças que já havia feito manualmente e, depois, comparando os caminhos. Sua prática atual delega tarefas pequenas e de alta confiança, pesquisa, triagem de issues e trabalho em segundo plano ao fim do dia, enquanto ele se concentra em problemas mais profundos ([“My AI adoption journey”](https://mitchellh.com/writing/my-ai-adoption-journey)).

Ele deliberadamente prefere um agente a um enxame. Enquanto o agente planeja, ele escreve código; enquanto o agente implementa, ele revisa. Cada erro recorrente se transforma em uma regra ou ferramenta permanente nas [instruções para agentes](https://github.com/ghostty-org/ghostty/blob/main/AGENTS.md) do Ghostty, e mudanças visuais podem ser verificadas por capturas de tela em vez de apenas por texto. Em uma [entrevista ao Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/mitchell-hashimoto), em 2026, descreveu a meta de manter um agente produtivamente ocupado durante parte do dia, não de lhe entregar o projeto inteiro. Seu limite é pragmático: delegar trabalhos cujo sucesso possa ser especificado e verificado a baixo custo; conservar o problema difícil, a revisão e o controle das interrupções.

## Armin Ronacher

Armin Ronacher criou Flask e Jinja e construiu uma infraestrutura para desenvolvedores em Python e Rust amplamente utilizada. Seus textos sobre IA são especialmente valiosos porque registram uma rápida mudança de uma assistência cautelosa para um trabalho de produção fortemente baseado em agentes, sem fingir que as contrapartidas desapareceram.

Em janeiro de 2025, Ronacher tratava a IA como um estagiário capaz e permanecia muito próximo do processo ([“How I AI”](https://lucumr.pocoo.org/2025/1/30/how-i-ai/)). Em setembro, havia colocado em produção um sistema cujas cerca de 40.000 linhas de Go, YAML e Pulumi foram mais de 90% escritas por IA. Ele projetou o esquema e a arquitetura, trabalhou em incrementos revisáveis do tamanho de pull requests, usou um modelo para revisar outro e leu cada linha. Também alertou que agentes perdem a visão do sistema como um todo: o operador ainda precisava compreender máquinas de estado, bancos de dados e o comportamento em execução ([“90%”](https://lucumr.pocoo.org/2025/9/29/90-percent/)).

Hoje, ele trabalha quase exclusivamente por meio de um pequeno agente de terminal, o [Pi](https://lucumr.pocoo.org/2026/1/31/pi/), mas não adotou autonomia irrestrita. Em junho de 2026, escreveu que loops autônomos externos não haviam funcionado para código com o qual se importava profundamente, porque queria controle, bom gosto e a capacidade de explicar o resultado ([“The Coming Loop”](https://lucumr.pocoo.org/2026/6/23/the-coming-loop/)). Um experimento posterior de fábrica de software, com 35 horas de duração, consumiu bilhões de tokens sem produzir software útil ([“Astra: Why?”](https://lucumr.pocoo.org/2026/9/7/astra-why/)). **Ronacher delega a maior parte da implementação, mas ainda considera compreensão e responsabilidade inseparáveis da engenharia séria.**

## Salvatore Sanfilippo

Salvatore Sanfilippo, conhecido como antirez, criou o Redis e tem uma longa trajetória projetando sistemas compactos a partir de princípios fundamentais. Seus textos recentes fornecem o exemplo mais claro, entre os analisados aqui, de um engenheiro revisando publicamente sua posição.

Em 2025, ele usava LLMs para revisão, protótipos e implementação a partir de especificações precisas, mantendo um ciclo manual rigoroso ([“Coding with LLMs in the summer of 2025”](https://antirez.com/news/154)). Durante o projeto Redis Array, em 2026, passou um mês trabalhando na especificação e nas estruturas de dados, e então deixou a IA implementar sob revisão constante. Leu cada linha e encontrou problemas de desempenho e design que uma grande suíte de testes não havia detectado ([“Redis array type: short story of a long development”](https://antirez.com/news/164)). Chamou isso de “programação automática”, distinta de *vibe coding* porque o humano mantinha a visão, a intuição e a compreensão ([“Automatic programming”](https://antirez.com/news/159)).

Em julho, sua visão havia mudado. Modelos de fronteira podiam produzir cerca de 5.000 linhas por dia, fazendo da revisão humana completa o gargalo. Na maioria dos projetos, passou a considerar que sua atenção seria mais bem empregada no modelo mental, no documento de design, nas ideias novas e na garantia de qualidade. Ainda revisava o código do Redis por respeito aos usuários, mas, em sistemas experimentais, estava disposto a validar comportamento e desempenho sem ler tudo ([“Control the ideas, not the code”](https://antirez.com/news/169)). Ele não abandonou a compreensão; levou-a para um nível acima. A implementação pode ser opaca, mas o design, o modelo de desempenho e o comportamento observado não podem.

## Birgitta Böckeler

Birgitta Böckeler é Distinguished Engineer na Thoughtworks, com mais de duas décadas de experiência como desenvolvedora, arquiteta e líder técnica. Seu trabalho se concentra especificamente na aplicação do desenvolvimento assistido por IA a software corporativo pronto para produção.

Em um experimento de 2025, a equipe de Böckeler levou agentes a construir um serviço Spring Boot com intervenção mínima. Os agentes adicionaram funcionalidades não solicitadas, alteraram premissas ao longo do caminho e, às vezes, declararam sucesso mesmo com testes falhando. Aplicações de referência, exemplos de código, prompts reutilizáveis, tarefas modulares e um agente de revisão separado melhoraram o resultado, mas não eliminaram a necessidade de supervisão humana ([“How far can we push AI autonomy?”](https://martinfowler.com/articles/pushing-ai-autonomy.html)). Mais tarde, ela enquadrou a inspeção do código-fonte como um cálculo de risco: impacto, probabilidade e detectabilidade determinam se o código gerado merece revisão minuciosa ([“I still care about the code”](https://martinfowler.com/articles/exploring-gen-ai/i-still-care-about-the-code.html)).

Seu trabalho de 2026 transforma arquitetura e qualidade em sensores que o agente pode ler: tipos, regras de lint, análise estática de segurança, verificações de dependências, testes, cobertura, testes de mutação, detecção de segredos e revisões aprofundadas periódicas. Uma regra de dependência pode impedir uma violação arquitetural antes que um humano veja o diff, enquanto o agente recebe feedback imediato e se corrige ([“Sensors for coding agents”](https://martinfowler.com/articles/sensors-for-coding-agents.html)). Böckeler não afirma que esses sensores comprovam a qualidade semântica. Eles transferem a fiscalização rotineira para o *harness*, para que a atenção humana possa se concentrar em exceções, riscos e julgamento no nível do sistema.

## Steve Yegge

Steve Yegge é um antigo engenheiro da Amazon e do Google cujos ensaios sobre ferramentas para desenvolvedores influenciam a indústria há décadas. Hoje, ele desenvolve Beads, Gas Town e Wheelhouse como experimentos de desenvolvimento agêntico em larga escala.

Yegge é o ponto fora da curva que aceita mais diretamente o código como caixa-preta. Gas Town começou como um sistema de orquestração de 20 a 30 agentes, com filas de merge e controles de qualidade; ele disse que foi inteiramente criado por *vibe coding* e que não havia lido seu código-fonte ([“Welcome to Gas Town”](https://yegge.ai/essays/welcome-to-gas-town/)). Argumentou que o comportamento do cliente, os testes e a verificação importam mais do que um humano ter inspecionado pessoalmente a implementação ([“The Future of Coding Agents”](https://yegge.ai/essays/the-future-of-coding-agents/)).

Sua posição não se baseia em fé cega em um único agente. Em agosto de 2026, o modelo reutilizável de orquestração do Gas Town havia quebrado diante do comportamento de novos modelos, por isso ele o substituiu pelo Wheelhouse, um sistema específico para cada projeto composto de planos persistentes, agentes com funções distintas, agentes revisores e memória institucional. Ele relata operar mais de quarenta agentes e produzir cerca de 175 commits reais por dia sem ler as 150.000 a 300.000 linhas da implementação ([“The Shape of Things to Come”](https://yegge.ai/essays/the-shape-of-things-to-come/)). A ambição do produto e o “cérebro” persistente do projeto continuam sob controle, mas implementação, decomposição e boa parte da revisão são delegadas a agentes. Ele acredita que a revisão humana de código está a caminho de desaparecer. Isso vai consideravelmente além de quase todos os outros nesta comparação.

## Anders Hejlsberg

Anders Hejlsberg foi o arquiteto de Turbo Pascal, Delphi, C# e TypeScript. Seu julgamento vem de quatro décadas de design de linguagens e compiladores, inclusive em sistemas nos quais invariantes globais sutis importam mais do que produzir rapidamente código comum de aplicações.

Hejlsberg usa IA, mas seus exemplos públicos favorecem transformações delimitadas. Ao falar da grande migração do TypeScript para código nativo, ofereceu um padrão revelador: em vez de pedir a um modelo que reescreva diretamente uma base de meio milhão de linhas, peça que ele gere um tradutor determinístico. Ele argumenta que a eficácia da IA em uma linguagem depende muito da quantidade de código representativo existente nos dados de treinamento e espera que desenvolvedores supervisionem sistemas cada vez mais capazes ([entrevista ao GitHub](https://github.blog/developer-skills/programming-languages-and-frameworks/typescripts-rise-in-the-ai-era-insights-from-lead-architect-anders-hejlsberg/)).

Em uma [entrevista ao Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/typescript-c-and-turbo-pascal-with), em 2026, disse que os agentes atuais ainda têm dificuldades com o trabalho em compiladores porque não preservam, em uma visão coerente, a relação entre tipos, símbolos, vinculação, análise sintática e outros subsistemas. Ele espera que engenheiros acabem gerenciando frotas de agentes, mas as evidências sobre seu próprio fluxo cotidiano são mais escassas do que para as outras pessoas aqui. O limite que ele enxerga hoje é claro: delegar trabalhos verificáveis localmente e a geração de ferramentas; conservar o modelo transversal e usar mecanismos determinísticos onde a correção possa ser codificada.

## Martin Fowler

Martin Fowler escreveu *Refatoração*, *Patterns of Enterprise Application Architecture* e vários dos relatos fundamentais da área sobre design ágil. Seu trabalho sempre se concentrou em integridade conceitual, arquitetura evolutiva e feedback.

O registro público de Fowler é mais uma caracterização cuidadosa da transição do que um diário detalhado de sua programação. Em junho de 2025, ele disse ter apenas experimentado superficialmente as melhores ferramentas, ao mesmo tempo que argumentava que o uso de prompts era um novo nível de abstração não determinístico, comparável em importância à passagem do Assembly para linguagens de alto nível ([“LLMs bring new nature of abstraction”](https://martinfowler.com/articles/2025-nature-abstraction.html)). Em agosto, alertou que pesquisas ocultavam a diferença entre autocompletar e agentes capazes de ler, editar e executar um repositório, e que as afirmações de agentes de que os testes haviam passado precisavam ser verificadas de forma independente ([“Some thoughts on LLMs and Software Development”](https://martinfowler.com/articles/202508-ai-thoughts.html)).

Em maio de 2026, ele identificou uma “inflexão de novembro”, quando novos modelos e o Claude Code tornaram viáveis tarefas muito mais difíceis ([“November Inflection”](https://martinfowler.com/bliki/NovemberInflection.html)). Sua definição de [programação agêntica](https://martinfowler.com/bliki/AgenticProgramming.html) é explícita: agentes manipulam a árvore de arquivos e executam testes por períodos prolongados; humanos avaliam o trabalho por meio de revisão, resultados de testes e outros sensores, e permanecem responsáveis pelo que o sistema faz e por como funciona. Fowler, portanto, rejeita tanto o autocompletar como descrição completa quanto o *vibe coding* como destino profissional. Sua ênfase está na compreensão do domínio, na colaboração com usuários e na engenharia do *harness* — os guias e sensores que tornam governável um implementador não determinístico.

## O que parece estar se tornando prática comum

### Forte convergência

**A implementação está sendo delegada de forma muito mais agressiva.** Em domínios bastante diferentes, engenheiros experientes foram além do autocompletar. Agentes agora escrevem funcionalidades inteiras, testes, migrações, infraestrutura, refatorações, experimentos e, às vezes, aplicações completas. A divergência já não é se a implementação pode ser delegada, mas até onde e com base em quais evidências.

**A responsabilidade não está sendo delegada no mesmo ritmo.** As responsabilidades humanas recorrentes são intenção, priorização, restrições, risco, aceitação e a decisão de colocar em produção. Mesmo os fluxos mais favoráveis à autonomia mantêm um operador que define o sucesso e assume o fracasso. Nenhum desses engenheiros considera a declaração confiante de um agente de que a tarefa terminou como evidência suficiente.

**Feedback rápido e executável é a infraestrutura que viabiliza tudo isso.** Testes aparecem em toda parte, mas o padrão é mais amplo: tipos, linters, scanners de segurança, regras de dependência, métricas fixas, capturas de tela, observação em tempo de execução, testes de mutação e commits pequenos e reversíveis. Os fluxos mais robustos transformam restrições arquiteturais e de produto em sinais que o agente pode consumir sem esperar por uma revisão humana.

**O contexto está se tornando parte do sistema projetado.** `AGENTS.md`, `CLAUDE.md`, documentos de design, especificações, exemplos, registros de decisões e grafos persistentes de tarefas deixaram de ser anotações incidentais. Eles são a memória e as instruções operacionais do processo de implementação. Engenheiros experientes aprimoram o *harness* depois de falhas da mesma forma que aprimorariam uma suíte de testes ou uma API.

**A experiência continua se acumulando e gerando vantagem.** Esses fluxos recompensam a capacidade de identificar uma abstração ruim, rejeitar escopo desnecessário, modelar modos de falha e escolher a validação correta. Agentes removem boa parte do custo mecânico de agir sobre esses julgamentos; não os fornecem de forma confiável. A vantagem do engenheiro sênior está menos na velocidade de digitação do que em saber o que merece atenção.

A distinção da caixa-preta se sustenta em grande parte, com uma ressalva. Muitos desses engenheiros aceitam alguma implementação como caixa-preta, especialmente quando é descartável, de baixo risco ou fortemente mensurável. Quase nenhum aceita o comportamento do sistema como caixa-preta. A maioria também rejeita que a arquitetura se torne opaca, embora possa permitir que agentes *proponham* designs locais ou até substanciais. A obrigação mantida não é necessariamente originar cada decisão de design, mas conservar uma explicação coerente do sistema e de suas restrições.

### Divergências significativas

**Eles discordam profundamente sobre a leitura do código.** Beck, Böckeler, Torvalds, Ronacher e Sanfilippo no início de 2026 tratam a compreensão do código-fonte como parte da manutenção séria. Willison, DHH e Sanfilippo mais tarde condicionam a inspeção ao risco. Karpathy pode ignorar os detalhes internos quando uma métrica captura o objetivo. Yegge está disposto a não ler centenas de milhares de linhas e substituir a revisão humana por camadas de revisão por agentes e evidências comportamentais.

**Eles discordam sobre autonomia e concorrência.** Hashimoto prefere um agente em segundo plano e protege o próprio foco. Beck é cético quanto a enxames que transformam o humano em coordenador. Ronacher considera decepcionantes os loops autônomos longos em software com o qual se importa. O loop experimental restrito de Karpathy funciona justamente porque pode operar sem supervisão. Yegge usa dezenas de agentes e considera a orquestração o novo meio de programação.

**Eles discordam sobre onde o design acontece.** Akita, Ronacher, Sanfilippo e Hejlsberg colocam o modelo de design humano claramente antes da geração. DHH permite cada vez mais que agentes escolham caminhos de implementação e depois revisa a forma resultante. Yegge também delega decomposição e design a agentes especializados. “Humanos arquitetam, IA implementa” descreve um centro de gravidade, não um limite estabelecido.

### Ainda sem resposta

**Uma arquitetura mantida por agentes consegue preservar a integridade conceitual ao longo dos anos?** Temos exemplos convincentes de curto e médio prazo, além de fracassos que servem de alerta. Ainda não há muitas evidências de bases de código dominadas por agentes que tenham atravessado anos de mudanças de equipes, requisitos, dependências e incidentes.

**Evidências comportamentais podem substituir a compreensão do código-fonte em sistemas de alto risco?** A revisão baseada em risco está claramente surgindo, mas o critério para parar ainda não está resolvido. Testes cobrem apenas propriedades que alguém pensou em codificar; a inspeção do código também deixa problemas passar; e a revisão por agentes herda pontos cegos correlacionados. Segurança, infraestrutura, concorrência e mudanças irreversíveis em dados continuam sendo os casos mais difíceis.

**O que acontece com a formação de especialistas?** Esses métodos amplificam pessoas que já possuem modelos sólidos de arquitetura, depuração e qualidade. Hashimoto, Fowler e outros levantam a pergunta ainda sem resposta por trás dessa vantagem: como um novo engenheiro adquire esses modelos se os agentes realizam o trabalho de implementação que antes os ensinava?

A conclusão atual mais defensável é mais restrita do que o entusiasmo ou a reação contrária. Engenheiros experientes estão delegando rapidamente a produção de código, e alguns também estão delegando a inspeção do código-fonte. Como grupo, eles não estão delegando a obrigação de compreender o problema, definir o comportamento aceitável, preservar um sistema coerente, escolher as evidências e assumir o resultado.

## Minha conclusão

Meu ponto de partida é que precisamos lembrar que LLMs são **preditores de tokens**. Eles não raciocinam nem deliberam; preveem o próximo token. Mesmo que raciocinassem, não teriam a experiência dos projetos anteriores nem o contexto organizacional necessário para saber o que é prioridade e como será a futura equipe responsável pelo sistema.

As pessoas mais entusiasmadas com a delegação à IA poderiam dizer: “Basta adicionar isso ao contexto. Grave as reuniões, grave tudo, adicione tudo como contexto e deixe o LLM decidir o que fazer.”

É claro que cada sessão tem um contexto limitado. Em teoria, consigo imaginar um fluxo com um agente “mestre” que mantenha o contexto da organização, receba solicitações e crie subagentes com tarefas de escopo restrito. Mas digo “em teoria” porque não vi isso funcionar nem consegui fazê-lo funcionar em software sério e complexo. O que vejo, em vez disso, é a lógica de negócio acabar duplicada, padrões arquiteturais se degradarem, APIs e interfaces deixarem de ser intuitivas e padronizadas, e os problemas se acumularem em uma grande base de código espaguete, impossível de manter até mesmo para o agente.

Minha conclusão é que a IA precisa ser usada, dado o ganho de produtividade que traz. Mas, para trabalho sério e complexo, é preciso haver um engenheiro humano que realmente compreenda o sistema e seu objetivo — alguém capaz de limpar, aparar, refatorar e corrigir o rumo. A IA aumenta a velocidade da implementação, enquanto esse envolvimento humano reduz o acúmulo de *bad smells* que o agente pode introduzir.

Ainda é preciso um humano para determinar o que é verdade, decidir o que isso significa, assumir responsabilidade e tomar decisões de design sobre o sistema.

Observe que eu disse “para trabalho sério e complexo”. Para MVPs, POCs, código descartável, ferramentas, utilitários e dashboards sob medida, *vibe coding* certamente é uma boa opção e pode gerar um grande aumento de produtividade. Uma coisa que gosto de fazer é pedir à IA que crie, por *vibe coding*, um script para uma tarefa que realizo repetidamente. Depois de gerado, o script executa de forma rápida e reproduzível, produz resultados determinísticos sem novo consumo de tokens e gasta o tempo do agente, não o meu. Essas implementações podem ser caixas-pretas sem problema.

No entanto, para sistemas complexos — ou sistemas que acabarão se tornando complexos — e para software que precisa ser confiável, acredito que ainda precisamos, e provavelmente sempre precisaremos, de engenheiros humanos responsáveis. Hoje, meu fluxo de trabalho é aproximadamente este:

Planejo com um agente de IA e peço que ele apresente possibilidades. Escolho entre elas em decisões como linguagem de programação, framework, tecnologia, hospedagem e banco de dados. Com base em meu conhecimento, experiência e planos para o projeto, seleciono as opções que considero mais econômicas e estrategicamente adequadas.

A partir desse trabalho, o agente gera um documento. Em uma nova sessão — o que mantém cada sessão dentro da faixa de 200.000 a 300.000 tokens, mais barata, rápida e eficaz —, examinamos em maior profundidade as principais entidades e classes do banco de dados e do domínio, APIs, arquitetura geral e estrutura de pastas. Essas decisões se tornam um segundo documento, mais detalhado.

Então, peço um primeiro passo pequeno, como a primeira API ou o primeiro script de banco de dados, e o inspeciono. Se o resultado for sólido e eu gostar da direção, peço ao agente que crie um `AGENTS.md` com a documentação adequada e estabeleça o que fizemos como padrão.

A partir daí, o agente pode escrever com mais liberdade, e tenho muito mais confiança de que permanecerá dentro dos limites estabelecidos.

Outra prática fundamental é usar DevOps em toda parte: testes automatizados, CI/CD e testes de ponta a ponta das funcionalidades principais. Tudo o que já sabemos sobre DevOps se aplica e ajuda enormemente. A IA também torna essa infraestrutura mais fácil de criar. Testes, scripts e códigos auxiliares semelhantes podem ser caixas-pretas sem problema.

Em um projeto existente, solicitações menores podem ser resolvidas mais facilmente de uma só vez. Uma sessão prepara o plano, uma nova sessão o executa e outra sessão nova o revisa — uso, por exemplo, minha skill pública [review-current-work](https://github.com/vdufloth/agent-plugins/blob/main/plugins/vdufloth/skills/review-current-work/SKILL.md). O agente cria o merge request, um humano faz uma revisão ampla em busca de qualquer coisa que pareça errada, aprova e o ciclo continua.

Para mim, o maior ganho de velocidade vem do agente realizar o trabalho durante o tempo que eu passaria escrevendo código. Posso me concentrar em compreender e planejar um problema de cada vez. O agente então cuida da implementação, da revisão e da descrição do merge request. Enquanto ele faz isso, posso começar a planejar a próxima mudança. É isso que aumenta drasticamente minha produtividade sem que eu perca o controle — controle que acabará sendo necessário em problemas difíceis, investigações ou mudanças arquiteturais.

Três afirmações dos programadores experientes acima capturam exatamente o que penso sobre isso:

> Em código que será mantido, alguém precisa compreender o resultado o suficiente para assumir responsabilidade por ele.<br>
> — Linus Torvalds, parafraseado

Em um projeto sério, se você muda algo, isso quebra e uma parte interessada pergunta por que você fez daquela forma, uma resposta como “porque o Claude disse” não vai muito longe.

> O humano ainda define a arquitetura e o escopo, decide quais evidências são adequadas e permanece responsável quando o *harness* deixa algo passar.<br>
> — Addy Osmani, parafraseado

Esse continua sendo o trabalho mais reflexivo do desenvolvedor. A parte mecânica da escrita está “resolvida”, embora, mesmo nela, legibilidade e manutenibilidade ainda precisem ser monitoradas e ocasionalmente corrigidas. Mas o design, a arquitetura, a responsabilidade e, especialmente, a simplificação de um sistema continuam sendo responsabilidade do engenheiro.

> A maior parte da implementação pode ser delegada, mas compreensão e responsabilidade permanecem inseparáveis da engenharia séria.<br>
> — Armin Ronacher, parafraseado

Compreender o sistema, tomar decisões e assumir responsabilidade por elas ainda precisa caber a um humano dedicado a fazê-lo funcionar — alguém responsável pelo que deu errado e por impedir que aconteça novamente. LLMs podem gerar e explorar texto, e até interagir com sistemas computacionais, em uma escala muito além dos humanos. O raciocínio, a intenção e a validação, no entanto, continuam intrinsecamente humanos, como explorei em [“O que resta quando a IA vira commodity? Intenção e validação”](/pt/blog/ai/intent-and-validation/).

## Apêndice: conclusões por engenheiro

| Engenheiro | Delega à IA | Mantém sob controle humano |
| --- | --- | --- |
| David Heinemeier Hansson (DHH) | Quase toda a implementação em um projeto novo como o Omarchy Quattro, incluindo decisões locais de design; muito menos inspeção do código-fonte da interface e do código auxiliar. | A forma geral do sistema e a revisão minuciosa de código crítico. Sistemas de produção existentes ainda precisam de um engenheiro experiente para preservar a coerência arquitetural. |
| Robert C. Martin | Implementação e refatoração dentro de um fluxo de agentes altamente disciplinado. | O comportamento aceito, as regras de arquitetura e a permissão para alterar cenários de aceitação, impostos por testes e verificações de dependências. |
| Fábio Akita | A maior parte da implementação, testes, refatoração mecânica, pesquisa e trabalho de infraestrutura. | O *quê* e o *porquê*, arquitetura, interfaces, priorização, julgamento de segurança, validação e a poda contínua de abstrações ruins. |
| Kent Beck | A maior parte da produção de código, experimentos e trabalho mecânico. | Qualidade do design, disciplina de testes, ciclos de feedback, decomposição de tarefas e intervenção quando decisões locais do agente prejudicam o todo. |
| Linus Torvalds | Software pessoal delimitado, especialmente em linguagens ou tecnologias fora de sua principal especialidade. | Compreensão e responsabilidade por sistemas duráveis e mantidos; o código gerado não pode transformar o próprio sistema em uma caixa-preta. |
| Simon Willison | Implementação, testes e, às vezes, mudanças completas de produção sem digitar ou ler manualmente cada linha. | Intenção e verificação precisas. A inspeção do código-fonte varia conforme o risco, mas o comportamento observado do sistema nunca é aceito sem comprovação. |
| Addy Osmani | Implementação ao longo do ciclo de desenvolvimento, com skills reutilizáveis impondo o processo. | Arquitetura, escopo, as evidências exigidas, revisão final e responsabilidade quando as verificações automatizadas deixam algo passar. |
| Andrej Karpathy | Implementação e experimentação autônomas dentro de loops restritos. | O objetivo de pesquisa, a superfície editável, o limite de tempo, a métrica de avaliação e o programa que governa o loop. |
| Mitchell Hashimoto | Tarefas pequenas e de alta confiança, pesquisa, triagem e implementação em segundo plano. | Os problemas mais difíceis, revisão, gestão da atenção e as regras e ferramentas adicionadas ao *harness* após cada falha. |
| Armin Ronacher | Mais de 90% da implementação em alguns sistemas de produção, além de pesquisa, depuração, infraestrutura e auxílio na revisão. | Arquitetura, compreensão, discernimento, comportamento em execução e responsabilidade. Ele continua cético quanto a loops sem supervisão para código durável com o qual se importa. |
| Salvatore Sanfilippo | Cada vez mais, a própria implementação e — em muitos projetos — a revisão linha a linha do código-fonte. | Ideias, modelos mentais, documentos de design, raciocínio de desempenho e garantia de qualidade. Ele ainda revisa código do Redis especialmente relevante. |
| Birgitta Böckeler | Implementação e fiscalização rotineira por meio de tipos, linters, testes, ferramentas de segurança, regras de dependência e outros sensores. | Avaliação de risco, exceções, qualidade semântica e julgamento sobre se os sensores disponíveis fornecem evidência suficiente. |
| Steve Yegge | Implementação, decomposição, design, revisão, merge e funções de produção entre frotas de agentes. | Ambição do produto e orientação leve. A memória persistente do projeto e agentes revisores especializados substituem sua própria inspeção do código-fonte. Ele é o defensor mais claro da substituição da revisão humana pela revisão de agentes. |
| Anders Hejlsberg | Assistência de IA em trabalhos verificáveis localmente; ele prefere pedir à IA que gere ferramentas determinísticas de transformação em vez de reescrever diretamente grandes bases de código. | O modelo transversal do compilador e a decisão de usar mecanismos determinísticos onde a geração direta não seria confiável. |
| Martin Fowler | Descreve a programação agêntica profissional como manipulação prolongada do repositório, implementação e execução de testes por agentes; as evidências sobre seu próprio fluxo diário são mais escassas. | Responsabilidade pelo que o software faz e por como funciona, compreensão do domínio, colaboração com usuários e avaliação por meio de revisões, testes e outros sensores. |
