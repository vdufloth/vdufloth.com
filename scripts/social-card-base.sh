#!/usr/bin/env bash
# Regenerates assets/images/social/card-base.png, the 1200x630 background that
# layouts/_partials/social-image.html draws each page title onto.
# Uses the site's dark palette (see html.dark in assets/css/custom.css).
# Requires rsvg-convert (librsvg) and ImageMagick.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
logo="$root/static/images/dufloth-lockup-papel.svg"
out="$root/assets/images/social/card-base.png"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# Inner markup of the lockup, re-wrapped with a padded viewBox so the chevron's stroke isn't clipped.
logo_inner="$(sed -e '1d' -e '$d' "$logo")"

cat > "$tmp/base.svg" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#171717"/>
  <rect x="0" y="0" width="1200" height="10" fill="#f0eff2"/>
  <svg x="72" y="70" width="252" height="50" viewBox="-8 -9 625 124">
$logo_inner
  </svg>
  <rect x="80" y="514" width="1040" height="2" fill="#404040"/>
</svg>
SVG

rsvg-convert -w 1200 -h 630 "$tmp/base.svg" -o "$tmp/base.png"
magick "$tmp/base.png" -strip "PNG24:$out"
echo "wrote $out"
