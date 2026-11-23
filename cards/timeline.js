// "Where it started": timeline card, 14 s. 16:9 runs left to right; 9:16 (window.WIDE false) runs top to bottom.
// Space after the second point is left empty for later dates.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const BURG = '#6B2737', OUT = 13.6, END = 14.0, EXT = 9.6;
const all = div({ left: 0, top: 0, width: SW + 'px', height: SH + 'px' });   // wrapper for the closing fade
const backOut = x => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

// ---- header ----
// 9:16: centre of the x 60-960 column (120 px clear on the right), everything between 15% and 75% of the height
const ty = WIDE ? 80 : 300, CX = WIDE ? SW / 2 : 510, HW = WIDE ? SW - 80 : 900;
fadeIn(text(CX, ty, HW, 'WHERE IT STARTED', Object.assign({}, T.eyebrow, { font: `600 ${WIDE ? 26 : 30}px Inter`, letterSpacing: '7px' }), all), 0);
fadeIn(text(CX, ty + (WIDE ? 48 : 56), HW, WIDE ? 'The monks got here first' : 'The monks<br>got here first',
  Object.assign({}, T.title, { font: `700 ${WIDE ? 96 : 104}px PF` }), all), 0.15);

// ---- line ----
// 16:9: y 600, centred on the frame: x 400 -> 960 at the start, -> 1520 at 9.6 s. 9:16: x 200, y 650 -> 880, -> 1240.
const L = WIDE ? { at: 600, a: 400, b1: 960, b2: 1520, th: 4 } : { at: 200, a: 650, b1: 880, b2: 1240, th: 4 };
const line = div({ background: C.gold, borderRadius: '2px' }, '', all);
anims.push(t => {
  const len = (L.b1 - L.a) * eout(seg(t, 0, 0.8)) + (L.b2 - L.b1) * ease(seg(t, EXT, EXT + 0.6));
  Object.assign(line.style, WIDE
    ? { left: L.a + 'px', top: (L.at - L.th / 2) + 'px', width: len + 'px', height: L.th + 'px' }
    : { left: (L.at - L.th / 2) + 'px', top: L.a + 'px', width: L.th + 'px', height: len + 'px' });
  line.style.opacity = len > 0 ? 1 : 0;
});

// ---- points ----
const PTS = [
  { year: '998', strong: 'First record of wine', body: 'Emperor Otto III gives vineyards to the monastery at Memleben', at: WIDE ? 680 : 730, a: 0.6 },
  { year: '1130s', strong: '', body: 'Cistercian monks found Kloster Pforta, near Naumburg', at: WIDE ? 1240 : 1090, a: EXT + 0.35 },
];
PTS.forEach((p, i) => {
  const g = div({ left: 0, top: 0 }, '', all);   // group, so the first point can dim when the second arrives
  const x = WIDE ? p.at : L.at, y = WIDE ? L.at : p.at, D = WIDE ? 30 : 34;
  const dot = div({ left: (x - D / 2) + 'px', top: (y - D / 2) + 'px', width: D + 'px', height: D + 'px', borderRadius: '50%', boxSizing: 'border-box',
    background: BURG, border: `5px solid ${C.bg}`, boxShadow: `0 0 0 2px ${C.gold}` }, '', g);
  const yr = WIDE
    ? text(x, y - 46 - 92, 500, p.year, { font: '700 92px PF', color: C.ink, lineHeight: '1', fontVariantNumeric: 'lining-nums' }, g)
    : div({ left: (x + 52) + 'px', top: (y - 52) + 'px', font: '700 100px PF', color: C.ink, lineHeight: '1', fontVariantNumeric: 'lining-nums' }, p.year, g);
  const html = (p.strong ? `<div style="font-weight:600;color:${C.ink};margin-bottom:6px">${p.strong}</div>` : '') + p.body;
  const lab = WIDE
    ? text(x, y + 44, 440, html, { font: '400 27px Inter', color: C.sub, lineHeight: '1.35' }, g)
    : div({ left: (x + 52) + 'px', top: (y + 66) + 'px', width: (960 - x - 52) + 'px', font: '400 32px Inter', color: C.sub, lineHeight: '1.35' }, html, g);
  anims.push(t => {
    const r = seg(t, p.a, p.a + 0.45); dot.style.transform = `scale(${r > 0 ? backOut(r) : 0})`;
    const h = eout(seg(t, p.a + 0.25, p.a + 0.7)); yr.style.opacity = h; yr.style.translate = `0 ${14 * (1 - h)}px`;
    const s = eout(seg(t, p.a + 0.45, p.a + 0.95)); lab.style.opacity = s; lab.style.translate = `0 ${14 * (1 - s)}px`;
    if (i === 0) g.style.opacity = 1 - 0.4 * ease(seg(t, EXT, EXT + 0.6));
  });
});

anims.push(t => { all.style.opacity = 1 - ease(seg(t, OUT, END)); });
render(0);
