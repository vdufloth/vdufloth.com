# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Hugo static site using the [Hextra](https://github.com/imfing/hextra) theme as a Hugo Module (see `go.mod` / `hugo.yaml`). Deploys to Cloudflare Pages on push to `main`.

Tool versions are pinned via `mise.toml` (Hugo `0.147.9`, Go `1.25.6`). Run `mise install` once after cloning.

## Commands

- `mise run serve` — dev server with drafts (`hugo serve -D`).
- `hugo serve -D --templateMetrics --templateMetricsHints` — same, with template hit metrics for debugging slow renders / unused partials.
- `hugo new content path/name.md` — scaffold from `archetypes/default.md` (creates a draft with empty `summary`, `categories`, `tags`).
- `hugo mod get -u` — bump Hextra theme module to its latest version.
- `hugo` — production build into `public/` (gitignored). Cloudflare runs this; you rarely need it locally.

## Architecture

### Content + i18n

Site is bilingual. `DefaultContentLanguage: pt`, `defaultContentLanguageInSubdir: true` — every URL is namespaced (`/pt/...`, `/en/...`).

Content uses Hugo's filename-suffix translation convention: each post is a pair `foo.en.md` + `foo.pt.md` under `content/`. Blog posts live in `content/blog/<topic>/<slug>.<lang>.md`. The two locales must stay in lockstep (same arguments, examples, diagrams, code blocks) — see the `review-article` skill below for the alignment contract.

UI strings (menu labels, "Latest posts", etc.) are not in the templates — they come from `i18n/{en,pt}.yaml` via `{{ i18n "key" }}`. Menus themselves are defined per-language in `hugo.yaml`.

A post is featured on the home "best posts" list when its front matter `tags` contains `best` (see `layouts/home.html`).

### Theme overrides

Hextra ships the base templates via Hugo Modules; this repo overrides only what it needs:

- `layouts/home.html` — fully custom home template. Renders title with a typewriter animation, an i18n'd "latest posts" feed (last 20 posts in `blog`), and a "best posts" feed (filter `tags intersect ["best"]`). All page CSS is inlined in this file (intentional — it's home-only).
- `layouts/partials/custom/head-end.html` — Hextra's documented extension point; loads IBM Plex Serif + Mono from Google Fonts and applies the serif-on-article design system globally (`article main .content` selectors, dark-mode variants, `.profile-avatar` styles used by the About pages).
- `layouts/_partials/footer.html` — footer override.
- `layouts/partials/favicons.html` — favicon set under `static/` (the `my-*` files are the active set).
- `assets/css/custom.css` — additional global styles processed through Hugo Pipes.

When editing visual styling, decide whether the change is home-only (edit `home.html`'s inline `<style>`), article-wide (edit `head-end.html`), or truly global (edit `assets/css/custom.css`). Don't move home-only rules into the global sheet.

### Hugo config notes

- Goldmark `passthrough` is enabled with both `\(...\)` and `\[...\]` / `$$...$$` delimiters, so math markup passes through unescaped — useful in posts, but be careful editing files that contain raw backslash-paren sequences.
- `markup.goldmark.renderer.unsafe: true` — raw HTML in Markdown is allowed (the inline styles in `about.*.md` and similar rely on this).
- `minify.minifyOutput: true` — production HTML is minified; whitespace-sensitive markup needs explicit handling.

## Repo-local skill: `review-article`

`.claude/skills/review-article/SKILL.md` defines a guided review workflow for bilingual blog posts. Trigger: `/review-article <path | stem | directory>`. It scans EN/PT pairs for translation drift, non-native phrasing per locale, AI-slop / LinkedIn idioms, voice fidelity (anchored against `content/_index.{en,pt}.md` and `content/about.{en,pt}.md`), and diagram parity. Findings are presented one-by-one with an approval gate; accepted edits are applied and a `<stem>.review.md` sidecar records the decision log. Use it before merging any post.
