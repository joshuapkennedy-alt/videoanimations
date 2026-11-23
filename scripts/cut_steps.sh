#!/bin/bash
# Cuts a full card video into step clips and renders a lossless end-frame PNG for each step.
#   scripts/cut_steps.sh <page.html> <full.mp4> <out_prefix> <boundary frames...>
# e.g. scripts/cut_steps.sh cards/thrive.html out/thriving_9x16_4K.mp4 out/thriving 0 102 177 252 330
# Set VW=1920 VH=1080 for 16:9 pages. Step k is frames [b(k-1), b(k)); its end frame is b(k)-1.
set -e
page=$1; full=$2; prefix=$3; shift 3; B=("$@"); n=$((${#B[@]} - 1))
cd "$(dirname "$0")/.."
tmp=$(mktemp -d); times=""
for k in $(seq 1 $n); do
  a=${B[$((k-1))]}; b=${B[$k]}
  ffmpeg -v error -y -i "$full" -vf "trim=start_frame=$a:end_frame=$b,setpts=PTS-STARTPTS" -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p -movflags +faststart "${prefix}_step_${k}.mp4"
  times="$times,$(python3 -c "print(round(($b-1)/30,4))")"
done
DPR=2 node render.js "$page" stills "$tmp" "${times#,}"
k=1; for t in ${times//,/ }; do cp "$tmp/t$t.png" "${prefix}_step_${k}_endframe.png"; k=$((k+1)); done
rm -rf "$tmp"; echo "cut $n steps -> ${prefix}_step_*"
