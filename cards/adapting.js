// "How growers are adapting": gold header tab and three small tiles with olive icon circles (transparent lower third), 11 s.
// 16:9: in a row, bottom centre, 80 px from the bottom. 9:16: stacked, centred on x 510, about 55-70% of the height.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const NS = 'http://www.w3.org/2000/svg', OLIVE = '#7E8F26', OUT = 10.6, END = 11.0;
const tileBg = 'rgba(246, 239, 225, 0.92)', tileBorder = '2px solid rgba(220, 205, 178, 0.9)';
const shadow = '0 10px 30px rgba(40, 29, 22, 0.28), 0 2px 6px rgba(40, 29, 22, 0.18)';
const Z = WIDE ? 1 : 1.12, px = n => Math.round(n * Z);
const ICON = {
  vine: '<path d="M50 84C46 76 40 72 31 72C23 72 17 66 19 58C11 56 7 48 11 41C15 35 22 34 27 36C25 27 31 19 39 21C41 13 47 9 50 9C53 9 59 13 61 21C69 19 75 27 73 36C78 34 85 35 89 41C93 48 89 56 81 58C83 66 77 72 69 72C60 72 54 76 50 84Z"/><path d="M50 84V32M50 66L30 50M50 66L70 50"/>',
  drop: '<path d="M50 14C50 14 26 44 26 62a24 24 0 0 0 48 0C74 44 50 14 50 14Z"/><path d="M38 64a12 12 0 0 0 10 12"/>',
  lens: '<circle cx="44" cy="44" r="22"/><path d="M60 60L82 82"/>',
};
const TILES = [
  { icon: 'vine', head: 'Hardier grapes', a: 1.8 },
  { icon: 'drop', head: 'Reservoirs', sub: 'planned for dry summers', a: 4.3 },
  { icon: 'lens', head: 'Research', sub: 'testing what works', a: 8.45 },
];
const col = div(Object.assign({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: px(14) + 'px' },
  WIDE ? { left: '50%', bottom: '80px', transform: 'translateX(-50%)' } : { left: '510px', top: Math.round(SH * 0.625) + 'px', transform: 'translate(-50%, -50%)' }));
const head = div({ position: 'static', font: `600 ${px(21)}px Inter`, letterSpacing: '6px', color: C.gold, background: tileBg, border: tileBorder, borderRadius: '12px', boxShadow: shadow,
  padding: `${px(7)}px ${px(16)}px ${px(7)}px ${px(22)}px`, whiteSpace: 'nowrap' }, 'HOW GROWERS ARE ADAPTING', col);
const row = div({ position: 'static', display: 'flex', flexDirection: WIDE ? 'row' : 'column', gap: px(16) + 'px', alignItems: 'stretch' }, '', col);
const backOut = x => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const tiles = TILES.map(tl => {
  const t = div({ position: 'static', boxSizing: 'border-box', width: (WIDE ? 380 : 560) + 'px', height: px(96) + 'px', background: tileBg, border: tileBorder, borderRadius: '16px', boxShadow: shadow,
    display: 'flex', alignItems: 'center', gap: px(16) + 'px', padding: `0 ${px(20)}px`, whiteSpace: 'nowrap' }, '', row);
  const svg = document.createElementNS(NS, 'svg'), S = px(62);
  svg.setAttribute('width', S); svg.setAttribute('height', S); svg.setAttribute('viewBox', '0 0 100 100'); svg.style.flex = 'none'; svg.style.overflow = 'visible';
  svg.innerHTML = `<circle class="ring" cx="50" cy="50" r="48" fill="${OLIVE}"/><g class="ic" fill="none" stroke="#FBF6EC" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" transform="translate(50 50) scale(.72) translate(-50 -50)">${ICON[tl.icon]}</g>`;
  t.appendChild(svg);
  const c = div({ position: 'static' }, '', t);
  div({ position: 'static', font: `700 ${px(30)}px PF`, color: C.ink, lineHeight: '1.1' }, tl.head, c);
  if (tl.sub) div({ position: 'static', font: `400 ${px(19)}px Inter`, color: C.ink, lineHeight: '1.3', marginTop: px(2) + 'px' }, tl.sub, c);
  const ring = svg.querySelector('.ring'), strokes = [...svg.querySelector('.ic').children].map(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; return [p, L]; });
  return { t, a: tl.a, ring, strokes };
});
anims.push(t => {
  const out = 1 - ease(seg(t, OUT, END)), h = eout(seg(t, 0, 0.5));
  head.style.opacity = h * out; head.style.translate = `0 ${10 * (1 - h)}px`;
  tiles.forEach(({ t: el, a, ring, strokes }) => {
    const k = eout(seg(t, a, a + 0.45)); el.style.opacity = k * out; el.style.translate = `0 ${20 * (1 - k)}px`;
    const r = seg(t, a + 0.1, a + 0.5); ring.setAttribute('transform', `translate(50 50) scale(${r > 0 ? backOut(r) : 0}) translate(-50 -50)`);
    const d = ease(seg(t, a + 0.3, a + 0.9)); strokes.forEach(([p, L]) => p.style.strokeDashoffset = L * (1 - d));
  });
});
render(0);
