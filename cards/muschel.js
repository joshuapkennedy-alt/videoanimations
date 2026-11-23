// Muschelkalk explainer: a cross-section that goes from ancient sea -> shell limestone -> terraced vineyard -> wine.
// window.WIDE selects the 16:9 layout.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const NS = 'http://www.w3.org/2000/svg', lerp = (a, b, k) => a + (b - a) * k;
const T0 = 0.9, STEP = 3.0, ST = [0, 1, 2, 3].map(k => T0 + k * STEP);
window.STEP_STARTS = ST;
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const backOut = x => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

// ---- layout ----
const L = WIDE
  ? { scene: { x: 70, y: 140, w: 1000, h: 800 }, col: { cx: 1470, w: 720 }, head: 170, steps: 520, corner: { x: 70, y: 958, w: 1000 } }
  : { scene: { x: 40, y: 470, w: 1000, h: 800 }, col: { cx: 540, w: 1000 }, head: 150, steps: 1372, corner: { x: 40, y: 1288, w: 1000 } };

// ---- header ----
fadeIn(text(L.col.cx, L.head, L.col.w, 'THE SOIL BENEATH THE VINES', Object.assign({}, T.eyebrow, { font: `600 ${WIDE ? 26 : 30}px Inter`, letterSpacing: '7px' })), 0.15);
fadeIn(text(L.col.cx, L.head + 50, L.col.w, 'Muschelkalk', Object.assign({}, T.title, { font: `700 ${WIDE ? 108 : 112}px PF` })), 0.3);
fadeIn(text(L.col.cx, L.head + 180, L.col.w, 'German for “shell limestone”', Object.assign({}, T.sub, { font: `italic 400 ${WIDE ? 38 : 40}px PFI`, color: C.sub })), 0.45);

// ---- scene ----
const svg = document.createElementNS(NS, 'svg');
svg.setAttribute('viewBox', '0 0 1000 800'); svg.setAttribute('width', L.scene.w); svg.setAttribute('height', L.scene.h);
Object.assign(svg.style, { position: 'absolute', left: L.scene.x + 'px', top: L.scene.y + 'px', borderRadius: '18px', overflow: 'hidden' });
stage.appendChild(svg);
const el = (tag, attrs, parent = svg) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
const g = (attrs = {}, parent = svg) => el('g', attrs, parent);
svg.innerHTML = `<defs>
  <clipPath id="panel"><rect width="1000" height="800" rx="18"/></clipPath>
  <clipPath id="hill"><polygon id="hillpoly"/></clipPath>
  <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FB3C4"/><stop offset="1" stop-color="#5D8799"/></linearGradient>
  <radialGradient id="sunglow"><stop offset="0" stop-color="#F7E2AE" stop-opacity=".9"/><stop offset="1" stop-color="#F7E2AE" stop-opacity="0"/></radialGradient>
  <radialGradient id="warm"><stop offset="0" stop-color="#F2C46B" stop-opacity=".7"/><stop offset="1" stop-color="#F2C46B" stop-opacity="0"/></radialGradient>
</defs>`;
const root = g({ 'clip-path': 'url(#panel)' });
el('rect', { width: 1000, height: 800, fill: '#F7F0E2' }, root);                 // sky

