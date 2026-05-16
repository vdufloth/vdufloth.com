---
date: '2026-03-28T20:35:36-03:00'
draft: false
title: 'Por Que Gerir Software É Diferente — e Por Que o Cascata Não Bastou'
summary: 'Software não tem leis da física, materiais escassos nem forma visível — por isso os métodos de gestão que funcionam para pontes falham com sistemas. Por que software é diferente e por que o modelo cascata ruiu diante da realidade mutável do código.'
categories:
- Desenvolvimento de Software
- Gestão
- Tecnologia
---

*Este é o primeiro artigo de uma série sobre como a gestão de engenharia de software evoluiu — e como conduzir um time moderno. Começamos pela raiz: por que gerir software resiste aos métodos que funcionam em todo o resto, e por que a primeira tentativa da indústria de criar um processo não se sustentou.*

## Por que gestão de software é diferente

Gestão de projetos de software é algo único. Diferente de outras engenharias, softwares não possuem restrições físicas. Não há leis da gravidade limitando o que pode ser construído, nenhum material escasso, nenhuma força natural resistindo ao progresso. Na mesma linha, software é intangível, não é possível ter uma dimensão visual clara de seu tamanho ou complexidade, principalmente para pessoas não técnicas.

Construir uma ponte é um empreendimento fundamentalmente previsível. A engenharia civil lida com leis da física constantes, materiais com propriedades imutáveis e um terreno que, uma vez mapeado e preparado, raramente sofre alterações drásticas durante a execução do projeto. Sabe-se previamente como será o resultado final, e os requisitos de engenharia estrutural não mudam de um mês para o outro. 

Foi natural que ao começarem, os grandes projetos de software foram geridos da mesma forma dos projetos de engenharia. Porém  com fracassos de prazo e custo frequentes, logo foi visto que software não pode ser tratado igual. O cliente muda de ideia. O mercado muda. A tecnologia muda. O que era urgente em janeiro pode ser irrelevante em março.

O usuário vê a interface, mas toda a parte de infraestrutura, automações e fluxos não é explicitamente visível. Estas características tornam o trabalho inerentemente otimista e ao mesmo tempo de difícil estimativa, o que por sua vez torna sua gestão complexa. Além disso, é sempre difícil argumentar com o financeiro a alocação do tempo necessário para documentação, testes automatizados, refatoração, justamente por serem invisíveis e muitas vezes de difícil cálculo de ROI (Retorno sobre o investimento).

Desde no mínimo 1975 isto já é conhecido. No livro *The Mythical Man-Month* de Fred Brooks, ele já calculava apenas 1/6 do tempo de sua equipe para a programação puramente dita. O restante seria consumido por testes, correção de bugs, trabalho não previsto e o inevitável tempo ocioso inerente a qualquer atividade humana. Décadas depois, alguns times e gestores ainda planejam como se esses 5/6 não existissem.

Brooks também identificou precisamente dificuldades únicas em projetos de software, o que chamou de *dificuldades essenciais*, que são:

- **Complexidade**: Sistemas crescem de forma não linear conforme aumentam em funcionalidades, o que resulta em dificuldades crescentes de comunicação, falhas e atrasos;
- **Conformidade**: Um sistema é construído também com  requisitos fora do controle da equipe, como regras de negócio, leis e sistemas externos, o que faz não ser possível um projeto 'ideal';
- **Mutabilidade**: Enquanto produtos físicos são substituídos por novos modelos, software é modificado no próprio produto já em uso, trazendo uma complexidade adicional de mantenibilidade de funções e compatibilidade com dados e fluxos existentes;
- **Invisibilidade**: Software é abstrato — sem representação física ou geométrica natural. Diagramas, documentações e analogias podem aproximar a sua compreensão, mas a representação pura do software é apenas o próprio código em si e a imaginação do mesmo em execução na mente do desenvolvedor.

A conclusão, conhecida como *Não há bala de prata* foi: não existe solução que proporcione saltos significativos de produtividade ou confiabilidade no desenvolvimento de software. Ferramentas melhores, linguagens mais expressivas e práticas como DevOps podem reduzir as *dificuldades acidentais* — os atritos criados pelo próprio processo de desenvolvimento, mas as dificuldades essenciais permanecerão.

