// Builds cards/gdrmap_geo.js: the 1949-1990 inner-German border, the GDR area and West Berlin, in the map image's pixel space
// (same fitted equirectangular projection as paths.js). Sources (not kept in the repo):
//   states:  isellsoap/deutschlandGeoJSON 2_bundeslaender/3_mittel.geo.json   (today's state borders)
//   rivers:  Natural Earth ne_10m_rivers_lake_centerlines.geojson               (the Elbe)
//   berlin:  Technologiestiftung Berlin lor_ortsteile.geojson                   (Berlin localities)
// Today's east/west state line is the 1949-1990 border except at Amt Neuhaus (GDR until 1993, now Lower Saxony):
// there the border followed the Elbe, from Lauenburg to Dömitz, so that stretch is replaced by the river.
// West Berlin = the localities of the twelve former western boroughs.
// usage: node gdrmap_build.js states.geo.json rivers.geojson ortsteile.geojson fit.json out.js
const fs = require('fs');
const [sf, rf, bf, fitf, out] = process.argv.slice(2);
const fit = JSON.parse(fs.readFileSync(fitf)).equirect, [sx, sy] = fit.s, [tx, ty] = fit.t, K = 1000 * Math.PI / 180;
const P = ([lon, lat]) => [sx * K * lon + tx, -sy * K * lat + ty];
const pd = (pts, min = 0) => { let last = null; const q = pts.map(P).filter((p, i, a) => { if (i && i < a.length - 1 && last && Math.hypot(p[0] - last[0], p[1] - last[1]) < min) return false; last = p; return true; });
  return 'M' + q.map(p => p.map(v => v.toFixed(1)).join(',')).join('L'); };   // min: drop points closer than this (map px)
const states = JSON.parse(fs.readFileSync(sf));
const EAST = ['DE-MV', 'DE-BB', 'DE-BE', 'DE-ST', 'DE-TH', 'DE-SN'], WEST = new Set(['DE-SH', 'DE-NI', 'DE-HE', 'DE-BY']);
const rings = g => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates).map(p => p[0]);

// ---- today's east/west line (points of eastern states within ~300 m of a western state's edge), north to south ----
const grid = new Map(), C = 0.05, gk = (x, y) => Math.floor(x / C) + ',' + Math.floor(y / C);
states.features.filter(f => WEST.has(f.properties.id)).forEach(f => rings(f.geometry).forEach(r => { for (let i = 0; i + 1 < r.length; i++) {
  const [a, b] = [r[i], r[i + 1]]; for (const [x, y] of [a, b]) { const k = gk(x, y); if (!grid.has(k)) grid.set(k, []); grid.get(k).push([a, b]); } } }));
function dist(p, [a, b]) { const cs = Math.cos(p[1] * Math.PI / 180), ax = a[0] * cs, bx = b[0] * cs, px = p[0] * cs;
  const dx = bx - ax, dy = b[1] - a[1], L = dx * dx + dy * dy, t = L ? Math.max(0, Math.min(1, ((px - ax) * dx + (p[1] - a[1]) * dy) / L)) : 0;
  return Math.hypot(px - ax - t * dx, p[1] - a[1] - t * dy); }
const onWest = p => { const cx = Math.floor(p[0] / C), cy = Math.floor(p[1] / C);
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (const s of grid.get((cx + i) + ',' + (cy + j)) || []) if (dist(p, s) < 0.003) return true; return false; };
let runs = [];
states.features.filter(f => EAST.includes(f.properties.id) && f.properties.id !== 'DE-BE').forEach(f => rings(f.geometry).forEach(r => {
  const ring = r.slice(0, -1), on = ring.map(onWest), n = ring.length; const s = on.findIndex(v => !v); if (s < 0 || !on.some(Boolean)) return;
  let cur = null; for (let k = 1; k <= n; k++) { const i = (s + k) % n; if (on[i]) (cur = cur || []).push(ring[i]); else if (cur) { runs.push(cur); cur = null; } }
  if (cur) runs.push(cur); }));
