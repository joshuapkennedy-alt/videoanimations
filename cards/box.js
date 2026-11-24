// "Saale-Unstrut in a box": what's in Vine to Table box #1, three tiles in the "Thriving at the Edge" style. 8.3 s.
// 16:9: tiles in a row. 9:16: tiles stacked (icon left, text right) in the x 60-960 column, between 15% and 75% of the height.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const NS = 'http://www.w3.org/2000/svg', OUT = 7.9, END = 8.3;
const all = div({ left: 0, top: 0, width: SW + 'px', height: SH + 'px' });   // wrapper for the closing fade

// five bottles side by side (neck, shoulder, body)
const bottle = x => `<path d="M${x - 1.8} 20V32C${x - 1.8} 35 ${x - 5.2} 37 ${x - 5.2} 43V82H${x + 5.2}V43C${x + 5.2} 37 ${x + 1.8} 35 ${x + 1.8} 32V20Z"/>`;
const ITEMS = [
  { name: '5 wines', line: 'all from Saale-Unstrut', color: '#6B2737', a: 0.4, icon: [16, 33, 50, 67, 84].map(bottle).join('') },
  { name: 'Tasting cards', line: 'what to look for in each glass', color: '#B8925A', a: 4.4,
    icon: '<rect x="16" y="22" width="68" height="56" rx="7"/><path d="M28 38H72M28 50H72M28 62H58"/>' },
  { name: 'The region’s story', line: 'the places and people behind them', color: '#697246', a: 5.6,
    icon: '<path d="M6 84C20 66 34 64 50 76C62 66 78 62 94 84"/><path d="M50 62C50 62 34 46 34 33a16 16 0 0 1 32 0c0 13-16 29-16 29z"/><circle cx="50" cy="33" r="5.5"/>' },
];

// ---- header ----
const ty = WIDE ? 110 : 300, CX = WIDE ? SW / 2 : 510, HW = WIDE ? SW - 80 : 900;
fadeIn(text(CX, ty, HW, 'VINE TO TABLE · BOX #1', Object.assign({}, T.eyebrow, { font: `600 ${WIDE ? 26 : 28}px Inter`, letterSpacing: WIDE ? '7px' : '6px', whiteSpace: 'nowrap' }), all), 0);
fadeIn(text(CX, ty + (WIDE ? 50 : 54), HW, WIDE ? 'Saale-Unstrut in a box' : 'Saale-Unstrut<br>in a box', Object.assign({}, T.title, { font: `700 ${WIDE ? 104 : 96}px PF`, lineHeight: '1.05' }), all), 0.1);
const rule = div({ left: (CX - 70) + 'px', top: (ty + (WIDE ? 190 : 276)) + 'px', width: '140px', height: '3px', background: '#C3A06A', transformOrigin: 'center' }, '', all);
anims.push(t => { rule.style.transform = `scaleX(${ease(seg(t, 0.3, 0.8))})`; });

// ---- tiles ----
function iconBadge(parent, size, it) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', size); svg.setAttribute('height', size); svg.setAttribute('viewBox', '0 0 100 100');
  svg.style.display = 'block'; svg.style.overflow = 'visible'; svg.style.flex = 'none';
  svg.innerHTML = `<circle class="ring" cx="50" cy="50" r="48" fill="${it.color}"/>` +
    `<g class="ic" fill="none" stroke="#FBF6EC" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" transform="translate(50 50) scale(.72) translate(-50 -50)">${it.icon}</g>`;
  parent.appendChild(svg);
  return svg;
}
const backOut = x => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
ITEMS.forEach((it, k) => {
  const a = it.a, tile = { background: '#F6EFE1', border: '2px solid #DCCDB2', borderRadius: '16px', boxSizing: 'border-box', display: 'flex' };
  let box, badge, head, sub;
  if (WIDE) {
    const cw = 520, gap = 40, x = (SW - (3 * cw + 2 * gap)) / 2 + k * (cw + gap);
    box = div(Object.assign(tile, { left: x + 'px', top: '400px', width: cw + 'px', height: '410px', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '54px 24px 0' }), '', all);
    badge = iconBadge(box, 150, it);
    head = div({ position: 'static', font: '700 52px PF', color: C.ink, marginTop: '34px', lineHeight: '1.05', whiteSpace: 'nowrap' }, it.name, box);
    sub = div({ position: 'static', font: '400 28px Inter', color: C.sub, marginTop: '16px', lineHeight: '1.35' }, it.line, box);
  } else {
    box = div(Object.assign(tile, { left: '60px', top: (630 + k * 240) + 'px', width: '900px', height: '216px', alignItems: 'center', padding: '0 40px', gap: '36px' }), '', all);
    badge = iconBadge(box, 136, it);
    const col = div({ position: 'static', flex: '1' }, '', box);
    head = div({ position: 'static', font: '700 54px PF', color: C.ink, lineHeight: '1.05', whiteSpace: 'nowrap' }, it.name, col);
    sub = div({ position: 'static', font: '400 30px Inter', color: C.sub, marginTop: '12px', lineHeight: '1.35' }, it.line, col);
  }
  const ic = badge.querySelector('.ic'), ring = badge.querySelector('.ring');
  const strokes = [...ic.children].map(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; return [p, L]; });
  anims.push(t => {
    const b = eout(seg(t, a, a + 0.45)); box.style.opacity = b; box.style.translate = `0 ${30 * (1 - b)}px`;
    const r = seg(t, a + 0.1, a + 0.55); ring.setAttribute('transform', `translate(50 50) scale(${r > 0 ? backOut(r) : 0}) translate(-50 -50)`);
    const d = ease(seg(t, a + 0.35, a + 1.05)); strokes.forEach(([p, L]) => p.style.strokeDashoffset = L * (1 - d));
    const h = eout(seg(t, a + 0.3, a + 0.7)); head.style.opacity = h; head.style.translate = `0 ${12 * (1 - h)}px`;
    const s = eout(seg(t, a + 0.45, a + 0.85)); sub.style.opacity = s; sub.style.translate = `0 ${12 * (1 - s)}px`;
  });
});

fadeIn(text(CX, WIDE ? 880 : 1380, HW, '18+ only', { font: `400 ${WIDE ? 24 : 27}px Inter`, color: 'rgba(40, 29, 22, 0.6)', letterSpacing: '1px' }, all), 6.0);
anims.push(t => { all.style.opacity = 1 - ease(seg(t, OUT, END)); });
render(0);
