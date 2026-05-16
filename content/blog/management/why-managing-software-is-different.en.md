---
date: '2026-03-28T20:35:36-03:00'
draft: false
title: 'Why Managing Software Is Different — and Why Waterfall Wasn''t Enough'
summary: 'Software has no laws of physics, no scarce materials, and no visible shape — so the management methods that work for bridges fail for systems. Why software is different, and why the waterfall model collapsed against the mutable reality of code.'
categories:
- Software Development
- Management
- Technology
---

*This is the first article in a series on how software engineering management evolved — and how to run a modern team. We start at the root: why managing software resists the methods that work everywhere else, and why the industry's first attempt at a process didn't hold.*

## Why software management is different

Software project management is unlike anything else. Unlike other engineering disciplines, software has no physical constraints. There are no laws of gravity limiting what can be built, no scarce materials, no natural forces resisting progress. Equally, software is intangible — it's impossible to have a clear visual sense of its size or complexity, especially for non-technical people.

Building a bridge is a fundamentally predictable endeavor. Civil engineering deals with constant laws of physics, materials with unchanging properties, and terrain that, once mapped and prepared, rarely undergoes drastic changes during project execution. The final result is known in advance, and structural engineering requirements don't shift from one month to the next.

It was natural that, when they started, large software projects were managed in the same way as engineering projects. But with frequent deadline and cost failures, it soon became clear that software cannot be treated the same way. The client changes their mind. The market changes. Technology changes. What was urgent in January may be irrelevant by March.

Users see the interface, but all of the infrastructure, automations, and workflows beneath it aren't explicitly visible. These characteristics make the work inherently optimistic and simultaneously difficult to estimate, which in turn makes its management complex. On top of that, it's always hard to argue with finance for the time needed for documentation, automated testing, and refactoring — precisely because they're invisible and their ROI (Return on Investment) is often hard to quantify.

This has been understood since at least 1975. In *The Mythical Man-Month*, Fred Brooks calculated that only 1/6 of his team's time was spent on pure programming. The rest was consumed by testing, bug fixing, unplanned work, and the inevitable idle time inherent to any human activity. Decades later, some teams and managers still plan as if those 5/6 don't exist.

Brooks also precisely identified unique difficulties in software projects, which he called *essential difficulties*:

- **Complexity**: Systems grow nonlinearly as features are added, resulting in escalating communication difficulties, failures, and delays;
- **Conformity**: A system is also built around requirements outside the team's control, such as business rules, laws, and external systems, making an 'ideal' project impossible;
- **Changeability**: While physical products are replaced by new models, software is modified in the product already in use, adding the additional complexity of maintaining functionality compatibility with existing data and flows;
- **Invisibility**: Software is abstract — with no natural physical or geometric representation. Diagrams, documentation, and analogies can approximate its understanding, but the pure representation of software is only the code itself and the imagination of it running in the developer's mind.

The conclusion, known as *No Silver Bullet*, was: there is no solution that will yield order-of-magnitude improvements in productivity or reliability in software development. Better tools, more expressive languages, and practices like DevOps can reduce *accidental difficulties* — the friction created by the development process itself — but the essential difficulties will remain.

The journey of software engineering management since then has been a transition from attempting rigid control to accepting and managing unpredictability. Across this series, we'll briefly trace that history and, at the end, present a practical guide to management that delivers solid results for most modern teams. We'll also close with an analysis of whether advances in artificial intelligence may change any of this.

## The waterfall model

In the early days of software engineering, during the 1960s and 1970s, the development of information systems began to demand a more formal methodology. As projects grew in size and complexity (driven primarily by government and aerospace contracts), the need for a structured process became apparent. The industry's initial response was to import and adapt management models from civil engineering and hardware manufacturing.

The waterfall model was the first software development lifecycle paradigm to emerge and consolidate, treating the construction of systems exactly like construction work. The basic premise was sequencing: gather all requirements, design the architecture, develop (program), test, and finally, deliver and maintain. Work flowed in only one direction, from one stage to the next — hence the name "waterfall." There was also no systemic provision for returning to a previous stage.

The first formal description of these sequential phases is widely attributed to a 1970 paper by Dr. Winston W. Royce, titled *Managing the Development of Large Software Systems*. Drawing on his extensive experience with aerospace mission planning systems, Royce drew the sequential flow that would dominate the industry. However, in the opening pages of his paper, Royce explicitly warned that the strict implementation of that purely linear model was fundamentally flawed, stating that the approach was "risky and invited failure."

Royce intimately understood the essential complexity that Brooks would describe a decade later. He knew that the testing phase would inevitably reveal serious conceptual flaws in the original design, and that constant iterations and returns to previous stages would be necessary. To mitigate this risk of massive rework, Royce proposed the prior creation of throwaway prototypes and the mandatory inclusion of feedback cycles between development stages.

But the industry was seduced by the desire for managerial predictability and adopted only the initial diagram from Royce's paper — the simplified, linear, corporate-contract-friendly view. His warnings about the need for iteration were ignored. The very term "Waterfall" wasn't even coined by Royce; the name first appeared in a 1976 paper by Bell and Thayer, cementing the sequential concept definitively in software engineering literature.

This model offered (the illusion of) absolute control: fixed scope delimited in contracts, detailed long-term schedules, and precise theoretical budgets. The problem occurred when that rigidity collided with the mutable reality of software.

By requiring that all requirements be defined before any code was written, the process forced clients to make all critical decisions at the moment of greatest ignorance about the project and furthest from actual use: the very beginning. The client only saw the product working for the first time at the end of the cycle, months or years after the specifications were agreed upon. The odds that the market had changed or that the client wanted something different when they actually interacted with the software were extremely high. Rearchitecting or altering logical foundations after code delivery became an exponentially expensive process, resulting in projects frequently canceled, blown over budget, and/or delivered with already-obsolete features.

> One direction only — no systemic provision for returning to a previous stage.

---

*Part 1 of [Modern Software Engineering Management](../tech-teams-management/). Next: [The Agile Response](../the-agile-response/).*
