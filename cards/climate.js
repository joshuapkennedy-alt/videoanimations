// Climate change, "The good" / "The bad": header and title top-left, four icon rows on the left, a graphic on the right.
//   window.MODE = 'good' (olive): harvest calendar, "usual start" and "2026: ~1 week early" markers. 17.4 s.
//   window.MODE = 'bad' (burgundy): April 2024 frost, about two-thirds of the harvest lost (-⅔), 3 bottles of which 2 go. 21.4 s.
// 16:9: rows left, graphic right. 9:16: rows above the calendar (good) / number and bottles above the rows (bad),
// everything between 15% and 75% of the height and 120+ px clear of the right edge.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920, MODE = window.MODE || 'good';
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const NS = 'http://www.w3.org/2000/svg', OLIVE = '#7E8F26', BURG = '#6B2737';
const ACC = MODE === 'good' ? OLIVE : BURG, END = MODE === 'good' ? 17.4 : 21.4;
const all = div({ left: 0, top: 0, width: SW + 'px', height: SH + 'px' });
const backOut = x => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

// ---- icons (white line art in a circle, as on the Thriving tiles) ----
const grapes = fill => [[38, 40], [50, 38], [62, 40], [44, 52], [56, 52], [38, 63], [62, 63], [50, 64], [44, 75], [56, 75], [50, 86]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="${fill}"/>`).join('');
const ICON = {
  sun: '<circle cx="50" cy="50" r="15"/><path d="M50 18V26M50 74V82M18 50H26M74 50H82M27 27l6 6M67 67l6 6M27 73l6-6M67 33l6-6"/>',
  grape: '<path d="M50 14V30M50 24C58 18 68 18 74 24C68 30 58 30 50 24"/>' + grapes('none'),
  redgrape: '<path d="M50 14V30M50 24C58 18 68 18 74 24C68 30 58 30 50 24"/>' + grapes(BURG),
  calendar: '<rect x="18" y="24" width="64" height="58" rx="7"/><path d="M18 40H82M34 16V30M66 16V30M32 54H40M46 54H54M60 54H68M32 68H40M46 68H54"/>',
  bud: '<path d="M50 88V46"/><path d="M50 66C40 66 30 60 28 50C38 50 48 56 50 66Z"/><path d="M50 58C60 58 70 52 72 42C62 42 52 48 50 58Z"/><path d="M50 46C43 40 43 28 50 16C57 28 57 40 50 46Z"/>',
  snow: '<path d="M50 14V86M19 32L81 68M19 68L81 32"/><path d="M42 20L50 28L58 20M42 80L50 72L58 80M18 44L29 47L26 36M82 56L71 53L74 64M18 56L29 53L26 64M82 44L71 47L74 36"/>',
  sundrop: '<path d="M40 30C40 30 22 52 22 64a18 18 0 0 0 36 0C58 52 40 30 40 30Z"/><circle cx="70" cy="30" r="9"/><path d="M70 12V16M70 44V48M52 30H56M84 30H88M57 17l3 3M80 40l3 3M57 43l3-3M80 20l3-3"/>',
  chart: '<path d="M18 18V82H84"/><path d="M28 30L44 46L56 40L76 70"/><path d="M66 70H76V60"/>',
};
function badge(parent, size, icon) {
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('width', size); svg.setAttribute('height', size); svg.setAttribute('viewBox', '0 0 100 100');
  svg.style.display = 'block'; svg.style.flex = 'none'; svg.style.overflow = 'visible';
  svg.innerHTML = `<circle class="ring" cx="50" cy="50" r="48" fill="${ACC}"/><g class="ic" fill="none" stroke="#FBF6EC" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" transform="translate(50 50) scale(.72) translate(-50 -50)">${ICON[icon]}</g>`;
  parent.appendChild(svg);
  const strokes = [...svg.querySelector('.ic').children].map(p => { const L = p.getTotalLength ? p.getTotalLength() : 0; p.style.strokeDasharray = L; return [p, L]; });
  return { ring: svg.querySelector('.ring'), strokes };
}

