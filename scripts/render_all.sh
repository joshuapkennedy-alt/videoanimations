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
# Where it started: timeline (14 s); Then and now: vineyard area (21.5 s). End frames are taken before the closing fade.
node render.js cards/timeline.html 14 out/where_it_started_9x16_4K.mp4
wide node render.js cards/timeline_wide.html 14 out/where_it_started_16x9_4K.mp4
node render.js cards/area.html 21.5 out/vineyard_area_then_and_now_9x16_4K.mp4
wide node render.js cards/area_wide.html 21.5 out/vineyard_area_then_and_now_16x9_4K.mp4
# Into East Germany: the region map with the inner-German border (8 s)
node render.js cards/gdr.html 8 out/saale_unstrut_east_germany_9x16_4K.mp4 out/saale_unstrut_east_germany_9x16_endframe.png
wide node render.js cards/gdr_wide.html 8 out/saale_unstrut_east_germany_16x9_4K.mp4 out/saale_unstrut_east_germany_16x9_endframe.png
# East Germany (GDR) map, 1949-1990 border (7.5 s); end frames are taken before the closing fade
node render.js cards/gdrmap.html 7.5 out/east_germany_gdr_map_9x16_4K.mp4
wide node render.js cards/gdrmap_wide.html 7.5 out/east_germany_gdr_map_16x9_4K.mp4
# Transparent overlays, ProRes 4444 with alpha at 1080p: Bückware title and lower thirds A-D
ALPHA=1 DPR=1 node render.js cards/bueck.html 9 out/buckware_title_9x16.mov
ALPHA=1 DPR=1 wide node render.js cards/bueck_wide.html 9 out/buckware_title_16x9.mov
for x in "a 9 winzervereinigung_freyburg" "b 5 rotkaeppchen" "c 8 bought_by_its_own_managers" "d 7 vineyard_area_1990_2025"; do set -- $x
  ALPHA=1 DPR=1 node render.js cards/lower_$1.html $2 out/lower_third_$1_$3_9x16.mov
  ALPHA=1 DPR=1 wide node render.js cards/lower_$1_wide.html $2 out/lower_third_$1_$3_16x9.mov
done
# How to read a German wine label (10 s)
node render.js cards/winelabel.html 10 out/how_to_read_a_wine_label_9x16_4K.mp4
wide node render.js cards/winelabel_wide.html 10 out/how_to_read_a_wine_label_16x9_4K.mp4
# Info cards, site labels and the Name / VDP rank key: transparent ProRes 4444 at 1080p
for x in "einzellage 8 overlay_a_einzellage" "vdp 11 overlay_c_vdp" "site_edelacker 3.5 overlay_d_freyburger_edelacker" "site_steinmeister 3.5 overlay_e_naumburger_steinmeister"; do set -- $x
  ALPHA=1 DPR=1 node render.js cards/ovl_$1.html $2 out/$3_9x16.mov
  ALPHA=1 DPR=1 wide node render.js cards/ovl_$1_wide.html $2 out/$3_16x9.mov
