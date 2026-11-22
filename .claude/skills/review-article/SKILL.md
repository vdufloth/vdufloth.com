---
name: review-article
description: Review and (with approval) edit blog articles for EN/PT alignment, native-speaker fit per locale, four-lens audience reception, and AI-slop / LinkedIn phrasing leaks. Interactive approval gate before any edit. Use when asked to review blog articles or when explicitly invoked with a path, stem, or directory.
allowed-tools: Read, Glob, Grep, Bash(git diff:*), Bash(git merge-base:*), AskUserQuestion, Edit, Write
---

# review-article

Guided review of a blog post draft with an interactive approval gate. The skill scans, presents each finding (original / proposed / why), and edits the article only for findings the user explicitly accepts. The full decision log is printed inline to the chat as the skill's final output — no sidecar file is written. Flag any leftover `<stem>.review.md` from a previous run for separate cleanup.

## Inputs

Invoke with `/review-article` in Claude Code or `$review-article` in Codex.

The user provides one of:
- A single article file (e.g. `content/blog/foo.en.md` or `content/blog/foo.pt.md`).
- An article stem (e.g. `content/blog/foo`); locate both `foo.en.md` and `foo.pt.md`.
- A directory containing both locale files.

Optional flags:
- `--diff` — limit scan to paragraphs changed vs `git merge-base HEAD main`.
- `--lens=peer|hm|founder|emp|all` — restrict the demographic-lens pass; default `all`.

If only one locale is provided, locate the sibling locale by swapping the `.<locale>.md` suffix. If the sibling is missing, flag it and proceed with the available file only.

## Phase A — Load & scope

1. Resolve input → locate `foo.en.md` + `foo.pt.md`.
2. Sibling missing → flag, continue single-locale.
3. Stub gate: any locale with fewer than 200 words → flag stub, ask the user whether to continue.
4. Voice anchors: read `content/_index.{en,pt}.md` and `content/about.{en,pt}.md` once to anchor tone (terse, opinionated, concrete-over-buzzword, learning-out-loud, dry humor). Skip if already in current context. Reference only — do not compare content.
5. `--diff` mode → run `git merge-base HEAD main` then `git diff <base>..HEAD -- <file>` and restrict scan to touched paragraphs.

## Phase B — Scan & enumerate findings

Every finding has this shape:

```yaml
id: F<n>             # F1, F2, … assigned in scan order
category: align | native-en | native-pt | lens-peer | lens-hm | lens-founder | lens-emp | slop-en | slop-pt | voice | diagram
file: content/blog/foo.en.md
line: 42             # mandatory — Edit anchor
original: "<exact quote from file>"
proposed: "<concrete replacement, or 'delete'>"
why: "<≤1 line rationale>"
severity: high | med | low
```

Line numbers are mandatory on every finding. `original` must match the file byte-for-byte so the later Edit pass can anchor on it.

### Scan checks

1. **Translation alignment (EN ↔ PT)**
   - Same arguments, examples, conclusions in both versions?
   - Flag paragraphs, code blocks, list items, or claims present in one and not the other.
   - Flag paraphrases that drift in meaning, not just wording.
   - Flag missing or different code samples, links, images, citations.
   - Flag mismatched headings, ordering, or section structure.

2. **Native-speaker fit**
   - **EN**: natural US/UK technical-blog register. Flag literal-from-Portuguese phrasing, false cognates, preposition errors, article misuse, translation-cadence sentences.
   - **PT**: natural Brazilian Portuguese technical-blog register. Flag literal English calques, anglicism overuse where a native term fits, cadence that reads translated.
   - For each: quote the offending phrase, explain why it reads non-native, propose a native alternative.

3. **Four demographic lenses** (see next section).

4. **AI-slop / LinkedIn phrasing watch**
   EN dictionary: "It's important to note that…", "In today's fast-paced world…", "leverage", "delve into", "unlock", "in the realm of", "navigate the complexities of", "robust", "scalable" (unsubstantiated), "seamlessly", "cutting-edge", "best-in-class", "synergy", "ecosystem" (vague), "transform" / "transformation" (paired with "digital"), "real problems with scale and impact", "intersection of X, Y, and Z", "passionate about", "thought leader", "at the end of the day".
   Plus: tricolons used as ornament without meaning ("clean, fast, and reliable"); throat-clearing openers; grammatically uniform bullet lists without informational reason; em-dash overuse beyond surrounding tone; hedging chains ("might", "could potentially", "in some cases may possibly"); closing paragraphs that summarize what the post just said.
   PT dictionary: "Aproveitar para", "alavancar", "robusto e escalável", "transformação digital", "no mundo atual", "vale destacar que", "em síntese, podemos afirmar que", "soluções inovadoras", "de ponta", "estado da arte", "empoderar", anglicism stacks where Portuguese has a clean term, gerundismo abuse ("vou estar verificando").

