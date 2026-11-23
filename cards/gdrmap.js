// "East Germany (GDR)": the Saale-Unstrut map with the 1949-1990 inner-German border, the GDR lightly shaded and
// West Berlin left clear. 7.5 s. window.WIDE selects 16:9. Geometry: gdrmap_geo.js (tools/map/gdrmap_build.js).
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const NS = 'http://www.w3.org/2000/svg', OUT = 7.1, END = 7.5, lerp = (a, b, k) => a + (b - a) * k;
const IMG = { w: 1640, h: 2160 }, SU = { x: 1035, y: 1065 };    // map image size, region centre in map-image pixels
// 16:9: whole map centred (as on the rivers card). 9:16: map centred under the card, y 470-1442 (Germany itself ends ~1425).
const S = WIDE ? 0.46 : 0.45, CY = WIDE ? SH / 2 : 470 + IMG.h * 0.45 / 2;
const all = div({ left: 0, top: 0, width: SW + 'px', height: SH + 'px' });   // wrapper for the closing fade

// ---- map: raster + vector layer in map-image pixels ----
const map = div({ left: 0, top: 0, width: IMG.w + 'px', height: IMG.h + 'px', transformOrigin: '0 0' }, '', all);
map.innerHTML = ['muted.png', 'su_layer.png'].map(s => `<img src="${s}" style="position:absolute;left:0;top:0;width:${IMG.w}px;height:${IMG.h}px">`).join('');
const w = px => px / S;   // screen px -> map units
const vec = document.createElementNS(NS, 'svg');
vec.setAttribute('width', IMG.w); vec.setAttribute('height', IMG.h); vec.style.position = 'absolute'; vec.style.overflow = 'visible';
vec.innerHTML = `<defs>
    <mask id="noWB" maskUnits="userSpaceOnUse" x="-100" y="-100" width="${IMG.w + 200}" height="${IMG.h + 200}">
      <rect x="-100" y="-100" width="${IMG.w + 200}" height="${IMG.h + 200}" fill="#fff"/><path d="${GDRMAP.westBerlin}" fill="#000"/></mask>
    <radialGradient id="g"><stop offset="0" stop-color="#C9D36A" stop-opacity=".6"/><stop offset="1" stop-color="#C9D36A" stop-opacity="0"/></radialGradient>
  </defs>
  <circle class="glow" cx="${SU.x}" cy="${SU.y}" fill="url(#g)"/>
  <g class="shade" mask="url(#noWB)"><g fill="${C.ink}" stroke="${C.ink}" stroke-width="${w(1)}" stroke-linejoin="round"><path d="${GDRMAP.east}"/></g></g>
  <g class="wb" mask="url(#noWB)"><path d="${GDRMAP.westBerlin}" fill="none" stroke="${C.ink}" stroke-width="${w(3)}" stroke-linejoin="round"/></g>
  <path class="halo" d="${GDRMAP.border}" fill="none" stroke="#F8F3EA" stroke-width="${w(9)}" stroke-linecap="round" stroke-linejoin="round"/>
  <path class="line" d="${GDRMAP.border}" fill="none" stroke="${C.ink}" stroke-width="${w(4)}" stroke-linecap="round" stroke-linejoin="round"/>`;
map.appendChild(vec);
const q = c => vec.querySelector('.' + c);
const [glow, shade, wb] = ['glow', 'shade', 'wb'].map(q), strokes = ['halo', 'line'].map(q);
const LEN = strokes[1].getTotalLength();
strokes.forEach(p => { p.style.strokeDasharray = LEN + 1; });

// ---- card ----
// 16:9: top-left, clear of the map. 9:16: centred on x 510 (120+ px clear on the right), y 300-440.
const card = div(Object.assign({ boxSizing: 'border-box', padding: WIDE ? '22px 34px 26px' : '22px 36px 26px', background: '#F6EFE1', border: '2px solid #DCCDB2',
  borderRadius: '16px', boxShadow: '0 6px 20px rgba(40, 29, 22, 0.10), 0 1px 3px rgba(40, 29, 22, 0.08)', whiteSpace: 'nowrap', textAlign: WIDE ? 'left' : 'center' },
  WIDE ? { left: '80px', top: '80px' } : { left: '510px', top: '300px', transform: 'translateX(-50%)' }), '', all);
div(Object.assign({}, T.eyebrow, { position: 'static', font: `600 ${WIDE ? 24 : 26}px Inter`, letterSpacing: '6px' }), '1949–1990', card);
div({ position: 'static', font: `700 ${WIDE ? 60 : 64}px PF`, color: C.ink, lineHeight: '1.1', marginTop: '6px' }, 'East Germany (GDR)', card);

anims.push(t => {
  const intro = eout(seg(t, 0, 0.7)), s = S * lerp(0.97, 1, intro);
  map.style.transform = `translate(${SW / 2 - IMG.w / 2 * s}px, ${CY - IMG.h / 2 * s}px) scale(${s})`;
  map.style.opacity = intro;
  glow.setAttribute('r', w(WIDE ? 90 : 95) * (1 + 0.06 * Math.sin(t * 3.2)));
  const d = ease(seg(t, 2.0, 3.2)); strokes.forEach(p => { p.style.strokeDashoffset = (LEN + 1) * (1 - d); p.style.opacity = d > 0 ? 1 : 0; });
  const sh = ease(seg(t, 3.2, 3.9)); shade.style.opacity = 0.08 * sh; wb.style.opacity = 0.8 * sh;
  const c = eout(seg(t, 3.0, 3.5)); card.style.opacity = c; card.style.translate = `0 ${14 * (1 - c)}px`;
  all.style.opacity = 1 - ease(seg(t, OUT, END));
});
render(0);
