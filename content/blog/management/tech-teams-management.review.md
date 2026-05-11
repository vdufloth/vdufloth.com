# Review — tech-teams-management — 2026-05-10

## Applied

### Diagrams removed (both locales)

- Both mermaid blocks (waterfall + Scrum) deleted. Briefly replaced with self-hosted Wikimedia Commons SVGs (`waterfall-model-en.svg` + `scrum-process-en.svg`), then removed at author request — the Commons assets did not match the article's visual quality.
- Waterfall caption kept as a standalone blockquote in both locales (reads as a punchy one-line summary of the model).
- Scrum had no original caption; the temporary one added with the image was dropped along with the image.
- SVG files deleted; `static/images/blog/management/` directory removed.
- No mermaid wiring changes — other posts can still use mermaid.
- Follow-up: if diagrams return, prefer commissioning original SVGs that match the site's design system rather than re-using Commons assets.

### Table condensation (both locales)

- T1 Sprint Characteristics in Scrum — 3 rows, right-side cells condensed to 1 sentence each.
- T2 The 4 Pillars of the Agile Manifesto — 4 rows, right-side cells condensed to 2–3 sentences each.
- T3 Essential Kanban Method Practices — 3 rows, right-side cells condensed to 1–2 sentences each.

Final summary table at end of article left untouched (already terse).

### EN — `content/blog/management/tech-teams-management.en.md`

- F12 slop-en :122 — "4 non-negotiable pillars" → "4 core pillars" — LinkedIn intensifier; "core" carries the meaning.
- F13 slop-en :126 — "constitutes pure flow waste" → "is pure waste" — buzzword stack ("constitutes" + "flow waste").
- F14 slop-en :160 — "two weeks of focal isolation, strategic planning, and orchestrated collective rhythm create stability over market chaos" → "two weeks of protected focus and shared rhythm create stability against market churn" — ornamental tricolon and buzzword stacks.
- F15 slop-en :164 — "absolute control of work congestion through WIP restriction is the only way to avoid human burnout and system paralysis" → "capping WIP is the primary lever against burnout and system paralysis" — softens unsupported absolute.
- F16 slop-en :168 — "permanently mitigating the exponential risk of classical methods" → "containing the compounding risk the classical methods carried" — both "permanently" and "exponential" overclaim.
- F17 slop-en :354 — "Mediocre professionals … Excellent professionals …" → "Weaker engineers … Stronger ones …" — moralistic character labels replaced with behavior-oriented framing.
- F18 slop-en :380 — "imposing rhythm and the clarity of visibility" → "imposing rhythm and visibility" — "clarity of visibility" is filler.
- F19 slop-en :392 — "AI acts as a tireless pair programming partner" → "AI acts as a pair programming partner that doesn't tire" — marketing-leaning adjective reworded for drier register.
- F20 slop-en :346 — "Mature management, especially in the context of enterprise software platforms" → "Mature management, especially in enterprise contexts" — corporate filler trimmed.

### PT — `content/blog/management/tech-teams-management.pt.md`

- F1  align :152 — Kanban "Visualizar o Fluxo de Trabalho" cell: removed duplicated Agile-Manifesto pillar-1 paragraph that had been pasted before the actual Kanban content. Now matches EN line 154.
- F2  align :150 — Kanban table column header: dropped stacked translation "Interpretação e Aplicação na Gestão de Software<br><br>", kept only "Teoria e Aplicação Prática no Desenvolvimento". Matches EN line 152.
- F3  native-pt :20  — "esr" → "ser" — typo.
- F10 native-pt :39  — "tornou-se necessário" → "tornou-se evidente" — agreement (necessidade is feminine) + mirrors EN "became apparent".
- F4  native-pt :226 — "isso representa cerca um máximo de 4 horas" → "isso representa no máximo cerca de 4 horas" — malformed phrase.
- F5  native-pt :228 — "Também é quebrado em itens" → "Também são quebradas em tarefas" — number/gender agreement.
- F6  native-pt :230 — "Dependendo a equipe" → "Dependendo da equipe" — missing preposition.
- F7  native-pt :268 — "inevavelmente" → "inevitavelmente" — typo.
- F8  native-pt :304 — "splike" → "spike"; "Documentado" → "documentado" — typo + stray capitalization.
- F9  native-pt :392 — "à regras tributárias" → "a regras tributárias" — misused crase.
- F21 slop-pt :107 — "perigosa ilusão gerencial" → "ilusão gerencial perigosa" — adjective order reads PT-native.
- F22 slop-pt :129 — "explosão de adoção" → "rápida adoção" — marketing register.
- F23 slop-pt :160 — mirror of EN F14.
- F24 slop-pt :164 — mirror of EN F15.
- F25 slop-pt :168 — "Sprints para fomento criativo e Kanban para saneamento de gargalos" → "Sprints para impulso criativo e Kanban para destravar gargalos" — bureaucratic jargon.
- F26 slop-pt :352 — mirror of EN F17.
- F27 slop-pt :380 — mirror of EN F18.
- F28 slop-pt :268 — "necessidade vitalícia" → "necessidade permanente" — overdramatic.

## Rejected (kept original)

- F11 slop-en :121 — "Yet the synergy was nearly instantaneous." — kept as-is.
- F29 slop-pt :105 — "a alta gerência questionava agressivamente" — kept as-is.

## Notes (for next pass — no edits applied)

### Lens — peer senior engineer
- **N1** Article hides the author. Voice anchor (`content/about.md`) lists shipped outcomes (200→60 open issues in a year, 10-person team kept same size for 3 years, 8M+ orders / 150B+ units processed). None of this anchors the practical guide. Folding 1–2 short examples from Cyberlog experience would lift sharability and credibility for a peer audience.

### Lens — hiring manager
- **N2** Hiring manager reading the body only would not learn that the author has shipped these practices in production. Same fix as N1 covers this lens — linking the practical guide to a concrete team outcome (size, throughput, defect rate) would close the "I shipped this" gap.

### Lens — founder / fractional CTO
- **N3** Article is uniformly prescriptive. Add a 1-paragraph "when this doesn't fit" caveat near the practical guide: when Scrum overhead exceeds team size (e.g. <5 people, pre-PMF), when Kanban-only is right, when neither is right. Pattern-recognition signal jumps for advisor reads.

### Lens — engineer evaluating author as future manager
- **N4** "Who to Let Go" section is sound in intent but harsh in framing. "Net Negative", "Toxic Knowledge Silo", "Lone Genius" read as character labels — reader may interpret as a psychological-safety signal. Replace character labels with observable behaviors and the feedback mechanism used in 1:1s. Same content, safer-to-read register.

### Voice
- **N5** Add a one-sentence first-person opener before "Why software management is different" (e.g. *"After a decade running tech teams, here is the management model I keep coming back to — and why."*). Aligns with home + about register, where the author writes in first-person learning frame.
- **N6** Em-dash density above voice baseline (~30+ across the piece; `content/about.md` uses them moderately). Pass to thin by ~30%: keep em-dashes that mark a hard shift, convert ornamental ones to commas or periods. Reduces translated-cadence feel.
- **N7** Prescriptive register throughout, never admits uncertainty about its own prescriptions. Voice anchor is "writing as I learn" / "messy problem-solving." Add 1–2 sentences of admitted uncertainty (e.g. on Story Points after AI, on Sprint length under heavy interrupts) — brings the piece into a learning-out-loud register.

## Skipped

_None._

## Failed

_None._
