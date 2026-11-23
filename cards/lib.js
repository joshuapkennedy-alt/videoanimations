// shared helpers for the vertical chart animations (1080x1920 stage)
const C = {
  bg: '#EEE5D4', ink: '#281D16', sub: '#685D4A', gold: '#B8925A', cream: '#F6EEDF',
  divider: '#D7C7A8', box: '#372D23', boxGold: '#B69256', dash: '#C6B592'
};
const stage = document.getElementById('stage');
const clamp = x => Math.max(0, Math.min(1, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const eout = x => 1 - Math.pow(1 - x, 3);
const anims = [];

function div(style, html = '', parent = stage) {
  const d = document.createElement('div');
  d.style.position = 'absolute';
  Object.assign(d.style, style);
  d.innerHTML = html;
  parent.appendChild(d);
  return d;
}
// centred text block of given width
function text(cx, y, w, html, style, parent) {
  return div(Object.assign({ left: (cx - w / 2) + 'px', top: y + 'px', width: w + 'px', textAlign: 'center' }, style), html, parent);
}
const T = {
  title: { font: '700 84px PF', color: C.ink, lineHeight: '1' },
  sub: { font: '400 30px Inter', color: C.sub, lineHeight: '1.25' },
  eyebrow: { font: '600 22px Inter', color: C.gold, letterSpacing: '5px', lineHeight: '1.2' },
  note: { font: '400 24px Inter', color: C.ink, lineHeight: '1.4' },
  ital: { font: 'italic 400 38px PFI', color: C.ink, lineHeight: '1.2' },
};

// fade + rise in over [a, a+d]
function fadeIn(el, a, d = 0.4, rise = 14) {
  anims.push(t => { const k = eout(seg(t, a, a + d)); el.style.opacity = k; el.style.translate = `0 ${rise * (1 - k)}px`; });
}
// crossfade: el visible until a, gone by a+d
function fadeOut(el, a, d = 0.4) { anims.push(t => { el.style.opacity = 1 - ease(seg(t, a, a + d)); }); }

// trapezoid pyramid; layers = [{name, sub, extra, color, light, h}] top to bottom
function pyramid(parent, cx, y0, y1, wt, wb, layers, opts = {}) {
  const gap = opts.gap ?? 7, tot = layers.reduce((s, l) => s + (l.h || 1), 0);
  const avail = (y1 - y0) - gap * (layers.length - 1);
  const halfAt = y => (wt + (wb - wt) * (y - y0) / (y1 - y0)) / 2;
  let y = y0; const out = [];
  layers.forEach(l => {
    const h = avail * (l.h || 1) / tot, ht = halfAt(y), hb = halfAt(y + h), W = hb * 2;
    const d = div({ left: (cx - hb) + 'px', top: y + 'px', width: W + 'px', height: h + 'px', background: l.color,
      clipPath: `polygon(${hb - ht}px 0, ${hb + ht}px 0, ${W}px 100%, 0 100%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }, '', parent);
    const fg = l.light ? C.cream : C.ink;
    div({ position: 'static', font: `700 ${opts.nameSize || 34}px PF`, color: fg, lineHeight: '1.1' }, l.name, d);
    if (l.sub) div({ position: 'static', font: `400 ${opts.subSize || 21}px Inter`, color: fg, opacity: l.light ? .85 : .8, marginTop: '4px' }, l.sub, d);
    if (l.extra) l.extraEl = div({ position: 'static', font: `600 ${opts.extraSize || 18}px Inter`, color: '#E0C78C', marginTop: '6px', lineHeight: '1.25' }, l.extra, d);
    out.push({ el: d, y, h, right: yy => cx + halfAt(yy), layer: l });
    y += h + gap;
  });
  return out;
}
// build pyramid bottom-up: each layer drops in
function buildUp(layers, start, step = 0.33, d = 0.42) {
  layers.slice().reverse().forEach((L, i) => {
    const a = start + i * step;
    anims.push(t => { const k = eout(seg(t, a, a + d)); L.el.style.opacity = k; L.el.style.translate = `0 ${-26 * (1 - k)}px`; });
  });
}
window.render = t => anims.forEach(f => f(t));
