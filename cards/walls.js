// "Why the walls matter": transparent lower third (16:9) / centre panel (9:16) of three tiles, for use over video.
// Same palette, fonts, tile style and icon animation as thrive.js. window.WIDE selects the 16:9 layout.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const NS = 'http://www.w3.org/2000/svg';
const T0 = 0.3, GAP = 0.4, OUT = 6.1, END = 6.5;   // header fades in over 0.3 s, tiles every 0.4 s, all out over the last 0.4 s

const ITEMS = [
  { name: 'Hold soil', line: 'stops rain washing it away', color: '#697246',
    icon: '<path d="M10 84H90"/><rect x="62" y="20" width="24" height="18" rx="3"/><rect x="62" y="41" width="24" height="18" rx="3"/><rect x="62" y="62" width="24" height="18" rx="3"/><path d="M12 32c10-4 20 4 30 0s10-2 14 0"/><path d="M12 50c10-4 20 4 30 0s10-2 14 0"/><path d="M12 68c10-4 20 4 30 0s10-2 14 0"/>' },
  { name: 'Store warmth', line: 'stones soak up the sun', color: '#B8925A',
    icon: '<circle cx="50" cy="50" r="15"/><path d="M50 18V26M50 74V82M18 50H26M74 50H82M27 27l6 6M67 67l6 6M27 73l6-6M67 33l6-6"/>' },
  { name: 'Wildlife', line: 'a home for plants and animals', color: '#8A6B4A',
    icon: '<path d="M22 80C22 44 46 22 82 18C82 56 60 80 22 80Z"/><path d="M22 80L64 38"/><path d="M40 62H54M50 52V38"/>' },
];

const tileBg = 'rgba(246, 239, 225, 0.92)', tileBorder = '2px solid rgba(220, 205, 178, 0.9)';
const shadow = '0 10px 30px rgba(40, 29, 22, 0.28), 0 2px 6px rgba(40, 29, 22, 0.18)';
const all = div({ left: 0, top: 0, width: SW + 'px', height: SH + 'px' });   // wrapper for the closing fade

function iconBadge(parent, size, it) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', size); svg.setAttribute('height', size); svg.setAttribute('viewBox', '0 0 100 100');
  svg.style.display = 'block'; svg.style.overflow = 'visible'; svg.style.flex = 'none';
  svg.innerHTML = `<circle class="ring" cx="50" cy="50" r="48" fill="${it.color}"/>` +
    `<g class="ic" fill="none" stroke="#FBF6EC" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" transform="translate(50 50) scale(.72) translate(-50 -50)">${it.icon}</g>`;
  parent.appendChild(svg);
  return svg;
}

// ---- geometry ----
// 16:9: group 1104 px wide, centred, bottom edge 80 px above the frame bottom; the top two-thirds stay empty.
// 9:16: tiles stacked in a column x 60-960 (120+ px clear on the right), everything between 25% and 75% of the height.
let tiles, header;
if (WIDE) {
  const tw = 352, th = 196, gap = 24, gw = 3 * tw + 2 * gap, x0 = (SW - gw) / 2, y = SH - 80 - th;
  tiles = ITEMS.map((it, k) => ({ x: x0 + k * (tw + gap), y, w: tw, h: th }));
  header = { cx: SW / 2, y: y - 62, w: gw, size: 22 };
} else {
  const tw = 900, th = 236, gap = 30, x0 = 60, total = 80 + 3 * th + 2 * gap, y0 = (SH - total) / 2;
  tiles = ITEMS.map((it, k) => ({ x: x0, y: y0 + 80 + k * (th + gap), w: tw, h: th }));
  header = { cx: x0 + tw / 2, y: y0, w: tw, size: 26 };
}

// ---- header ----
// on a small parchment tab (same fill and shadow as the tiles) so the gold reads over any footage
const hd = div(Object.assign({}, T.eyebrow, { left: header.cx + 'px', top: header.y + 'px', transform: 'translateX(-50%)',
  font: `600 ${header.size}px Inter`, letterSpacing: '6px', whiteSpace: 'nowrap', padding: `${WIDE ? 8 : 10}px ${WIDE ? 14 : 18}px ${WIDE ? 8 : 10}px ${WIDE ? 20 : 24}px`,
  background: tileBg, border: tileBorder, borderRadius: '12px', boxShadow: shadow }), 'WHY THE WALLS MATTER', all);
anims.push(t => { hd.style.opacity = eout(seg(t, 0, 0.3)); });

// ---- tiles ----
const backOut = x => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
ITEMS.forEach((it, k) => {
  const g = tiles[k], a = T0 + k * GAP;
  let box, badge, head, sub;
  const base = { left: g.x + 'px', top: g.y + 'px', width: g.w + 'px', height: g.h + 'px', background: tileBg, border: tileBorder,
    borderRadius: '16px', boxSizing: 'border-box', boxShadow: shadow, display: 'flex' };
  if (WIDE) {
    box = div(Object.assign(base, { flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '22px 16px 0' }), '', all);
    badge = iconBadge(box, 76, it);
    head = div({ position: 'static', font: '700 36px PF', color: C.ink, marginTop: '14px', lineHeight: '1.05', whiteSpace: 'nowrap' }, it.name, box);
    sub = div({ position: 'static', font: '400 21px Inter', color: C.sub, marginTop: '8px', lineHeight: '1.3', whiteSpace: 'nowrap' }, it.line, box);
  } else {
    box = div(Object.assign(base, { alignItems: 'center', padding: '0 40px', gap: '36px' }), '', all);
    badge = iconBadge(box, 140, it);
    const col = div({ position: 'static', flex: '1' }, '', box);
    head = div({ position: 'static', font: '700 60px PF', color: C.ink, lineHeight: '1.05', whiteSpace: 'nowrap' }, it.name, col);
    sub = div({ position: 'static', font: '400 30px Inter', color: C.sub, marginTop: '12px', lineHeight: '1.35', whiteSpace: 'nowrap' }, it.line, col);
  }
  const ic = badge.querySelector('.ic'), ring = badge.querySelector('.ring');
  const strokes = [...ic.children].map(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; return [p, L]; });
  anims.push(t => {
    const b = eout(seg(t, a, a + 0.45)); box.style.opacity = b; box.style.translate = `0 ${30 * (1 - b)}px`;
    const r = seg(t, a + 0.1, a + 0.55); ring.setAttribute('transform', `translate(50 50) scale(${r > 0 ? backOut(r) : 0}) translate(-50 -50)`);
    const d = ease(seg(t, a + 0.3, a + 1.0)); strokes.forEach(([p, L]) => p.style.strokeDashoffset = L * (1 - d));
    const h = eout(seg(t, a + 0.2, a + 0.6)); head.style.opacity = h; head.style.translate = `0 ${10 * (1 - h)}px`;
    const s = eout(seg(t, a + 0.3, a + 0.7)); sub.style.opacity = s; sub.style.translate = `0 ${10 * (1 - s)}px`;
  });
});

// ---- closing fade ----
anims.push(t => { all.style.opacity = 1 - ease(seg(t, OUT, END)); });
render(0);
