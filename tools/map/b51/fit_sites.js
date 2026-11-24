// Refines the site positions: main map = affine fit on 12 towns + inverse-distance correction from the towns' residuals
// (so each site moves with the towns around it); Süßer See inset = affine fit on Eisleben, Höhnstedt and the lake's two ends.
const fs = require('fs');
const o = JSON.parse(fs.readFileSync('dl_osm/osm.json')), lake = o.elements.find(e => e.tags && e.tags.name && e.tags.name.includes('Süßer')).geometry;
const W = lake.reduce((a, p) => p.lon < a.lon ? p : a), E = lake.reduce((a, p) => p.lon > a.lon ? p : a);
const towns = {
  Freyburg: [[547.7, 410.3], [51.2128, 11.7697]], Naumburg: [[583.4, 489.1], [51.1527, 11.8098]], 'Weißenfels': [[760, 418], [51.2000, 11.9668]],
  'Bad Kösen': [[483.7, 560.9], [51.1336, 11.7221]], Laucha: [[423.7, 389.1], [51.2233, 11.6822]], 'Bad Sulza': [[382, 631], [51.0879, 11.6234]],
  Jena: [[380, 873], [50.9282, 11.5879]], Kirchscheidungen: [[418.6, 355.1], [51.2452, 11.6579]], Gleina: [[495.7, 347.7], [51.2602, 11.7202]],
  'Roßbach': [[546, 488.6], [51.1707, 11.7769]], Kaatschen: [[445.75, 613.75], [51.0966, 11.6842]], 'Löberschütz': [[439, 841], [50.9657, 11.6998]],
};
const inset = { Eisleben: [[515, 207.5], [51.5283, 11.5466]], 'Höhnstedt': [[699.25, 240], [51.5019, 11.7357]], lakeW: [[597.5, 229.5], [W.lat, W.lon]], lakeE: [[663.75, 258.75], [E.lat, E.lon]] };
const sites = {
  1: ['Freyburger Schweigenberg', [524.3, 406.3]], 2: ['Freyburger Edelacker', [558.6, 422.9]], 3: ['Dorndorfer Rappental', [455.7, 354.3]],
  4: ['Burgscheidunger Veitsgrube', [422.3, 334.9]], 5: ['Naumburger Sonneck', [584.3, 472.3]], 6: ['Gosecker Dechantenberg', [641.4, 452.6]],
  7: ['Naumburger Steinmeister', [524.3, 502.9]], 8: ['Saalhäuser', [498.6, 519.4]], 9: ['Pfortenser Köppelberg', [504.3, 530.3]],
  10: ['Kaatschener Dachsberg', [445.75, 610]], 11: ['Tultewitzer Bünauer Berg', [468.75, 620]],
  12: ['Höhnstedter Kreisberg', [687.5, 250], 'inset'], 13: ['Seeburger Himmelshöhe', [578.75, 209.5], 'inset'],
};
function affine(ctrl) {
  const T = Object.values(ctrl), lsq = ys => { const A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], B = [0, 0, 0];
    T.forEach(([[x, y]], i) => { const r = [x, y, 1]; for (let j = 0; j < 3; j++) { B[j] += r[j] * ys[i]; for (let k = 0; k < 3; k++) A[j][k] += r[j] * r[k]; } });
    const M = A.map((r, i) => [...r, B[i]]); for (let i = 0; i < 3; i++) { const p = M[i][i]; for (let j = i; j < 4; j++) M[i][j] /= p; for (let k = 0; k < 3; k++) if (k !== i) { const f = M[k][i]; for (let j = i; j < 4; j++) M[k][j] -= f * M[i][j]; } }
    return M.map(r => r[3]); };
  const la = lsq(T.map(t => t[1][0])), lo = lsq(T.map(t => t[1][1]));
  return ([x, y]) => [la[0] * x + la[1] * y + la[2], lo[0] * x + lo[1] * y + lo[2]];
}
const km = ([a, b], [c, d]) => Math.hypot((a - c) * 111.2, (b - d) * 111.2 * 0.627);
const fm = affine(towns), fi = affine(inset);
const res = Object.values(towns).map(([p, g]) => { const f = fm(p); return { p, d: [g[0] - f[0], g[1] - f[1]] }; });
const corrected = p => { const f = fm(p); let w = 0, dl = 0, dn = 0;
  res.forEach(r => { const dd = Math.hypot(r.p[0] - p[0], r.p[1] - p[1]) + 1e-6, k = 1 / (dd * dd); w += k; dl += k * r.d[0]; dn += k * r.d[1]; });
  return [f[0] + dl / w, f[1] + dn / w]; };
console.log('inset residuals (km):', Object.entries(inset).map(([n, [p, g]]) => n + ' ' + km(fi(p), g).toFixed(2)).join(', '));
const out = {};
Object.entries(sites).forEach(([n, [name, p, which]]) => { const g = which ? fi(p) : corrected(p); out[n] = { name, at: g.map(v => +v.toFixed(4)), group: which ? 'see' : null }; });
Object.entries(out).forEach(([n, s]) => console.log(n.padStart(3), s.name.padEnd(28), s.at.join(', ')));
fs.writeFileSync('b51/sites.json', JSON.stringify(out, null, 1));
