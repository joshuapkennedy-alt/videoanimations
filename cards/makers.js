// "Old to new": a three-point timeline (Kloster Pforta, Rotkäppchen, 1990) over four family-estate tiles, 32.8 s.
// Same dots, type and easing as timeline.js. The line is ink up to 1990 and turns gold after it (from 13 s).
// Each tile has a small gold vine-leaf line icon, the name and one line (all four identical in size and style).
// 16:9: timeline across the top half, tiles in a row below. 9:16: timeline top to bottom, tiles in a 2x2 grid below,
// everything between 15% and 75% of the height and 120+ px clear of the right edge.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const BURG = '#6B2737', NS = 'http://www.w3.org/2000/svg', OUT = 32.4, END = 32.8;
const all = div({ left: 0, top: 0, width: SW + 'px', height: SH + 'px' });
const backOut = x => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

// ---- header ----
const ty = WIDE ? 56 : 300, CX = WIDE ? SW / 2 : 510, HW = WIDE ? SW - 80 : 900;
fadeIn(text(CX, ty, HW, 'THE MAKERS', Object.assign({}, T.eyebrow, { font: `600 ${WIDE ? 26 : 28}px Inter`, letterSpacing: '7px' }), all), 0);
fadeIn(text(CX, ty + (WIDE ? 44 : 50), HW, 'Old to new', Object.assign({}, T.title, { font: `700 ${WIDE ? 84 : 92}px PF` }), all), 0.15);

// ---- timeline ----
// 16:9: line at y 330, x 230-1690; points at 400 / 880 / 1360. 9:16: line at x 120, y 470-860; points at 500 / 620 / 740.
const PTS = [
  { year: '1100s', strong: 'Kloster Pforta', body: 'still farming the monks’ vineyards', a: 0.3 },
  { year: '1850s', strong: 'Rotkäppchen', body: 'Sekt in Freyburg', a: 7.0 },
  { year: '1990', strong: 'After the Wall: the families', body: '', a: 13.0 },
];
const L = WIDE ? { at: 330, a: 230, b: 1690, pos: [400, 880, 1360] } : { at: 120, a: 468, b: 862, pos: [505, 625, 745] };
const seg1 = div({ background: C.ink, borderRadius: '2px' }, '', all), seg2 = div({ background: C.ink, borderRadius: '2px' }, '', all);
const gold2 = div({ background: C.gold, borderRadius: '2px', opacity: 0 }, '', all);
const split = L.pos[2];
const place = (el, a, b) => Object.assign(el.style, WIDE ? { left: a + 'px', top: (L.at - 2) + 'px', width: Math.max(0, b - a) + 'px', height: '4px' }
                                                       : { left: (L.at - 2) + 'px', top: a + 'px', width: '4px', height: Math.max(0, b - a) + 'px' });
anims.push(t => {
  const end = L.a + (L.b - L.a) * eout(seg(t, 0, 1.0));
  place(seg1, L.a, Math.min(end, split)); place(seg2, split, end); place(gold2, split, end);
  gold2.style.opacity = ease(seg(t, 13.0, 13.8));
});
PTS.forEach((p, i) => {
  const g = div({ left: 0, top: 0 }, '', all), D = WIDE ? 28 : 30;
  const x = WIDE ? L.pos[i] : L.at, y = WIDE ? L.at : L.pos[i];
  const dot = div({ left: (x - D / 2) + 'px', top: (y - D / 2) + 'px', width: D + 'px', height: D + 'px', borderRadius: '50%', boxSizing: 'border-box',
    background: BURG, border: `5px solid ${C.bg}`, boxShadow: `0 0 0 2px ${i === 2 ? C.gold : C.gold}` }, '', g);
  const html = `<div style="font-weight:600;color:${C.ink}">${p.strong}</div>` + (p.body ? `<div style="margin-top:4px">${p.body}</div>` : '');
  let yr, lab;
  if (WIDE) {
    yr = text(x, y - 40 - 70, 420, p.year, { font: '700 70px PF', color: C.ink, lineHeight: '1', fontVariantNumeric: 'lining-nums' }, g);
    lab = text(x, y + 34, 440, html, { font: '400 25px Inter', color: C.sub, lineHeight: '1.3' }, g);
  } else {
    yr = div({ left: (x + 40) + 'px', top: (y - 34) + 'px', font: '700 64px PF', color: C.ink, lineHeight: '1', fontVariantNumeric: 'lining-nums' }, p.year, g);
    lab = div({ left: (x + 250) + 'px', top: (y - 30) + 'px', width: (960 - x - 250) + 'px', font: '400 25px Inter', color: C.sub, lineHeight: '1.3' }, html, g);
  }
  anims.push(t => {
    const r = seg(t, p.a, p.a + 0.45); dot.style.transform = `scale(${r > 0 ? backOut(r) : 0})`;
    const h = eout(seg(t, p.a + 0.25, p.a + 0.7)); yr.style.opacity = h; yr.style.translate = `0 ${12 * (1 - h)}px`;
    const s = eout(seg(t, p.a + 0.45, p.a + 0.95)); lab.style.opacity = s; lab.style.translate = `0 ${12 * (1 - s)}px`;
    const next = PTS[i + 1]; g.style.opacity = next ? 1 - 0.4 * ease(seg(t, next.a, next.a + 0.6)) : 1;
  });
});

