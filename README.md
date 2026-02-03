# vdufloth.com

Code for the website [vdufloth.com](https://vdufloth.com) made with Hugo and the Hextra theme.

I'm using `asdf` to manage the hugo version. Given the repo already has the `.toolversions` file, simply run `asdf install` (after having installed asdf itself).

To get the hugo hextra module use `hugo mod get -u`.

Cloudflare Pages is used for continuous deployment.

## Common comands

Add new file:
`hugo new content path/name.md`

Serve with drafts:
`hugo serve -D`

Show pages being loaded, good for debug:
`hugo serve -D --templateMetrics --templateMetricsHints`
