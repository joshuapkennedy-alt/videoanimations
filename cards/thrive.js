// "Thriving at the Edge": title, then four reasons added one at a time. window.WIDE selects the 16:9 layout.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const NS = 'http://www.w3.org/2000/svg';
const T0 = 0.9, STEP = 2.5;                       // item k appears at T0 + k*STEP
window.STEP_STARTS = [0, 1, 2, 3].map(k => T0 + k * STEP);

const ITEMS = [
  { name: 'Rivers', line: 'valleys trap the warmth', color: '#5F8BA8',
    icon: '<path d="M14 36c8-8 14-8 22 0s14 8 22 0 14-8 22 0"/><path d="M14 52c8-8 14-8 22 0s14 8 22 0 14-8 22 0"/><path d="M14 68c8-8 14-8 22 0s14 8 22 0 14-8 22 0"/>' },
  { name: 'Slopes', line: 'steep, south-facing slopes catch more sun', color: '#697246',
    icon: '<path d="M10 84L90 34V84Z"/><circle cx="28" cy="28" r="7"/><path d="M28 10V15M28 41V46M10 28H15M41 28H46M15 15l3 3M38 38l3 3M15 41l3-3M38 18l3-3"/>' },
  { name: 'Dry', line: 'low rainfall, so less rot', color: '#B8925A',
    icon: '<circle cx="50" cy="50" r="15"/><path d="M50 18V26M50 74V82M18 50H26M74 50H82M27 27l6 6M67 67l6 6M27 73l6-6M67 33l6-6"/>' },
  { name: 'Soil', line: "shell limestone and sandstone store the day's heat", color: '#8A6B4A',
    icon: '<path d="M12 30c12-5 24 5 38 0s26-5 38 0"/><path d="M12 52c12-5 24 5 38 0s26-5 38 0"/><path d="M12 74c12-5 24 5 38 0s26-5 38 0"/><circle cx="30" cy="41" r="3"/><circle cx="62" cy="40" r="3"/><circle cx="46" cy="63" r="3"/><circle cx="76" cy="63" r="3"/>' },
];

// ---- title ----
const eyebrowStyle = Object.assign({}, T.eyebrow, { font: `600 ${WIDE ? 26 : 26}px Inter`, letterSpacing: WIDE ? '7px' : '5px', whiteSpace: 'nowrap' });
const titleStyle = Object.assign({}, T.title, { font: `700 ${WIDE ? 104 : 98}px PF`, whiteSpace: 'nowrap' });
const ty = WIDE ? 120 : 150;
const CX = WIDE ? SW / 2 : 495, CW = WIDE ? SW - 80 : 900;   // 9:16: column x 45-945, so the ~912 px title stays 120+ px clear of the right edge
fadeIn(text(CX, ty, WIDE ? CW : 960, "GERMANY'S NORTHERNMOST QUALITY-WINE REGION", eyebrowStyle), 0.15);
fadeIn(text(CX, ty + (WIDE ? 50 : 58), WIDE ? CW : 960, 'Thriving at the Edge', titleStyle), 0.3);
const rule = div({ left: (CX - 70) + 'px', top: (ty + (WIDE ? 190 : 200)) + 'px', width: '140px', height: '3px', background: '#C3A06A', transformOrigin: 'center' });
anims.push(t => { const k = ease(seg(t, 0.5, 1.0)); rule.style.transform = `scaleX(${k})`; });

// ---- items ----
function iconBadge(parent, size, it) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', size); svg.setAttribute('height', size); svg.setAttribute('viewBox', '0 0 100 100');
  svg.style.display = 'block'; svg.style.overflow = 'visible';
  svg.innerHTML = `<circle class="ring" cx="50" cy="50" r="48" fill="${it.color}"/>` +
    `<g class="ic" fill="none" stroke="#FBF6EC" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" transform="translate(50 50) scale(.72) translate(-50 -50)">${it.icon}</g>`;
  parent.appendChild(svg);
  return svg;
}
ITEMS.forEach((it, k) => {
  const a = T0 + k * STEP;
  let box, badge, head, sub;
  if (WIDE) {
    const cw = 400, gap = 40, x0 = (SW - (4 * cw + 3 * gap)) / 2, x = x0 + k * (cw + gap), y = 430;
    box = div({ left: x + 'px', top: y + 'px', width: cw + 'px', height: '520px', background: '#F6EFE1', border: '2px solid #DCCDB2', borderRadius: '16px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '56px 34px 0' });
    badge = iconBadge(box, 150, it);
    head = div({ position: 'static', font: '700 62px PF', color: C.ink, marginTop: '34px', lineHeight: '1.05' }, it.name, box);
    sub = div({ position: 'static', font: '400 28px Inter', color: C.sub, marginTop: '18px', lineHeight: '1.35' }, it.line, box);
  } else {
    const cw = 430, ch = 460, gap = 40, x = CX - CW / 2 + (k % 2) * (cw + gap), y = 440 + Math.floor(k / 2) * (ch + gap);
    box = div({ left: x + 'px', top: y + 'px', width: cw + 'px', height: ch + 'px', background: '#F6EFE1', border: '2px solid #DCCDB2', borderRadius: '16px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '50px 34px 0' });
    badge = iconBadge(box, 150, it);
    head = div({ position: 'static', font: '700 64px PF', color: C.ink, marginTop: '32px', lineHeight: '1.05' }, it.name, box);
    sub = div({ position: 'static', font: '400 31px Inter', color: C.sub, marginTop: '16px', lineHeight: '1.35' }, it.line, box);
  }
  const ic = badge.querySelector('.ic'), ring = badge.querySelector('.ring');
  const strokes = [...ic.children].map(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; return [p, L]; });
  const backOut = x => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  anims.push(t => {
    const b = eout(seg(t, a, a + 0.45)); box.style.opacity = b; box.style.translate = `0 ${30 * (1 - b)}px`;
    const r = seg(t, a + 0.1, a + 0.55); ring.setAttribute('transform', `translate(50 50) scale(${r > 0 ? backOut(r) : 0}) translate(-50 -50)`);
    const d = ease(seg(t, a + 0.35, a + 1.05)); strokes.forEach(([p, L]) => p.style.strokeDashoffset = L * (1 - d));
    const h = eout(seg(t, a + 0.3, a + 0.7)); head.style.opacity = h; head.style.translate = `0 ${12 * (1 - h)}px`;
    const s = eout(seg(t, a + 0.45, a + 0.85)); sub.style.opacity = s; sub.style.translate = `0 ${12 * (1 - s)}px`;
  });
});
render(0);
