// "2025 · Vineyard area": the 13-regions map (same map, tints and masks as werder.js), grey down-arrows on the 12 regions
// that shrank and a burgundy up-arrow on Saale-Unstrut, "+10 ha, 868 ha in 2025, the only region that grew". 10.5 s.
// 16:9: map left of centre, card to its right with a thin leader to the arrow. 9:16: map centred, card below; 15-75% of the height.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
window.ready = false;
const NS = 'http://www.w3.org/2000/svg', BURG = '#6B2737', OLIVE = '#7E8F26', GREY = '#9A9284', END = 10.5, OUT = 10.1;
const IMG = { w: 1640, h: 2160 }, SU = [1035, 1065];   // map-image pixels (muted.png), Saale-Unstrut's centre
const all = div({ left: 0, top: 0, width: SW + 'px', height: SH + 'px' });

// projection of muted.png (fitted equirectangular, as in paths.mjs / werder_build.js)
const P = ([lat, lon]) => [168.4528 * lon - 938.67, -266.967 * lat + 14739.4];
// the other 12 regions: one arrow each, at a point inside its vineyards
const REGIONS = [
  ['Ahr', [50.535, 7.06]], ['Mosel', [49.93, 7.03]], ['Mittelrhein', [50.17, 7.70]], ['Nahe', [49.80, 7.78]],
  ['Rheingau', [50.02, 8.05]], ['Rheinhessen', [49.78, 8.15]], ['Pfalz', [49.32, 8.14]], ['Hessische Bergstraße', [49.70, 8.64]],
  ['Franken', [49.83, 10.12]], ['Württemberg', [49.07, 9.27]], ['Baden', [48.33, 7.86]], ['Sachsen', [51.14, 13.50]],
];

// ---- map ----
const S = WIDE ? 0.46 : 0.338, CX = WIDE ? 820 : 540, CY = WIDE ? 556 : 815;   // 9:16: map y ~455-1175, x ~263-817
const TX = CX - IMG.w / 2 * S, TY = CY - IMG.h / 2 * S, scr = ([x, y]) => [TX + x * S, TY + y * S];
const map = div({ left: TX + 'px', top: TY + 'px', width: IMG.w + 'px', height: IMG.h + 'px', transformOrigin: '0 0', transform: `scale(${S})` }, '', all);
map.innerHTML = `<img src="muted.png" style="position:absolute;left:0;top:0;width:${IMG.w}px;height:${IMG.h}px">`;
const canv = ['regions13.png', 'su_mask.png'].map(() => { const c = document.createElement('canvas'); c.width = IMG.w; c.height = IMG.h;
  Object.assign(c.style, { position: 'absolute', left: 0, top: 0, width: IMG.w + 'px', height: IMG.h + 'px' }); map.appendChild(c); return c; });
