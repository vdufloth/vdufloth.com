---
date: '2026-05-02T20:35:36-03:00'
draft: false
title: 'The Individual Metric Trap: How to Actually Evaluate a Tech Team'
summary: 'Measuring a developer by individual Story Points is a conceptual mistake. How to actually evaluate a tech team: who to promote, who to let go, and the competency matrix that keeps career decisions honest.'
categories:
- Software Development
- Management
- Technology
---

*Sixth in the series. With the process in place — [history](../the-agile-response/), [flow](../beyond-the-sprint-kanban-and-flow/), [rituals](../running-modern-sprints/), and [handling the unplanned](../managing-the-unplanned/) — one hard question remains: how do you evaluate the people?*

## The individual metric trap and true performance management

There is a natural temptation among managers to track performance by measuring the number of *Story Points* each developer delivers individually over time, in search of the "most productive."

**This practice is a profound conceptual mistake.** *Story Points* are an abstract unit of measurement created to gauge effort, risk, and relative complexity for the *team*, not to time individual hours. Turning them into a personal evaluation metric (KPI) invariably causes estimate inflation (developers start overestimating tasks to hit targets) and corrodes the collaboration culture, discouraging mutual assistance and pair programming.

High performance in software engineering is measured by the collective predictability of delivery (the team's stabilized average velocity), by the reduction of *Lead Time* (time from conception to production), and by the empirical consistency in achieving the proposed *Sprint Goal*.

If success is measured by collective delivery, how does leadership operate meritocracy, salary increases, and individual dismissals? Evaluating an engineer by delivery volume is like evaluating a surgeon by the number of scalpels used. Mature management, especially in enterprise contexts, replaces volume metrics (*output*) with metrics of **impact, behavior, and quality** that can be obtained through feedback from the team itself.

### Identifying High Performance: Who to Promote

Promotion in technology should rarely be a prize for "writing a lot of code fast," but rather for increasing the technical and commercial maturity of the product. The real indicators of who should move up are:

* **The Multiplier Effect:** A high-performance developer doesn't just deliver their own work; they elevate the entire team's technical level. This is visible in who does the best code reviews (*Pull Requests*), who unblocks colleagues stuck on logical problems, and who documents obscure processes. The true senior makes the entire team go faster.
* **Business Vision over Code:** The professional ready for the next level understands the *why* behind the software. They don't just ask "how do I integrate this API?", but question the business impact: "If the client's flow is X, does this feature actually solve their pain point or just add complexity?" They protect return on investment (ROI).
* **Resolving Complexity and Reducing Technical Debt:** Weaker engineers ship features by adding accidental complexity. Stronger ones solve the same problem by removing code, simplifying the architecture, and avoiding incidents the following month.
* **Autonomy and Reliability:** You hand them an ambiguous problem and know it will come back resolved — or with clear, risk-grounded decision options.

### Identifying Friction: Who to Let Go

Firing in an agile context requires identifying who is slowing the system down or corroding the operational culture, often silently:

* **The "Net Negative" (Rework Generator):** This is the developer who does deliver their Sprint tasks, but the code is so fragile and poorly tested that it generates dozens of extra hours of work for infrastructure or QA teams the following week. The cost of maintaining their code exceeds the value they produce.
* **The Toxic Knowledge Silo (The "Lone Genius"):** May be the most technically capable professional, but refuses to adopt standards, doesn't document their work, is hostile in *Code Reviews*, and centralizes critical tasks. They destroy the productivity and morale of others.
* **Low Adaptability and Chronic Resistance:** Development changes rapidly. The professional who systematically refuses to learn a new architectural tool, or who constantly fights against the operational flow, stalls the gears.
* **Post-Feedback Stagnation:** Every professional fails. The dismissal criterion solidifies when, after clear feedback in *One-on-One* sessions, the pattern of technical or behavioral failures repeats cycle after cycle with no signs of evolution.

### The Competency Matrix (*Career Ladder*)

To ensure that career decisions are objective and disconnected from managerial favoritism or the fallacy of hour-based estimates, the **Competency Matrix** is adopted.

This is a transparent framework that maps expectations for each level (Junior, Mid-level, Senior, Staff, Tech Lead) structured around major axes:
1.  **Technical Skill:** Proficiency in architecture, testing, and code best practices.
2.  **Impact and Delivery:** Quality of complex resolutions and structural autonomy.
3.  **Communication and Leadership:** Peer mentoring and ability to guide technical decisions.
4.  **Culture and Business:** Strategic understanding of the product and corporate proactivity.

The manager and technical leadership cross the developer's behaviors over months against this documented matrix, transforming *feedback* into a process grounded in concrete evidence of professional maturity.

---

*Part 6 of [Modern Software Engineering Management](../tech-teams-management/). Previous: [Managing the unplanned](../managing-the-unplanned/). Next: [No silver bullet, and AI](../no-silver-bullet-and-ai/).*
