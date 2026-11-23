// "Then and now": vineyard area, 1500s vs today, with reason chips between the bars. 21.5 s.
// Same chart style as bars.js (gridlines, counting values). window.WIDE selects the 16:9 layout.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const fmt = n => Math.round(n).toLocaleString('en-GB');
const OUT = 21.1, END = 21.5, max = 11000, ticks = [0, 2500, 5000, 7500, 10000];
const all = div({ left: 0, top: 0, width: SW + 'px', height: SH + 'px' });   // wrapper for the closing fade

// ---- header ----
// 9:16: centre of the x 60-960 column (120 px clear on the right), everything between 15% and 75% of the height
const ty = WIDE ? 80 : 300, CX = WIDE ? SW / 2 : 510, HW = WIDE ? SW - 80 : 900;
fadeIn(text(CX, ty, HW, 'VINEYARD AREA, SAALE-UNSTRUT', Object.assign({}, T.eyebrow, { font: `600 ${WIDE ? 26 : 28}px Inter`, letterSpacing: WIDE ? '7px' : '5px' }), all), 0);
fadeIn(text(CX, ty + (WIDE ? 48 : 56), HW, 'Then and now', Object.assign({}, T.title, { font: `700 ${WIDE ? 96 : 110}px PF` }), all), 0.15);
fadeIn(text(CX, ty + (WIDE ? 168 : 196), HW, 'hectares', Object.assign({}, T.sub, { font: `400 ${WIDE ? 32 : 36}px Inter` }), all), 0.3);

// ---- plot ----
const P = WIDE ? { x0: 460, x1: 1460, y0: 360, y1: 900 } : { x0: 170, x1: 650, y0: 640, y1: 1250 };
const yOf = v => P.y1 - (P.y1 - P.y0) * v / max;
const slot = (P.x1 - P.x0) / 2, bw = WIDE ? 200 : 150;
ticks.forEach((v, i) => {
  const y = yOf(v), base = v === 0;
  const g = div({ left: P.x0 + 'px', top: (y - (base ? 1 : 0.5)) + 'px', width: (P.x1 - P.x0) + 'px', height: (base ? 2 : 1) + 'px', background: base ? '#9C8D74' : '#D8CBB3', transformOrigin: 'left' }, '', all);
  const l = div({ left: (P.x0 - 150) + 'px', top: (y - 16) + 'px', width: '130px', textAlign: 'right', font: `400 ${WIDE ? 24 : 26}px Inter`, color: '#8A7C65' }, fmt(v), all);
  anims.push(t => { const k = ease(seg(t, 0.05 + i * 0.05, 0.55 + i * 0.05)); g.style.transform = `scaleX(${k})`; l.style.opacity = k; });
});

const BARS = [
  { label: '1500s', value: 10000, show: v => '~' + fmt(v), a: 0.3, d: 1.2 },
  { label: 'Today', value: 850, show: v => fmt(v) + '+', a: 15.2, d: 0.8, hi: true },
];
BARS.forEach((b, i) => {
  const cx = P.x0 + slot * (i + 0.5), hi = !!b.hi;
  const col = div({ left: (cx - bw / 2) + 'px', width: bw + 'px', background: hi ? '#7E8F26' : '#B3A58C', borderRadius: '8px 8px 0 0' }, '', all);
  const val = div({ left: (cx - 200) + 'px', width: '400px', textAlign: 'center', font: `700 ${WIDE ? 52 : 58}px PF`, fontVariantNumeric: 'lining-nums', color: hi ? C.ink : '#5E5444' }, '', all);
  const name = div({ left: (cx - slot / 2) + 'px', top: (P.y1 + 22) + 'px', width: slot + 'px', textAlign: 'center',
    font: `${hi ? 700 : 600} ${WIDE ? 30 : 32}px Inter`, color: hi ? C.ink : '#6E6250', lineHeight: '1.25' }, b.label, all);
  anims.push(t => {
    const k = ease(seg(t, b.a, b.a + b.d)), v = b.value * k, top = yOf(v);
    col.style.top = top + 'px'; col.style.height = (P.y1 - top) + 'px'; col.style.opacity = k > 0 ? 1 : 0;
    val.textContent = b.show(v); val.style.top = (top - (WIDE ? 70 : 78)) + 'px'; val.style.opacity = eout(seg(t, b.a, b.a + 0.3));
    name.style.opacity = eout(seg(t, b.a - 0.1, b.a + 0.3));
  });
});

// ---- reason chips: 16:9 stacked in the gap between the bars; 9:16 stacked in a column to the right of the chart ----
const CHIPS = [['wars', 5.7], ['failed harvests', 7.8], ['imported wine', 9.3], ['beer &amp; coffee', 11.0]];
const chipX = WIDE ? SW / 2 : 815, chipY0 = WIDE ? 520 : 770, chipStep = WIDE ? 78 : 92;
CHIPS.forEach(([word, a], k) => {
  const c = text(chipX, chipY0 + k * chipStep, 300, `<span style="display:inline-block;padding:9px 24px;background:#F6EFE1;border:2px solid #DCCDB2;border-radius:999px;box-shadow:0 2px 8px rgba(40,29,22,.08)">${word}</span>`,
    { font: `500 ${WIDE ? 26 : 29}px Inter`, color: C.ink, lineHeight: '1.2', whiteSpace: 'nowrap' }, all);
  fadeIn(c, a);
});

// ---- footnote ----
fadeIn(text(CX, WIDE ? 990 : 1370, HW, 'All of Germany today: ~100,000 ha', { font: `400 ${WIDE ? 26 : 30}px Inter`, color: 'rgba(40, 29, 22, 0.7)' }, all), 18.7);

anims.push(t => { all.style.opacity = 1 - ease(seg(t, OUT, END)); });
render(0);
