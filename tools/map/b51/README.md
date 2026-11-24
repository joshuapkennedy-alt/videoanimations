# Saale-Unstrut close-up map (Breitengrad 51 sites, VDP estates)

`cards/b51map.js` draws both maps (`window.MODE = 'sites' | 'vdp'`) from `cards/b51_geo.js`.

- Rivers, the Süßer See and town positions: OpenStreetMap, fetched with the Overpass query in `osm_query.txt`
  (Freyburg and Naumburg use their town-centre coordinates). Not kept here.
- The 13 Breitengrad 51 sites: read off the group's own location map and placed by `fit_sites.js` — an affine fit on
  12 towns (residuals 0.3–2.5 km) plus an inverse-distance correction from those towns' residuals; the Süßer See
  inset uses Eisleben, Höhnstedt and the lake's two ends. Their unnamed site 05 is left out and the rest renumbered by area.
- The VDP estates: at their villages (Gleina, Zscheiplitz, Weinberge), as on the VDP's own map.
- `build_geo.js` cuts the rivers to the main map and the inset, thins them, and writes `cards/b51_geo.js`.