Promise.all(['regions13.png', 'su_mask.png'].map((src, i) => new Promise(res => { const im = new Image(); im.onload = () => {
  const x = canv[i].getContext('2d'); x.drawImage(im, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = OLIVE; x.fillRect(0, 0, IMG.w, IMG.h); res(); }; im.src = src; })))
  .then(() => { window.ready = true; render(0); });
canv[0].style.opacity = 0.4;

// ---- arrows ----
const arrowSvg = (w, h, col, up) => `<svg width="${w}" height="${h}" viewBox="0 0 20 26" style="display:block;overflow:visible">` +
  `<path d="${up ? 'M10 1L19 12H13.5V25H6.5V12H1Z' : 'M10 25L19 14H13.5V1H6.5V14H1Z'}" fill="${col}" stroke="#F4EEE2" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
const Z = WIDE ? 1 : 0.85;
const downs = REGIONS.map(([n, ll], i) => { const [x, y] = scr(P(ll)), w = 18 * Z, h = 24 * Z;
  return { el: div({ left: (x - w / 2) + 'px', top: (y - h / 2) + 'px', filter: 'drop-shadow(0 1px 2px rgba(40,29,22,.25))' }, arrowSvg(w, h, GREY, false), all), a: 1.65 + i * 0.08 }; });
const [sx, sy] = scr(SU), UW = 40 * Z, UH = 52 * Z;
const glow = div({ left: (sx - 60 * Z) + 'px', top: (sy - 60 * Z) + 'px', width: 120 * Z + 'px', height: 120 * Z + 'px', borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(107,39,55,.32) 0%, rgba(107,39,55,.12) 45%, rgba(107,39,55,0) 70%)' }, '', all);
const up = div({ left: (sx - UW / 2) + 'px', top: (sy - UH / 2) + 'px', filter: 'drop-shadow(0 2px 4px rgba(40,29,22,.3))' }, arrowSvg(UW, UH, BURG, true), all);

// ---- header ----
fadeIn(div({ left: (WIDE ? 80 : 60) + 'px', top: (WIDE ? 80 : 300) + 'px', width: WIDE ? 'auto' : '900px', textAlign: WIDE ? 'left' : 'center', font: `600 ${WIDE ? 26 : 28}px Inter`, letterSpacing: '7px', color: C.gold }, '2025', all), 0);
fadeIn(div({ left: (WIDE ? 80 : 60) + 'px', top: (WIDE ? 116 : 338) + 'px', width: WIDE ? 'auto' : '900px', textAlign: WIDE ? 'left' : 'center', font: `700 ${WIDE ? 88 : 84}px PF`, color: C.ink, lineHeight: '1.05', whiteSpace: 'nowrap' }, 'Vineyard area', all), 0.15);

// ---- card ----
const tile = { background: '#F6EFE1', border: '2px solid #DCCDB2', borderRadius: '16px', boxShadow: '0 8px 24px rgba(40,29,22,.12), 0 2px 5px rgba(40,29,22,.08)', boxSizing: 'border-box', whiteSpace: 'nowrap' };
const card = div(Object.assign({ padding: WIDE ? '22px 34px 24px' : '20px 34px 22px' }, tile,
  WIDE ? { left: '1300px', top: (sy - 86) + 'px' } : { left: '510px', top: '1205px', transform: 'translateX(-50%)', textAlign: 'center' }),
  `<div style="font:700 ${WIDE ? 76 : 70}px PF;color:${BURG};line-height:1;font-variant-numeric:lining-nums">+10 ha</div>` +
  `<div style="font:500 ${WIDE ? 27 : 27}px Inter;color:${C.ink};margin-top:10px">868 ha in 2025</div>` +
  `<div style="font:400 ${WIDE ? 20 : 20}px Inter;color:${C.sub};margin-top:6px">the only region that grew</div>`, all);
// 16:9: thin burgundy leader from the arrow to the card
const lead = document.createElementNS(NS, 'svg'); lead.setAttribute('width', SW); lead.setAttribute('height', SH); lead.style.position = 'absolute'; lead.style.left = 0; lead.style.top = 0;
lead.innerHTML = WIDE ? `<path d="M${sx + 26},${sy}H1290" stroke="${BURG}" stroke-width="2" stroke-dasharray="6 6" fill="none"/>` : '';
all.insertBefore(lead, card);

const backOut = x => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
anims.push(t => {
  map.style.opacity = eout(seg(t, 0, 0.7)); canv[1].style.opacity = 1;
  downs.forEach(({ el, a }) => { const r = seg(t, a, a + 0.3); el.style.opacity = r > 0 ? 1 : 0; el.style.transform = `scale(${r > 0 ? backOut(r) : 0})`; });
  const u = eout(seg(t, 4.3, 5.0)); up.style.opacity = u; up.style.translate = `0 ${36 * (1 - u)}px`;
  const p = seg(t, 9.2, 9.8), pulse = Math.sin(Math.PI * p);
  up.style.transform = `scale(${1 + 0.18 * pulse})`;
  glow.style.opacity = eout(seg(t, 4.6, 5.3)) * (0.85 + 0.15 * Math.sin(t * 3)); glow.style.transform = `scale(${1 + 0.35 * pulse})`;
  const c = eout(seg(t, 6.8, 7.3)); card.style.opacity = c; card.style.translate = `${WIDE ? 16 * (1 - c) : 0}px ${WIDE ? 0 : 12 * (1 - c)}px`; lead.style.opacity = c;
  all.style.opacity = 1 - ease(seg(t, OUT, END));
});
render(0);
