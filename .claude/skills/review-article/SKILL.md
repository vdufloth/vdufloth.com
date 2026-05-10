---
name: review-article
description: Review a blog article for EN/PT translation alignment, native-speaker fit per locale, audience reception across three demographics (tech employees evaluating the author as a manager, $10k+/mo remote recruiters, founders seeking tech advisor/CTO work), and AI-slop / LinkedIn phrasing leaks. Suggestions only — never edit. Trigger when user invokes /review-article with a path to a content/blog/*.md file, an article stem, or a directory.
---

# review-article

Review a blog post draft for cross-language alignment, native-speaker readability, three-audience fit, and AI/LinkedIn phrasing leaks. Output suggestions only — never edit the article.

## Inputs

The user provides one of:
- A single article file (e.g. `content/blog/foo.en.md` or `content/blog/foo.pt.md`).
- An article stem (e.g. `content/blog/foo`); locate both `foo.en.md` and `foo.pt.md`.
- A directory containing both locale files.

If only one locale is provided, locate the sibling locale by swapping the `.<locale>.md` suffix. If the sibling is missing, flag it and proceed with the available file only.

## Steps

### 1. Load
- Read the EN file and the PT file (if both exist).
- Read `content/_index.{en,pt}.md` and `content/about.{en,pt}.md` once to anchor the author's natural tone (terse, opinionated, concrete-over-buzzword, learning-out-loud, dry humor). Voice reference only — do not compare content.

### 2. Translation alignment (EN ↔ PT)
- Are the same arguments, examples, and conclusions present in both versions?
- Flag any paragraph, code block, list item, or claim that exists in one but not the other.
- Flag paraphrases that drift in meaning, not just wording.
- Flag missing or different code samples, links, images, or citations.
- Flag mismatched headings, ordering, or section structure.

### 3. Native-speaker fit
- **EN**: read for natural US/UK technical-blog register. Flag literal-from-Portuguese phrasing, false cognates, preposition errors, article misuse, or sentence rhythm that signals translation.
- **PT**: read for natural Brazilian Portuguese technical-blog register. Flag literal English calques, anglicism overuse where a native term fits, or sentence cadence that signals translation.
- For each flag: quote the offending phrase, explain why it reads non-native, propose a native alternative.

### 4. Three-demographic fit

Apply each lens. Answer the embedded sub-questions explicitly. Quote evidence from the article when possible.

#### Demographic 1 — Tech employees evaluating the author as a manager / company to work for
- Would they feel they would learn from the author? Where specifically does the writing demonstrate transferable insight versus generic restatement?
- Would they feel it is worth following the blog for ongoing learning? Is there a recurring thesis, point of view, or area of expertise that compounds across posts?
- Friction signals: hand-waving, no concrete examples, no opinion, no failure modes acknowledged, no code/diagrams when warranted.

#### Demographic 2 — Big-tech or startup recruiters sourcing $10k+/mo remote roles
- Does the article project credibility for senior IC, tech lead, or CTO-track work?
- Does it surface scope (team size, system size, blast radius), trade-offs handled, or operator judgment under constraint?
- Friction signals: tutorials with no judgment, surface-level overviews, missing rationale, no signal of having shipped the thing in production.

#### Demographic 3 — Founders seeking tech advisor / part-time CTO / founding CTO
- Does it pass credibility for architectural decisions and tech-team strategic calls?
- Does the author show pattern recognition across companies/contexts, not just a single setup?
- Friction signals: single-context war stories with no transferable framing, framework cheerleading, no discussion of cost/timing/team trade-offs.

### 5. AI-slop and LinkedIn phrasing watch

High-priority deletions. Flag every occurrence:

EN:
- "It's important to note that…", "In today's fast-paced world…", "leverage", "delve into", "unlock", "in the realm of", "navigate the complexities of", "robust", "scalable" (unsubstantiated), "seamlessly", "cutting-edge", "best-in-class", "synergy", "ecosystem" (vague), "transform" / "transformation" (paired with "digital"), "real problems with scale and impact", "intersection of X, Y, and Z", "passionate about", "thought leader", "at the end of the day".
- Tricolons used as ornament rather than meaning ("clean, fast, and reliable").
- Paragraphs that open with throat-clearing or restate the prompt.
- Bullet lists that are grammatically uniform without informational reason.
- Em-dash overuse beyond what the surrounding tone has earned.
- Hedging chains ("might", "could potentially", "in some cases may possibly").
- Closing paragraphs that summarize what the post just said.

PT:
- "Aproveitar para", "alavancar", "robusto e escalável", "transformação digital", "no mundo atual", "vale destacar que", "em síntese, podemos afirmar que", "soluções inovadoras", "de ponta", "estado da arte", "empoderar", anglicism stacks where Portuguese has a clean term, gerundismo abuse ("vou estar verificando").

### 6. Voice-fidelity check
Compare the article's voice against the home + About voice (terse, concrete, opinionated, dry, willing to admit uncertainty). Flag paragraphs that read in a different register and propose how to bring them back without losing technical content.

## Output format

Produce a single review report with the following sections, in this order. Omit any section without findings.

1. **Summary** — 2–3 sentences. Top-level verdict and the single most important change.
2. **Translation alignment** — bullet list of EN/PT divergences. For each: quote both versions, describe the drift.
3. **Native-speaker fit** — sub-section per locale. Bullet each issue with quote, why it reads non-native, and suggested alternative.
4. **Demographic 1 — tech employees** — answer the two sub-questions explicitly with quoted evidence; list friction items.
5. **Demographic 2 — recruiters** — same shape.
6. **Demographic 3 — founders** — same shape.
7. **AI-slop / LinkedIn phrasing** — quote each offending phrase with line reference; propose a replacement or deletion.
8. **Voice fidelity** — flag any paragraph that drifts; propose a tonal correction.
9. **Top 5 changes (priority-ordered)** — distilled action list. The author can apply these without re-reading the full report.

## Constraints

- Never edit the article. Suggestions only.
- Quote the article exactly when flagging issues; do not paraphrase the complaint.
- Use file paths and line numbers when referencing specific spots.
- If a locale has fewer than ~200 words, flag the locale as a stub before applying full review.
- Do not invent missing context. If unable to tell whether a phrase is a translation issue or an intentional choice, ask.
- Preserve the author's natural tone. Do not push toward a generic "professional" register.
