---
date: '2026-04-04T20:35:36-03:00'
draft: false
title: 'The Agile Response: Scrum, Extreme Programming, and the Manifesto'
summary: 'How the 1990s answered the failure of plan-driven projects: the rise of Agile, the structured experience of Scrum, the technical discipline of Extreme Programming, the origin of Story Points, and the Manifesto that tied it together.'
categories:
- Software Development
- Management
- Technology
---

*Second in the series. The [first article](../why-managing-software-is-different/) traced why software resists rigid planning and how the waterfall model collapsed under that reality. The 1990s answered with something fundamentally different.*

## Managing uncertainty: The rise of Agile

Faced with the constant collapse of plan-driven projects, the 1990s catalyzed a methodological revolution in software engineering. The Agile paradigm abandoned the futile attempt to eliminate uncertainty through exhaustive upfront planning.

Instead of planning everything at the start and delivering only at the end, the approach adopted short, iterative cycles: plan a little, build, show the increment, collect real feedback, adjust the course, and repeat.

Uncertainty is not eliminated in this model; it is managed in much smaller doses. This change in cadence transforms every rework — which inherently exists in development — into something far less costly and traumatic. Two main currents led this revolution: Scrum, focused on management structure and process control, and Extreme Programming (XP), focused more on software engineering practices.

### The structured practical experience of Scrum (1993–1995)

The seeds of Scrum were planted long before the formal agility manifesto, originating from an article published in the Harvard Business Review in 1986, written by Hirotaka Takeuchi and Ikujiro Nonaka, titled "The New New Product Development Game."

Analyzing highly innovative Japanese and American companies in physical product development, the authors noticed that exceptionally fast teams didn't work sequentially, like a relay race. Instead, they acted cohesively, adaptively, and overlappingly, advancing together as a unit on a playing field — a direct analogy to the rugby scrum formation.

Inspired by this self-managing, multidisciplinary team dynamic, Jeff Sutherland adapted the concept for software development in 1993 during his work at Easel Corporation. Sutherland understood that classic predictive charts rarely reflected the real state of a complex system under construction. Working together with Ken Schwaber, Sutherland formalized the Scrum framework, presenting it publicly to the academic and professional community in 1995 at the OOPSLA conference (Object-Oriented Programming, Systems, Languages & Applications).

The theory behind Scrum is based on Empirical Process Control, which states that knowledge comes from experience and decisions should be based on what is factually observed, rather than theoretical plans. To achieve predictability in an unstable environment, agile day-to-day work in Scrum is organized through fixed, protected cycles called Sprints.

| Sprint Characteristics in Scrum<br><br> | Implications for Product Development<br><br>                                                                                                                                               |
|---------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Fixed Time Cycles (Timeboxes)<br><br>    | One to four weeks. Cap on how much can fail in one cycle.<br><br>        |
| Predictability and Rhythm<br><br>             | Team commits to a specific delivery; cadence is stable for stakeholders.<br><br>          |
| Iterative Scope Protection<br><br>        | Scope frozen mid-Sprint. External changes wait for the next planning.<br><br> |

Sprints work exceptionally well for innovative product development, where establishing rhythm and short-term predictability matter. The team inspects what was done at the end of each iteration, adjusting not just the product but also their own way of working.

## Technical excellence and Extreme Programming (1996–1999)

While Scrum was establishing the management and governance framework, Kent Beck was formalizing, at the same time, Extreme Programming (XP). XP emerged directly from the trenches of software development in 1996, during the troubled Chrysler Comprehensive Compensation System (C3) project. The project was stalled, and Beck, brought in to rescue it, decided to push software engineering disciplines to the extreme, formalizing the methodology in his 1999 book, *Extreme Programming Explained: Embrace Change*.

XP's philosophy starts from the premise that if a technical practice is beneficial, it should be executed continuously. If code reviews prevent bugs, the code should be reviewed in real time by two developers on the same machine (Pair Programming). If testing ensures stability, tests should be written before the feature code itself (Test-Driven Development — TDD).

XP established revolutionary practices such as very short development cycles, continuous code integration multiple times per day, and, crucially, the direct physical involvement of the client sitting alongside the development team to guide the business.
Many of these practices and philosophies were later absorbed into the general culture of the Agile Manifesto and reappear in varied forms in modern Scrum, especially the emphasis on frequent delivery rhythm and constant, unobstructed feedback from end users.

## The emergence of Story Points as a unit of complexity

One of the most ubiquitous artifacts in modern agile management is the Story Point-based estimate. Interestingly, while it is considered the standard in current Scrum planning, this metric is not an official Scrum Guide prescription, but rather a direct inheritance from the early iterations of Extreme Programming.

Ron Jeffries, one of XP's creators who worked alongside Beck on the Chrysler project, was instrumental in this evolution. In the early days of the methodology, the team estimated User Stories (requirements described from the client's perspective) based on actual execution time. The original metric was called *Ideal Days*, conceptualized as the time it would take a pair of programmers to finish the task assuming absolutely no interruptions, meetings, or bureaucracy. To translate that concept into real calendar dates, the team multiplied the ideal days by a "load factor," which statistically hovered around three. That is, it took three literal corporate working days to complete the effort of one ideal day.

