// "New ideas": the next generation of Saale-Unstrut growers, three equal tiles with small gold line icons. 18.5 s.
// Tile 2 (Breitengrad 51) gets a thin gold 51°N line drawn across it behind the text, then "Breitengrad = latitude".
// 16:9: tiles in a row. 9:16: tiles stacked in the x 60-960 column, between 15% and 75% of the height. No logos or photos.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const NS = 'http://www.w3.org/2000/svg', OUT = 18.1, END = 18.5, LAT = 7.0, TILE = '#F6EFE1';
const all = div({ left: 0, top: 0, width: SW + 'px', height: SH + 'px' });

// ---- header ----
const ty = WIDE ? 150 : 300, CX = WIDE ? SW / 2 : 510, HW = WIDE ? SW - 80 : 900;
fadeIn(text(CX, ty, HW, 'THE NEXT GENERATION', Object.assign({}, T.eyebrow, { font: `600 ${WIDE ? 26 : 28}px Inter`, letterSpacing: '7px' }), all), 0);
fadeIn(text(CX, ty + (WIDE ? 48 : 52), HW, 'New ideas', Object.assign({}, T.title, { font: `700 ${WIDE ? 100 : 100}px PF` }), all), 0.15);
const rule = div({ left: (CX - 70) + 'px', top: (ty + (WIDE ? 178 : 182)) + 'px', width: '140px', height: '3px', background: '#C3A06A', transformOrigin: 'center' }, '', all);
anims.push(t => { rule.style.transform = `scaleX(${ease(seg(t, 0.3, 0.8))})`; });

// ---- tiles ----
const ICONS = {
  yeast: '<circle cx="36" cy="62" r="15"/><circle cx="63" cy="47" r="10"/><circle cx="47" cy="27" r="7"/><circle cx="71" cy="74" r="6"/><circle cx="25" cy="33" r="4"/>',
  globe: '<circle cx="50" cy="50" r="34"/><ellipse cx="50" cy="50" rx="14" ry="34"/><path d="M18.5 38H81.5"/>',
  estates: [22, 50, 78].map(x => `<path d="M${x - 11} 76V57L${x} 46L${x + 11} 57V76Z"/>`).join('') + '<path d="M6 76H94"/>',
};
const ITEMS = [
  { icon: 'yeast', a: 3.1, rows: [['name', 'Matthias Hey'], ['line', 'ferments with wild yeasts']] },
  { icon: 'globe', a: 5.5, lat: true, rows: [['name', 'Breitengrad 51'], ['note', 'Breitengrad = latitude'], ['line', 'a group of top growers'], ['small', 'best wines in a fresh, cool-climate style']] },
  { icon: 'estates', a: 13.8, rows: [['kicker', 'IN THE VDP'], ['name', 'Pawis · Hey · Böhme &amp; Töchter'], ['line', '3 family estates']] },
];
const Z = WIDE ? 1 : 1.04, px = n => Math.round(n * Z) + 'px';
const ST = {
  name: { font: `700 ${px(40)} PF`, color: C.ink, lineHeight: '1.12', marginTop: px(14), textWrap: 'balance' },
  kicker: { font: `600 ${px(18)} Inter`, color: C.gold, letterSpacing: '5px', marginTop: px(14) },
  note: { font: `italic 400 ${px(21)} Inter`, color: C.gold, marginTop: px(4) },
  line: { font: `400 ${px(25)} Inter`, color: C.ink, lineHeight: '1.35', marginTop: px(8) },
  small: { font: `400 ${px(20)} Inter`, color: C.sub, lineHeight: '1.35', marginTop: px(4), textWrap: 'balance' },
};
const backOut = x => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const GEO = WIDE ? (k => ({ x: 170 + k * 540, y: 430, w: 500, h: 330 })) : (k => ({ x: 60, y: [520, 800, 1120][k], w: 900, h: [258, 298, 258][k] }));
ITEMS.forEach((it, k) => {
  const g = GEO(k);
  const box = div({ left: g.x + 'px', top: g.y + 'px', width: g.w + 'px', height: g.h + 'px', background: TILE, border: '2px solid #DCCDB2', borderRadius: '16px', boxSizing: 'border-box',
    boxShadow: '0 8px 24px rgba(40,29,22,.12), 0 2px 5px rgba(40,29,22,.08)', overflow: 'hidden' }, '', all);
  // latitude line (behind the text): drawn across the tile, "51°N" at its left end
  let latLine, latLab;
  if (it.lat) {
    // placed through the middle of the 'a group of top growers' row once the fonts have loaded (see below)
    latLine = div({ left: '22px', top: '0px', width: (g.w - 44) + 'px', height: '2px', background: C.gold, transformOrigin: 'left', transform: 'scaleX(0)' }, '', box);
    latLab = div({ left: '24px', top: '0px', font: '600 18px Inter', color: C.gold, letterSpacing: '1px' }, '51°N', box);
  }
  const inner = div({ left: 0, top: 0, width: '100%', height: '100%', boxSizing: 'border-box', padding: WIDE ? '36px 30px 0' : '24px 40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }, '', box);
  const svg = document.createElementNS(NS, 'svg'), S = WIDE ? 70 : 60;
  svg.setAttribute('width', S); svg.setAttribute('height', S); svg.setAttribute('viewBox', '0 0 100 100'); svg.style.display = 'block'; svg.style.flex = 'none'; svg.style.overflow = 'visible';
  svg.innerHTML = `<g fill="none" stroke="${C.gold}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">${ICONS[it.icon]}</g>`;
  inner.appendChild(svg);
  const strokes = [...svg.querySelectorAll('circle, ellipse, path')].map(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; return [p, L]; });
  let note, latRow, placed = false;
  it.rows.forEach(([kind, txt]) => {
    // text sits on tile-coloured spans, so the latitude line passes behind it
    const el = div(Object.assign({ position: 'static', maxWidth: '100%' }, ST[kind]), `<span style="background:${TILE};padding:0 8px;box-decoration-break:clone;-webkit-box-decoration-break:clone">${txt}</span>`, inner);
    if (kind === 'note') note = el;
    if (kind === 'line') latRow = el;
  });
  anims.push(t => {
    const a = it.a, b = eout(seg(t, a, a + 0.5)); box.style.opacity = b; box.style.translate = `0 ${30 * (1 - b)}px`;
    const d = ease(seg(t, a + 0.2, a + 0.9)); strokes.forEach(([p, L]) => p.style.strokeDashoffset = L * (1 - d));
    if (it.lat) {
      if (!placed && document.fonts.status === 'loaded') { placed = true; const ly = latRow.offsetTop + latRow.offsetHeight / 2; latLine.style.top = (ly - 1) + 'px'; latLab.style.top = (ly - 26) + 'px'; }
      latLine.style.transform = `scaleX(${ease(seg(t, LAT, LAT + 1.2))})`;
      latLab.style.opacity = eout(seg(t, LAT, LAT + 0.4));
      const n = eout(seg(t, LAT + 1.2, LAT + 1.7)); note.style.opacity = n;
    }
  });
});
anims.push(t => { all.style.opacity = 1 - ease(seg(t, OUT, END)); });
render(0);
