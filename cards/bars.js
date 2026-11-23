// Animated column chart for the rain / sunshine comparisons. Reads window.CHART and window.WIDE.
const { eyebrow, title, unit, max, ticks, bars } = window.CHART;
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const fmt = n => Math.round(n).toLocaleString('en-GB');

// ---- header ----
const ty = WIDE ? 80 : 150;
const CX = WIDE ? SW / 2 : 510;   // 9:16: centre of the x 60-960 safe column (120 px clear on the right, text in the top 75%)
fadeIn(text(CX, ty, SW - 80, eyebrow, Object.assign({}, T.eyebrow, { font: `600 ${WIDE ? 26 : 30}px Inter`, letterSpacing: '7px' })), 0.15);
fadeIn(text(CX, ty + (WIDE ? 48 : 56), SW - 80, title, Object.assign({}, T.title, { font: `700 ${WIDE ? 96 : 110}px PF` })), 0.3);
fadeIn(text(CX, ty + (WIDE ? 168 : 196), SW - 80, unit, Object.assign({}, T.sub, { font: `400 ${WIDE ? 32 : 36}px Inter` })), 0.45);

// ---- plot geometry ----
const P = WIDE ? { x0: 460, x1: 1460, y0: 360, y1: 900 } : { x0: 120, x1: 960, y0: 520, y1: 1330 };
const yOf = v => P.y1 - (P.y1 - P.y0) * v / max;
const n = bars.length, slot = (P.x1 - P.x0) / n, bw = Math.min(WIDE ? 200 : 210, slot * 0.56);

// gridlines + tick labels (hairline, recessive)
ticks.forEach((v, i) => {
  const y = yOf(v), base = v === 0;
  const g = div({ left: P.x0 + 'px', top: (y - (base ? 1 : 0.5)) + 'px', width: (P.x1 - P.x0) + 'px', height: (base ? 2 : 1) + 'px', background: base ? '#9C8D74' : '#D8CBB3', transformOrigin: 'left' });
  const l = div({ left: (P.x0 - 150) + 'px', top: (y - 16) + 'px', width: '130px', textAlign: 'right', font: `400 ${WIDE ? 24 : 26}px Inter`, color: '#8A7C65' }, fmt(v));
  anims.push(t => { const k = ease(seg(t, 0.6 + i * 0.05, 1.1 + i * 0.05)); g.style.transform = `scaleX(${k})`; l.style.opacity = k; });
});

// ---- columns ----
bars.forEach((b, i) => {
  const cx = P.x0 + slot * (i + 0.5), a = 1.2 + i * 0.35, hi = !!b.highlight;
  const col = div({ left: (cx - bw / 2) + 'px', width: bw + 'px', background: hi ? '#7E8F26' : '#B3A58C', borderRadius: '8px 8px 0 0' });
  const val = div({ left: (cx - 200) + 'px', width: '400px', textAlign: 'center', font: `700 ${WIDE ? 52 : 58}px PF`, fontVariantNumeric: 'lining-nums', color: hi ? C.ink : '#5E5444' });
  const name = div({ left: (cx - slot / 2) + 'px', top: (P.y1 + 22) + 'px', width: slot + 'px', textAlign: 'center',
    font: `${hi ? 700 : 600} ${WIDE ? 30 : 32}px Inter`, color: hi ? C.ink : '#6E6250', lineHeight: '1.25' }, b.label);
  anims.push(t => {
    const k = ease(seg(t, a, a + 0.95)), v = b.value * k, top = yOf(v);
    col.style.top = top + 'px'; col.style.height = (P.y1 - top) + 'px'; col.style.opacity = k > 0 ? 1 : 0;
    val.textContent = fmt(v); val.style.top = (top - (WIDE ? 70 : 78)) + 'px'; val.style.opacity = eout(seg(t, a, a + 0.3));
    name.style.opacity = eout(seg(t, a - 0.1, a + 0.3));
  });
});
render(0);
