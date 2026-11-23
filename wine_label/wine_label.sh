#!/bin/bash
# Vertical "wine label explained": full video, six 2.5 s step clips, an end frame per step, and the step 0 still.
#   wine_label/wine_label.sh <wine_label_explained_all_steps_16x9.mp4> <outdir>
# Top half: the source's bottle/label/callout area at full 4K (not resized). Bottom half: cards/label_list.html.
set -e
SRC=$(realpath "$1"); OUT=$(realpath -m "$2"); cd "$(dirname "$0")"; mkdir -p "$OUT"
full="$OUT/wine_label_explained_all_steps_9x16_4K.mp4"
node label_render.js "$SRC" "$full" "$OUT/step_end_"
for k in 1 2 3 4 5 6; do
  ffmpeg -v error -y -i "$full" -vf "trim=start_frame=$(( (k-1)*75 )):end_frame=$(( k*75 )),setpts=PTS-STARTPTS" -an -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/step_${k}_9x16_4K.mp4"
  mv "$OUT/step_end_$k.png" "$OUT/step_${k}_9x16_endframe.png"
done
cp "$OUT/step_6_9x16_endframe.png" "$OUT/wine_label_explained_all_steps_9x16_endframe.png"
# step 0: the clean label before any marker appears (= first frame of step 1)
ffmpeg -v error -y -i "$SRC" -filter_complex "[0:v]trim=end_frame=1,split[a][b];[a]crop=64:64:16:16,scale=2160:3840[bg];[b]crop=1804:1880:200:140[top];[bg][top]overlay=178:40,format=rgb24" -frames:v 1 "$OUT/step_0_9x16_startframe.png"
echo "wrote $OUT"