A jornada da gestão da engenharia de software desde então foi uma transição da tentativa de controle rigoroso para a aceitação e gestão da imprevisibilidade. Abordaremos brevemente esta história ao longo da série e, ao final, um guia prático de uma gestão que traz bons resultados para a maioria dos times modernos. Também teremos ao final, uma análise se os avanços em inteligência artificial poderão mudar algo.

## O modelo cascata

No início da engenharia de software, durante as décadas de 1960 e 1970, o desenvolvimento de sistemas de informação passou a demandar uma metodologia mais formal. À medida que os projetos cresciam em tamanho e complexidade (principalmente impulsionados por contratos governamentais e aeroespaciais), a necessidade de um processo estruturado tornou-se evidente. A resposta inicial da indústria foi importar e adaptar modelos de gestão da engenharia civil e da manufatura de hardware.

O modelo cascata (waterfall) foi o primeiro paradigma de ciclo de vida de desenvolvimento de software a surgir e se consolidar, tratando a construção de sistemas exatamente como era na construção civil. A premissa básica era o sequenciamento: levantar todos requisitos, fazer o design da arquitetura, desenvolvimento (programação), testes e, finalmente, entrega e manutenção. O trabalho fluía em apenas uma direção, de uma etapa a outra, por isso o nome “cascata”. Também não existia uma previsão sistêmica de retorno a uma etapa anterior.

A primeira descrição formal dessas fases sequenciais é amplamente atribuída a um artigo de 1970 escrito pelo Dr. Winston W. Royce, intitulado Managing the Development of Large Software Systems. Royce, baseando-se em sua vasta experiência com sistemas de planejamento de missões aeroespaciais, desenhou o fluxo sequencial que dominaria a indústria. No entanto, logo nas páginas iniciais de seu artigo, Royce alertou explicitamente que a implementação estrita daquele modelo puramente linear era fundamentalmente falha, afirmando que a abordagem era "arriscada e convidava ao fracasso".

Royce compreendia intimamente a complexidade essencial que Brooks descreveria uma década depois. Ele sabia que a fase de testes certamente revelaria falhas conceituais graves no design original, e seria necessário iterações constantes e retornos às fases anteriores. Para mitigar esse risco de retrabalho massivo, Royce propôs a criação prévia de protótipos descartáveis e a inclusão mandatória de ciclos de feedback entre as etapas de desenvolvimento. 

Mas, a indústria foi seduzida pelo desejo da previsibilidade gerencial e adotou apenas o diagrama inicial do artigo de Royce — a visão simplificada, linear e palatável para contratos corporativos. Foram ignoradas suas advertências sobre a necessidade de iteração. O próprio termo "Cascata" sequer foi cunhado por Royce; a nomenclatura apareceu pela primeira vez em um artigo de 1976 publicado por Bell e Thayer, consolidando o conceito sequencial definitivo na literatura de engenharia de software.

Este modelo oferecia (a ilusão) de controle absoluto: escopo fixo delimitado em contratos, cronogramas detalhados de longo prazo e orçamentos teóricos precisos. O problema ocorria no momento em que essa rigidez colidia com a realidade mutável do software. 

Ao exigir que todos os requisitos fossem definidos antes de qualquer código ser escrito, o processo forçava o cliente a tomar todas as decisões críticas no momento de maior ignorância sobre o projeto e o mais distante do uso: o seu início. O cliente só via o produto funcionando de fato pela primeira vez no final do ciclo, meses ou anos depois do acordo das especificações. As chances do mercado ter mudado ou do cliente querer algo diferente ao interagir com o software eram altíssimas. Refazer a arquitetura ou alterar as fundações lógicas após a entrega do código se tornava um processo exponencialmente caro, resultando em projetos frequentemente cancelados, estourados em orçamento e/ou entregues com funcionalidades já obsoletas.

> Uma direção apenas — sem previsão sistêmica de retorno a uma etapa anterior.

---

*Parte 1 de [Gestão Moderna de Engenharia de Software](../tech-teams-management/). Próximo: [A Resposta Ágil](../the-agile-response/).*
