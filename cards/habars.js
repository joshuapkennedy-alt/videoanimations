// Weißburgunder vs Müller-Thurgau: two horizontal bars on one scale in a parchment tile (transparent overlay), 7 s.
// 16:9: bottom centre, 80 px from the bottom. 9:16: centred on x 510 (120+ px clear on the right), middle at 65% of the height.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const OUT = 6.6, END = 7.0, MAX = 125;
const tileBg = 'rgba(246, 239, 225, 0.92)', tileBorder = '2px solid rgba(220, 205, 178, 0.9)';
const shadow = '0 10px 30px rgba(40, 29, 22, 0.28), 0 2px 6px rgba(40, 29, 22, 0.18)';
const Z = WIDE ? 1 : 1.12, px = n => Math.round(n * Z) + 'px';
const BARS = [
  { name: 'Weißburgunder', value: 116, colour: '#7E8F26', a: 0.4, bold: true },
  { name: 'Müller-Thurgau', value: 110, colour: '#B3A58C', a: 1.2 },
];
const NAMEW = 230 * Z, TRACK = WIDE ? 470 : 380 * Z, VALW = 150 * Z;
const card = div(Object.assign({ boxSizing: 'border-box', padding: `${px(22)} ${px(34)} ${px(26)}`, background: tileBg, border: tileBorder,
  borderRadius: '16px', boxShadow: shadow, whiteSpace: 'nowrap' },
  WIDE ? { left: '50%', bottom: '80px', transform: 'translateX(-50%)' } : { left: '510px', top: Math.round(SH * 0.65) + 'px', transform: 'translate(-50%, -50%)' }));
div({ position: 'static', font: `500 ${px(22)} Inter`, color: C.sub, letterSpacing: '0.5px', marginBottom: px(14) }, 'vineyard area, Saale-Unstrut', card);
const rows = BARS.map((b, i) => {
  const row = div({ position: 'static', display: 'flex', alignItems: 'center', height: px(54), marginTop: i ? px(8) : 0 }, '', card);
  div({ position: 'static', width: NAMEW + 'px', font: `${b.bold ? 600 : 500} ${px(26)} Inter`, color: C.ink }, b.name, row);
  const track = div({ position: 'relative', width: TRACK + 'px', height: px(26) }, '', row);
  const bar = div({ left: 0, top: 0, height: '100%', width: '0px', background: b.colour, borderRadius: `0 ${px(6)} ${px(6)} 0` }, '', track);
  const val = div({ position: 'static', width: VALW + 'px', paddingLeft: px(18), font: `700 ${px(38)} PF`, color: b.bold ? C.ink : '#5E5444', fontVariantNumeric: 'lining-nums' }, '', row);
  return { b, bar, val };
});
anims.push(t => {
  const a = eout(seg(t, 0, 0.4)), out = 1 - ease(seg(t, OUT, END));
  card.style.opacity = a * out; card.style.translate = `0 ${20 * (1 - a)}px`;
  rows.forEach(({ b, bar, val }) => {
    const k = ease(seg(t, b.a, b.a + 0.8)), v = b.value * k;
    bar.style.width = (TRACK * v / MAX) + 'px';
    val.textContent = `~${Math.round(v)} ha`; val.style.opacity = eout(seg(t, b.a, b.a + 0.3));
  });
});
render(0);
