// "2025 · Vineyard area: change vs 2024": diverging bars, one row per region, -5% to +2%, in the bars.js chart style. 11 s.
// Cues: grey bars 1.65 s; Saale-Unstrut, Ahr, Sachsen 4.15 s; "+10 ha" card 7.15 s; pulse on "But it still grew" 9.6 s; fade-out 10.6-11.0 s.
// Names in a column on the left; values at the bar ends (percent in Playfair, hectares in Inter); counts run as bars grow.
// The "+10 ha" card sits beside the Saale-Unstrut bar, in the empty space left of the zero line on the top rows.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const BURG = '#6B2737', TAUPE = '#B3A58C', GREY = '#9A9284', END = 11.0, OUT = 10.6;
const all = div({ left: 0, top: 0, width: SW + 'px', height: SH + 'px' });
const ROWS = [
  ['Saale-Unstrut', 1.2, 10, 'su'], ['Ahr', 0.4, 2, 'up'], ['Sachsen', 0.4, 2, 'up'], ['Rheinhessen', -0.1, -14], ['Pfalz', -0.6, -147],
  ['Franken', -1.4, -88], ['Nahe', -1.6, -68], ['Mosel', -1.9, -158], ['Rheingau', -2.0, -63], ['Baden', -2.0, -312],
  ['Mittelrhein', -2.7, -12], ['Hessische Bergstraße', -3.5, -16], ['Württemberg', -4.3, -485],
];
const fmtP = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1) + '%';
const fmtH = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.round(Math.abs(v)) + ' ha';

// ---- header (centred, as bars.js) ----
const ty = WIDE ? 56 : 300, CX = WIDE ? SW / 2 : 510, HW = WIDE ? SW - 80 : 900;
fadeIn(text(CX, ty, HW, '2025 · VINEYARD AREA', Object.assign({}, T.eyebrow, { font: `600 ${WIDE ? 26 : 28}px Inter`, letterSpacing: '7px' }), all), 0);
fadeIn(text(CX, ty + (WIDE ? 44 : 48), HW, 'Change vs 2024', Object.assign({}, T.title, { font: `700 ${WIDE ? 84 : 80}px PF` }), all), 0.15);

// ---- geometry ----
// 16:9: names right-aligned at x 440; -5% at x 660, 0 at 1360, +2% at 1640. 9:16: names at x 330; -5% at 480, 0 at 735, +2% at 837.
const G = WIDE ? { nameR: 440, x0: 660, u: 140, y0: 236, rh: 54, bh: 30, nameS: 22, pS: 26, hS: 17 }
               : { nameR: 330, x0: 480, u: 51, y0: 470, rh: 62, bh: 30, nameS: 21, pS: 23, hS: 15 };
const X = v => G.x0 + (v + 5) * G.u, ZERO = X(0), plotB = G.y0 + ROWS.length * G.rh;
// gridlines and tick labels (every 1%)
for (let v = -5; v <= 2; v++) {
  const g = div({ left: (X(v) - 0.5) + 'px', top: (G.y0 - 8) + 'px', width: '1px', height: (plotB - G.y0 + 16) + 'px', background: v === 0 ? 'transparent' : '#D8CBB3' }, '', all);
  const l = text(X(v), plotB + 14, 80, v === 0 ? '0' : fmtP(v).replace('.0', ''), { font: `400 ${WIDE ? 19 : 17}px Inter`, color: '#8A7C65' }, all);
  fadeIn(g, 0.1, 0.5, 0); fadeIn(l, 0.2, 0.5, 0);
}
const zero = div({ left: (ZERO - 1) + 'px', top: (G.y0 - 12) + 'px', width: '2px', height: (plotB - G.y0 + 24) + 'px', background: C.ink, transformOrigin: 'top' }, '', all);
anims.push(t => { zero.style.transform = `scaleY(${ease(seg(t, 0, 0.6))})`; });

