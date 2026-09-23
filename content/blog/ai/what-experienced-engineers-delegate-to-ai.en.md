---
date: '2026-09-23T10:00:00-03:00'
title: 'How experienced programmers, tech thinkers and authors are using AI?'
summary: 'How fifteen respected engineers use coding agents, what they still keep under human control, and where their practices genuinely disagree.'
categories:
- Technology
- Software Development
tags:
- ai
---

## Introduction

Artificial Intelligence-assisted development is changing quickly enough that practices which looked extreme a year ago are becoming ordinary. I wanted to see whether some form of “common sense” was emerging among several engineers whose judgment I respect. In the end, I will draw my own conclusions and compare them with my own experience.

The interesting question is no longer whether they use AI. Everyone here does. The question is:

> **What are they delegating to AI, and what do they still feel they must review closely or do manually?**

I looked primarily at first-party material published between 2025 and September 2026: their writing, talks, interviews, repositories, and project instructions. The dates matter. Several of these engineers changed their workflows substantially within months.

> **TL;DR of my takeaway:** AI can take over most implementation, and sometimes even source review, but serious systems still need an accountable human who understands the system, controls its intent and architecture, defines the evidence required to trust it, and makes the final decisions. My workflow keeps those responsibilities human, encodes them in plans, project instructions, and automated checks, then lets agents implement and review while I plan the next change. [The appendix summarizes what each engineer delegates and retains.](#appendix-engineer-by-engineer-takeaways)

## David Heinemeier Hansson - DHH

David Heinemeier Hansson created Ruby on Rails and is the technical co-owner of 37signals, which builds Basecamp and HEY. More recently he created Omarchy, a Linux distribution whose development has become closely intertwined with AI agents—and which I am using right now. His opinion carries weight because he is responsible both for influential developer infrastructure and for long-lived production applications.

At the beginning of 2026, DHH wrote that coding agents had finally crossed his threshold for serious production work. He had rejected autocomplete-style assistance, but was now giving OpenCode agents real tasks, letting them work autonomously, and reviewing the result. He was still emphatic that this was supervised engineering, not a 90% replacement for experienced developers if quality and cohesion mattered ([“Promoting AI agents”](https://world.hey.com/dhh/promoting-ai-agents-3ee04945)).

By mid-2026, his practice had moved further. In a long interview he said the new Omarchy Quattro codebase was entirely agent-written. He reviewed its overall shape and inspected critical model-layer code, but did not spend time reading much of the UI and auxiliary implementation. That acceptance of an implementation black box was conditional. On Basecamp and HEY, a batch of individually plausible AI-generated changes had collectively damaged the architecture and required manual cleanup. His distinction is therefore not “AI may code, humans architect” in the strict sense—agents can choose local designs too—but the experienced engineer must still preserve the system's conceptual integrity and know where close inspection is warranted ([Lex Fridman interview transcript](https://lexfridman.com/?p=6512)).

## Robert C. Martin

Robert C. Martin co-authored the Agile Manifesto, popularized the SOLID principles, and wrote *Clean Code* and *Clean Architecture*. Much of his career has concerned the disciplines that keep software changeable even as a project continues to grow and mature.

The strongest current evidence is his public [Empire project](https://github.com/unclebob/empire-2025), alongside a 2026 video series with Justin Martin on applying testing and refactoring discipline with agents ([“Agentic Discipline”](https://cleancoders.com/episode/agentic-discipline-1)). This is partly an observed workflow rather than a sweeping statement about AI: the repository shows agent use inside a deliberately constrained engineering process.

Its [agent instructions](https://github.com/unclebob/empire-2025/blob/master/AGENTS.md) make the boundary concrete. Acceptance scenarios may not be changed without explicit permission. Behavioral changes begin with failing scenarios, continue through unit tests and implementation, and finish with the complete test pipeline. Architectural rules are executable: AI decision code, for example, may read the computer's map but not the game's hidden map. The agent is allowed to implement and refactor aggressively; it is not allowed to redefine accepted behavior or silently cross architectural boundaries. Here, control is retained less through continuous hand-authoring than through tests, dependency rules, and protected specifications.

## Fábio Akita

Fábio Akita is a Brazilian software engineer and educator best known for his influence on the Ruby on Rails community and for three decades of hands-on development work.

In February 2026 he documented building a four-application production system with Claude Code in eight days: 274 commits, 1,323 tests, deployment infrastructure, security work, and real users. Only 37% of the commits were features. The rest were the less photogenic work of hardening, testing, fixing, deploying, securing, and documenting. He describes the relationship as XP-style pair programming: the agent drives most implementation, while he supplies intent, domain knowledge, prioritization, and braking when the design becomes elaborate ([full project retrospective](https://akitaonrails.com/en/2026/02/20/zero-to-post-production-in-1-week-using-ai-on-real-projects-behind-the-m-akita-chronicles/)).

Akita's account is unusually precise about what remains human. He chose the service boundaries and interfaces, decided what to extract during refactoring, validated the agent's work, and kept every commit green through tests, linting, dependency auditing, and static security analysis. His contrasting [FrankMD project](https://github.com/akitaonrails/FrankMD) accumulated a nearly 5,000-line controller when he relaxed that discipline. His conclusion is not that agents cannot produce architecture, but that they tend to extend the nearest pattern and over-engineer unless an experienced engineer maintains the larger model. He delegates the *how* heavily, but not the *what*, *why*, priority, or quality bar.

## Kent Beck

Kent Beck created Extreme Programming, pioneered test-driven development, and has spent decades refining short feedback loops and incremental design. Few engineers have had more influence on how programmers structure the act of programming.

Beck calls his current practice “augmented coding,” deliberately separating it from vibe coding. While building a B+ tree with an agent, he barely typed code, but he cared about complexity, tests, coverage, and the internal design. He watched for loops, unnecessary features, deleted tests, and deteriorating structure, and intervened when the agent's locally sensible moves led to globally poor code. His system prompt encodes Red/Green/Refactor, minimum code, Tidy First, and small commits ([“Augmented Coding: Beyond the Vibes”](https://newsletter.kentbeck.com/p/augmented-coding-beyond-the-vibes)).

His 2026 experiments also expose the cost of autonomy. In multi-agent “Genie” sessions, he found himself coordinating implementers and verifiers while holding the real state of the work in his own head. The desired outcome is less human coordination, not a theatrical swarm ([“Nobody Wants Agents”](https://newsletter.kentbeck.com/p/genie-lessons-nobody-wants-agents)). He is exploring specifications expressed as contracts—what must be true before and after a change—rather than detailed implementation recipes ([“Lessons from Genie Sessions”](https://newsletter.kentbeck.com/p/genie-lessons-from-genie-sessions)). Implementation is highly delegated; design taste, feedback design, and responsibility for code quality remain central human work.

## Linus Torvalds

Linus Torvalds created Linux and Git and has spent more than three decades maintaining one of the world's most consequential systems codebases. His standards are shaped by software that must remain understandable and maintainable for decades.

His most concrete AI coding experiment is [AudioNoise](https://github.com/torvalds/AudioNoise), a personal Python audio visualizer whose README says it was largely vibe-coded with Google Antigravity. In one [documented change](https://github.com/torvalds/AudioNoise/commit/93a72563cba609a414297b558cb46ddd3ce9d6b5), the agent implemented a custom selection mechanism after Torvalds identified that the library's built-in behavior did not fit. He delegated implementation in a language and UI stack outside his main expertise, while still defining the behavioral problem and judging the result.

He draws a much harder boundary around durable systems software. In his 2026 [Open Source Summit keynote](https://www.youtube.com/watch?v=fi29pfLcW4I&t=1725s), he welcomed AI as a useful tool but rejected claims that generating most of the text is equivalent to doing most of the programming. **For maintained code, somebody must understand the result well enough to take responsibility for it.** His own evidence therefore supports broad delegation for bounded personal software, not treating kernel code or long-term maintainability as a black box.

## Simon Willison

Simon Willison co-created Django and created Datasette and the `llm` command-line ecosystem. He is both a prolific user of coding agents and one of the clearest public chroniclers of their failure modes.

Willison's production workflow is intentionally controlling. He gives agents detailed tasks, signatures, constraints, and examples, then makes them write tests and demonstrate the software running. He has described the agent as a fast, capable intern under an authoritarian manager: useful precisely because the operator is explicit about the desired result. The non-delegable step is testing. If he has not seen the behavior run, he does not consider the work complete ([“Here's how I use LLMs to help me write code”](https://simonwillison.net/2025/Mar/11/using-llms-for-code/), [“Using coding agents”](https://simonwillison.net/2025/Jun/18/coding-agents/)).

His source review is risk-based rather than doctrinal. He may use a low-risk disposable script without reading it, while following a deployment change closely and taking over when the agent misses a subtle constraint. He has shipped production work by prompting without manually editing the code, but that did not mean surrendering control of the files, behavior, or verification ([“Coding without typing the code”](https://simonwillison.net/2025/Oct/16/coding-without-typing-the-code/)). By August 2026 he argued that line-by-line review is only one verification technique; tests, manual exploration, static analysis, execution traces, and agent-produced walkthroughs can sometimes provide stronger evidence ([“More than just code review”](https://simonwillison.net/2026/Aug/22/more-than-just-code-review/)). He accepts an implementation black box in proportion to the consequences of being wrong, but not a behavioral black box.

## Addy Osmani

Addy Osmani spent more than fourteen years engineering Chrome and developer tooling at Google and now works on Claude Code at Anthropic. His writing connects hands-on agent use with the operational practices of larger engineering teams.

At the start of 2026, his default workflow began with a specification covering requirements, architecture, data, and testing. He then gave one supervised agent small chunks, reviewed the diff, ran the tests, and often asked a second model to review it. At that point he still reported reading generated code line by line, particularly because the bottleneck had moved from producing code to evaluating it ([“My AI coding workflow”](https://addyosmani.com/blog/ai-coding-workflow/)).

His later work makes that process executable. [Agent Skills](https://addyosmani.com/blog/agent-skills/) encode a path from specification through planning, implementation, verification, review, and shipping, with evidence-based exit criteria. A passing test suite is not sufficient proof: runtime behavior, visible output, security checks, and the actual diff still matter. This is a shift from personally remembering every discipline to installing those disciplines around the agent. **The human still defines architecture and scope, decides which evidence is adequate, and remains accountable when the harness misses something.**

## Andrej Karpathy

Andrej Karpathy is an AI researcher, educator, founding OpenAI researcher, and former director of AI at Tesla. He approaches coding agents both as a developer and as someone who has built the underlying systems.

Karpathy is among the most aggressive delegators in this group. In a March 2026 [No Priors interview](https://www.youtube.com/watch?v=kwSVtQ7dziU), he described a transition from manually writing code to spending his time expressing intent to agents. That extends the “vibe coding” idea he coined in 2025 far beyond throwaway weekend projects: the primary activity becomes describing the desired change, steering attempts, and evaluating results rather than editing syntax.

His [autoresearch](https://github.com/karpathy/autoresearch) project shows what makes high autonomy workable. The agent may modify one training file, run a fixed five-minute experiment, measure a single validation metric, keep improvements, revert regressions, and repeat overnight. The human edits the research program and controls the immutable preparation and evaluation machinery. This is autonomous implementation inside a tiny, explicit search space—not autonomous ownership of the scientific objective or the evidence. The code can become comparatively opaque because the experimental behavior is unusually measurable.

## Mitchell Hashimoto

Mitchell Hashimoto co-founded HashiCorp and created tools including Vagrant and Terraform; he now develops the Ghostty terminal. His work spans developer tools, systems software, and large open-source communities.

Hashimoto's adoption was gradual and empirical. Chat-based code generation initially disappointed him. Agents became useful when they could inspect the repository, run tools, plan separately from execution, and verify the result. He trained his own judgment by asking an agent to reproduce changes he had already made manually, then comparing the paths. His current practice delegates small, high-confidence tasks, research, issue triage, and end-of-day background work while he concentrates on deeper problems ([“My AI adoption journey”](https://mitchellh.com/writing/my-ai-adoption-journey)).

He deliberately prefers one agent over a swarm. When the agent plans, he writes code; when it implements, he reviews. Every recurring mistake becomes a durable rule or tool in Ghostty's [agent instructions](https://github.com/ghostty-org/ghostty/blob/main/AGENTS.md), and visual changes can be checked through screenshots rather than prose alone. In a 2026 [Pragmatic Engineer interview](https://newsletter.pragmaticengineer.com/p/mitchell-hashimoto), he described aiming to keep an agent productively occupied for part of the day, not handing it the whole project. His boundary is pragmatic: delegate work whose success can be specified and cheaply checked; retain the hard problem, review, and interruption budget.

## Armin Ronacher

Armin Ronacher created Flask and Jinja and has built widely used Python and Rust developer infrastructure. His AI writing is especially valuable because it records a rapid change from cautious assistance to agent-heavy production work without pretending the trade-offs disappeared.

In January 2025, Ronacher treated AI as a capable intern and remained closely in the loop ([“How I AI”](https://lucumr.pocoo.org/2025/1/30/how-i-ai/)). By September, he had shipped a production system whose roughly 40,000 lines of Go, YAML, and Pulumi were more than 90% AI-written. He designed the schema and architecture, worked in reviewable pull-request-sized increments, used one model to review another, and read every line. He also warned that agents lose the whole-system picture: the operator still needed to understand state machines, databases, and runtime behavior ([“90%”](https://lucumr.pocoo.org/2025/9/29/90-percent/)).

He now works almost exclusively through a small terminal agent, [Pi](https://lucumr.pocoo.org/2026/1/31/pi/), but he has not embraced unbounded autonomy. In June 2026 he wrote that autonomous outer loops had not worked for code he deeply cared about because he wanted control, taste, and the ability to explain the result ([“The Coming Loop”](https://lucumr.pocoo.org/2026/6/23/the-coming-loop/)). A later 35-hour software-factory experiment consumed billions of tokens without producing useful software ([“Astra: Why?”](https://lucumr.pocoo.org/2026/9/7/astra-why/)). **Ronacher delegates most implementation, but still regards comprehension and responsibility as indivisible from serious engineering.**

## Salvatore Sanfilippo

Salvatore Sanfilippo, known as antirez, created Redis and has a long record of designing compact systems from first principles. His recent writing provides the clearest example here of an engineer revising his position in public.

In 2025 he used LLMs for review, prototypes, and implementation from precise specifications, while keeping a strict manual loop ([“Coding with LLMs in the summer of 2025”](https://antirez.com/news/154)). During the Redis Array project in 2026, he spent a month on the specification and data structures, then let AI implement under constant review. He read every line and found performance and design problems that a large test suite had missed ([“Redis array type: short story of a long development”](https://antirez.com/news/164)). He called this “automatic programming,” distinct from vibe coding because the human maintained the vision, intuition, and understanding ([“Automatic programming”](https://antirez.com/news/159)).

By July, his view had shifted. Frontier models could produce roughly 5,000 lines a day, making comprehensive human review the throughput limit. For most projects he now considered his attention better spent on the mental model, design document, novel ideas, and quality assurance. He still reviewed Redis code out of respect for its users, but on experimental systems he was willing to validate behavior and performance without reading everything ([“Control the ideas, not the code”](https://antirez.com/news/169)). He did not abandon understanding; he moved it up a level. The implementation may be opaque, while the design, performance model, and observed behavior may not.

## Birgitta Böckeler

Birgitta Böckeler is a Thoughtworks Distinguished Engineer with more than two decades as a developer, architect, and technical leader. Her work focuses specifically on applying AI-assisted delivery to production-grade business software.

In a 2025 experiment, Böckeler's team pushed agents to build a Spring Boot service with minimal intervention. The agents added unrequested features, changed assumptions as they went, and sometimes declared success with failing tests. Reference applications, code examples, reusable prompts, modular tasks, and a separate review agent improved the result, but did not remove the need for human supervision ([“How far can we push AI autonomy?”](https://martinfowler.com/articles/pushing-ai-autonomy.html)). She later framed source inspection as a risk calculation: impact, probability, and detectability determine whether generated code deserves close review ([“I still care about the code”](https://martinfowler.com/articles/exploring-gen-ai/i-still-care-about-the-code.html)).

Her 2026 work turns architecture and quality into sensors the agent can read: types, lint rules, static security analysis, dependency checks, tests, coverage, mutation testing, secret scanning, and periodic deeper reviews. A dependency rule can prevent an architectural violation before a human sees the diff, while the agent gets immediate feedback and corrects itself ([“Sensors for coding agents”](https://martinfowler.com/articles/sensors-for-coding-agents.html)). Böckeler does not claim these sensors prove semantic quality. They shift routine policing into the harness so human attention can concentrate on exceptions, risks, and system-level judgment.

## Steve Yegge

Steve Yegge is a longtime Amazon and Google engineer whose essays on developer tools have influenced the industry for decades. He is now building Beads, Gas Town, and Wheelhouse as experiments in large-scale agentic development.

Yegge is the outlier who most directly accepts code as a black box. Gas Town began as a 20–30-agent orchestration system with merge queues and quality gates; he said it was entirely vibe-coded and that he had not read its source ([“Welcome to Gas Town”](https://yegge.ai/essays/welcome-to-gas-town/)). He argued that customer behavior, tests, and verification matter more than whether a human personally inspected the implementation ([“The Future of Coding Agents”](https://yegge.ai/essays/the-future-of-coding-agents/)).

His position is not blind faith in a single agent. By August 2026, Gas Town's reusable orchestration model had broken under new model behavior, so he replaced it with Wheelhouse, a project-specific system of persistent plans, role agents, review agents, and institutional memory. He reports operating more than forty agents and producing around 175 real commits per day without reading the 150,000–300,000-line implementation ([“The Shape of Things to Come”](https://yegge.ai/essays/the-shape-of-things-to-come/)). Product ambition and the persistent project “brain” remain controlled, but implementation, decomposition, and much review are delegated to agents. He believes human code review is on the way out. That is materially further than almost everyone else in this comparison.

## Anders Hejlsberg

Anders Hejlsberg architected Turbo Pascal, Delphi, C#, and TypeScript. His judgment comes from four decades of language and compiler design, including systems where subtle global invariants matter more than producing ordinary application code quickly.

Hejlsberg uses AI, but his public examples favor bounded transformations. In discussing TypeScript's large native-code migration, he offered a revealing pattern: instead of asking a model to rewrite a half-million-line codebase directly, ask it to generate a deterministic translator. He argues that AI's effectiveness in a language depends heavily on the amount of representative code in its training data, and expects developers to supervise increasingly capable systems ([GitHub interview](https://github.blog/developer-skills/programming-languages-and-frameworks/typescripts-rise-in-the-ai-era-insights-from-lead-architect-anders-hejlsberg/)).

In a 2026 [Pragmatic Engineer interview](https://newsletter.pragmaticengineer.com/p/typescript-c-and-turbo-pascal-with), he said current agents still struggle with compiler work because they do not hold the relationship among types, symbols, binding, parsing, and other subsystems in one coherent picture. He expects engineers to manage fleets of agents eventually, but the evidence for his own day-to-day workflow is thinner than for the other people here. What is clear is the boundary he sees today: delegate locally checkable work and tool generation; keep the cross-cutting model and use deterministic machinery where correctness can be encoded.

## Martin Fowler

Martin Fowler wrote *Refactoring*, *Patterns of Enterprise Application Architecture*, and several of the field's foundational accounts of agile design. His work has consistently centered on conceptual integrity, evolutionary architecture, and feedback.

Fowler's public record is more a careful characterization of the transition than a detailed personal coding diary. In June 2025 he said he had only dabbled with the best tools, while arguing that prompting was a new, non-deterministic level of abstraction comparable in significance to the move from assembly to high-level languages ([“LLMs bring new nature of abstraction”](https://martinfowler.com/articles/2025-nature-abstraction.html)). In August he warned that surveys were obscuring the difference between autocomplete and agents that can read, edit, and run a repository, and that agents' claims of passing tests must be independently checked ([“Some thoughts on LLMs and Software Development”](https://martinfowler.com/articles/202508-ai-thoughts.html)).

By May 2026 he identified a “November inflection,” when new models and Claude Code made much harder tasks practical ([“November Inflection”](https://martinfowler.com/bliki/NovemberInflection.html)). His definition of [agentic programming](https://martinfowler.com/bliki/AgenticProgramming.html) is explicit: agents manipulate the tree and run tests for extended periods; humans evaluate the work through review, test results, and other sensors, and remain responsible for what the system does and how it works. Fowler therefore rejects both autocomplete as the full story and vibe coding as the professional endpoint. His emphasis is on domain understanding, collaboration with users, and harness engineering—the guides and sensors that make a non-deterministic implementer governable.

## What seems to be becoming common practice

### Strong convergence

**Implementation is being delegated much more aggressively.** Across very different domains, experienced engineers have moved beyond autocomplete. Agents now write whole features, tests, migrations, infrastructure, refactors, experiments, and sometimes entire applications. The disagreement is no longer whether implementation can be delegated, but how far and under what evidence.

**Responsibility is not being delegated at the same rate.** The repeated human responsibilities are intent, prioritization, constraints, risk, acceptance, and the decision to ship. Even the most autonomy-friendly workflows retain an operator who defines success and owns failure. None of these engineers treats an agent's confident declaration that a task is finished as sufficient evidence.

**Fast, executable feedback is the enabling infrastructure.** Tests recur everywhere, but the pattern is wider than testing: types, linters, security scanners, dependency rules, fixed metrics, screenshots, runtime observation, mutation testing, and small reversible commits. The strongest workflows turn architectural and product constraints into signals the agent can consume without waiting for a human review.

**Context is becoming part of the engineered system.** `AGENTS.md`, `CLAUDE.md`, design documents, specifications, examples, decision records, and persistent task graphs are no longer incidental notes. They are the memory and operating instructions of the implementation process. Experienced engineers refine the harness after failures in the same way they would improve a test suite or API.

**Experience still compounds.** These workflows reward the ability to spot a bad abstraction, reject unnecessary scope, model failure modes, and choose the right validation. Agents remove much of the mechanical cost of acting on those judgments; they do not supply them reliably. The senior engineer's advantage is less typing speed than knowing what deserves attention.

The black-box distinction mostly holds, with a qualification. Many of these engineers accept some implementation as a black box, especially when it is disposable, low-risk, or strongly measurable. Almost none accepts system behavior as a black box. Most also reject architecture becoming opaque, although they may let agents *propose* local or even substantial designs. The retained obligation is not necessarily to originate every design decision, but to maintain a coherent explanation of the system and its constraints.

### Significant disagreement

**They disagree sharply about reading the code.** Beck, Böckeler, Torvalds, Ronacher, and early-2026 Sanfilippo treat source comprehension as part of serious maintenance. Willison, DHH, and later Sanfilippo make inspection conditional on risk. Karpathy can ignore internals when a metric captures the objective. Yegge is prepared not to read hundreds of thousands of lines and to replace human review with layers of agent review and behavioral evidence.

**They disagree about autonomy and concurrency.** Hashimoto prefers one background agent and protects his own focus. Beck is skeptical of swarms that turn the human into a coordinator. Ronacher has found long autonomous loops disappointing on software he cares about. Karpathy's narrow experimental loop succeeds precisely because it can run unattended. Yegge uses dozens of agents and regards orchestration as the new medium of programming.

**They disagree about where design happens.** Akita, Ronacher, Sanfilippo, and Hejlsberg place the human design model conspicuously upstream of generation. DHH increasingly allows agents to choose implementation routes, then reviews the shape. Yegge delegates decomposition and design to specialized agents too. “Humans architect, AI implements” describes a center of gravity, not a settled boundary.

### Still unresolved

**Can an agent-maintained architecture preserve conceptual integrity over years?** We have persuasive short- and medium-horizon examples, plus cautionary failures. We do not yet have much evidence from agent-dominated codebases that have survived years of changing teams, requirements, dependencies, and incidents.

**Can behavioral evidence replace source understanding in high-risk systems?** Risk-based review is clearly emerging, but the stopping rule is unsettled. Tests only cover properties somebody thought to encode; source inspection also misses problems; agent review inherits correlated blind spots. Security, infrastructure, concurrency, and irreversible data changes remain the hardest cases.

**What happens to the production of expertise?** These methods amplify people who already possess strong models of architecture, debugging, and quality. Hashimoto, Fowler, and others raise the unanswered question underneath that advantage: how does a new engineer acquire those models if agents perform the implementation work that used to teach them?

The most defensible present conclusion is narrower than either the hype or the backlash. Experienced engineers are delegating code production quickly, and some are delegating source inspection too. They are not, as a group, delegating the obligation to understand the problem, define acceptable behavior, preserve a coherent system, choose the evidence, and own the result.

## My Takeaway

My starting point is that we must remember that LLMs are **token predictors**. They do not reason or deliberate; they predict the next token. Even if they did reason, they would not have the experience of previous projects or the organizational context to know what is a priority and what the future team supporting the system will look like.

The people most enthusiastic about AI delegation might say: “Just add it to the context. Record the meetings, record everything, add it all as context, and let the LLM decide what to do.”

Of course, each session has a limited context. In theory, I can imagine a workflow with a “master” agent that holds the organization's context, receives requests, and creates sub-agents with narrowly scoped tasks. But I say “in theory” because I have neither seen it work nor managed to make it work for serious, complex software. What I see instead is that business logic eventually gets duplicated, architectural patterns break down, APIs and interfaces stop being intuitive and standardized, and the problems compound into a large spaghetti codebase that is unmaintainable even for the LLM.

My takeaway is that AI has to be used given the productivity boost it brings. But for serious and complex work, there must be a human engineer who truly understands the system and its goal—someone who can clean up, trim, refactor, and correct course. AI increases the speed of implementation, while that human involvement reduces the accumulation of bad smells the LLM might introduce.

It still takes a human to determine what is true, decide what it means, take responsibility, and make design decisions about the system.

Note that I said “for serious and complex work.” For MVPs, POCs, throwaway code, custom tools and helpers, or custom dashboards, vibe coding is surely a good option and can produce a large increase in productivity. One thing I like to do is ask AI to vibe-code a script for a task I perform repeatedly. Once generated, the script runs quickly and reproducibly, produces deterministic results without further token usage, and costs the agent's time rather than mine. These implementations can safely be black boxes.

However, for complex systems—or systems that will eventually become complex—and for software that must be reliable, I believe we still need, and probably always will need, accountable human engineers. My workflow today looks roughly like this:

I plan with an AI agent and ask it to surface possibilities. I choose among them for decisions such as the programming language, framework, technology, hosting, and database. Based on my knowledge, experience, and plans for the project, I select what I consider the most cost-effective and strategically appropriate options.

From that work, the agent generates a document. In a fresh session—which keeps each session within the cheaper, faster, and more effective 200,000–300,000-token range—we take a deeper look at the main database and domain entities and classes, APIs, general architecture, and folder structure. Those decisions become a second, more detailed document.

I then ask for a small first step, such as the first API or database script, and inspect it. If the result is sound and I like the direction, I ask the agent to create an `AGENTS.md` with the appropriate documentation and establish what we have done as the standard.

From that point, the agent can write more freely, and I have much more confidence that it will remain within the established guardrails.

Another key practice is using DevOps everywhere: automated tests, CI/CD, and end-to-end testing of key features. Everything we already know from DevOps applies, and it helps tremendously. AI also makes that infrastructure easier to create. Tests, scripts, and similar supporting code can safely be black boxes.

In an existing project, smaller requests can more easily be handled in one shot. One session prepares the plan, a fresh session executes it, and another fresh session reviews it—I use, for example, my public [review-current-work skill](https://github.com/vdufloth/agent-plugins/blob/main/plugins/vdufloth/skills/review-current-work/SKILL.md). The agent creates the merge request, a human reviews it broadly for anything that looks or feels wrong, approves it, and the cycle continues.

For me, the biggest speedup comes from the LLM doing the work during the time I would otherwise spend writing code. I can focus on understanding and planning one problem at a time. The agent then handles the implementation, review, and merge-request description. While it does that, I can start planning the next change. That is what dramatically increases my productivity without sacrificing control—control that will eventually be required for difficult problems, investigations, or architectural changes.

Three statements from the experienced programmers above capture exactly how I think about this:

> For maintained code, somebody must understand the result well enough to take responsibility for it.  
> — Linus Torvalds, paraphrased

On a serious project, if you change something, it breaks, and a stakeholder asks why you did it that way, a response such as “because Claude said so” does not go very far.

> The human still defines architecture and scope, decides which evidence is adequate, and remains accountable when the harness misses something.  
> — Addy Osmani, paraphrased

That remains the developer's most thoughtful job. The mechanical writing part is “solved,” although even there, readability and maintainability still need to be monitored and occasionally corrected. But design, architecture, accountability, and especially the simplification of a system remain the engineer's responsibility.

> Most implementation can be delegated, but comprehension and responsibility remain indivisible from serious engineering.  
> — Armin Ronacher, paraphrased

Understanding the system, making decisions, and taking responsibility for them must still belong to a human dedicated to making it work—someone accountable for what went wrong and for preventing it from happening again. LLMs can generate and explore text, and even interact with computer systems, at a scale far beyond humans. Reason, intent, and validation, however, are still intrinsically human, as I explored in [“What's Left When AI Becomes a Commodity? Intent and Validation”](/en/blog/ai/intent-and-validation/).

## Appendix: Engineer-by-engineer takeaways

| Engineer | Delegates to AI | Keeps under human control |
| --- | --- | --- |
| David Heinemeier Hansson (DHH) | Nearly all implementation on a new project such as Omarchy Quattro, including local design decisions; much less source inspection for UI and auxiliary code. | Overall system shape and close review of critical code. Existing production systems still need an experienced engineer to preserve architectural coherence. |
| Robert C. Martin | Implementation and refactoring inside a highly disciplined agent workflow. | Accepted behavior, architecture rules, and permission to alter acceptance scenarios, enforced through tests and dependency checks. |
| Fábio Akita | Most implementation, tests, mechanical refactoring, research, and infrastructure work. | The *what* and *why*, architecture, interfaces, prioritization, security judgment, validation, and continuous pruning of bad abstractions. |
| Kent Beck | Most code production, experiments, and mechanical work. | Design quality, test discipline, feedback loops, task decomposition, and intervention when local agent decisions damage the whole. |
| Linus Torvalds | Bounded personal software, especially in languages or stacks outside his main expertise. | Understanding and responsibility for durable, maintained systems; generated code cannot make the system itself a black box. |
| Simon Willison | Implementation, tests, and sometimes complete production changes without manually typing or reading every line. | Precise intent and verification. Source inspection varies with risk, but observed system behavior is never taken on trust. |
| Addy Osmani | Implementation across the development lifecycle, with reusable skills enforcing the process. | Architecture, scope, the required evidence, final review, and accountability when automated checks miss something. |
| Andrej Karpathy | Autonomous implementation and experimentation inside narrow loops. | The research objective, editable surface, time budget, evaluation metric, and the program that governs the loop. |
| Mitchell Hashimoto | Small, high-confidence tasks, research, triage, and background implementation. | The hardest problems, review, attention management, and the rules and tools added to the harness after each failure. |
| Armin Ronacher | More than 90% of implementation in some production systems, plus research, debugging, infrastructure, and review assistance. | Architecture, comprehension, taste, runtime behavior, and responsibility. He remains skeptical of unattended loops for durable code he cares about. |
| Salvatore Sanfilippo | Increasingly, the implementation itself and—in many projects—line-by-line source review. | Ideas, mental models, design documents, performance reasoning, and quality assurance. He still reviews especially consequential Redis code. |
| Birgitta Böckeler | Implementation and routine enforcement through types, linters, tests, security tools, dependency rules, and other sensors. | Risk assessment, exceptions, semantic quality, and judgment about whether the available sensors provide sufficient evidence. |
| Steve Yegge | Implementation, decomposition, design, review, merging, and production roles across fleets of agents. | Product ambition and light-touch direction. Persistent project memory and specialized reviewer agents replace his own source inspection. He is the clearest advocate for replacing human code review with agent review. |
| Anders Hejlsberg | AI assistance on locally checkable work; he favors asking AI to generate deterministic transformation tools instead of directly rewriting large codebases. | The cross-cutting compiler model and the decision to use deterministic machinery where direct generation would be unreliable. |
| Martin Fowler | Describes professional agentic programming as extended repository manipulation, implementation, and test execution by agents; evidence about his own daily workflow is thinner. | Responsibility for what the software does and how it works, domain understanding, user collaboration, and evaluation through reviews, tests, and other sensors. |