// ---- header ----
const HX = WIDE ? 100 : 90;
fadeIn(div({ left: HX + 'px', top: (WIDE ? 80 : 300) + 'px', font: `600 ${WIDE ? 24 : 26}px Inter`, letterSpacing: '7px', color: C.gold }, 'CLIMATE CHANGE', all), 0);
fadeIn(div({ left: HX + 'px', top: (WIDE ? 114 : 336) + 'px', font: `700 ${WIDE ? 96 : 92}px PF`, color: ACC, lineHeight: '1.05' }, MODE === 'good' ? 'The good' : 'The bad', all), 0.15);

// ---- rows ----
const ROWS = MODE === 'good' ? [
  { icon: 'sun', line: 'It’s warmer', a: 0.5 },
  { icon: 'grape', line: 'Grapes ripen more reliably', a: 2.4 },
  { icon: 'redgrape', line: 'Reds like Spätburgunder get riper', small: 'still white-wine country', a: 4.45, sa: 7.6 },
  { icon: 'calendar', line: 'Harvest keeps starting earlier', a: 10.1 },
] : [
  { icon: 'bud', line: 'Warm springs wake the vines early', a: 1.25 },
  { icon: 'snow', line: 'Then a late frost hits the young shoots', a: 3.6 },
  { icon: 'sundrop', line: 'Dry summers', a: 14.55 },
  { icon: 'chart', line: '4 poor harvests since 2018', a: 17.6 },
];
const R = WIDE ? { x: HX, y0: 300, step: 158, icon: 84, size: MODE === 'bad' ? 38 : 40 } : (MODE === 'good' ? { x: HX, y0: 478, step: 112, icon: 76, size: 36 } : { x: HX, y0: 1000, step: 108, icon: 76, size: 36 });
ROWS.forEach((r, i) => {
  const row = div({ left: R.x + 'px', top: (R.y0 + i * R.step) + 'px', width: (WIDE ? 880 : 900 - R.x + 60) + 'px', display: 'flex', alignItems: 'center', gap: (WIDE ? 26 : 22) + 'px' }, '', all);
  const b = badge(row, R.icon, r.icon);
  const col = div({ position: 'static' }, '', row);
  const head = div({ position: 'static', font: `700 ${R.size}px PF`, color: C.ink, lineHeight: '1.15' }, r.line, col);
  const sm = r.small ? div({ position: 'static', font: `400 ${WIDE ? 25 : 25}px Inter`, color: C.sub, marginTop: '4px' }, r.small, col) : null;
  anims.push(t => {
    const k = eout(seg(t, r.a, r.a + 0.5)); row.style.opacity = k; row.style.translate = `${-24 * (1 - k)}px 0`;
    const q = seg(t, r.a + 0.05, r.a + 0.5); b.ring.setAttribute('transform', `translate(50 50) scale(${q > 0 ? backOut(q) : 0}) translate(-50 -50)`);
    const d = ease(seg(t, r.a + 0.3, r.a + 1.0)); b.strokes.forEach(([p, L]) => p.style.strokeDashoffset = L * (1 - d));
    if (sm) { const s = eout(seg(t, r.sa, r.sa + 0.5)); sm.style.opacity = s; sm.style.translate = `0 ${8 * (1 - s)}px`; }
  });
});

