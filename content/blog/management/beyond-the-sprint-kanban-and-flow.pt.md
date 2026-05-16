---
date: '2026-04-11T20:35:36-03:00'
draft: false
title: 'Além da Sprint: Kanban, Fluxo e o Princípio dos Pequenos Lotes'
summary: 'Iterações fechadas não servem para suporte, infraestrutura ou operações. Como o Kanban trouxe o fluxo puxado do Sistema Toyota de Produção para o software — e por que o princípio dos lotes pequenos sustenta tanto Scrum quanto Kanban.'
categories:
- Desenvolvimento de Software
- Gestão
- Tecnologia
---

*Terceiro da série. Até aqui: [por que software é difícil de gerir](../why-managing-software-is-different/) e [como o Ágil, o Scrum, o XP e o Manifesto](../the-agile-response/) responderam com iterações curtas. Mas iterações fechadas não servem para todo time.*

## A otimização do fluxo contínuo: A integração do Kanban (2004 em diante)

Após o Manifesto, o Scrum consolidou-se como o framework hegemônico para gerenciar projetos e desenvolvimento de produtos. Entretanto, ao longo da década de 2000, organizações de tecnologia começaram a perceber que as iterações fechadas (as Sprints) não se adequavam perfeitamente a todos os ecossistemas.

Equipes de suporte nível 3, sustentação de infraestrutura, operações e, mais tarde, práticas DevOps, enfrentavam demandas caracteristicamente imprevisíveis. Interromper o trabalho para realizar um planejamento de ciclo fechado quinzenal era disfuncional quando incidentes e chamados emergenciais chegavam de forma intermitente.
Foi nesse vácuo que a evolução metodológica olhou, ironicamente, de volta para a manufatura industrial — mas não para o controle engessado, e sim para a filosofia de otimização orgânica do Sistema Toyota de Produção (TPS).

### Do chão de fábrica para o trabalho de conhecimento

Entre o final da década de 1940 e os anos 1970, o engenheiro Taiichi Ohno concebeu o Sistema Toyota de Produção no Japão. Para eliminar o desperdício de superprodução, Ohno utilizou conceitos de reposição de gôndolas de supermercados para instituir o Just-in-Time. 

A mecânica operacional que controlava isso era o Kanban (termo japonês que significa "placa visual" ou "cartão de sinalização"). Na fábrica, uma etapa da montagem só começava a produzir peças quando recebia um cartão visual da etapa subsequente indicando que havia capacidade ou necessidade. Nascia ali o conceito de "sistema puxado" (pull system), onde o trabalho não é empurrado goela abaixo para os operários, mas sim puxado conforme a liberação de capacidade produtiva, evitando gargalos e estoques intermediários excessivos.

Em 2003, o pensamento Lean foi traduzido decisivamente para a esfera do software através do trabalho acadêmico e prático de Mary e Tom Poppendieck no livro Lean Software Development. Logo na sequência, o engenheiro e gestor David J. Anderson tornou-se o pioneiro na cristalização metódica do Kanban para a engenharia de software.

Em 2004, Anderson publicou seus estudos sobre o gerenciamento ágil aplicando a Teoria das Restrições e fluxos de sistemas. Em 2005, enquanto geria a equipe técnica de engenharia sustentada na Microsoft, ele desenhou um sistema de fluxo puxado focando no alívio de gargalos de teste de qualidade. Mas o divisor de águas definitivo ocorreu entre 2006 e 2007, quando Anderson implementou um sistema maduro para gerenciar o fluxo de requisições de mudança na empresa Corbis. Diferente das metodologias anteriores, a equipe da Corbis abandonou as iterações limitadas pelo tempo (Sprints) utilizadas no Scrum, equilibrando a demanda estritamente contra a capacidade produtiva em tempo real.

Formalizado no livro Kanban: Successful Evolutionary Change for Your Technology Business (2010), o método de Anderson não exige que a organização mude seus papéis hierárquicos ou reestruture seus processos abruptamente da noite para o dia. Ao invés disso, o Kanban estimula mudanças evolutivas e graduais a partir do que a empresa já faz, fundamentando-se em princípios rigorosos:

