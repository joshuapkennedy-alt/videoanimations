// "Into East Germany": the Saale-Unstrut map (whole of Germany), the region lights up, then the inner-German border
// draws north to south and the East shades in. 8 s. window.WIDE selects the 16:9 layout. Border data: gdr_geo.js.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const NS = 'http://www.w3.org/2000/svg', BURG = '#6B2737', lerp = (a, b, k) => a + (b - a) * k;
const IMG = { w: 1640, h: 2160 }, SU = { x: 1035, y: 1065 };   // map image size, region centre in map-image pixels
const S = WIDE ? 0.46 : 0.62;                                   // same whole-Germany scale as the rivers card's opening
const TX = SW / 2 - IMG.w / 2 * S, TY = SH / 2 - IMG.h / 2 * S;
const scr = ([x, y]) => [TX + x * S, TY + y * S];               // map-image pixels -> screen

// ---- map (raster + vector layer in map-image pixels, so everything scales together) ----
const map = div({ left: 0, top: 0, width: IMG.w + 'px', height: IMG.h + 'px', transformOrigin: '0 0' });
map.innerHTML = `<img src="muted.png" style="position:absolute;left:0;top:0;width:${IMG.w}px;height:${IMG.h}px">` +
  `<img class="su" src="su_layer.png" style="position:absolute;left:0;top:0;width:${IMG.w}px;height:${IMG.h}px">`;
const su = map.querySelector('.su');
const vec = document.createElementNS(NS, 'svg');
vec.setAttribute('width', IMG.w); vec.setAttribute('height', IMG.h); vec.style.position = 'absolute'; vec.style.overflow = 'visible';
const w = px => px / S;   // screen px -> map units
vec.innerHTML = `<g class="east" fill="${BURG}" stroke="${BURG}" stroke-width="${w(1)}" stroke-linejoin="round"><path d="${GDR.east}"/></g>
  <path class="halo" d="${GDR.border}" fill="none" stroke="#F8F3EA" stroke-width="${w(11)}" stroke-linecap="round" stroke-linejoin="round"/>
  <path class="line" d="${GDR.border}" fill="none" stroke="${BURG}" stroke-width="${w(5)}" stroke-linecap="round" stroke-linejoin="round"/>`;
map.appendChild(vec);
const east = vec.querySelector('.east'), strokes = ['.halo', '.line'].map(c => vec.querySelector(c));
const LEN = strokes[1].getTotalLength();
strokes.forEach(p => { p.style.strokeDasharray = LEN + 1; });

// ---- region glow and pulse (screen space, as on the rivers card) ----
const fx = document.createElementNS(NS, 'svg');
fx.setAttribute('width', SW); fx.setAttribute('height', SH); fx.style.position = 'absolute'; fx.style.left = 0; fx.style.top = 0;
fx.innerHTML = '<defs><radialGradient id="g"><stop offset="0" stop-color="#C9D36A" stop-opacity=".55"/><stop offset="1" stop-color="#C9D36A" stop-opacity="0"/></radialGradient></defs>';
stage.appendChild(fx);
const [sux, suy] = scr([SU.x, SU.y]);
const glow = document.createElementNS(NS, 'circle'); glow.setAttribute('fill', 'url(#g)'); glow.setAttribute('cx', sux); glow.setAttribute('cy', suy); fx.appendChild(glow);
const rings = [0, 1].map(() => { const c = document.createElementNS(NS, 'circle'); Object.entries({ fill: 'none', stroke: '#8E9F2E', cx: sux, cy: suy }).forEach(([k, v]) => c.setAttribute(k, v)); fx.appendChild(c); return c; });

// ---- labels ----
// 9:16: all text stays 120+ px clear of the right edge
function label(lines, at, a, align = 'center') {
  const [x, y] = scr(at);
  const el = div({ left: (x - 300) + 'px', top: y + 'px', width: '600px', textAlign: align, transform: 'translateY(-50%)' },
    lines.map(([str, st]) => `<div style="${st}">${str}</div>`).join(''));
  fadeIn(el, a, 0.5);
  return el;
}
const halo = c => `text-shadow:0 0 6px ${c},0 0 6px ${c},0 0 12px ${c}`;
const capsSt = (size, color) => `font:600 ${size}px Inter;letter-spacing:${WIDE ? 5 : 5}px;color:${color};${halo('#F8F3EA')}`;
label([['EAST GERMANY', capsSt(WIDE ? 26 : 30, BURG)], ['GDR · 1949–1990', `font:500 ${WIDE ? 22 : 26}px Inter;color:${C.sub};margin-top:6px;letter-spacing:1px;${halo('#F8F3EA')}`]],
  WIDE ? [1300, 760] : [1180, 700], 3.7);
label([['WEST GERMANY', capsSt(WIDE ? 26 : 30, '#8A7C65')]], [430, 960], 4.0);
label([['Saale-Unstrut', `font:italic 400 ${WIDE ? 34 : 40}px PFI;color:${C.ink};${halo('#F8F3EA')}`]], [SU.x + 50, SU.y + 120], 4.4);

// ---- timeline ----
anims.push(t => {
  const intro = eout(seg(t, 0, 0.7)), s = S * lerp(0.97, 1, intro);
  map.style.transform = `translate(${SW / 2 - IMG.w / 2 * s}px, ${SH / 2 - IMG.h / 2 * s}px) scale(${s})`;
  map.style.opacity = intro;
  su.style.opacity = eout(seg(t, 0.9, 1.4));
  glow.setAttribute('r', (WIDE ? 95 : 120) * (1 + 0.08 * Math.sin(t * 4.4))); glow.setAttribute('opacity', seg(t, 1.1, 1.5) * (1 - 0.5 * seg(t, 3.0, 3.8)));
  rings.forEach((c, i) => {
    const p = (t - 1.2 - i * 0.9) / 1.4;
    if (p < 0 || p > 1) { c.setAttribute('opacity', 0); return; }
    c.setAttribute('r', lerp(24, WIDE ? 130 : 160, eout(p))); c.setAttribute('stroke-width', lerp(5, 2, p)); c.setAttribute('opacity', (1 - p) * 0.9);
  });
  const d = ease(seg(t, 1.7, 3.7)); strokes.forEach(p => { p.style.strokeDashoffset = (LEN + 1) * (1 - d); });
  strokes.forEach(p => { p.style.opacity = d > 0 ? 1 : 0; });
  east.style.opacity = 0.15 * ease(seg(t, 3.0, 3.9));
});
render(0);
