#!/bin/bash
# Vertical versions of the rivers & regions map (ffmpeg crop onto a 2160x3840 canvas, no re-animation).
#   big_picture/rivers_regions.sh <rivers_regions_16x9_4K.mp4> <rivers_regions_16x9_4K_pointers.mp4> <outdir>
# Writes rivers_regions_9x16_4K.mp4 (8 s), rivers_regions_9x16_4K_pointers.mp4 (15.5 s)
# and rivers_regions_9x16_4K_pointers_title.mp4 (pointers + "Germany's Rivers" title fading in at 0.3 s).
set -e
SRC=$1; PTR=$2; OUT=$3; cd "$(dirname "$0")"; mkdir -p "$OUT"
# background = a patch of the source's own background, so the padding matches exactly
BG='[a]crop=64:64:16:16,scale=2160:3840[bg]'
ffmpeg -v error -y -i "$SRC" -filter_complex "[0:v]split[a][b];$BG;[b]crop=1680:2160:1080:0,scale=2160:-2:flags=lanczos[m];[bg][m]overlay=0:(H-h)/2,format=yuv420p" \
  -c:v libx264 -crf 14 -preset slow -movflags +faststart "$OUT/rivers_regions_9x16_4K.mp4"
# the pointers version needs a wider crop so every river label stays in frame
ffmpeg -v error -y -i "$PTR" -filter_complex "[0:v]split[a][b];$BG;[b]crop=2700:2160:368:0,scale=2160:-2:flags=lanczos[m];[bg][m]overlay=0:(H-h)/2,format=yuv420p" \
  -c:v libx264 -crf 14 -preset slow -movflags +faststart "$OUT/rivers_regions_9x16_4K_pointers.mp4"
# title: render rivers_title.html to a transparent PNG, then fade and drift it in over the pointers version
title=$(mktemp --suffix=.png)
node -e "
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 360 }, deviceScaleFactor: 2 });
  await p.goto('file://' + require('path').resolve('rivers_title.html'));
  await p.evaluate(() => Promise.all(['700 100px PF', '600 20px Inter'].map(f => document.fonts.load(f))).then(() => document.fonts.ready));
  await p.screenshot({ path: '$title', omitBackground: true }); await b.close(); })();"
ffmpeg -v error -y -i "$PTR" -loop 1 -framerate 30 -i "$title" -filter_complex "[0:v]split[a][b];$BG;[b]crop=2700:2160:368:0,scale=2160:-2:flags=lanczos[m];[bg][m]overlay=0:(H-h)/2[base];[1:v]format=rgba,fade=in:st=0.3:d=0.8:alpha=1[t];[base][t]overlay=0:'360+40*pow(1-min(1,max(0,(t-0.3)/0.8)),3)':shortest=1,format=yuv420p" \
  -c:v libx264 -crf 14 -preset slow -movflags +faststart "$OUT/rivers_regions_9x16_4K_pointers_title.mp4"
rm -f "$title"; echo "wrote $OUT/rivers_regions_9x16_4K*.mp4"