// ---- right-hand graphic ----
if (MODE === 'good') {
  // a strip of weeks from late August to October; "usual start" (gold) and "2026: ~1 week early" (olive)
  const WEEKS = [['24', 'Aug'], ['31', 'Aug'], ['7', 'Sep'], ['14', 'Sep'], ['21', 'Sep'], ['28', 'Sep'], ['5', 'Oct'], ['12', 'Oct'], ['19', 'Oct'], ['26', 'Oct']];
  const USUAL = 3;   // week of 14 Sep
  const G = WIDE ? { x: 1000, y: 560, cw: 78, ch: 64, gap: 6 } : { x: 90, y: 1070, cw: 80, ch: 60, gap: 5 };
  const strip = div({ left: 0, top: 0 }, '', all);
  const cell = i => G.x + i * (G.cw + G.gap);
  // month labels above their weeks
  [['AUGUST', 0, 1], ['SEPTEMBER', 2, 5], ['OCTOBER', 6, 9]].forEach(([m, a, b]) => {
    div({ left: cell(a) + 'px', top: (G.y - 40) + 'px', width: (cell(b) + G.cw - cell(a)) + 'px', textAlign: 'center', font: `600 ${WIDE ? 17 : 16}px Inter`, letterSpacing: '4px', color: C.ink,
      borderBottom: `1.5px solid ${C.ink}`, paddingBottom: '6px', boxSizing: 'border-box', opacity: 0.8 }, m, strip); });
  WEEKS.forEach(([d], i) => div({ left: cell(i) + 'px', top: G.y + 'px', width: G.cw + 'px', height: G.ch + 'px', boxSizing: 'border-box', background: '#F6EFE1', border: '1.5px solid #DCCDB2', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', font: `500 ${WIDE ? 22 : 21}px Inter`, color: C.ink }, d, strip));
  div({ left: (cell(WEEKS.length - 1) + G.cw) + 'px', top: (G.y + G.ch + 10) + 'px', transform: 'translateX(-100%)', whiteSpace: 'nowrap', font: `400 ${WIDE ? 16 : 15}px Inter`, color: C.sub, letterSpacing: '0.5px' }, 'weeks starting Monday', strip);
  // markers: a triangle pointer on the week plus a label; gold above the strip, olive below
  const marker = (col, label, above) => { const m = div({ left: 0, top: 0, width: G.cw + 'px' }, '', all);
    const tri = div({ left: (G.cw / 2 - 11) + 'px', top: (above ? G.y - 64 : G.y + G.ch + 40) + 'px', width: 0, height: 0, borderLeft: '11px solid transparent', borderRight: '11px solid transparent',
      [above ? 'borderTop' : 'borderBottom']: `14px solid ${col}` }, '', m);
    const lab = div({ left: (G.cw / 2) + 'px', top: (above ? G.y - 104 : G.y + G.ch + 58) + 'px', transform: 'translateX(-50%)', whiteSpace: 'nowrap', font: `600 ${WIDE ? 21 : 20}px Inter`, color: '#FBF6EC',
      background: col, borderRadius: '999px', padding: '6px 14px' }, label, m);
    const ring = div({ left: '-3px', top: (G.y - 3) + 'px', width: (G.cw + 6) + 'px', height: (G.ch + 6) + 'px', boxSizing: 'border-box', border: `3px solid ${col}`, borderRadius: '10px' }, '', m);
    return m; };
  const usual = marker(C.gold, 'usual start', true), early = marker(OLIVE, '2026: ~1 week early', false);
  anims.push(t => {
    const s = eout(seg(t, 10.1, 10.7)); strip.style.opacity = s; strip.style.translate = `0 ${16 * (1 - s)}px`;
    const u = eout(seg(t, 10.6, 11.1)); usual.style.opacity = u; usual.style.left = cell(USUAL) + 'px';
    const e = eout(seg(t, 12.7, 13.3)), mv = ease(seg(t, 12.9, 13.8)); early.style.opacity = e; early.style.left = (cell(USUAL) - (G.cw + G.gap) * mv) + 'px';
  });
} else {
  // April 2024 frost: the number steps 0 -> -⅓ -> -½ -> -⅔ (Playfair has these fraction glyphs), then 3 bottles, 2 of which fade and go.
  // Cues set to the voice-over: label 6.25 s, count to -⅔ from 8.15 s landing 9.4 s, bottles 10.1 s, "Two bottles out of three" 11.5 s, "Gone" 13.5 s.
  const FADE_AT = 11.5, GONE_AT = 13.5, COUNT = [8.15, 9.4], BOTTLES = 10.1;
  const B = WIDE ? { cx: 1440, lab: 290, num: 332, numS: 210, lab2: 568, src: 612, by: 668, bw: 64, bh: 154, bg: 46, cap: 838 }
                 : { cx: 510, lab: 470, num: 506, numS: 200, lab2: 732, src: 772, by: 818, bw: 46, bh: 110, bg: 34, cap: 940 };
  const l1 = text(B.cx, B.lab, 800, 'April 2024 frost', { font: `600 30px Inter`, letterSpacing: '2px', color: C.ink });
  const num = text(B.cx, B.num, 900, '0', { font: `700 ${B.numS}px PF`, color: BURG, lineHeight: '1', fontVariantNumeric: 'lining-nums' });
  const l2 = text(B.cx, B.lab2, 800, 'of the region’s harvest', { font: `400 30px Inter`, color: C.ink });
  const src = text(B.cx, B.src, 800, 'Source: Destatis', { font: `400 ${WIDE ? 20 : 21}px Inter`, color: 'rgba(40, 29, 22, 0.6)', letterSpacing: '0.5px' });
  [l1, num, l2, src].forEach(e => all.appendChild(e));
  const bottlePath = 'M12 0H18V16C18 20 25 22 25 30V70H5V30C5 22 12 20 12 16Z';
  const rowW = 3 * B.bw + 2 * B.bg, x0 = B.cx - rowW / 2;
  const bottles = Array.from({ length: 3 }, (_, i) => { const s = document.createElementNS(NS, 'svg');
    s.setAttribute('width', B.bw); s.setAttribute('height', B.bh); s.setAttribute('viewBox', '0 0 30 72'); s.style.position = 'absolute'; s.style.left = (x0 + i * (B.bw + B.bg)) + 'px'; s.style.top = B.by + 'px';
    s.innerHTML = `<path d="${bottlePath}" fill="${C.ink}"/><rect x="5" y="40" width="20" height="14" fill="#EEE5D4" opacity=".55"/>`; all.appendChild(s); return s; });
  const KEEP = 2;   // the one bottle left
  const cap = text(B.cx, B.cap, 800, '2 bottles out of 3', { font: `500 28px Inter`, color: C.ink }); all.appendChild(cap);
  let shown = '';
  anims.push(t => {
    const a = eout(seg(t, 6.25, 6.75)); l1.style.opacity = a; num.style.opacity = a; num.style.translate = l1.style.translate = `0 ${12 * (1 - a)}px`;
    // even steps: -⅓ at COUNT[0], -½ halfway, landing on -⅔ at COUNT[1]; each step pops a little
    const k = t < COUNT[0] ? 0 : Math.min(3, 1 + Math.floor(seg(t, COUNT[0], COUNT[1]) * 2 + 1e-6)), label = ['0', '−⅓', '−½', '−⅔'][k];
    if (label !== shown) { shown = label; num.textContent = shown; }
    const tStep = COUNT[0] + (k - 1) * (COUNT[1] - COUNT[0]) / 2, pop = seg(t, tStep, tStep + 0.25);
    num.style.transform = `scale(${k ? 1 + 0.07 * Math.sin(Math.PI * pop) : 1})`;
    const b = eout(seg(t, 6.7, 7.2)); l2.style.opacity = b; l2.style.translate = `0 ${10 * (1 - b)}px`; src.style.opacity = eout(seg(t, 7.1, 7.6));
    const fade = ease(seg(t, FADE_AT, FADE_AT + 0.7)), gone = ease(seg(t, GONE_AT, GONE_AT + 0.55));
    bottles.forEach((s, i) => { const k = eout(seg(t, BOTTLES + i * 0.12, BOTTLES + 0.45 + i * 0.12));
      const o = i === KEEP ? k : k * (1 - 0.85 * fade) * (1 - gone); s.style.opacity = o; s.style.translate = `0 ${12 * (1 - k)}px`; });
    const c = eout(seg(t, FADE_AT, FADE_AT + 0.5)); cap.style.opacity = c; cap.style.translate = `0 ${10 * (1 - c)}px`;
  });
}
anims.push(t => { all.style.opacity = 1 - ease(seg(t, END - 0.4, END)); });
render(0);
