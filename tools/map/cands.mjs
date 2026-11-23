// project Germany's outline with several candidate projections (unit scale) so they can be fitted to the raster map
import fs from 'fs';
import * as d3 from 'd3-geo';
import { feature } from 'topojson-client';
const topo = JSON.parse(fs.readFileSync(new URL('./node_modules/world-atlas/countries-10m.json', import.meta.url)));
const de = feature(topo, topo.objects.countries).features.find(f => f.id === '276');
const P = {
  mercator: d3.geoMercator(),
  equirect: d3.geoEquirectangular(),
  equirect_cos51: d3.geoEquirectangular(), // handled by x-scale freedom in the fit
  conic_48_54: d3.geoConicConformal().parallels([48, 54]).rotate([-10.5, 0]),
  albers_48_54: d3.geoConicEqualArea().parallels([48, 54]).rotate([-10.5, 0]),
  tmerc: d3.geoTransverseMercator().rotate([-10.5, 0]),
  azeq: d3.geoAzimuthalEqualArea().rotate([-10.5, -51.2]),
  naturalEarth: d3.geoNaturalEarth1(),
  equalEarth: d3.geoEqualEarth(),
};
const out = {};
for (const [k, p] of Object.entries(P)) {
  p.scale(1000).translate([0, 0]);
  const pts = [];
  const polys = de.geometry.type === 'Polygon' ? [de.geometry.coordinates] : de.geometry.coordinates;
  for (const poly of polys) for (const ring of poly) for (const c of ring) { const q = p(c); if (q) pts.push(q); }
  out[k] = pts;
}
fs.writeFileSync(process.argv[2], JSON.stringify(out));
console.log(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.length])));
