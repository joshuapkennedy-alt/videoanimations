// "The next generation": header plus three stacked tiles (transparent overlay), 18.5 s. Tiles slide in from the right.
// 16:9: right third, 80 px from the right edge, about 560 px wide, vertically centred (the speaker is centre/left).
// 9:16: centred on x 510 (120+ px clear on the right), between 20% and 65% of the height.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const OUT = 18.1, END = 18.5;
const tileBg = 'rgba(246, 239, 225, 0.92)', tileBorder = '2px solid rgba(220, 205, 178, 0.9)';
const shadow = '0 10px 30px rgba(40, 29, 22, 0.28), 0 2px 6px rgba(40, 29, 22, 0.18)';
const Z = WIDE ? 1 : 1.2, px = n => Math.round(n * Z) + 'px';
const W = WIDE ? 560 : 780;
const col = div(Object.assign({ width: W + 'px', display: 'flex', flexDirection: 'column', gap: px(16), alignItems: 'stretch' },
  WIDE ? { right: '80px', top: '50%', transform: 'translateY(-50%)' } : { left: (510 - W / 2) + 'px', top: Math.round(SH * 0.425) + 'px', transform: 'translateY(-50%)' }));
// header on a small parchment tab so the gold reads over the footage
const head = div({ position: 'static', alignSelf: WIDE ? 'flex-start' : 'center', font: `600 ${px(22)} Inter`, letterSpacing: '6px', color: C.gold, background: tileBg,
  border: tileBorder, borderRadius: '12px', boxShadow: shadow, padding: `${px(8)} ${px(16)} ${px(8)} ${px(22)}`, whiteSpace: 'nowrap' }, 'THE NEXT GENERATION', col);
const TILES = [
  { a: 3.1, html: [['700', 38, 'PF', C.ink, 'Matthias Hey'], ['400', 23, 'Inter', C.ink, 'ferments with wild yeasts']] },
  { a: 5.5, html: [['700', 38, 'PF', C.ink, 'Breitengrad 51'], ['400', 23, 'Inter', C.ink, 'a group of top growers'], ['400', 19, 'Inter', C.sub, 'best wines in a fresh, cool-climate style']] },
  { a: 13.8, html: [['600', 17, 'Inter', C.gold, 'IN THE VDP', '4px'], ['700', 31, 'PF', C.ink, 'Pawis · Hey · Böhme &amp; Töchter'], ['400', 23, 'Inter', C.ink, '3 family estates']] },
];
const tiles = TILES.map(tl => {
  const t = div({ position: 'static', boxSizing: 'border-box', padding: `${px(18)} ${px(26)} ${px(20)}`, background: tileBg, border: tileBorder, borderRadius: '16px', boxShadow: shadow,
    textAlign: WIDE ? 'left' : 'center' }, '', col);
  tl.html.forEach(([w, s, f, c, txt, ls], i) => div({ position: 'static', font: `${w} ${px(s)} ${f}`, color: c, lineHeight: f === 'PF' ? '1.15' : '1.35', letterSpacing: ls || 'normal',
    marginTop: i ? px(f === 'PF' ? 4 : 4) : '0', whiteSpace: 'nowrap' }, txt, t));
  return [t, tl.a];
});
anims.push(t => {
  const out = 1 - ease(seg(t, OUT, END)), h = eout(seg(t, 0, 0.5));
  head.style.opacity = h * out; head.style.translate = `0 ${10 * (1 - h)}px`;
  tiles.forEach(([el, a]) => { const k = eout(seg(t, a, a + 0.5)); el.style.opacity = k * out; el.style.translate = `${(WIDE ? 70 : 50) * (1 - k)}px 0`; });
});
render(0);
