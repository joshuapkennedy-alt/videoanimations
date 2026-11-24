// "Mostly white": share of Saale-Unstrut vineyard area, white vs red grapes, as a pie. 4.5 s. Same header style as bars.js.
// 16:9: pie centred, labels outside with thin leader lines. 9:16: title above, pie, labels stacked below.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const NS = 'http://www.w3.org/2000/svg', BURG = '#6B2737', CREAM = '#E6D3A3', OUT = 4.1, END = 4.5;
const all = div({ left: 0, top: 0, width: SW + 'px', height: SH + 'px' });

// ---- header (9:16: centre of the x 60-960 column, from 15% of the height) ----
const ty = WIDE ? 80 : 300, CX = WIDE ? SW / 2 : 510, HW = WIDE ? SW - 80 : 900;
fadeIn(text(CX, ty, HW, 'SAALE-UNSTRUT VINEYARDS', Object.assign({}, T.eyebrow, { font: `600 ${WIDE ? 26 : 28}px Inter`, letterSpacing: WIDE ? '7px' : '5px' }), all), 0);
fadeIn(text(CX, ty + (WIDE ? 48 : 56), HW, 'Mostly white', Object.assign({}, T.title, { font: `700 ${WIDE ? 96 : 110}px PF` }), all), 0.1);

// ---- pie ----
const P = WIDE ? { x: 960, y: 600, r: 260 } : { x: 510, y: 820, r: 240 };
const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('width', SW); svg.setAttribute('height', SH);
svg.style.position = 'absolute'; all.appendChild(svg);
svg.innerHTML = `<circle cx="${P.x}" cy="${P.y}" r="${P.r + 1}" fill="none" stroke="#D9C9A9" stroke-width="2" class="ring"/>
  <path class="w" fill="${CREAM}"/><path class="r" fill="${BURG}"/>
  <line class="sep" stroke="${C.bg}" stroke-width="4" stroke-linecap="round"/><line class="sep2" stroke="${C.bg}" stroke-width="4" stroke-linecap="round"/>`;
const [w, r, ring, sep, sep2] = ['w', 'r', 'ring', 'sep', 'sep2'].map(c => svg.querySelector('.' + c));
const pt = a => [P.x + P.r * Math.sin(a), P.y - P.r * Math.cos(a)];   // angle clockwise from 12 o'clock
const arc = (a0, a1) => { if (a1 - a0 < 1e-4) return ''; const [x0, y0] = pt(a0), [x1, y1] = pt(a1), big = a1 - a0 > Math.PI ? 1 : 0;
  if (a1 - a0 > 2 * Math.PI - 1e-4) return `M${P.x},${P.y - P.r}A${P.r},${P.r} 0 1 1 ${P.x - 0.01},${P.y - P.r}Z`;
  return `M${P.x},${P.y}L${x0},${y0}A${P.r},${P.r} 0 ${big} 1 ${x1},${y1}Z`; };
const SPLIT = 0.75 * 2 * Math.PI;

// ---- labels ----
const lab = (word, share, col) => `<div style="font:500 ${WIDE ? 30 : 32}px Inter;color:${C.sub};letter-spacing:1px">${word}</div>` +
  `<div style="font:700 ${WIDE ? 64 : 64}px PF;color:${col};line-height:1.05;font-variant-numeric:lining-nums">${share}</div>`;
let labels;
if (WIDE) {
  // leaders from the middle of each slice's rim out to the label
  const lead = (a, dx, dy) => { const [x0, y0] = [P.x + (P.r - 6) * Math.sin(a), P.y - (P.r - 6) * Math.cos(a)], x1 = x0 + dx, y1 = y0 + dy;
    const l = document.createElementNS(NS, 'polyline'); l.setAttribute('points', `${x0},${y0} ${x1},${y1} ${x1 + Math.sign(dx) * 60},${y1}`);
    Object.entries({ fill: 'none', stroke: C.ink, 'stroke-width': 1.5, 'stroke-opacity': 0.7 }).forEach(([k, v]) => l.setAttribute(k, v)); svg.appendChild(l); return [l, x1 + Math.sign(dx) * 72, y1]; };
  const [lw, wx, wy] = lead(Math.PI * 0.75, 70, 50), [lr, rx, ry] = lead(Math.PI * 1.75, -70, -50);
  labels = [
    { el: div({ left: wx + 'px', top: (wy - 52) + 'px', whiteSpace: 'nowrap' }, lab('white', '~3 in 4', C.ink), all), line: lw, a: 1.2 },
    { el: div({ left: (rx - 300) + 'px', top: (ry - 52) + 'px', width: '300px', textAlign: 'right', whiteSpace: 'nowrap' }, lab('red', '~1 in 4', BURG), all), line: lr, a: 1.6 },
  ];
} else {
  // stacked below the pie, each with a swatch
  const row = (word, share, col, fill, y) => div({ left: '230px', top: y + 'px', width: '560px', display: 'flex', alignItems: 'center', gap: '26px' },
    `<span style="flex:none;width:44px;height:44px;border-radius:8px;background:${fill};box-shadow:inset 0 0 0 2px rgba(40,29,22,.12)"></span>` +
    `<span style="font:500 34px Inter;color:${C.sub};letter-spacing:1px;width:110px">${word}</span>` +
    `<span style="font:700 64px PF;color:${col};font-variant-numeric:lining-nums">${share}</span>`, all);
  labels = [{ el: row('white', '~3 in 4', C.ink, CREAM, 1110), a: 1.2 }, { el: row('red', '~1 in 4', BURG, BURG, 1210), a: 1.6 }];
}
fadeIn(text(CX, WIDE ? 990 : 1350, HW, 'share of vineyard area, approximate', { font: `400 ${WIDE ? 24 : 27}px Inter`, color: 'rgba(40, 29, 22, 0.6)' }, all), 1.6);

anims.push(t => {
  const A = 2 * Math.PI * ease(seg(t, 0.3, 1.3));
  w.setAttribute('d', arc(0, Math.min(A, SPLIT))); r.setAttribute('d', A > SPLIT ? arc(SPLIT, A) : '');
  ring.setAttribute('opacity', eout(seg(t, 0.2, 0.5)));
  // thin parchment gaps between the slices once both exist
  const g = seg(t, 1.0, 1.3), [x0, y0] = pt(0), [x1, y1] = pt(SPLIT);
  [[sep, x0, y0], [sep2, x1, y1]].forEach(([l, x, y]) => { l.setAttribute('x1', P.x); l.setAttribute('y1', P.y); l.setAttribute('x2', x); l.setAttribute('y2', y); l.setAttribute('opacity', A > SPLIT + 0.05 ? g : 0); });
  labels.forEach(({ el, line, a }) => { const k = eout(seg(t, a, a + 0.5)); el.style.opacity = k; el.style.translate = `0 ${10 * (1 - k)}px`;
    if (line) { line.style.opacity = k; } });
  all.style.opacity = 1 - ease(seg(t, OUT, END));
});
render(0);
