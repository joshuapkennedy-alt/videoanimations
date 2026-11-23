// Info card / site label overlay (transparent). Reads window.OVL = { pos, dur, rows } and window.WIDE.
//   pos: 'tl' = top-left, 80 px from the top and left edges; 'bl' = bottom-left, 80 px from the bottom and left edges
//        (keeps the bottom-right Google Earth logo clear). 9:16: centred on x 510 (120+ px clear on the right), top at 15.6%.
//   rows: [{ type, text, at }]; a row with `at` > 0 opens up (height grows, then fades up) at that time.
//     type 'head'  gold letter-spaced Inter       'main'  Playfair, ink        'burg'  Playfair, burgundy
//          'count' Playfair burgundy, the number in {n} counts up from 0      'note'  small Inter with a gold swatch
//          'site'  gold swatch + Playfair, ink    'sub'   Inter, ink
// Card fades and slides in over 0.4 s and out over the last 0.4 s.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const { pos, dur, rows } = window.OVL, BURG = '#6B2737', GOLD = C.gold;
const tileBg = 'rgba(246, 239, 225, 0.92)', tileBorder = '2px solid rgba(220, 205, 178, 0.9)';
const shadow = '0 10px 30px rgba(40, 29, 22, 0.28), 0 2px 6px rgba(40, 29, 22, 0.18)';
const Z = WIDE ? 1 : 1.12;   // 9:16 type a little larger
const px = n => Math.round(n * Z) + 'px';

const place = WIDE ? (pos === 'tl' ? { left: '80px', top: '80px' } : { left: '80px', bottom: '80px' })
                   : { left: '510px', top: Math.round(SH * 0.156) + 'px', transform: 'translateX(-50%)' };
const card = div(Object.assign({ boxSizing: 'border-box', padding: `${px(22)} ${px(32)} ${px(24)}`, background: tileBg, border: tileBorder,
  borderRadius: '16px', boxShadow: shadow, whiteSpace: 'nowrap', textAlign: WIDE ? 'left' : 'center' }, place));

const swatch = size => `<span style="display:inline-block;width:${px(size)};height:${px(size)};border-radius:${px(5)};background:${GOLD};` +
  `box-shadow:inset 0 0 0 1px rgba(40,29,22,.15);vertical-align:middle;margin-right:${px(size * 0.55)};position:relative;top:-${px(size * 0.08)}"></span>`;
const ST = {
  head: { font: `600 ${px(22)} Inter`, color: GOLD, letterSpacing: px(6), lineHeight: '1.3' },
  main: { font: `700 ${px(42)} PF`, color: C.ink, lineHeight: '1.2' },
  burg: { font: `700 ${px(42)} PF`, color: BURG, lineHeight: '1.2' },
  count: { font: `700 ${px(42)} PF`, color: BURG, lineHeight: '1.2', fontVariantNumeric: 'lining-nums' },
  note: { font: `400 ${px(24)} Inter`, color: C.ink, lineHeight: '1.35' },
  site: { font: `700 ${px(40)} PF`, color: C.ink, lineHeight: '1.15' },
  sub: { font: `400 ${px(24)} Inter`, color: C.ink, lineHeight: '1.35' },
};
const GAP = { head: 4, main: 4, burg: 6, count: 10, note: 14, site: 0, sub: 6 };

const items = rows.map((r, i) => {
  const outer = div({ position: 'static', overflow: 'hidden' }, '', card);           // grows open for late rows
  const inner = div(Object.assign({ position: 'static', paddingTop: i ? px(GAP[r.type]) : '0' }, ST[r.type]), '', outer);
  let num = null;
  if (r.type === 'count') {
    const [a, b] = r.text.split('{n}'), final = r.n;
    inner.innerHTML = `${a}<span style="display:inline-block;min-width:${String(final).length * 0.62}em;text-align:right"></span>${b}`;
    num = inner.querySelector('span');
  } else inner.innerHTML = (r.type === 'note' ? swatch(22) : r.type === 'site' ? swatch(28) : '') + r.text;
  return { r, outer, inner, num };
});

let H = null;   // natural heights, measured once the fonts have loaded
anims.push(t => {
  if (!H && document.fonts.status === 'loaded') H = items.map(it => it.inner.offsetHeight);
  const a = eout(seg(t, 0, 0.4)), out = 1 - ease(seg(t, dur - 0.4, dur));
  card.style.opacity = a * out; card.style.translate = `0 ${(pos === 'bl' && WIDE ? 20 : -20) * (1 - a)}px`;
  items.forEach(({ r, outer, inner, num }, i) => {
    const at = r.at || 0;
    if (at > 0) {
      const o = ease(seg(t, at, at + 0.4)), f = eout(seg(t, at + 0.15, at + 0.55));
      outer.style.height = H ? H[i] * o + 'px' : (o ? 'auto' : '0px');
      inner.style.opacity = f; inner.style.translate = `0 ${10 * (1 - f)}px`;
    }
    if (num) num.textContent = Math.round(r.n * ease(seg(t, at + 0.2, at + 1.4)));
  });
});
render(0);
