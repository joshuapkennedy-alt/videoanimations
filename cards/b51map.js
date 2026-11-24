// Saale-Unstrut close-up map in our style (rivers from OpenStreetMap, the 51°N parallel, a Süßer See inset), two versions:
//   window.MODE = 'sites': Breitengrad 51's 13 vineyard sites, numbered and listed by area (16 s)
//   window.MODE = 'vdp':   the three VDP family estates, Böhme & Töchter, Pawis and Hey, as pins (10 s)
// Geometry in b51_geo.js ([lat, lon]); projected here onto a local equirectangular grid. window.WIDE selects 16:9.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920, MODE = window.MODE || 'sites';
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const NS = 'http://www.w3.org/2000/svg', G = window.B51, BURG = '#6B2737', OLIVE = '#7E8F26', RIVER = '#86AECB', RLAB = '#3F6B8A';
const END = MODE === 'sites' ? 16.0 : 10.0, OUT = END - 0.4;
const all = div({ left: 0, top: 0, width: SW + 'px', height: SH + 'px' });
const COS = Math.cos(51.15 * Math.PI / 180);

// ---- projections: main map and inset ----
const M = G.MAIN, I = G.INSET;
const box = WIDE ? { x: 120, y: 214, h: 836 } : { x: 0, y: 440, h: 712 };
const sMain = box.h / (M.n - M.s), mapW = (M.e - M.w) * COS * sMain;
if (!WIDE) box.x = 480 - mapW / 2;   // 9:16: centred on x 480 (the map's right edge stays 120+ px clear)
const P = ([la, lo]) => [box.x + (lo - M.w) * COS * sMain, box.y + (M.n - la) * sMain];
const ib = WIDE ? { w: 300 } : { w: 228 }; ib.h = ib.w * (I.n - I.s) / ((I.e - I.w) * COS); ib.x = box.x + mapW - ib.w; ib.y = box.y;
const sIn = ib.h / (I.n - I.s), PI_ = ([la, lo]) => [ib.x + (lo - I.w) * COS * sIn, ib.y + (I.n - la) * sIn];

const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('width', SW); svg.setAttribute('height', SH); svg.style.position = 'absolute'; all.appendChild(svg);
const el = (tag, attrs, parent = svg) => { const e = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); parent.appendChild(e); return e; };
const line = (pts, f) => 'M' + pts.map(p => f(p).map(v => v.toFixed(1)).join(',')).join('L');
const Z = WIDE ? 1 : 0.92;

