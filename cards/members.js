// "Winzervereinigung today": ~320 member growers (counting number) and ~half of the region's vines (donut). 5 s.
// 16:9: number left, donut right. 9:16: number above the donut, centred on x 510, between 15% and 75% of the height.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const NS = 'http://www.w3.org/2000/svg', BURG = '#6B2737', GREY = '#D9CFBF', OUT = 4.6, END = 5.0;
const all = div({ left: 0, top: 0, width: SW + 'px', height: SH + 'px' });

const ty = WIDE ? 150 : 300, CX = WIDE ? SW / 2 : 510, HW = WIDE ? SW - 80 : 900;
fadeIn(text(CX, ty, HW, 'WINZERVEREINIGUNG TODAY', Object.assign({}, T.eyebrow, { font: `600 ${WIDE ? 28 : 28}px Inter`, letterSpacing: WIDE ? '8px' : '5px' }), all), 0, 0.5);
const rule = div({ left: (CX - 70) + 'px', top: (ty + 56) + 'px', width: '140px', height: '3px', background: '#C3A06A', transformOrigin: 'center' }, '', all);
anims.push(t => { rule.style.transform = `scaleX(${ease(seg(t, 0.1, 0.6))})`; });

// ---- number ----
const N = WIDE ? { x: 620, y: 330 } : { x: 510, y: 400 };
const num = text(N.x, N.y, 700, '', { font: `700 ${WIDE ? 220 : 210}px PF`, color: BURG, lineHeight: '1', fontVariantNumeric: 'lining-nums' }, all);
const numLab = text(N.x, N.y + (WIDE ? 250 : 236), 700, 'member growers', { font: `500 ${WIDE ? 36 : 36}px Inter`, color: C.ink, letterSpacing: '0.5px' }, all);

// ---- donut ----
const D = WIDE ? { x: 1300, y: 545, r: 190, w: 62 } : { x: 510, y: 1040, r: 190, w: 62 };
const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('width', SW); svg.setAttribute('height', SH); svg.style.position = 'absolute'; all.appendChild(svg);
svg.innerHTML = `<path class="b" fill="${BURG}"/><path class="g" fill="${GREY}"/>`;
const [pb, pg] = ['b', 'g'].map(c => svg.querySelector('.' + c));
const R0 = D.r - D.w;
const P = (a, r) => [D.x + r * Math.sin(a), D.y - r * Math.cos(a)];   // clockwise from 12 o'clock
const ring = (a0, a1) => { if (a1 - a0 < 1e-4) return ''; a1 = Math.min(a1, a0 + 2 * Math.PI - 1e-3); const big = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = P(a0, D.r), [x1, y1] = P(a1, D.r), [x2, y2] = P(a1, R0), [x3, y3] = P(a0, R0);
  return `M${x0},${y0}A${D.r},${D.r} 0 ${big} 1 ${x1},${y1}L${x2},${y2}A${R0},${R0} 0 ${big} 0 ${x3},${y3}Z`; };
const mid = text(D.x, D.y - (WIDE ? 44 : 44), 300, '~half', { font: `700 ${WIDE ? 72 : 72}px PF`, color: C.ink, lineHeight: '1.1' }, all);
const midLab = text(D.x, D.y + D.r + (WIDE ? 34 : 34), 500, 'of the region’s vines', { font: `500 ${WIDE ? 36 : 36}px Inter`, color: C.ink, letterSpacing: '0.5px' }, all);

anims.push(t => {
  const c = ease(seg(t, 0.2, 1.0)); num.textContent = '~' + Math.round(320 * c); num.style.opacity = eout(seg(t, 0.2, 0.5));
  const l = eout(seg(t, 0.6, 1.0)); numLab.style.opacity = l; numLab.style.translate = `0 ${10 * (1 - l)}px`;
  const A = 2 * Math.PI * ease(seg(t, 0.8, 1.6)), H = Math.PI;
  pb.setAttribute('d', ring(0, Math.min(A, H))); pg.setAttribute('d', A > H ? ring(H, A) : '');
  const m = eout(seg(t, 1.3, 1.8)); mid.style.opacity = m; midLab.style.opacity = m; midLab.style.translate = mid.style.translate = `0 ${10 * (1 - m)}px`;
  all.style.opacity = 1 - ease(seg(t, OUT, END));
});
render(0);