The terminology, however, generated deep social and psychological friction with stakeholders. Senior management aggressively questioned why a developer needed three weeks to deliver "five days" of work, interpreting the estimate as inefficiency. To neutralize the political clash and semantic confusion, Jeffries suggested abstracting the time unit, renaming "ideal days" simply to "points." By removing the chronological connotation, the team focused exclusively on task complexity. A story estimated at 3 points indirectly meant about nine real days, and the abstract term eliminated executive pressure for unrealistic schedules. Around the same time, other abstract and playful units, such as "Gummi Bears" and NUTs (Nebulous Units of Time), were tested by the community to underscore the detachment from exact time.

Today, Story Points are defined as the unit of measure for complexity and relative effort in the agile environment. They don't represent hours, but rather the risk, uncertainty, and volume of work inherent to a backlog item. An 8-point task doesn't necessarily consume exactly twice the clock time of a 4-point task, but it's recognized by the team as significantly more complex and risky. This abstraction eliminates the dangerous managerial illusion that hour-based estimates for creative knowledge work are precise.

Different teams have different levels of technical maturity and intrinsic velocities, making it impossible to compare "point velocity" between distinct teams. However, point comparisons within the same team over time remain statistically consistent, allowing for realistic capacity calculations for future iterations.

## The Agile Manifesto (2001)

The transition from the 1990s into the 2000s was dominated by the fragmentation of "lightweight methodologies." Scrum, Extreme Programming (XP), Dynamic Systems Development Method (DSDM), Feature-Driven Development (FDD), Crystal, and Adaptive Software Development competed conceptually, but their creators recognized that they shared certain ethical and operational values.

There was widespread consensus around repulsion toward strict command-and-control governance, documentation as an end in itself, and micromanagement dictated by frozen-scope contracts.

This ideological convergence culminated in one of the most important events in modern technology history. Between February 11 and 13, 2001, at the invitation of engineer Robert C. Martin ("Uncle Bob"), seventeen highly influential professionals gathered at The Lodge at Snowbird ski resort in the mountains of Utah, United States. Among those present were Kent Beck and Ron Jeffries (for XP), Jeff Sutherland and Ken Schwaber (for Scrum), along with other prominent figures such as Martin Fowler, Alistair Cockburn, and Jim Highsmith.

Expectations of consensus were extremely low; Cockburn himself described the group as an assembly of independent "organizational anarchists." Yet the synergy was nearly instantaneous. Frustrated with corporate bureaucratic processes that systematically hindered rather than helped the delivery of quality software, they drafted and signed the Manifesto for Agile Software Development (the term "agile" was chosen after debate, winning over options like "lightweight").
The Manifesto imposed no new technical framework, nor did it dictate programming practices; it wrote the cultural constitution for a new way of cognitive work. The document was built on 4 core pillars, which formally outlined the evolution of technology project management:

| The 4 Pillars of the Agile Manifesto<br><br><br><br>                                  | Interpretation and Application in Software Management<br><br><br><br>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|---------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1. Individuals and interactions over processes and tools<br><br><br><br> | Two developers solving a problem in 5 minutes of conversation beats a ticket, triage, email, and meeting every time. Processes scale the org and record history — they don't replace live communication. Any process that blocks the people closest to the problem is the process to question.<br><br><br><br>                                                                                                                                                                                                                                              |
| 2. Working software over comprehensive documentation<br><br><br><br>        | Waterfall celebrated hundreds of pages of specs as progress, with no working code. The Manifesto inverts this: document only what's needed for the work to be understood and maintained. Not "don't document" — prioritize real, testable value over paperwork.<br><br><br><br>                                                                                                                                                                                                                                           |
| 3. Customer collaboration over contract negotiation<br><br>           | Traditional: client signs specs, transfers risk, waits for final delivery. Agile: client is a daily partner (echoing XP's on-site customer). Sprint Reviews exist to demo, gather feedback, and correct course before the next cycle. Continuous co-creation replaces the surprise delivery.<br><br>                                                                                                                                          |
| 4. Responding to change over following a plan<br><br>                        | Plans are hypotheses to test against reality, not contracts. The unexpected is the norm — competitor launches, client pivots, critical bugs. The original plan is a reference, not a punishment. Adapting in real time is worth more than obedience to a stale roadmap.<br><br> |

Jim Highsmith, one of the signatories, noted that the explosive adoption of agile methodologies that followed the Manifesto occurred not because of pair programming mechanics or visual boards, but because the values allowed organizational environments based on trust, collaboration, and respect for the human intelligence of developers, freeing them from the micromanagement culture that penalized dynamic adaptation.

---

*Part 2 of [Modern Software Engineering Management](../tech-teams-management/). Previous: [Why software management is different](../why-managing-software-is-different/). Next: [Beyond the Sprint](../beyond-the-sprint-kanban-and-flow/).*
