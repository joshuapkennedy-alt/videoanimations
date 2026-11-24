// "Freyburg - Werder": one continuous map, 36.2 s. Germany with Freyburg and Werder (Havel) pinned and joined by a
// dashed line (~150 km); the 13 wine regions tint in and Brandenburg greys out (no wine region of its own); Werder joins
// Saale-Unstrut (1991); then the camera moves in on Saxony-Anhalt, Thuringia and Brandenburg: 3 states, 1 region.
// Map layers are in muted.png's pixel space (same projection as the other maps); geometry in werder_geo.js.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
window.ready = false;
const NS = 'http://www.w3.org/2000/svg', BURG = '#6B2737', OLIVE = '#7E8F26', lerp = (a, b, k) => a + (b - a) * k;
const IMG = { w: 1640, h: 2160 }, G = WGEO, PT = G.pts, END = 36.2, OUT = 35.8;
const all = div({ left: 0, top: 0, width: SW + 'px', height: SH + 'px' });   // wrapper for the closing fade

// ---- camera: whole Germany, then (25.5-28.5 s) the three states ----
// 9:16: map x 150-930 (120+ px clear on the right), y 440-1430; cards above it from y 300. The map sits in a soft-edged
// window (x up to 960, y 405-1440) so the zoom stays inside the 15-75% band.
const V0 = WIDE ? { s: 0.46, cx: 820, cy: 1080, sx: SW / 2, sy: SH / 2 } : { s: 0.476, cx: 820, cy: 1080, sx: 540, sy: 935 };
const V1 = WIDE ? { s: 1.05, cx: 1134.5, cy: 890, sx: 1225, sy: 545 } : { s: 0.95, cx: 1134.5, cy: 890, sx: 540, sy: 935 };
let cam = V0;
const view = t => { const k = ease(seg(t, 25.5, 28.5)), s = Math.exp(lerp(Math.log(V0.s), Math.log(V1.s), k));
  return { s, cx: lerp(V0.cx, V1.cx, k), cy: lerp(V0.cy, V1.cy, k), sx: lerp(V0.sx, V1.sx, k), sy: lerp(V0.sy, V1.sy, k) }; };
const scr = ([x, y]) => [cam.sx + (x - cam.cx) * cam.s, cam.sy + (y - cam.cy) * cam.s];

// ---- map ----
const win = WIDE ? all : div({ left: 0, top: 0, width: SW + 'px', height: SH + 'px',
  maskImage: 'linear-gradient(to bottom, transparent 405px, #000 440px, #000 1408px, transparent 1440px), linear-gradient(to right, transparent 40px, #000 80px, #000 935px, transparent 960px)',
  maskComposite: 'intersect', webkitMaskComposite: 'source-in' }, '', all);
win.style.webkitMaskImage = win.style.maskImage;
const map = div({ left: 0, top: 0, width: IMG.w + 'px', height: IMG.h + 'px', transformOrigin: '0 0' }, '', win);
map.innerHTML = `<img src="muted.png" style="position:absolute;left:0;top:0;width:${IMG.w}px;height:${IMG.h}px">`;
const vec = document.createElementNS(NS, 'svg');
vec.setAttribute('width', IMG.w); vec.setAttribute('height', IMG.h); vec.style.position = 'absolute'; vec.style.overflow = 'visible';
vec.innerHTML = `<defs><pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <line x1="0" y1="0" x2="0" y2="9" stroke="${C.ink}" stroke-width="1.6" stroke-opacity=".32"/></pattern></defs>
  <g class="tints" fill-rule="evenodd">
    <path class="tST" d="${G.ST}" fill="#E4CFA4"/><path class="tTH" d="${G.TH}" fill="#D2B98C"/><path class="tBB" d="${G.BB}" fill="#EEE2C8"/></g>
  <g class="bb" fill-rule="evenodd"><path d="${G.BB}" fill="#B9B3A8" fill-opacity=".5"/><path d="${G.BB}" fill="url(#hatch)"/></g>`;
map.appendChild(vec);
const q = c => vec.querySelector('.' + c), bbGrey = q('bb'), tints = ['tST', 'tTH', 'tBB'].map(q);
// wine regions: masks painted olive on canvases (drawn once the masks load)
const canvases = ['regions13.png', 'su_mask.png'].map(() => { const c = document.createElement('canvas'); c.width = IMG.w; c.height = IMG.h;
  Object.assign(c.style, { position: 'absolute', left: 0, top: 0, width: IMG.w + 'px', height: IMG.h + 'px' }); map.appendChild(c); return c; });
