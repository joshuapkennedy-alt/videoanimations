// Writes src/cards/b51_geo.js: rivers (OpenStreetMap: Saale, Unstrut, Ilm, Salza), the Süßer See, towns, the 13 Breitengrad 51 sites
// and the 3 VDP estates, all as [lat, lon]. Rivers are cut to the main map and the Süßer See inset, then thinned.
const fs = require('fs');
const o = JSON.parse(fs.readFileSync('dl_osm/osm.json')), sites = JSON.parse(fs.readFileSync('b51/sites.json'));
const MAIN = { s: 50.955, n: 51.300, w: 11.545, e: 12.010 }, INSET = { s: 51.455, n: 51.555, w: 11.440, e: 11.800 };
const inBox = (b, [la, lo]) => la >= b.s && la <= b.n && lo >= b.w && lo <= b.e;
const rdp = (P, e) => { if (P.length < 3) return P; let dm = 0, im = 0; const [a, b] = [P[0], P[P.length - 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-9;
  for (let i = 1; i < P.length - 1; i++) { const d = Math.abs((b[1] - a[1]) * (a[0] - P[i][0]) - (a[1] - P[i][1]) * (b[0] - a[0])) / L; if (d > dm) { dm = d; im = i; } }
  return dm > e ? [...rdp(P.slice(0, im + 1), e).slice(0, -1), ...rdp(P.slice(im), e)] : [a, b]; };
const rivers = [];
o.elements.filter(e => e.type === 'way' && e.tags.waterway === 'river').forEach(w => {
  const pts = w.geometry.map(p => [p.lat, p.lon]);
  for (const [box, where] of [[MAIN, 'main'], [INSET, 'inset']]) {   // keep runs of points inside each box
    let run = []; const flush = () => { if (run.length > 1) rivers.push({ name: w.tags.name, where, pts: rdp(run, 0.00015).map(p => p.map(v => +v.toFixed(5))) }); run = []; };
    pts.forEach(p => inBox(box, p) ? run.push(p) : flush()); flush();
  }
});
const ring = o.elements.find(e => e.tags && e.tags.name && e.tags.name.includes('Süßer')).geometry.map(p => [p.lat, p.lon]), h = ring.length >> 1;   // closed: thin each half
const lake = [...rdp(ring.slice(0, h + 1), 0.00008).slice(0, -1), ...rdp(ring.slice(h), 0.00008)].map(p => p.map(v => +v.toFixed(5)));
const node = n => { const e = o.elements.find(x => x.type === 'node' && x.tags.name === n && (n !== 'Gleina' || x.lat > 51.1) && (n !== 'Roßbach' || x.lat < 51.2)); return [+e.lat.toFixed(4), +e.lon.toFixed(4)]; };
const towns = [
  ['Freyburg', [51.2128, 11.7697], 1], ['Naumburg', [51.1527, 11.8098], 1], ['Weißenfels', node('Weißenfels'), 1], ['Bad Kösen', node('Bad Kösen'), 1],
  ['Laucha', node('Laucha an der Unstrut'), 1], ['Bad Sulza', node('Bad Sulza'), 1], ['Gleina', node('Gleina'), 0], ['Goseck', node('Goseck'), 0],
  ['Eisleben', node('Lutherstadt Eisleben'), 1, 'inset'], ['Höhnstedt', node('Höhnstedt'), 0, 'inset'],
].map(([name, at, big, where]) => ({ name, at, big: !!big, where: where || 'main' }));
const vdp = [
  { name: 'Böhme &amp; Töchter', place: 'Gleina', at: node('Gleina') },
  { name: 'Pawis', place: 'Zscheiplitz', at: node('Zscheiplitz') },
  { name: 'Hey', place: 'Naumburg-Weinberge', at: node('Weinberge') },
];
const out = { MAIN, INSET, rivers, lake, towns, sites: Object.entries(sites).map(([n, s]) => ({ n: +n, name: s.name, at: s.at, where: s.group ? 'inset' : 'main' })), vdp };
fs.writeFileSync('src/cards/b51_geo.js', '// Generated: OpenStreetMap rivers, lake and towns (via Overpass); Breitengrad 51 sites placed from their map; VDP estates at their villages. [lat, lon]\r\nwindow.B51 = ' + JSON.stringify(out) + ';\r\n');
console.log('river pieces', rivers.length, 'points', rivers.reduce((s, r) => s + r.pts.length, 0), '| lake pts', lake.length, '| size', fs.statSync('src/cards/b51_geo.js').size);
console.log(towns.map(t => t.name + ' ' + t.at).join(' | ')); console.log(vdp.map(v => v.place + ' ' + v.at).join(' | '));
