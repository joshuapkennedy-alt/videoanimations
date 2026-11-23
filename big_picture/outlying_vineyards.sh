#!/bin/bash
# Vertical outlying-vineyards map: crop the 16:9 source, erase its leader lines frame by frame, enlarge, and
# composite redrawn labels (cards/ov_labels.html) on top. 12 s, 30 fps, 2160x3840.
#   big_picture/outlying_vineyards.sh <outlying_vineyards_16x9.mp4> <out.mp4> <endframe.png>
# ov_masks.json holds each leader line's pixel band in the cropped frame (made by ov_mask.py from the last frame);
# each line is erased from the frame where it starts drawing in the source.
set -e
V=$(realpath "$1"); OUT=$(realpath -m "$2"); PNG=$(realpath -m "$3"); N=360
cd "$(dirname "$0")"; labels=$(mktemp -d)
node -e "
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });
  await p.goto('file://' + require('path').resolve('../cards/ov_labels.html'));
  await p.evaluate(() => Promise.all(['700 50px PF', '400 20px Inter'].map(f => document.fonts.load(f))));
  for (let f = 0; f < $N; f++) { await p.evaluate(t => render(t), f / 30); await p.screenshot({ path: '$labels/' + String(f).padStart(4, '0') + '.png', omitBackground: true }); }
  await b.close(); })();"
ffmpeg -v error -i "$V" -frames:v $N -vf "crop=1560:2160:1140:0,format=rgb24" -f rawvideo - | python3 -c "
import sys, numpy as np
sys.path.insert(0, '.'); from ov_fill import fill, load
m = load('ov_masks.json'); W, H = 1560, 2160
start = {'sachsen': 56, 'schlieben': 74, 'wurtt': 199, 'lindau': 217}
n = 0
while True:
  b = sys.stdin.buffer.read(W*H*3)
  if len(b) < W*H*3: break
  fr = np.frombuffer(b, np.uint8).reshape(H, W, 3).copy()
  for k, s in start.items():
    if n >= s: fill(fr, m[k])
  sys.stdout.buffer.write(fr.tobytes()); n += 1
" | ffmpeg -v error -y -f rawvideo -pix_fmt rgb24 -s 1560x2160 -r 30 -i - -framerate 30 -i "$labels/%04d.png" \
  -f lavfi -i "color=c=0xEEE5D4:s=2160x3840:r=30,format=rgb24" -filter_complex \
  "[0:v]scale=2160:-1:flags=lanczos[m];[2:v][m]overlay=0:0:shortest=1[b];[b][1:v]overlay=0:0:format=rgb,format=rgb24,split[v][s];[s]select='eq(n\,$((N-1)))'[last];[v]format=yuv420p[vo]" \
  -map "[vo]" -c:v libx264 -crf 14 -preset slow -movflags +faststart "$OUT" -map "[last]" -frames:v 1 -update 1 "$PNG"
rm -r "$labels"; echo "wrote $OUT"