const len = r => r.reduce((s, p, i) => i ? s + Math.hypot(p[0] - r[i - 1][0], p[1] - r[i - 1][1]) : 0, 0);
runs = runs.filter(r => r.length >= 2 && len(r) > 0.02);
runs.forEach(r => { if (r[0][1] < r[r.length - 1][1]) r.reverse(); });
runs.sort((a, b) => b[0][1] - a[0][1]);
const today = runs.shift().slice();
while (runs.length) { const e = today[today.length - 1]; let bi = 0, bd = 1e9, rev = false;
  runs.forEach((r, i) => { const d0 = Math.hypot(r[0][0] - e[0], r[0][1] - e[1]), d1 = Math.hypot(r[r.length - 1][0] - e[0], r[r.length - 1][1] - e[1]);
    if (d0 < bd) { bd = d0; bi = i; rev = false; } if (d1 < bd) { bd = d1; bi = i; rev = true; } });
  const r = runs.splice(bi, 1)[0]; if (bd > 0.15) throw new Error('gap ' + bd); today.push(...(rev ? r.reverse() : r)); }

// ---- Amt Neuhaus: swap today's line for the Elbe between Lauenburg and Dömitz ----
const near = (pts, q) => pts.reduce((b, p, i) => { const d = Math.hypot(p[0] - q[0], p[1] - q[1]); return d < b.d ? { i, d } : b; }, { i: -1, d: 1e9 });
const A = [10.585, 53.375], B = [11.245, 53.140];   // Lauenburg / Boizenburg reach, Dömitz
const iA = near(today, A), iB = near(today, B);
const elbe = JSON.parse(fs.readFileSync(rf)).features.find(f => f.properties.name === 'Elbe').geometry;
const eLines = elbe.type === 'MultiLineString' ? elbe.coordinates : [elbe.coordinates];
const eLine = eLines.map(l => ({ l, a: near(l, today[iA.i]), b: near(l, today[iB.i]) })).sort((x, y) => (x.a.d + x.b.d) - (y.a.d + y.b.d))[0];
let river = eLine.l.slice(Math.min(eLine.a.i, eLine.b.i), Math.max(eLine.a.i, eLine.b.i) + 1);
if (eLine.a.i > eLine.b.i) river.reverse();
console.log(`today's line ${today.length} pts; Amt Neuhaus stretch: points ${iA.i}-${iB.i} (snap ${iA.d.toFixed(3)}, ${iB.d.toFixed(3)} deg) -> Elbe ${river.length} pts (snap ${eLine.a.d.toFixed(3)}, ${eLine.b.d.toFixed(3)} deg)`);
const bulge = today.slice(iA.i, iB.i + 1);
const border = [...today.slice(0, iA.i), ...river, ...today.slice(iB.i + 1)];
const neuhaus = [...bulge, ...river.slice().reverse()];   // area between today's line and the Elbe: GDR then, Lower Saxony now

// ---- West Berlin ----
const WB = new Set(['Charlottenburg-Wilmersdorf', 'Spandau', 'Steglitz-Zehlendorf', 'Tempelhof-Schöneberg', 'Neukölln', 'Reinickendorf']);
const WO = new Set(['Moabit', 'Hansaviertel', 'Tiergarten', 'Wedding', 'Gesundbrunnen', 'Kreuzberg']);
const ber = JSON.parse(fs.readFileSync(bf)).features.filter(f => WB.has(f.properties.BEZIRK) || WO.has(f.properties.OTEIL));
console.log('West Berlin localities', ber.length);
const westBerlin = ber.map(f => rings(f.geometry).map(r => pd(r, 0.8) + 'Z').join('')).join('');
const east = states.features.filter(f => EAST.includes(f.properties.id)).map(f => rings(f.geometry).map(r => pd(r) + 'Z').join('')).join('') + pd(neuhaus) + 'Z';
const wbc = ber.flatMap(f => rings(f.geometry).flat()); const wbx = wbc.reduce((s, p) => s + p[0], 0) / wbc.length, wby = wbc.reduce((s, p) => s + p[1], 0) / wbc.length;
fs.writeFileSync(out, '// Generated by tools/map/gdrmap_build.js (sources listed there), map image pixel space\r\nwindow.GDRMAP = ' +
  JSON.stringify({ border: pd(border), east, westBerlin, westBerlinAt: P([wbx, wby]) }) + ';\r\n');
