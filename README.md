# vdufloth.com

Code for the website [vdufloth.com](https://vdufloth.com) made with Hugo and the Hextra theme.

I'm using `mise` to manage tool versions. With mise installed, run `mise install` from the repo root to install the pinned Hugo and Go versions.

To start the dev server: `mise run serve` (executes `hugo serve -D`).

To get the hugo hextra module use `hugo mod get -u`.

Cloudflare Pages is used for continuous deployment.

## Common comands

Add new file:
`hugo new content path/name.md`

Serve with drafts:
`hugo serve -D`

Show pages being loaded, good for debug:
`hugo serve -D --templateMetrics --templateMetricsHints`