// hill profile: flat-topped rock block that the river carves into terraces
const PROF = [[0, 300], [205, 300], [222, 362], [335, 362], [352, 424], [465, 424], [482, 486], [595, 486], [612, 548], [700, 560], [752, 688], [790, 716], [915, 716], [948, 684], [1000, 676]];
const hillpoly = svg.querySelector('#hillpoly');
const rock = g({ 'clip-path': 'url(#hill)' }, root);
// sandstone (older, below)
el('rect', { x: 0, y: 680, width: 1000, height: 120, fill: '#B26E50' }, rock);
for (let i = 0; i < 3; i++) el('line', { x1: 0, x2: 1000, y1: 708 + i * 30, y2: 708 + i * 30, stroke: '#9C5C42', 'stroke-width': 2, opacity: .7 }, rock);
// limestone bands grow up from the seabed in step 2
const BANDS = 8, BH = 380 / BANDS, bandEls = [];
for (let i = 0; i < BANDS; i++) {
  const y = 680 - (i + 1) * BH, b = g({}, rock);
  el('rect', { x: 0, y, width: 1000, height: BH + 0.5, fill: i % 2 ? '#E7DDC7' : '#DDD0B4' }, b);
  el('line', { x1: 0, x2: 1000, y1: y, y2: y, stroke: '#C4B392', 'stroke-width': 1.6 }, b);
  // fossils: little shells and sea-lily discs
  for (let j = 0; j < 7; j++) {
    const fx = 40 + rnd() * 920, fy = y + 10 + rnd() * (BH - 20), r = rnd();
    if (r < 0.6) el('path', { d: `M${fx - 9} ${fy + 5} Q${fx} ${fy - 12} ${fx + 9} ${fy + 5} Z M${fx} ${fy + 5} L${fx - 4} ${fy - 4} M${fx} ${fy + 5} L${fx} ${fy - 6} M${fx} ${fy + 5} L${fx + 4} ${fy - 4}`, fill: 'none', stroke: '#B3A07C', 'stroke-width': 1.6 }, b);
    else el('circle', { cx: fx, cy: fy, r: 4, fill: 'none', stroke: '#B3A07C', 'stroke-width': 1.6 }, b);
  }
  bandEls.push(b);
}
// seabed line + sea
const sea = el('rect', { x: 0, y: 120, width: 1000, height: 560, fill: 'url(#sea)' }, root);
const surf = el('path', { fill: 'none', stroke: '#E9F1F3', 'stroke-width': 3, 'stroke-linecap': 'round' }, root);
const seabedShells = g({}, root);
// sea lilies (crinoids) swaying on the seabed
const lilies = [120, 330, 560, 780, 905].map((x, i) => {
  const s = g({}, root), h = 70 + (i % 3) * 22;
  const stalk = el('path', { fill: 'none', stroke: '#C7A6A0', 'stroke-width': 4, 'stroke-linecap': 'round' }, s);
  const crown = g({}, s);
  for (let a = -2; a <= 2; a++) el('path', { d: `M0 0 Q${a * 8} -22 ${a * 14} -34`, fill: 'none', stroke: '#C7A6A0', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, crown);
  return { s, stalk, crown, x, h, ph: i * 1.3 };
});
// drifting shells
const shells = Array.from({ length: 18 }, (_, i) => {
  const x = 50 + rnd() * 900, d0 = rnd() * 1.6, sp = 1.4 + rnd() * 0.8, rot = rnd() * 360;
  const sh = el('path', { d: 'M-11 6 Q0 -14 11 6 Z M0 6 L-5 -5 M0 6 L0 -8 M0 6 L5 -5', fill: '#F3ECDD', stroke: '#9F8E70', 'stroke-width': 1.8, 'stroke-linejoin': 'round' }, seabedShells);
  return { sh, x, d0, sp, rot };
});

// river, vines, sun, rays, water trickle (step 3)
const river = el('path', { d: 'M790 716 L915 716 L948 684 L752 688 Z', fill: '#7FA6B8' }, root);
const vines = [[100, 300], [282, 362], [400, 424], [530, 486], [160, 300], [650, 553]].map(([x, y]) => {
  const v = g({}, root);
  el('line', { x1: x, y1: y, x2: x, y2: y - 34, stroke: '#5A4632', 'stroke-width': 4 }, v);
  [[-10, -40, 12], [10, -40, 12], [0, -52, 13]].forEach(([dx, dy, r]) => el('circle', { cx: x + dx, cy: y + dy, r, fill: '#6F7A45', stroke: '#3B3A26', 'stroke-width': 2 }, v));
  [[3, -28], [8, -28], [5.5, -23]].forEach(([dx, dy]) => el('circle', { cx: x + dx, cy: y + dy, r: 3.2, fill: '#C9C46A' }, v));
  return { v, x, y };
});
const sun = g({}, root);
el('circle', { cx: 0, cy: 0, r: 110, fill: 'url(#sunglow)' }, sun);
el('circle', { cx: 0, cy: 0, r: 46, fill: '#E7BC62', stroke: '#281D16', 'stroke-width': 3 }, sun);
const rays = [[282, 362], [400, 424], [530, 486], [140, 300]].map(([x, y]) => {
  const r = el('line', { x1: 860, y1: 120, x2: x, y2: y - 4, stroke: '#D9A458', 'stroke-width': 3, 'stroke-dasharray': '10 10', 'stroke-linecap': 'round' }, root);
  const w = el('ellipse', { cx: x, cy: y + 10, rx: 70, ry: 26, fill: 'url(#warm)' }, root);
  return { r, w, L: Math.hypot(860 - x, 120 - y) };
});
const drips = [[262, 362], [380, 424], [508, 486], [120, 300]].map(([x, y]) => {
  const p = el('path', { d: `M${x} ${y + 4} q10 60 -4 120 q-12 60 6 ${676 - y - 184}`, fill: 'none', stroke: '#5F8BA8', 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-dasharray': '4 14' }, root);
  return p;
});
// tags in the scene
function tag(x, y, title, sub) {
  const t = g({}, root);
  const w = Math.max(title.length * 21, sub.length * 12.5) + 40;
  el('rect', { x, y, width: w, height: 74, rx: 10, fill: '#FBF7EF', stroke: '#CDBFA4', 'stroke-width': 2 }, t);
  const a = el('text', { x: x + 20, y: y + 34, 'font-family': 'PF', 'font-weight': 700, 'font-size': 30, fill: '#281D16' }, t); a.textContent = title;
  const b = el('text', { x: x + 20, y: y + 60, 'font-family': 'Inter', 'font-size': 19, fill: '#685D4A' }, t); b.textContent = sub;
  return t;
}
const tagM = tag(34, 560, 'Muschelkalk', 'shell limestone · ~240 million years');
const tagB = tag(34, 702, 'Buntsandstein', 'red sandstone · older, below');
// glass (step 4)
const glass = g({}, root);
el('path', { d: 'M-46 -96 L46 -96 Q52 -20 0 6 Q-52 -20 -46 -96 Z', fill: '#FBF7EF', stroke: '#281D16', 'stroke-width': 3.5 }, glass);
el('path', { d: 'M-43 -60 L43 -60 Q44 -18 0 2 Q-44 -18 -43 -60 Z', fill: '#E9DB98' }, glass);
el('path', { d: 'M0 6 V70 M-34 72 H34', stroke: '#281D16', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, glass);

// ---- step captions ----
const capW = L.col.w;
const dots = div({ left: (L.col.cx - 90) + 'px', top: L.steps + 'px', width: '180px', height: '18px', display: 'flex', justifyContent: 'space-between' });
const dotEls = [0, 1, 2, 3].map(() => div({ position: 'static', width: '18px', height: '18px', borderRadius: '50%', background: '#D8CBB3' }, '', dots));
const CAPS = [
  ['An ancient sea', 'Formed 240 million years ago on the floor of a warm, shallow sea'],
  ['Made of shells', 'Countless shells and sea lilies, pressed into stone'],
  ['Warm and well drained', "Pale, stony ground soaks up the sun's warmth, and water drains away fast"],
  ['In the glass', 'Fresh acidity, finesse and a mineral edge'],
];
const caps = CAPS.map(([h, s], k) => {
  const box = div({ left: (L.col.cx - capW / 2) + 'px', top: (L.steps + 52) + 'px', width: capW + 'px', textAlign: 'center' });
  div({ position: 'static', font: `700 ${WIDE ? 64 : 66}px PF`, color: C.ink, lineHeight: '1.1' }, h, box);
  div({ position: 'static', font: `400 ${WIDE ? 32 : 34}px Inter`, color: C.sub, lineHeight: '1.4', marginTop: '18px', padding: '0 20px' }, s, box);
  return box;
});
const chipRow = div({ left: (L.col.cx - capW / 2) + 'px', top: (L.steps + (WIDE ? 310 : 300)) + 'px', width: capW + 'px', display: 'flex', justifyContent: 'center', gap: '18px', flexWrap: 'wrap' });
const chips = ['fresh acidity', 'finesse', 'mineral edge'].map(c => div({ position: 'static', font: `600 ${WIDE ? 28 : 30}px Inter`, color: '#4E5430', background: '#E3E6CC', border: '2px solid #B9C08C', borderRadius: '40px', padding: '10px 26px' }, c, chipRow));

// corner note about sandstone
const corner = div({ left: L.corner.x + 'px', top: L.corner.y + 'px', width: L.corner.w + 'px', textAlign: 'right', font: `400 ${WIDE ? 24 : 26}px Inter`, color: '#6E6250' },
  '<span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:#B26E50;margin-right:10px;vertical-align:-1px"></span>Also in Saale-Unstrut: <b style="font-weight:600;color:#3A2E22">Buntsandstein</b>, red sandstone on the lower slopes');

// ---- timeline ----
anims.push(t => {
  const sceneIn = eout(seg(t, 0.2, 0.8)); svg.style.opacity = sceneIn;
  // step 1: the sea, falling shells, swaying sea lilies
  const fill = ease(seg(t, ST[1] + 0.1, ST[1] + 2.3));                 // limestone build-up 0..1
  const top = 680 - 380 * fill;                                        // current rock top
  const seaTop = lerp(120, top, ease(seg(t, ST[1] + 0.6, ST[1] + 2.6)));
  const seaA = 1 - seg(t, ST[1] + 2.0, ST[1] + 2.7);
  sea.setAttribute('y', seaTop); sea.setAttribute('height', Math.max(0, top - seaTop + 2)); sea.style.opacity = seaA;
  let d = ''; for (let x = 0; x <= 1000; x += 20) d += (x ? 'L' : 'M') + x + ' ' + (seaTop + 4 * Math.sin(x / 45 + t * 2.4)).toFixed(1);
  surf.setAttribute('d', d); surf.style.opacity = seaA;
  bandEls.forEach((b, i) => { const k = seg(t, ST[1] + 0.1 + i * 0.26, ST[1] + 0.5 + i * 0.26); b.style.opacity = k; });
  shells.forEach(s => {
    const p = seg(t, 0.6 + s.d0, 0.6 + s.d0 + s.sp), y = lerp(110, 668 - (s.x % 9), eout(p));
    const bury = top < 668 - 8 ? 0 : 1;
    s.sh.setAttribute('transform', `translate(${s.x + Math.sin(t * 2 + s.rot) * 10 * (1 - p)} ${y}) rotate(${s.rot + 120 * (1 - p)})`);
    s.sh.style.opacity = (p > 0 ? 1 : 0) * bury;
  });
  lilies.forEach(l => {
    const sw = Math.sin(t * 1.6 + l.ph) * 10, base = 680, k = eout(seg(t, 0.5, 1.2)) * (1 - seg(t, ST[1] + 0.2, ST[1] + 0.9));
    l.stalk.setAttribute('d', `M${l.x} ${base} Q${l.x + sw * 0.5} ${base - l.h / 2} ${l.x + sw} ${base - l.h}`);
    l.crown.setAttribute('transform', `translate(${l.x + sw} ${base - l.h}) rotate(${sw * 1.5})`);
    l.s.style.opacity = k;
  });
  // step 3: the river carves terraces, vines grow, sun warms, water drains
  const carve = ease(seg(t, ST[2] + 0.1, ST[2] + 1.2));
  const pts = PROF.map(([x, y]) => [x, lerp(Math.min(y, 300) === 300 && fill >= 0 ? 300 : 300, y, carve)]);
  const rockTop = Math.min(680, top);
  hillpoly.setAttribute('points', [...pts.map(([x, y]) => `${x},${Math.max(y, rockTop)}`), '1000,800', '0,800'].join(' '));
  river.style.opacity = seg(t, ST[2] + 0.8, ST[2] + 1.3);
  vines.forEach((v, i) => { const k = seg(t, ST[2] + 1.0 + i * 0.08, ST[2] + 1.4 + i * 0.08); v.v.setAttribute('transform', `translate(${v.x} ${v.y}) scale(${k > 0 ? backOut(k) : 0}) translate(${-v.x} ${-v.y})`); });
  const su = ease(seg(t, ST[2] + 0.9, ST[2] + 1.6)); sun.setAttribute('transform', `translate(860 ${lerp(-80, 120, su)})`);
  rays.forEach((r, i) => {
    const k = seg(t, ST[2] + 1.5 + i * 0.1, ST[2] + 2.1 + i * 0.1);
    r.r.style.opacity = k; r.r.setAttribute('stroke-dashoffset', -t * 40);
    r.w.style.opacity = seg(t, ST[2] + 1.9 + i * 0.1, ST[2] + 2.4 + i * 0.1) * (0.75 + 0.25 * Math.sin(t * 3 + i));
  });
  drips.forEach((p, i) => { p.style.opacity = seg(t, ST[2] + 1.7 + i * 0.1, ST[2] + 2.1 + i * 0.1); p.setAttribute('stroke-dashoffset', -t * 60); });
  tagM.style.opacity = eout(seg(t, ST[1] + 2.0, ST[1] + 2.5));
  tagB.style.opacity = eout(seg(t, ST[2] + 1.2, ST[2] + 1.7));
  corner.style.opacity = eout(seg(t, ST[2] + 1.5, ST[2] + 2.0));
  // step 4: the glass
  const gl = seg(t, ST[3] + 0.1, ST[3] + 0.6);
  glass.setAttribute('transform', `translate(330 ${lerp(140, 128, gl)}) scale(${gl > 0 ? 0.8 + 0.2 * backOut(gl) : 0})`);
  glass.style.opacity = gl;
  // captions: one at a time, progress dots fill
  caps.forEach((c, k) => {
    const a = ST[k], inn = eout(seg(t, a + 0.15, a + 0.6)), out = k < 3 ? seg(t, ST[k + 1] - 0.05, ST[k + 1] + 0.25) : 0;
    c.style.opacity = inn * (1 - out); c.style.translate = `0 ${14 * (1 - inn) - 14 * out}px`;
    dotEls[k].style.background = t >= a + 0.15 ? '#B8925A' : '#D8CBB3';
    dotEls[k].style.transform = `scale(${1 + 0.35 * Math.max(0, 1 - Math.abs(t - a - 0.3) * 3)})`;
  });
  dots.style.opacity = eout(seg(t, 0.6, 1.0));
  chips.forEach((c, i) => { const k = eout(seg(t, ST[3] + 0.8 + i * 0.3, ST[3] + 1.2 + i * 0.3)); c.style.opacity = k; c.style.translate = `0 ${10 * (1 - k)}px`; });
});
render(0);