| Práticas Essenciais do Método Kanban<br><br><br><br><br><br>                                                                  | Teoria e Aplicação Prática no Desenvolvimento<br><br><br><br>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|-------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Visualizar o Fluxo de Trabalho<br><br>                                                                                        | Externalize o trabalho invisível em um quadro (A Fazer / Em Andamento / Concluído). Equipe e stakeholders veem o estado do sistema de relance, e os gargalos aparecem sozinhos.<br><br><br><br>                                                       |
| Limitar o Trabalho em Andamento (WIP)<br><br><br><br> | Espinha dorsal do Kanban. Cada coluna tem limite rígido; uma vez cheia, nada entra. O time precisa terminar o que está ativo para destravar a linha. Ataca o paradoxo de que começar muita coisa em paralelo atrasa tudo. Foco sai de começar e vai para terminar.<br><br><br><br> |
| Gerenciamento Ativo de Fluxo Contínuo<br><br><br><br>                                                                         | Sem ciclos fixos. Demanda entra quando o WIP libera; resultados são medidos pelo Lead Time — pedido até entrega — não pela velocidade da Sprint.<br><br><br><br>                                              |

## Sprints, Fluxo Contínuo e o princípio dos Lotes Pequenos

Atualmente, a melhor gestão entende que Scrum e Kanban não são excludentes (e muitas vezes coexistem no hibridismo conhecido como Scrumban) , mas servem a perfis operacionais distintos.

As Sprints (ciclos de cadência fixa) funcionam extraordinariamente bem para frentes de inovação e desenvolvimento de produtos novos, cenários onde duas semanas de foco protegido, planejamento estratégico e ritmo coletivo criam estabilidade sobre o caos do mercado. O compromisso estabelecido pela equipe de desenvolvimento em uma Sprint Planning serve para proteger a engenharia de devaneios comerciais intempestivos, gerando previsibilidade ao longo de blocos de tempo.

O Kanban, operando com um sistema de fluxo de passagem ininterrupta, brilha onde a demanda é estocástica e incontrolável. Ele é largamente indicado e adotado por times de suporte de infraestrutura e operações contínuas, onde problemas surgem imprevisivelmente e limitar o WIP é a principal alavanca contra o esgotamento humano e a paralisia do sistema.

O sucesso de ambos, no entanto, ancora-se inevitavelmente no imperativo de fatiar grandes entregas, refletindo o princípio cultural do DevOps de lotes pequenos (*small batches*) e integração de fluxos da manufatura Lean. A teoria de filas e sistemas complexos demonstra que quanto menor for a unidade atômica de trabalho, mais rápido o código transita pelo fluxo, minimizando atritos. Uma tarefa maciça e mal dimensionada que consome 3 semanas inteiras de desenvolvimento para ser elaborada atrasa todo o processo, retém capital investido e entrega valor e validação de qualidade somente ao final do seu ciclo.

Em contrapartida, fatiar esse monolito em três tarefas menores e independentes garante que o valor seja entregue progressivamente. Mais importante ainda, lotes diminutos revelam deficiências estruturais, desvios de design ou falhas de automação de testes incrivelmente mais cedo, permitindo que a correção de curso imposta pela imperfeição humana — teorizada desde Royce em 1970 — aconteça em questão de horas, mitigando permanentemente o risco exponencial dos métodos clássicos.

A verdadeira evolução da gestão de tecnologia não é a substituição de uma metodologia fechada por outra, mas o progressivo entendimento de que ferramentas empíricas, como Sprints para impulso criativo e Kanban para destravar gargalos, criam um framework para lidar com a complexidade essencial do software.

---

*Parte 3 de [Gestão Moderna de Engenharia de Software](../tech-teams-management/). Anterior: [A resposta Ágil](../the-agile-response/). Próximo: [Conduzindo sprints modernas](../running-modern-sprints/).*
