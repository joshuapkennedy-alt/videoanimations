# Saale-Unstrut infographics

Source for the animated cards in the Saale-Unstrut video, plus the vertical (9:16) versions of the earlier "big picture" and wine-label animations (see [Big picture and wine label](#big-picture-and-wine-label)). Each card is an HTML page that draws one frame for a given time `t`; `render.js` steps through it in headless Chromium and pipes the frames to ffmpeg.

## Requirements

- Node.js 18+ with Playwright and its Chromium (`npm install && npx playwright install chromium`)
- ffmpeg on the `PATH`
- Python 3 with numpy and Pillow (for the step end frames and the map tools); scipy only for `tools/map/fit.py`

The fonts are bundled in `fonts/` (Playfair Display and Inter, both SIL OFL 1.1), so nothing needs installing system-wide.

## Output format

Every card renders at **30 fps** and **4K**: the pages are laid out at 1080×1920 (9:16) or 1920×1080 (16:9) and captured at 2× device scale.

| Format | Page size | Output |
|---|---|---|
| 9:16 (default) | 1080×1920 | 2160×3840 |
| 16:9 (`*_wide.html`, `saale169.html`) | 1920×1080 | 3840×2160 |

For 16:9 pages, prefix the command with `VW=1920 VH=1080` so the browser viewport matches.

Set `DPR=1` to render at 1080×1920 / 1920×1080 instead of 4K, and `FFMPEG=<path>` if ffmpeg is not on the `PATH`. The 9:16 tile card and bar charts keep all text in the top 75% of the frame and at least 120 px from the right edge, clear of the Shorts/Reels buttons.

## Rendering a card

```
node render.js <page.html> <seconds> <out.mp4> [endframe.png]
```

The optional PNG is the card's final state, rendered losslessly (not grabbed from the compressed video).

| Card | 9:16 page | 16:9 page | Duration |
|---|---|---|---|
| Thriving at the Edge | `cards/thrive.html` | `cards/thrive_wide.html` | 11 s (330 frames) |
| Rainfall bar chart | `cards/bars_rain.html` | `cards/bars_rain_wide.html` | 6 s (180 frames) |
| Sunshine bar chart | `cards/bars_sun.html` | `cards/bars_sun_wide.html` | 6 s (180 frames) |
| Saale-Unstrut rivers (leads into 51°N) | `cards/saale.html` | `cards/saale169.html` | 8 s (240 frames) |
| 51°N: Freyburg and London | `cards/lat51.html` | `cards/lat51_wide.html` | 9 s (270 frames) |
| Muschelkalk | `cards/muschel.html` | `cards/muschel_wide.html` | 13 s (390 frames) |
| Why the walls matter (transparent lower third) | `cards/walls.html` | `cards/walls_wide.html` | 6.5 s (195 frames) |

Examples:

```
node render.js cards/thrive.html 11 out/thriving_at_the_edge_9x16_4K.mp4 out/thriving_at_the_edge_9x16_endframe.png
VW=1920 VH=1080 node render.js cards/thrive_wide.html 11 out/thriving_at_the_edge_16x9_4K.mp4 out/thriving_at_the_edge_16x9_endframe.png
```

`scripts/render_all.sh` renders every card in both formats, including the step clips, into `out/`.

## Transparent overlays

"Why the walls matter" is a lower third for use over video. Render it with `ALPHA=1` for a transparent background and Apple ProRes 4444 with alpha (`.mov`), at 1080p:

```
ALPHA=1 DPR=1 VW=1920 VH=1080 node render.js cards/walls_wide.html 6.5 out/why_the_walls_matter_16x9.mov
ALPHA=1 DPR=1 node render.js cards/walls.html 6.5 out/why_the_walls_matter_9x16.mov
```

In 16:9 the group is 1104 px wide, centred, 80 px above the bottom, and the top two-thirds stay empty. In 9:16 everything sits between 25% and 75% of the height and 120+ px clear of the right edge.

## Step versions

Thriving at the Edge and Muschelkalk also ship as one clip per step. Each step is cut from the full video, so every step ends on the frame the next one starts with, and each gets a lossless end-frame PNG:

```
scripts/cut_steps.sh <page.html> <full.mp4> <out_prefix> <boundary frames...>
```

| Card | Boundary frames | Step lengths |
|---|---|---|
| Thriving at the Edge | `0 102 177 252 330` | 3.4 s (title + Rivers), 2.5 s, 2.5 s, 2.6 s |
| Muschelkalk | `0 117 207 297 390` | 3.9 s (title + An ancient sea), 3 s, 3 s, 3 s |

```
scripts/cut_steps.sh cards/thrive.html out/thriving_at_the_edge_9x16_4K.mp4 out/thriving_at_the_edge_9x16 0 102 177 252 330
```

Use the same `VW=1920 VH=1080` prefix for the 16:9 pages. Step 4's end frame is the same as the full video's.

## Stills at any time

```
DPR=2 node render.js cards/muschel.html stills out/stills 2.5,6,12.99
```

Writes `t2.5.png` and so on. `DPR=2` gives 4K output; leave it off for quick 1× previews.

## Layout of the repo

- `render.js`: the renderer
- `cards/lib.js`: shared helpers (timing, easing, text styles)
- `cards/*.js`: one script per card; the `.html` pages set `window.WIDE` (layout) and, for the bar charts, `window.CHART` (the data)
- `cards/muted.png`, `cards/su_layer.png`, `cards/muted_de.png`: map images for the Saale-Unstrut and 51°N cards
- `cards/paths.js`: country outlines for the 51°N card, in the same projection as the map images
- `fonts/`: bundled fonts, `fonts.css` and licences
- `tools/map/`: how the map assets were made (below)
- `big_picture/`: the big-picture renderers and conversion scripts
- `wine_label/`: the wine-label conversion

## Changing the cards

- **Bar chart data:** edit `window.CHART` in the four `bars_*.html` pages (labels, values, axis `max` and `ticks`).
- **Wording:** the text lives near the top of each card's `.js` file.
- **Timing:** each card's `.js` sets its step start times (`T0` and `STEP`). If you change them, update the duration and step boundary frames above.

## Map assets (tools/map)

The map images are cut from the 16:9 rivers & regions animation (frames 110 and 239, cropped to x 1100–2740). The 51°N card adds the rest of Europe from Natural Earth outlines (via the `world-atlas` package). These are lined up with the existing map by fitting its projection: it turns out to be equirectangular, and `fit.json` holds the fitted scale and offset.

To rebuild them (normally not needed):

```
cd tools/map
npm install d3-geo@3.1.1 topojson-client@3.1.0 world-atlas@2.0.2
node cands.mjs cands.json && python3 fit.py ../../cards/muted.png cands.json fit.json   # only to re-fit the projection
node paths.mjs fit.json ../../cards/paths.js
python3 build_map_assets.py <rivers_regions_16x9_4K.mp4> ../../cards
```

## Big picture and wine label

All of these are 9:16 only, 30 fps, 2160×3840. The first group is drawn from scratch; the second converts your original 16:9 videos, which aren't in the repo, so pass their paths in.

### Drawn from scratch

| Animation | Command | Duration |
|---|---|---|
| The big picture, chapter cards 1–7 | `node big_picture/render_bp.js out/` | 4 s each (120 frames) |
| River warmth, night to day (3 terraces, final) | `node big_picture/render_river_warmth.js big_picture/river_warmth.html out/river_warmth_9x16_4K_3terraces.mp4` | 10 s (300 frames) |
| River warmth, earlier 5- and 6-terrace versions | same, with `river_warmth_5terraces.html` or `river_warmth_6terraces.html` | 10 s |
| France vs Germany, side by side (leads into the squeeze) | `node render.js cards/fvg2.html 10 out/france_vs_germany_side_by_side_9x16_4K.mp4 out/france_vs_germany_side_by_side_9x16_endframe.png` | 10 s (300 frames) |
| France vs Germany, stacked then into columns | `node render.js cards/fvg.html 10 ...` | 10 s |
| Systems squeeze to 2021 | `node render.js cards/squeeze.html 9 ...` | 9 s (270 frames) |
| Germany 2021 vs VDP, continuing from the squeeze | `node render.js cards/vdp2.html 10 ...` | 10 s (300 frames) |
| Germany 2021 vs VDP, standalone | `node render.js cards/vdp.html 10 ...` | 10 s |

The three-clip sequence `fvg2` → `squeeze` → `vdp2` is built so each clip opens on the previous one's last frame.

### Converted from your 16:9 videos

| Animation | Command | Source video | Duration |
|---|---|---|---|
| Rivers & regions (plain, pointers, pointers + title) | `big_picture/rivers_regions.sh <plain.mp4> <pointers.mp4> out/` | `rivers_regions_16x9_4K.mp4`, `rivers_regions_16x9_4K_pointers.mp4` | 8 s, 15.5 s, 15.5 s |
| Outlying vineyards | `big_picture/outlying_vineyards.sh <source.mp4> out/outlying_vineyards_9x16_4K.mp4 out/outlying_vineyards_9x16_endframe.png` | `outlying_vineyards_16x9.mp4` | 12 s (360 frames) |
| Wine label explained (full, 6 steps, end frames, step 0 still) | `wine_label/wine_label.sh <source.mp4> out/wine_label/` | `wine_label_explained_all_steps_16x9.mp4` | 15 s; steps 2.5 s (75 frames) each |

How the conversions work:

- **Rivers & regions** crops the map out of the 4K frame onto a 2160×3840 canvas whose background is a patch of the source's own background, so the padding matches exactly. The pointers version uses a wider crop so every river label stays in frame. The title version adds `big_picture/rivers_title.html`, fading in at 0.3 s.
- **Outlying vineyards** crops the map, erases the original leader lines frame by frame (`big_picture/ov_masks.json`, made by `ov_mask.py` from the last frame), enlarges it to the full width, and draws new labels from `cards/ov_labels.html` on top.
- **Wine label** keeps the bottle, label and markers from the source at full 4K (not resized) in the top half, and draws the list in `cards/label_list.html` underneath, each item timed to its marker.
