#!/bin/bash
# Renders every Saale-Unstrut card in both formats into out/ (videos, end frames, step clips).
set -e
cd "$(dirname "$0")/.."; mkdir -p out
wide() { VW=1920 VH=1080 "$@"; }
# Thriving at the Edge (11 s, 4 steps)
node render.js cards/thrive.html 11 out/thriving_at_the_edge_9x16_4K.mp4 out/thriving_at_the_edge_9x16_endframe.png
wide node render.js cards/thrive_wide.html 11 out/thriving_at_the_edge_16x9_4K.mp4 out/thriving_at_the_edge_16x9_endframe.png
scripts/cut_steps.sh cards/thrive.html out/thriving_at_the_edge_9x16_4K.mp4 out/thriving_at_the_edge_9x16 0 102 177 252 330
wide scripts/cut_steps.sh cards/thrive_wide.html out/thriving_at_the_edge_16x9_4K.mp4 out/thriving_at_the_edge_16x9 0 102 177 252 330
# Rainfall and sunshine bar charts (6 s each)
for c in rain sun; do n=$([ $c = rain ] && echo rainfall || echo sunshine)
  node render.js cards/bars_$c.html 6 out/${n}_saale_unstrut_9x16_4K.mp4 out/${n}_saale_unstrut_9x16_endframe.png
  wide node render.js cards/bars_${c}_wide.html 6 out/${n}_saale_unstrut_16x9_4K.mp4 out/${n}_saale_unstrut_16x9_endframe.png
done
# Saale-Unstrut river labels (8 s) and the 51°N zoom-out that continues from it (9 s)
node render.js cards/saale.html 8 out/saale_unstrut_rivers_9x16_4K.mp4 out/saale_unstrut_rivers_9x16_endframe.png
wide node render.js cards/saale169.html 8 out/saale_unstrut_rivers_16x9_4K.mp4 out/saale_unstrut_rivers_16x9_endframe.png
node render.js cards/lat51.html 9 out/latitude_51_freyburg_london_9x16_4K.mp4 out/latitude_51_freyburg_london_9x16_endframe.png
wide node render.js cards/lat51_wide.html 9 out/latitude_51_freyburg_london_16x9_4K.mp4 out/latitude_51_freyburg_london_16x9_endframe.png
# Why the walls matter: transparent lower third, ProRes 4444 with alpha at 1080p (6.5 s)
ALPHA=1 DPR=1 wide node render.js cards/walls_wide.html 6.5 out/why_the_walls_matter_16x9.mov
ALPHA=1 DPR=1 node render.js cards/walls.html 6.5 out/why_the_walls_matter_9x16.mov
# Muschelkalk (13 s, 4 steps)
node render.js cards/muschel.html 13 out/muschelkalk_9x16_4K.mp4 out/muschelkalk_9x16_endframe.png
wide node render.js cards/muschel_wide.html 13 out/muschelkalk_16x9_4K.mp4 out/muschelkalk_16x9_endframe.png
scripts/cut_steps.sh cards/muschel.html out/muschelkalk_9x16_4K.mp4 out/muschelkalk_9x16 0 117 207 297 390
wide scripts/cut_steps.sh cards/muschel_wide.html out/muschelkalk_16x9_4K.mp4 out/muschelkalk_16x9 0 117 207 297 390
