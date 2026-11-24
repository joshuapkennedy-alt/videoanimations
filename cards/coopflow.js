// "You grow -> the co-op makes": two small tiles joined by a thin gold arrow (transparent lower third), 8 s.
// 16:9: side by side, bottom centre, 80 px from the bottom. 9:16: stacked, centred on x 510, middle at 65% of the height.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const NS = 'http://www.w3.org/2000/svg', OUT = 7.6, END = 8.0, ARROW = 4.6;
const tileBg = 'rgba(246, 239, 225, 0.92)', tileBorder = '2px solid rgba(220, 205, 178, 0.9)';
const shadow = '0 10px 30px rgba(40, 29, 22, 0.28), 0 2px 6px rgba(40, 29, 22, 0.18)';
const Z = WIDE ? 1 : 1.12, px = n => Math.round(n * Z);
const ITEMS = [
  { head: 'You grow', sub: 'the grapes', color: '#B8925A', a: 0.3,
    icon: '<path d="M50 10V24M50 18C58 12 68 12 74 18C68 24 58 24 50 18"/>' +
      [[38, 34], [50, 32], [62, 34], [44, 46], [56, 46], [38, 57], [62, 57], [50, 58], [44, 69], [56, 69], [50, 80]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5"/>`).join('') },
  { head: 'The co-op makes', sub: 'the wine', color: '#6B2737', a: 5.0,
    icon: '<path d="M44 12H56V30C56 35 64 37 64 45V88H36V45C36 37 44 35 44 30Z"/><path d="M36 58H64M36 74H64"/>' },
];
const TW = px(WIDE ? 440 : 520), TH = px(112), GAP = px(WIDE ? 90 : 70);
const wrap = div(WIDE ? { left: ((SW - 2 * TW - GAP) / 2) + 'px', top: (SH - 80 - TH) + 'px', width: (2 * TW + GAP) + 'px', height: TH + 'px' }
                      : { left: (510 - TW / 2) + 'px', top: (Math.round(SH * 0.65) - TH - GAP / 2) + 'px', width: TW + 'px', height: (2 * TH + GAP) + 'px' });
const backOut = x => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
ITEMS.forEach((it, k) => {
  const x = WIDE ? k * (TW + GAP) : 0, y = WIDE ? 0 : k * (TH + GAP);
  const tile = div({ left: x + 'px', top: y + 'px', width: TW + 'px', height: TH + 'px', boxSizing: 'border-box', background: tileBg, border: tileBorder, borderRadius: '16px',
    boxShadow: shadow, display: 'flex', alignItems: 'center', gap: px(20) + 'px', padding: `0 ${px(22)}px`, whiteSpace: 'nowrap' }, '', wrap);
  const svg = document.createElementNS(NS, 'svg'), S = px(72);
  svg.setAttribute('width', S); svg.setAttribute('height', S); svg.setAttribute('viewBox', '0 0 100 100'); svg.style.flex = 'none'; svg.style.overflow = 'visible';
  svg.innerHTML = `<circle class="ring" cx="50" cy="50" r="48" fill="${it.color}"/><g class="ic" fill="none" stroke="#FBF6EC" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" transform="translate(50 50) scale(.72) translate(-50 -50)">${it.icon}</g>`;
  tile.appendChild(svg);
  const col = div({ position: 'static' }, '', tile);
  div({ position: 'static', font: `700 ${px(34)}px PF`, color: C.ink, lineHeight: '1.1' }, it.head, col);
  div({ position: 'static', font: `400 ${px(23)}px Inter`, color: C.ink, lineHeight: '1.3', marginTop: px(3) + 'px' }, it.sub, col);
  const ring = svg.querySelector('.ring'), strokes = [...svg.querySelector('.ic').children].map(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; return [p, L]; });
  anims.push(t => {
    const a = it.a, b = eout(seg(t, a, a + 0.4)), out = 1 - ease(seg(t, OUT, END));
    tile.style.opacity = b * out; tile.style.translate = `0 ${24 * (1 - b)}px`;
    const r = seg(t, a + 0.1, a + 0.5); ring.setAttribute('transform', `translate(50 50) scale(${r > 0 ? backOut(r) : 0}) translate(-50 -50)`);
    const d = ease(seg(t, a + 0.3, a + 0.9)); strokes.forEach(([p, L]) => p.style.strokeDashoffset = L * (1 - d));
  });
});
// thin gold arrow across the gap
const ar = document.createElementNS(NS, 'svg'); ar.setAttribute('width', WIDE ? 2 * TW + GAP : TW); ar.setAttribute('height', WIDE ? TH : 2 * TH + GAP);
ar.style.position = 'absolute'; ar.style.left = 0; ar.style.top = 0; ar.style.overflow = 'visible'; wrap.appendChild(ar);
const [ax0, ay0, ax1, ay1] = WIDE ? [TW + 14, TH / 2, TW + GAP - 14, TH / 2] : [TW / 2, TH + 12, TW / 2, TH + GAP - 12];
const hd = WIDE ? `M${ax1 - 11},${ay1 - 9}L${ax1},${ay1}L${ax1 - 11},${ay1 + 9}` : `M${ax1 - 9},${ay1 - 11}L${ax1},${ay1}L${ax1 + 9},${ay1 - 11}`;
ar.innerHTML = `<path class="sh" d="M${ax0},${ay0}L${ax1},${ay1}" stroke="${C.gold}" stroke-width="3" stroke-linecap="round" fill="none"/>` +
  `<path class="hd" d="${hd}" stroke="${C.gold}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
const sh = ar.querySelector('.sh'), head = ar.querySelector('.hd'), SL = sh.getTotalLength(), HL = head.getTotalLength();
sh.style.strokeDasharray = SL; head.style.strokeDasharray = HL;
anims.push(t => {
  const d = ease(seg(t, ARROW, ARROW + 0.45)), h = ease(seg(t, ARROW + 0.35, ARROW + 0.55)), out = 1 - ease(seg(t, OUT, END));
  sh.style.strokeDashoffset = SL * (1 - d); head.style.strokeDashoffset = HL * (1 - h); ar.style.opacity = (d > 0 ? 1 : 0) * out;
});
render(0);