5. **Voice fidelity** — compare against home + About anchors. Flag paragraphs in a different register; propose a tonal correction without losing technical content.

6. **Diagram parity** — for every mermaid block, ASCII diagram, and image (incl. alt text) in one locale, confirm an equivalent exists in the other. Flag missing, drifted, or untranslated diagrams.

## Four demographic lenses

For each lens, answer the sub-questions explicitly with quoted evidence and list friction items.

### L1 — Peer senior engineer (share / discuss audience)
- **Sharability**: would a peer send this to a colleague unprompted? What is the one-line reason they would?
- **Craft**: does the post teach a non-obvious insight, name a real trade-off, or just restate consensus?
- **Friction**: framework cheerleading, tutorial-without-judgment, no failure modes acknowledged, generic restatement of docs.

### L2 — Hiring manager screening for senior IC / tech lead (replaces "recruiter")
- **Signal**: does it surface scope (team size, system size, blast radius), trade-offs handled, operator judgment under constraint?
- **Credibility**: does it project senior IC / tech lead / CTO-track work?
- **Friction**: surface overviews, missing rationale, tutorials with no judgment, no signal of having shipped in production.

### L3 — Founder seeking advisor / fractional CTO / founding CTO
- **Architectural judgment**: does it pass credibility for strategic calls on tech-team direction?
- **Pattern recognition**: does the author show transfer across companies/contexts, not a single setup?
- **Friction**: single-context war stories without transferable framing, framework cheerleading, no discussion of cost/timing/team trade-offs.

### L4 — Engineer evaluating author as future manager / company to work for
- **Manager signal**: how does the author treat uncertainty, blame, learning, team dynamics?
- **Workplace signal**: would a reader want to work in the environment this writing implies?
- **Friction**: hand-waving, no concrete examples, no acknowledged failure modes, no opinion, sanitized "everything went great" arcs.

## Phase C — Interactive approval

After the scan, print a one-screen summary:

```
<N> findings — <H> high / <M> med / <L> low
by category: align=<n>, native-en=<n>, native-pt=<n>, lens-peer=<n>, lens-hm=<n>, lens-founder=<n>, lens-emp=<n>, slop-en=<n>, slop-pt=<n>, voice=<n>, diagram=<n>
```

Triage findings in severity order (high → med → low). Present each non-slop finding individually with its ID, file and line, exact original, proposed replacement, and rationale. Offer Accept, Keep original, and Skip / revisit, and let the user add a note.

Group slop findings by locale and phrasing pattern. Show the same details for each hit. Use a multi-select prompt if available, or ask the user to reply with the IDs they accept. Wait for an explicit response before moving on. If a question tool is unavailable, present the choices in chat and wait for a reply.

Record each decision as accept, reject, skip, or note, keyed by finding ID. Treat a note without explicit acceptance as keeping the original. If author intent is ambiguous, ask before classifying the finding.

## Phase D — Consolidated review & apply

1. Show a unified diff preview of the accepted changes, grouped by file.
2. Ask whether to apply all previewed changes, cancel, or apply with selected IDs excluded. Wait for explicit confirmation before editing.
3. Apply only the confirmed changes. Match the exact original text and add surrounding context if the match is ambiguous. For deletions, remove surrounding syntax or whitespace as needed to keep the article well-formed.
4. If an edit fails, stop applying changes and report what was applied, what remains pending, and which finding failed.

## Phase E — Final summary (inline)

Do not write any file. Print the decision log as the skill's last chat output, in the exact markdown shape below. The chat scrollback is the author's record; git history of the article files is the audit trail of what changed.

If a stale `<stem>.review.md` exists, report its path. Hugo can render it as a blog page. Ask for explicit approval before deleting it.

```markdown
# Review — <stem> — <YYYY-MM-DD>

## Applied
- F3 native-en foo.en.md:42 — "<original>" → "<proposed>" — <why>

## Rejected (kept original)
- F7 slop-en foo.en.md:118 — "leverage" — note: "intentional, matches client wording"

## Notes
- F12 lens-peer foo.en.md:204 — "consider concrete example of cache miss" — note: "todo next pass"

## Skipped
- F19 diagram foo.pt.md:88 — "mermaid block missing in PT" — note: "needs translator"

## Failed (if any)
- F22 align foo.pt.md:301 — original text remained ambiguous after adding context
```

## Constraints

- Never edit without an explicit Accept decision recorded for that finding.
- Quote the article exactly when flagging. `original` must match the file byte-for-byte; do not paraphrase.
- Line numbers are mandatory on every finding.
- Stub locale (<200 words) → flag and ask before applying the full review.
- Ambiguous intent → ask the author before proceeding.
- Preserve the author's natural tone (terse, concrete, opinionated, dry, willing to admit uncertainty). Do not push toward a generic "professional" register.
- Do not generate translations. Flag missing translations; the author writes them.
- Do not write any file under `content/` other than the article files being edited. Keep the decision log in chat.
- Do not commit or push. The author commits manually.