// rivers (drawn in), widest first
const rivers = G.rivers.map(r => { const f = r.where === 'inset' ? PI_ : P;
  const w = { Saale: 4, Unstrut: 3.4, Ilm: 2.4, Salza: 2.2 }[r.name] * (r.where === 'inset' ? 0.7 : 1) * Z;
  const p = el('path', { d: line(r.pts, f), fill: 'none', stroke: RIVER, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  if (r.where === 'inset') p.setAttribute('class', 'inset'); const L = p.getTotalLength(); p.style.strokeDasharray = L + 1; return [p, L]; });
// inset frame + lake
const insetG = el('g', {});
el('rect', { x: ib.x, y: ib.y, width: ib.w, height: ib.h, fill: '#F3ECDE', stroke: C.gold, 'stroke-width': 1.5, rx: 8 }, insetG);
svg.insertBefore(insetG, svg.firstChild);
svg.querySelectorAll('path.inset').forEach(p => insetG.appendChild(p));
el('path', { d: line(G.lake, PI_) + 'Z', fill: '#A9C6DA', stroke: RIVER, 'stroke-width': 1 }, insetG);
const insetLab = div({ left: (ib.x + 10) + 'px', top: (ib.y + ib.h + 6) + 'px', font: `600 ${Math.round(15 * Z)}px Inter`, letterSpacing: '3px', color: C.gold, whiteSpace: 'nowrap' }, 'SÜSSER SEE, 35 KM NORTH', all);

// 51°N parallel
const [p51a, p51b] = [P([51, M.w]), P([51, M.e])];
const par = el('line', { x1: p51a[0], y1: p51a[1], x2: p51b[0], y2: p51b[1], stroke: C.gold, 'stroke-width': 2.2, 'stroke-dasharray': '9 7' });
const parMask = el('clipPath', { id: 'parclip' }); const parRect = el('rect', { x: p51a[0], y: p51a[1] - 6, width: 0, height: 12 }, parMask); par.setAttribute('clip-path', 'url(#parclip)');
const parLab = div({ left: (p51a[0]) + 'px', top: (p51a[1] - 30 * Z) + 'px', font: `700 ${Math.round(24 * Z)}px PF`, color: C.gold }, '51°N', all);

// towns
const halo = 'text-shadow:0 0 4px #EEE5D4,0 0 4px #EEE5D4,0 0 8px #EEE5D4';
const towns = G.towns.map(t => { const f = t.where === 'inset' ? PI_ : P, [x, y] = f(t.at), r = (t.big ? 5 : 3.5) * (t.where === 'inset' ? 0.8 : 1) * Z;
  const d = el('circle', { cx: x, cy: y, r, fill: C.ink, opacity: 0.85 });
  const side = { Laucha: 'left', 'Weißenfels': 'left', 'Höhnstedt': 'left', Freyburg: 'aboveRight', Eisleben: 'below' }[t.name] || 'right';
  const pos = { right: [x + 9 * Z, y - 11 * Z, 'none'], left: [x - 9 * Z, y - 11 * Z, 'translateX(-100%)'], above: [x, y - 8 * Z, 'translate(-50%, -100%)'], aboveRight: [x + 5 * Z, y - 8 * Z, 'translateY(-100%)'], below: [x, y + 6 * Z, 'translateX(-50%)'] }[side];
  const lab = div({ left: pos[0] + 'px', top: pos[1] + 'px', transform: pos[2], whiteSpace: 'nowrap', display: MODE === 'vdp' && t.name === 'Gleina' ? 'none' : 'block',
    font: `${t.big ? 600 : 500} ${Math.round((t.big ? 19 : 16) * Z * (t.where === 'inset' ? 0.85 : 1))}px Inter`, color: t.big ? C.ink : C.sub }, t.name, all);
  lab.style.cssText += ';' + halo; return [d, lab]; });
// river names
const rl = (txt, at, size) => { const [x, y] = P(at); const e = div({ left: x + 'px', top: y + 'px', font: `italic 400 ${Math.round(size * Z)}px PFI`, color: RLAB, whiteSpace: 'nowrap' }, txt, all); e.style.cssText += ';' + halo; return e; };
const rLabels = [rl('Unstrut', [51.282, 11.585], 26), rl('Saale', [51.112, 11.735], 28), rl('Saale', [51.03, 11.66], 24), rl('Ilm', [51.083, 11.6], 20)];
// scale bar: 5 km
const kmPx = sMain / 111.2, sb = WIDE ? [box.x, box.y + box.h - 4] : [box.x + 10, box.y + box.h - 4];
const scale = el('g', {});
el('path', { d: `M${sb[0]},${sb[1] - 6}V${sb[1]}H${sb[0] + 5 * kmPx}V${sb[1] - 6}`, fill: 'none', stroke: C.sub, 'stroke-width': 1.5 }, scale);
const scaleLab = div({ left: (sb[0] + 5 * kmPx + 8) + 'px', top: (sb[1] - 14) + 'px', font: `500 ${Math.round(15 * Z)}px Inter`, color: C.sub }, '5 km', all);

// ---- header ----
const HX = WIDE ? 80 : 510, align = WIDE ? 'left' : 'center';
const head = div({ left: (WIDE ? HX : 60) + 'px', top: (WIDE ? 70 : 300) + 'px', width: (WIDE ? 1200 : 900) + 'px', textAlign: align, font: `600 ${WIDE ? 24 : 26}px Inter`, letterSpacing: '7px', color: C.gold },
  MODE === 'sites' ? 'BREITENGRAD 51' : 'THE VDP ESTATES', all);
const title = div({ left: (WIDE ? HX : 60) + 'px', top: (WIDE ? 104 : 340) + 'px', width: (WIDE ? 1200 : 900) + 'px', textAlign: align, font: `700 ${WIDE ? 74 : 72}px PF`, color: C.ink, lineHeight: '1.05' },
  MODE === 'sites' ? 'Their vineyard sites' : 'Three family estates', all);
fadeIn(head, 0); fadeIn(title, 0.15);

// ---- content ----
const items = [];   // [element(s), start time] pairs animated below
if (MODE === 'sites') {
  const GROUPS = [['UNSTRUT', [1, 2, 3, 4]], ['NAUMBURG &amp; SAALE', [5, 6, 7, 8, 9]], ['SOUTH OF BAD KÖSEN', [10, 11]], ['SÜSSER SEE', [12, 13]]];
  const T0 = 3.0, STEP = 0.45, when = n => T0 + (n - 1) * STEP;
  // markers
  const NUDGE = { 8: [-9, -6], 9: [8, 6] };   // px; both stay within ~0.5 km of their place
  G.sites.forEach(s => { const f = s.where === 'inset' ? PI_ : P, [x0, y0] = f(s.at), [nx, ny] = NUDGE[s.n] || [0, 0], x = x0 + nx * Z, y = y0 + ny * Z, R = (s.where === 'inset' ? 11 : 12) * Z;
    const g = el('g', { transform: `translate(${x} ${y})` }); const inner = el('g', {}, g);
    el('circle', { r: R, fill: OLIVE, stroke: '#F6EFE1', 'stroke-width': 2 }, inner);
    const t = el('text', { 'text-anchor': 'middle', y: R * 0.36, fill: '#FBF6EC', 'font-family': 'Inter', 'font-weight': 700, 'font-size': (s.n > 9 ? 12 : 14) * Z * (s.where === 'inset' ? 0.9 : 1) }, inner); t.textContent = s.n;
    items.push({ kind: 'pop', el: inner, a: when(s.n) }); });
  // list, grouped by area
  const cols = WIDE ? [[0, 2], [1, 3]] : [[0, 2], [1, 3]];
  const LX = WIDE ? [960, 1400] : [90, 530], LY = WIDE ? 430 : 1166, RH = WIDE ? 40 : 28, HH = WIDE ? 46 : 34, FS = WIDE ? 23 : 19;
  cols.forEach((gs, c) => { let y = LY;
    gs.forEach(gi => { const [gname, ns] = GROUPS[gi];
      const h = div({ left: LX[c] + 'px', top: y + 'px', font: `600 ${WIDE ? 16 : 14}px Inter`, letterSpacing: '4px', color: C.gold, whiteSpace: 'nowrap' }, gname, all);
      items.push({ kind: 'fade', el: h, a: when(ns[0]) - 0.1 }); y += HH * 0.8;
      ns.forEach(n => { const s = G.sites.find(q => q.n === n);
        const row = div({ left: LX[c] + 'px', top: y + 'px', display: 'flex', alignItems: 'center', gap: (WIDE ? 12 : 9) + 'px', whiteSpace: 'nowrap' },
          `<span style="flex:none;width:${WIDE ? 28 : 22}px;height:${WIDE ? 28 : 22}px;border-radius:50%;background:${OLIVE};color:#FBF6EC;font:700 ${WIDE ? 13 : 11}px Inter;display:flex;align-items:center;justify-content:center">${n}</span>` +
          `<span style="font:500 ${FS}px Inter;color:${C.ink}">${s.name}</span>`, all);
        items.push({ kind: 'fade', el: row, a: when(n) + 0.1 }); y += RH; });
      y += HH * 0.45; }); });
} else {
  // VDP estates: burgundy pins and small parchment labels; the same three as tiles in the side column (16:9) / below the map (9:16)
  const pin = `<svg width="${30 * Z}" height="${42 * Z}" viewBox="0 0 26 36" style="display:block;overflow:visible"><path d="M13 35C13 35 2 21.5 2 13a11 11 0 0 1 22 0c0 8.5-11 22-11 22z" fill="${BURG}" stroke="#F7F1E6" stroke-width="2"/><circle cx="13" cy="13" r="4.2" fill="#F7F1E6"/></svg>`;
  const LBL = { Gleina: 'left', Zscheiplitz: 'below', 'Naumburg-Weinberge': 'left' };
  G.vdp.forEach((v, i) => { const [x, y] = P(v.at), a = 3.0 + i * 0.8;
    const p = div({ left: (x - 15 * Z) + 'px', top: (y - 42 * Z) + 'px', filter: 'drop-shadow(0 2px 3px rgba(40,29,22,.3))' }, pin, all);
    const side = LBL[v.place];
    const lp = { right: [x + 22 * Z, y - 52 * Z, 'none'], left: [x - 22 * Z, y - 52 * Z, 'translateX(-100%)'], below: [x, y + 10 * Z, 'translateX(-50%)'] }[side];
    const lab = div({ left: lp[0] + 'px', top: lp[1] + 'px', transform: lp[2], whiteSpace: 'nowrap',
      background: 'rgba(246,239,225,.95)', border: '1.5px solid #DCCDB2', borderRadius: '10px', padding: `${6 * Z}px ${12 * Z}px`, boxShadow: '0 4px 12px rgba(40,29,22,.14)' },
      `<div style="font:700 ${Math.round(24 * Z)}px PF;color:${C.ink};line-height:1.1">${v.name}</div><div style="font:500 ${Math.round(15 * Z)}px Inter;color:${C.sub};margin-top:2px">${v.place}</div>`, all);
    items.push({ kind: 'drop', el: p, a }); items.push({ kind: 'fade', el: lab, a: a + 0.25 }); });
  const tw = WIDE ? 780 : 840, tx = WIDE ? 980 : 60, ty0 = WIDE ? 420 : 1190, th = WIDE ? 110 : 76, tg = WIDE ? 22 : 14;
  const blurb = { 'Böhme &amp; Töchter': 'first vines 1986, still in the GDR', Pawis: 'began as a side business on ½ ha', Hey: 'cleared brambles, repaired dry-stone walls' };
  G.vdp.forEach((v, i) => {
    const t = div({ left: tx + 'px', top: (ty0 + i * (th + tg)) + 'px', width: tw + 'px', height: th + 'px', boxSizing: 'border-box', background: '#F6EFE1', border: '2px solid #DCCDB2', borderRadius: '14px',
      boxShadow: '0 8px 20px rgba(40,29,22,.10)', display: 'flex', alignItems: 'center', gap: '18px', padding: `0 ${WIDE ? 24 : 20}px` },
      `<div style="flex:none">${pin}</div><div><div style="font:700 ${WIDE ? 32 : 28}px PF;color:${C.ink};line-height:1.1">${v.name}</div><div style="font:400 ${WIDE ? 21 : 19}px Inter;color:${C.sub};margin-top:4px">${v.place} · ${blurb[v.name]}</div></div>`, all);
    items.push({ kind: 'fade', el: t, a: 3.0 + i * 0.8 + 0.4 }); });
}

// ---- animation ----
const backOut = x => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
anims.push(t => {
  const d = ease(seg(t, 0.3, 2.0)); rivers.forEach(([p, L]) => p.style.strokeDashoffset = (L + 1) * (1 - d));
  insetG.style.opacity = eout(seg(t, 1.0, 1.6)); insetLab.style.opacity = eout(seg(t, 1.2, 1.7));
  const tw = eout(seg(t, 1.0, 1.6)); towns.forEach(([dt, lab]) => { dt.setAttribute('opacity', 0.85 * tw); lab.style.opacity = tw; });
  rLabels.forEach(l => l.style.opacity = eout(seg(t, 1.6, 2.2)));
  parRect.setAttribute('width', (p51b[0] - p51a[0]) * ease(seg(t, 1.8, 2.8))); parLab.style.opacity = eout(seg(t, 2.4, 2.9));
  scale.style.opacity = scaleLab.style.opacity = eout(seg(t, 2.2, 2.7));
  items.forEach(it => {
    if (it.kind === 'pop') { const r = seg(t, it.a, it.a + 0.4); it.el.setAttribute('transform', `scale(${r > 0 ? backOut(r) : 0})`); }
    else if (it.kind === 'drop') { const k = eout(seg(t, it.a, it.a + 0.45)); it.el.style.opacity = k; it.el.style.translate = `0 ${-24 * (1 - k)}px`; }
    else { const k = eout(seg(t, it.a, it.a + 0.45)); it.el.style.opacity = k; it.el.style.translate = `0 ${10 * (1 - k)}px`; }
  });
  all.style.opacity = 1 - ease(seg(t, OUT, END));
});
render(0);