// ---- rows ----
const rows = ROWS.map(([name, pct, ha, kind], i) => {
  const yc = G.y0 + i * G.rh + G.rh / 2, su = kind === 'su', pos = pct > 0;
  const col = su ? BURG : pos ? TAUPE : GREY;
  const nm = div({ left: (G.nameR - 400) + 'px', top: (yc - G.nameS * 0.7) + 'px', width: '400px', textAlign: 'right', font: `${su ? 700 : 500} ${G.nameS}px Inter`, color: su ? BURG : C.ink, whiteSpace: 'nowrap' }, name, all);
  fadeIn(nm, 0.15 + i * 0.03, 0.4, 0);
  const bar = div({ top: (yc - G.bh / 2) + 'px', height: G.bh + 'px', background: col, borderRadius: pos ? '0 5px 5px 0' : '5px 0 0 5px',
    boxShadow: su ? '0 0 18px rgba(107,39,55,.45), 0 0 4px rgba(107,39,55,.35)' : 'none' }, '', all);
  const val = div({ top: (yc - G.pS * 0.68) + 'px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'baseline', gap: '8px', flexDirection: pos ? 'row' : 'row-reverse' },
    `<span class="p" style="font:700 ${G.pS}px PF;color:${su ? BURG : C.ink};font-variant-numeric:lining-nums"></span><span class="h" style="font:400 ${G.hS}px Inter;color:${C.sub}"></span>`, all);
  return { pct, ha, pos, su, bar, val, p: val.querySelector('.p'), h: val.querySelector('.h'), a: pos ? 4.15 : 1.65, d: pos ? 0.6 : 0.8 };
});

// ---- "+10 ha" card, beside the Saale-Unstrut bar (left of the zero line, over the empty top rows) ----
const suY = G.y0 + G.rh / 2;
const card = div({ top: (suY - (WIDE ? 26 : 24)) + 'px', right: (SW - ZERO + (WIDE ? 22 : 14)) + 'px', boxSizing: 'border-box', padding: WIDE ? '14px 24px 16px' : '12px 18px 14px',
  background: '#F6EFE1', border: '2px solid #DCCDB2', borderRadius: '14px', boxShadow: '0 8px 22px rgba(40,29,22,.12), 0 2px 5px rgba(40,29,22,.08)', whiteSpace: 'nowrap', textAlign: 'right' },
  `<div style="font:700 ${WIDE ? 46 : 38}px PF;color:${BURG};line-height:1;font-variant-numeric:lining-nums">+10 ha</div>` +
  `<div style="font:500 ${WIDE ? 20 : 18}px Inter;color:${C.ink};margin-top:6px">868 ha · grew the most</div>`, all);

// ---- source ----
fadeIn(text(CX, plotB + (WIDE ? 52 : 50), HW, 'Source: Destatis / DWI, stocked vineyard area', { font: `400 ${WIDE ? 19 : 18}px Inter`, color: 'rgba(40, 29, 22, 0.6)' }, all), 0.4);

anims.push(t => {
  rows.forEach(r => {
    const k = eout(seg(t, r.a, r.a + r.d)), v = r.pct * k, x = X(v);
    const L = Math.min(ZERO, x), W = Math.abs(x - ZERO);
    r.bar.style.left = L + 'px'; r.bar.style.width = W + 'px'; r.bar.style.opacity = k > 0 ? 1 : 0;
    r.p.textContent = fmtP(v); r.h.textContent = fmtH(r.ha * k);
    r.val.style.opacity = eout(seg(t, r.a, r.a + 0.3));
    if (r.pos) { r.val.style.left = (x + 10) + 'px'; r.val.style.right = 'auto'; } else { r.val.style.right = (SW - x + 10) + 'px'; r.val.style.left = 'auto'; }
    if (r.su) { const pu = Math.sin(Math.PI * seg(t, 9.6, 10.15));   // "But it still grew"
      r.bar.style.transform = `scaleY(${1 + 0.22 * pu})`; r.bar.style.boxShadow = `0 0 ${18 + 16 * pu}px rgba(107,39,55,${0.45 + 0.25 * pu}), 0 0 4px rgba(107,39,55,.35)`; }
  });
  const c = eout(seg(t, 7.15, 7.65)); card.style.opacity = c; card.style.translate = `${-14 * (1 - c)}px 0`;
  all.style.opacity = 1 - ease(seg(t, OUT, END));
});
render(0);
