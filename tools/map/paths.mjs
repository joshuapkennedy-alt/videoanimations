// usage: node paths.mjs fit.json ../../cards/paths.js
// country paths for north-west Europe in the raster map's pixel space (equirectangular, fitted scale/offset)
import fs from 'fs';
import * as d3 from 'd3-geo';
import { feature } from 'topojson-client';
const fit = JSON.parse(fs.readFileSync(process.argv[2])).equirect;
const [sx, sy] = fit.s, [tx, ty] = fit.t, K = 1000 * Math.PI / 180;
const P = (lon, lat) => [sx * K * lon + tx, -sy * K * lat + ty];
const proj = d3.geoTransform({ point(x, y) { const [a, b] = P(x, y); this.stream.point(a, b); } });
const path = d3.geoPath(proj);
const topo = JSON.parse(fs.readFileSync(new URL('./node_modules/world-atlas/countries-10m.json', import.meta.url)));
const all = feature(topo, topo.objects.countries).features;
const box = { w: -12, e: 26, s: 42, n: 62 };
const near = all.filter(f => { const [[w, s], [e, n]] = d3.geoBounds(f); return e > box.w && w < box.e && n > box.s && s < box.n; });
const round = d => d.replace(/(\d+\.\d{1})\d+/g, '$1');
const skip = new Set(['Greenland', 'Maldives']);
const out = { countries: near.filter(f => f.id !== '276' && !skip.has(f.properties.name)).map(f => ({ id: f.id, name: f.properties.name, d: round(path(f)) })),
  germany: round(path(all.find(f => f.id === '276'))),
  cities: { Freyburg: P(11.7697, 51.2128), London: P(-0.1278, 51.5074) },
  lat51: [P(-12, 51), P(26, 51)], perDegLon: sx * K, perDegLat: sy * K };
fs.writeFileSync(process.argv[3], 'window.GEO = ' + JSON.stringify(out) + ';\n');
console.log(out.countries.map(c => c.name).join(', '));
console.log('Freyburg', out.cities.Freyburg, 'London', out.cities.London, '51N y', out.lat51[0][1], 'px/deg lon', out.perDegLon, 'lat', out.perDegLat);