// ---- family tiles ----
// four identical tiles: a small gold vine-leaf line icon at the top, the name and one line. No logos, photos, initials or tags.
const FAM = [
  { name: 'Herzer', line: 'started in 1992', a: 15.0 },
  { name: 'Pawis', line: 'began as a side business on ½ ha', a: 17.4 },
  { name: 'Hey', line: 'cleared brambles, repaired dry-stone walls', a: 21.2 },
  { name: 'Böhme &amp; Töchter', line: 'first vines 1986, still in the GDR', a: 26.6 },
];
const tileSt = { background: '#F6EFE1', border: '2px solid #DCCDB2', borderRadius: '16px', boxSizing: 'border-box', boxShadow: '0 8px 24px rgba(40,29,22,.12), 0 2px 5px rgba(40,29,22,.08)' };
const LEAF = '<path d="M50 84C46 76 40 72 31 72C23 72 17 66 19 58C11 56 7 48 11 41C15 35 22 34 27 36C25 27 31 19 39 21C41 13 47 9 50 9C53 9 59 13 61 21C69 19 75 27 73 36C78 34 85 35 89 41C93 48 89 56 81 58C83 66 77 72 69 72C60 72 54 76 50 84Z"/>' +
  '<path d="M50 84V92M50 84V32M50 66L30 50M50 66L70 50M50 52L37 34M50 52L63 34"/>';
const IS = WIDE ? 58 : 56;   // icon size, the same on every tile
function leaf(parent) {
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('width', IS); svg.setAttribute('height', IS); svg.setAttribute('viewBox', '0 0 100 100');
  svg.style.display = 'block'; svg.style.flex = 'none'; svg.style.overflow = 'visible';
  svg.innerHTML = `<g fill="none" stroke="${C.gold}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">${LEAF}</g>`;
  parent.appendChild(svg);
  return [...svg.querySelectorAll('path')].map(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; return [p, L]; });
}
FAM.forEach((f, k) => {
  let box, strokes;
  if (WIDE) {
    const w = 330, gap = 40, x = (SW - 4 * w - 3 * gap) / 2 + k * (w + gap), y = 580;
    box = div(Object.assign({ left: x + 'px', top: y + 'px', width: w + 'px', height: '236px', padding: '24px 20px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }, tileSt), '', all);
    strokes = leaf(box);
    div({ position: 'static', font: '700 34px PF', color: C.ink, lineHeight: '1.1', marginTop: '16px', whiteSpace: 'nowrap' }, f.name, box);
    div({ position: 'static', font: '400 22px Inter', color: C.sub, lineHeight: '1.3', marginTop: '6px', textWrap: 'balance' }, f.line, box);
  } else {
    const w = 440, h = 210, gx = 20, gy = 20, x = 60 + (k % 2) * (w + gx), y = 896 + Math.floor(k / 2) * (h + gy);
    box = div(Object.assign({ left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', padding: '22px 24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }, tileSt), '', all);
    strokes = leaf(box);
    div({ position: 'static', font: '700 34px PF', color: C.ink, lineHeight: '1.1', marginTop: '12px', whiteSpace: 'nowrap' }, f.name, box);
    div({ position: 'static', font: '400 22px Inter', color: C.sub, lineHeight: '1.3', marginTop: '6px', textWrap: 'balance' }, f.line, box);
  }
  anims.push(t => {
    const b = eout(seg(t, f.a, f.a + 0.5)); box.style.opacity = b; box.style.translate = `0 ${30 * (1 - b)}px`;
    const d = ease(seg(t, f.a + 0.2, f.a + 0.9)); strokes.forEach(([p, L]) => p.style.strokeDashoffset = L * (1 - d));
  });
});

anims.push(t => { all.style.opacity = 1 - ease(seg(t, OUT, END)); });
render(0);