done
ALPHA=1 DPR=1 node render.js cards/keytiles.html 8.5 out/lower_third_name_vdp_rank_9x16.mov
ALPHA=1 DPR=1 wide node render.js cards/keytiles_wide.html 8.5 out/lower_third_name_vdp_rank_16x9.mov
# Freyburg - Werder map (36.2 s); end frames are taken before the closing fade
node render.js cards/werder.html 36.2 out/freyburg_werder_three_states_9x16_4K.mp4
wide node render.js cards/werder_wide.html 36.2 out/freyburg_werder_three_states_16x9_4K.mp4
# Werderaner Wachtelberg label: transparent ProRes 4444 at 1080p (6 s)
ALPHA=1 DPR=1 node render.js cards/lower_e.html 6 out/lower_third_werderaner_wachtelberg_9x16.mov
ALPHA=1 DPR=1 wide node render.js cards/lower_e_wide.html 6 out/lower_third_werderaner_wachtelberg_16x9.mov
# New ideas: the next generation (18.5 s)
node render.js cards/newideas.html 18.5 out/new_ideas_next_generation_9x16_4K.mp4
wide node render.js cards/newideas_wide.html 18.5 out/new_ideas_next_generation_16x9_4K.mp4
# Old to new: the makers (32.8 s)
node render.js cards/makers.html 32.8 out/old_to_new_makers_9x16_4K.mp4
wide node render.js cards/makers_wide.html 32.8 out/old_to_new_makers_16x9_4K.mp4
# The next generation and the shorter Winzervereinigung label: transparent ProRes 4444 at 1080p
ALPHA=1 DPR=1 node render.js cards/nextgen.html 18.5 out/overlay_the_next_generation_9x16.mov
ALPHA=1 DPR=1 wide node render.js cards/nextgen_wide.html 18.5 out/overlay_the_next_generation_16x9.mov
ALPHA=1 DPR=1 node render.js cards/lower_a2.html 9 out/lower_third_a_winzervereinigung_freyburg_cooperative_only_9x16.mov
ALPHA=1 DPR=1 wide node render.js cards/lower_a2_wide.html 9 out/lower_third_a_winzervereinigung_freyburg_cooperative_only_16x9.mov
# The co-op timeline (13.5 s) and Winzervereinigung today (5 s)
node render.js cards/coop.html 13.5 out/coop_timeline_1934_1951_9x16_4K.mp4
wide node render.js cards/coop_wide.html 13.5 out/coop_timeline_1934_1951_16x9_4K.mp4
node render.js cards/members.html 5 out/winzervereinigung_today_9x16_4K.mp4
wide node render.js cards/members_wide.html 5 out/winzervereinigung_today_16x9_4K.mp4
# You grow -> the co-op makes, and the tours label: transparent ProRes 4444 at 1080p (8 s each)
ALPHA=1 DPR=1 node render.js cards/coopflow.html 8 out/lower_third_you_grow_coop_makes_9x16.mov
ALPHA=1 DPR=1 wide node render.js cards/coopflow_wide.html 8 out/lower_third_you_grow_coop_makes_16x9.mov
ALPHA=1 DPR=1 node render.js cards/lower_g.html 8 out/lower_third_tours_dukes_vineyard_9x16.mov
ALPHA=1 DPR=1 wide node render.js cards/lower_g_wide.html 8 out/lower_third_tours_dukes_vineyard_16x9.mov
# Saale-Unstrut in a box (8.3 s)
node render.js cards/box.html 8.3 out/saale_unstrut_in_a_box_9x16_4K.mp4
wide node render.js cards/box_wide.html 8.3 out/saale_unstrut_in_a_box_16x9_4K.mp4
# Mostly white pie (4.5 s) and the newsletter end cards (6.3 s, no fade-out)
node render.js cards/pie.html 4.5 out/mostly_white_pie_9x16_4K.mp4
wide node render.js cards/pie_wide.html 4.5 out/mostly_white_pie_16x9_4K.mp4
wide node render.js cards/endcard_a_wide.html 6.3 out/endcard_newsletter_A_youtube_16x9_4K.mp4 out/endcard_newsletter_A_youtube_16x9_endframe.png
node render.js cards/endcard_b.html 6.3 out/endcard_newsletter_B_shorts_9x16_4K.mp4 out/endcard_newsletter_B_shorts_9x16_endframe.png
node render.js cards/endcard_c.html 6.3 out/endcard_newsletter_C_instagram_9x16_4K.mp4 out/endcard_newsletter_C_instagram_9x16_endframe.png
wide node render.js cards/endcard_d_wide.html 6.3 out/endcard_newsletter_D_instagram_16x9_4K.mp4 out/endcard_newsletter_D_instagram_16x9_endframe.png
# FRESH · LIGHTER · OFTEN DRY label: transparent ProRes 4444 at 1080p (6 s)
ALPHA=1 DPR=1 node render.js cards/lower_f.html 6 out/lower_third_fresh_lighter_often_dry_9x16.mov
ALPHA=1 DPR=1 wide node render.js cards/lower_f_wide.html 6 out/lower_third_fresh_lighter_often_dry_16x9.mov
# Weißburgunder / Müller-Thurgau bars: transparent ProRes 4444 at 1080p (7 s)
ALPHA=1 DPR=1 node render.js cards/habars.html 7 out/lower_third_weissburgunder_mueller_thurgau_9x16.mov
ALPHA=1 DPR=1 wide node render.js cards/habars_wide.html 7 out/lower_third_weissburgunder_mueller_thurgau_16x9.mov
# Muschelkalk (13 s, 4 steps)
node render.js cards/muschel.html 13 out/muschelkalk_9x16_4K.mp4 out/muschelkalk_9x16_endframe.png
wide node render.js cards/muschel_wide.html 13 out/muschelkalk_16x9_4K.mp4 out/muschelkalk_16x9_endframe.png
scripts/cut_steps.sh cards/muschel.html out/muschelkalk_9x16_4K.mp4 out/muschelkalk_9x16 0 117 207 297 390
wide scripts/cut_steps.sh cards/muschel_wide.html out/muschelkalk_16x9_4K.mp4 out/muschelkalk_16x9 0 117 207 297 390
