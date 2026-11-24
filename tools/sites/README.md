# Vineyard site overlays (Google Earth clips)

`cards/site.js` draws a vineyard site over a settled Google Earth shot: the frame dims, the Einzellage parcels outline in
cream, the title and key come in, then the VDP.Große Lage parcels fill in gold. Each site has a page that sets
`window.SITE = { title, S, GL, at }` (settle time, Große Lage time, title position) and a `*_geo.js` with the parcels
in video pixels. `cards/koeppelberg.js` is the earlier, simpler single-outline version.

| Site | Page | Clip | Duration |
|---|---|---|---|
| Edelacker | `cards/edelacker.html` | `Edelacker.mp4` | 15 s |
| Steinmeister | `cards/steinmeister.html` | `Steinmaster.mp4` | 15 s |
| Köppelberg | `cards/koeppelberg.html` | `Koeppelburg.mp4` | 8 s (clip held on its last frame) |

Render the transparent overlay, then lay it over the clip:

```
ALPHA=1 DPR=1 VW=1920 VH=1080 node render.js cards/edelacker.html 15 overlay.mov
ffmpeg -i Edelacker.mp4 -i overlay.mov -filter_complex "[0:v][1:v]overlay=0:0:format=auto,format=yuv420p" -t 15 -c:v libx264 -crf 16 edelacker.mp4
```

## How the parcels were made

The scripts in `edelacker/` and `steinmeister/` are kept for reference; they expect the clip's last frame
(`last.png`) and the two screenshots next to them (paths inside the scripts).

1. `register.js` matches the outline screenshot (same imagery as the clip) to the clip's settled frame by
   correlating gradients: Edelacker scale 1.323, shift (-129, -276); Steinmeister scale 1.3185, shift (91, -271).
2. `extract.js` subtracts the frame from the warped screenshot, which leaves only the overlay; the black outlines
   enclose the parcels. Several threshold settings are combined. Steinmeister's tiny plots were traced by hand
   (`small_plots.js`) and three false matches removed.
3. `gl.js` traces the red Große Lage parcels from the vineyard map screenshot, placed by matching the map's
   vineyard blocks to the outlined parcels; `clip_gl.js` trims them to the Einzellage outline.
4. `build_geo.js` writes `cards/*_geo.js`.