const [regC, suC] = canvases;
Promise.all(['regions13.png', 'su_mask.png'].map((src, i) => new Promise(res => { const im = new Image(); im.onload = () => {
  const x = canvases[i].getContext('2d'); x.drawImage(im, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = OLIVE; x.fillRect(0, 0, IMG.w, IMG.h); res(); }; im.src = src; })))
  .then(() => { window.ready = true; render(0); });

// ---- screen layer: lines, pins, labels ----
const fx = document.createElementNS(NS, 'svg'); fx.setAttribute('width', SW); fx.setAttribute('height', SH);
fx.style.position = 'absolute'; fx.style.left = 0; fx.style.top = 0; all.appendChild(fx);
fx.innerHTML = `<defs><mask id="reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="${SW}" height="${SH}"><line class="rv" stroke="#fff" stroke-width="12" stroke-linecap="round"/></mask></defs>
  <line class="dash" stroke="${BURG}" stroke-width="${WIDE ? 3.5 : 4}" stroke-dasharray="11 9" stroke-linecap="round" mask="url(#reveal)"/>
  <line class="solid" stroke="${BURG}" stroke-width="${WIDE ? 4 : 4.5}" stroke-linecap="round"/>
  <circle class="berlin" r="${WIDE ? 5 : 6}" fill="${C.ink}"/>`;
const fq = c => fx.querySelector('.' + c), [rv, dash, solid, berlinDot] = ['rv', 'dash', 'solid', 'berlin'].map(fq);
const Z = WIDE ? 1 : 1.18, px = n => Math.round(n * Z) + 'px';
const halo = 'text-shadow:0 0 4px #F7F1E6,0 0 4px #F7F1E6,0 0 8px #F7F1E6,0 0 12px #F7F1E6';
const pinSvg = col => `<svg width="${26 * Z}" height="${36 * Z}" viewBox="0 0 26 36" style="display:block;overflow:visible"><path d="M13 35C13 35 2 21.5 2 13a11 11 0 0 1 22 0c0 8.5-11 22-11 22z" fill="${col}" stroke="#F7F1E6" stroke-width="2"/><circle cx="13" cy="13" r="4.2" fill="#F7F1E6"/></svg>`;
function pin(col) { return div({ width: 26 * Z + 'px', height: 36 * Z + 'px', filter: 'drop-shadow(0 2px 3px rgba(40,29,22,.3))' }, pinSvg(col), all); }
const pins = { freyburg: pin(BURG), werder: pin(BURG), werderOl: pin(OLIVE) };
const label = (txt, st) => div(Object.assign({ whiteSpace: 'nowrap', font: `500 ${px(24)} Inter`, color: C.ink, lineHeight: '1.2' }, st), txt, all);
const L = {
  freyburg: label('Freyburg', {}), werder: label('Werder (Havel)', {}), berlin: label('Berlin', { font: `400 ${px(21)} Inter`, color: C.sub }),
  km: label('~150 km', { font: `700 ${px(38)} PF`, color: C.ink }),
  bb: label(WIDE ? 'Brandenburg: no wine region of its own' : 'Brandenburg:<br>no wine region of its own', { font: `500 ${px(23)} Inter`, textAlign: WIDE ? 'left' : 'center', lineHeight: '1.3' }),
  ST: label('Saxony-Anhalt', { font: `600 ${px(26)} Inter`, letterSpacing: '1px' }), TH: label('Thuringia', { font: `600 ${px(26)} Inter`, letterSpacing: '1px' }),
  BB: label('Brandenburg', { font: `600 ${px(26)} Inter`, letterSpacing: '1px' }),
};
Object.values(L).forEach(el => el.style.cssText += ';' + halo);
const tag = div({ whiteSpace: 'nowrap', font: `600 ${px(19)} Inter`, color: OLIVE, letterSpacing: '0.5px', padding: `${px(5)} ${px(12)}`, background: '#F6EFE1',
  border: `1.5px solid ${OLIVE}`, borderRadius: '999px', boxShadow: '0 2px 6px rgba(40,29,22,.12)' }, 'joined 1991', all);

// ---- cards (16:9 top-left 80 px in; 9:16 centred above the map, from y 300) ----
function card(head, body) {
  const c = div(Object.assign({ boxSizing: 'border-box', padding: WIDE ? '22px 34px 26px' : '24px 36px 28px', background: '#F6EFE1', border: '2px solid #DCCDB2',
    borderRadius: '16px', boxShadow: '0 6px 20px rgba(40, 29, 22, 0.10), 0 1px 3px rgba(40, 29, 22, 0.08)', whiteSpace: 'nowrap', textAlign: WIDE ? 'left' : 'center' },
    WIDE ? { left: '80px', top: '80px' } : { left: '540px', top: '300px', transform: 'translateX(-50%)' }), '', all);
  div(Object.assign({}, T.eyebrow, { position: 'static', font: `600 ${WIDE ? 24 : 27}px Inter`, letterSpacing: '6px' }), head, c);
  div({ position: 'static', font: `700 ${WIDE ? 52 : 56}px PF`, color: C.ink, lineHeight: '1.15', marginTop: '6px' }, body, c);
  return c;
}
const card1 = card('QUALITÄTSWEIN', 'needs one of the 13 regions'), card2 = card('SAALE-UNSTRUT', '3 states · 1 region');

const place = (el, [x, y], ax, ay) => { el.style.left = (x - el.offsetWidth * ax) + 'px'; el.style.top = (y - el.offsetHeight * ay) + 'px'; };
const fade = (el, a, b, d = 0.5) => (b == null ? eout(seg(window._t, a, a + d)) : eout(seg(window._t, a, a + d)) * (1 - ease(seg(window._t, b, b + d))));
const rise = (el, k) => { el.style.opacity = k; el.style.translate = `0 ${10 * (1 - k)}px`; };

anims.push(t => {
  window._t = t; cam = view(t);
  const intro = eout(seg(t, 0, 0.7));
  map.style.transform = `translate(${cam.sx - cam.cx * cam.s}px, ${cam.sy - cam.cy * cam.s}px) scale(${cam.s})`; map.style.opacity = intro;
  const F = scr(PT.freyburg), W = scr(PT.werder), B = scr(PT.berlin), E = scr(PT.suEnd);
  // regions, Saale-Unstrut, Brandenburg grey, state tints
  const reg = ease(seg(t, 9.2, 10.2)) * (1 - ease(seg(t, 25.5, 26.3)));
  regC.style.opacity = 0.4 * reg; suC.style.opacity = ease(seg(t, 9.2, 10.2));
  bbGrey.style.opacity = reg;
  tints.forEach((el, i) => { el.style.opacity = 0.75 * ease(seg(t, 26.0 + i * 0.25, 27.0 + i * 0.25)); });
  // pins and their labels
  place(pins.freyburg, F, 0.5, 1); place(pins.werder, W, 0.5, 1); place(pins.werderOl, W, 0.5, 1);
  const pinIn = eout(seg(t, 0.2, 0.7));
  pins.freyburg.style.opacity = pinIn; const ol = ease(seg(t, 21.0, 21.6)); pins.werder.style.opacity = pinIn * (1 - ol); pins.werderOl.style.opacity = ol;
  place(L.freyburg, [F[0] + 18 * Z, F[1] - 18 * Z], 0, 0.5); place(L.werder, [W[0] - 18 * Z, W[1] - 18 * Z], 1, 0.5);
  place(L.berlin, [B[0] + 12 * Z, B[1]], 0, 0.5);
  [L.freyburg, L.werder, L.berlin].forEach(el => { el.style.opacity = pinIn; });
  berlinDot.setAttribute('cx', B[0]); berlinDot.setAttribute('cy', B[1]); berlinDot.setAttribute('opacity', pinIn);
  // dashed Freyburg -> Werder, drawn 0.8-2.3 s, gone at 9.2 s
  const d = ease(seg(t, 0.8, 2.3)), lineOut = 1 - ease(seg(t, 9.2, 9.7));
  const a = [F[0], F[1] - 1], bb = [lerp(F[0], W[0], d), lerp(F[1], W[1], d)];
  [dash, rv].forEach(l => { l.setAttribute('x1', F[0]); l.setAttribute('y1', F[1]); l.setAttribute('x2', W[0]); l.setAttribute('y2', W[1]); });
  rv.setAttribute('x2', bb[0]); rv.setAttribute('y2', bb[1]); rv.setAttribute('opacity', d > 0 ? 1 : 0); dash.setAttribute('opacity', lineOut);
  const mid = [(F[0] + W[0]) / 2, (F[1] + W[1]) / 2], n = Math.hypot(W[0] - F[0], W[1] - F[1]), nx = (W[1] - F[1]) / n, ny = -(W[0] - F[0]) / n;   // normal, pointing left/up
  place(L.km, [mid[0] + nx * 26 * Z, mid[1] + ny * 26 * Z], 1, 0.5); L.km.style.opacity = eout(seg(t, 3.0, 3.5)) * lineOut;
  // solid Werder -> main Saale-Unstrut area, 20.0-21.2 s
  const s2 = ease(seg(t, 20.0, 21.2));
  solid.setAttribute('x1', W[0]); solid.setAttribute('y1', W[1]); solid.setAttribute('x2', lerp(W[0], E[0], s2)); solid.setAttribute('y2', lerp(W[1], E[1], s2));
  solid.setAttribute('opacity', s2 > 0 ? 1 : 0);
  // tag, Brandenburg note, cards, state labels
  place(tag, [W[0] - 18 * Z, W[1] + 16 * Z], 1, 0); rise(tag, fade(tag, 22.8, 25.5));
  place(L.bb, WIDE ? [scr([1400, 520])[0], scr([1400, 520])[1]] : scr([1335, 505]), WIDE ? 0.5 : 0.5, 0.5); rise(L.bb, fade(L.bb, 15.0, 25.5));
  rise(card1, fade(card1, 10.0, 25.5)); rise(card2, fade(card2, 27.0));
  [['ST', 29.0], ['TH', 31.0], ['BB', 33.0]].forEach(([k, a2]) => { place(L[k], scr(PT[k]), 0.5, 0.5); rise(L[k], fade(L[k], a2)); });
  all.style.opacity = 1 - ease(seg(t, OUT, END));
});
render(0);
