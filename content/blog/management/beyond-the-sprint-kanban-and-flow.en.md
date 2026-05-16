---
date: '2026-04-11T20:35:36-03:00'
draft: false
title: 'Beyond the Sprint: Kanban, Flow, and the Small-Batch Principle'
summary: 'Closed iterations don''t fit support, infrastructure, or operations. How Kanban brought the Toyota Production System''s pull-flow into software — and why the small-batch principle underpins both Scrum and Kanban.'
categories:
- Software Development
- Management
- Technology
---

*Third in the series. So far: [why software is hard to manage](../why-managing-software-is-different/), and [how Agile, Scrum, XP, and the Manifesto](../the-agile-response/) answered it with short iterations. But closed iterations don't fit every team.*

## Optimizing continuous flow: The integration of Kanban (2004 onward)

After the Manifesto, Scrum consolidated itself as the hegemonic framework for managing projects and product development. However, throughout the 2000s, technology organizations began to realize that closed iterations (Sprints) didn't perfectly suit all ecosystems.

Level 3 support teams, infrastructure maintenance, operations, and later DevOps practices faced characteristically unpredictable demands. Pausing work to conduct a two-week closed-cycle planning session was dysfunctional when incidents and emergency requests arrived intermittently.
It was in this vacuum that methodological evolution looked, ironically, back toward industrial manufacturing — but not toward rigid control, rather toward the philosophy of organic optimization from the Toyota Production System (TPS).

### From the factory floor to knowledge work

Between the late 1940s and the 1970s, engineer Taiichi Ohno conceived the Toyota Production System in Japan. To eliminate the waste of overproduction, Ohno used concepts from supermarket shelf replenishment to institute Just-in-Time.

The operational mechanism controlling this was Kanban (a Japanese term meaning "visual board" or "signal card"). On the factory floor, one assembly stage would only start producing parts when it received a visual card from the subsequent stage indicating that there was capacity or need. Born there was the concept of the "pull system," where work is not pushed down onto workers, but rather pulled as productive capacity is freed up, avoiding bottlenecks and excessive intermediate inventory.

In 2003, Lean thinking was decisively translated into the software sphere through the academic and practical work of Mary and Tom Poppendieck in the book *Lean Software Development*. Shortly after, engineer and manager David J. Anderson became the pioneer in the methodical crystallization of Kanban for software engineering.

In 2004, Anderson published his studies on agile management applying the Theory of Constraints and systems flows. In 2005, while managing the sustained technical engineering team at Microsoft, he designed a pull-flow system focused on alleviating quality testing bottlenecks. But the definitive turning point occurred between 2006 and 2007, when Anderson implemented a mature system to manage the flow of change requests at Corbis. Unlike previous methodologies, the Corbis team abandoned the time-boxed iterations (Sprints) used in Scrum, balancing demand strictly against real-time productive capacity.

Formalized in the book *Kanban: Successful Evolutionary Change for Your Technology Business* (2010), Anderson's method does not require the organization to change its hierarchical roles or abruptly restructure its processes overnight. Instead, Kanban encourages evolutionary, gradual changes from what the company already does, grounded in rigorous principles:

| Essential Kanban Method Practices<br><br><br><br><br><br>                                                                  | Theory and Practical Application in Development<br><br><br><br>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|-------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Visualize the Workflow<br><br>                                                                                        | Externalize the invisible work on a board (To Do / In Progress / Done). Team and stakeholders see the state of the system at a glance, and bottlenecks surface on their own.<br><br><br><br>                                                       |
| Limit Work in Progress (WIP)<br><br><br><br> | Backbone of Kanban. Each column has a hard cap; once full, no new items enter. The team must finish active work to unblock the line. Attacks the paradox that starting many things in parallel delays all of them. Focus shifts from starting to finishing.<br><br><br><br> |
| Active Management of Continuous Flow<br><br><br><br>                                                                         | No fixed cycles. Demand enters as WIP frees up; results are measured by Lead Time — order to delivery — not by Sprint velocity.<br><br><br><br>                                              |

## Sprints, Continuous Flow, and the Small Batches principle

Today, the best management understands that Scrum and Kanban are not mutually exclusive (and often coexist in the hybrid known as Scrumban), but serve distinct operational profiles.

Sprints (fixed-cadence cycles) work extraordinarily well for innovation and new product development fronts — scenarios where two weeks of protected focus and shared rhythm create stability against market churn. The commitment established by the development team in a Sprint Planning serves to protect engineering from untimely commercial whims, generating predictability across time blocks.

Kanban, operating with an uninterrupted throughput flow system, shines where demand is stochastic and uncontrollable. It is widely recommended and adopted by infrastructure support and continuous operations teams, where problems arise unpredictably and capping WIP is the primary lever against burnout and system paralysis.

The success of both, however, inevitably anchors itself in the imperative of slicing large deliverables, reflecting the DevOps cultural principle of small batches and Lean manufacturing flow integration. Queue theory and complex systems demonstrate that the smaller the atomic unit of work, the faster code moves through the flow, minimizing friction. A massive, poorly scoped task consuming 3 full weeks of development delays the entire process, retains invested capital, and delivers value and quality validation only at the end of its cycle.

In contrast, slicing that monolith into three smaller, independent tasks ensures that value is delivered progressively. More importantly, small batches reveal structural deficiencies, design deviations, or test automation failures dramatically sooner, allowing the course correction imposed by human imperfection — theorized since Royce in 1970 — to happen within hours, containing the compounding risk the classical methods carried.

The true evolution of technology management is not the replacement of one closed methodology by another, but the progressive understanding that empirical tools — like Sprints for creative momentum and Kanban for bottleneck clearance — create a framework for dealing with the essential complexity of software.

---

*Part 3 of [Modern Software Engineering Management](../tech-teams-management/). Previous: [The Agile response](../the-agile-response/). Next: [Running modern sprints](../running-modern-sprints/).*
