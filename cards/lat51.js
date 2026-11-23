// Saale-Unstrut -> 51°N: starts on the zoomed region (end of saale_unstrut_rivers), zooms out to north-west Europe,
// then draws the 51st parallel and marks Freyburg and London. window.WIDE selects the 16:9 layout.
window.ready = false;
Promise.resolve(window.GEO).then(G => {
  const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
  const NS = 'http://www.w3.org/2000/svg', lerp = (a, b, k) => a + (b - a) * k;
  const SU = { x: 1035, y: 1065 }, MID = { x: 820, y: 1080 };
  const FB = G.cities.Freyburg, LON = G.cities.London, Y51 = G.lat51[0][1];
  // views: map point c shown at screen centre with scale s
  const V0 = { s: 1.736, c: SU };                                       // where saale_unstrut_rivers ends
  const V1 = WIDE ? { s: 0.44, c: { x: -60, y: 1080 } } : { s: 0.28, c: { x: -96, y: 1100 } };   // centred on 5°E: all of England and Germany
  function view(t) {
    const k = ease(seg(t, 0.8, 4.4)), s = Math.exp(lerp(Math.log(V0.s), Math.log(V1.s), k));
    const w = (1 / s - 1 / V0.s) / (1 / V1.s - 1 / V0.s);                // pan follows the visible extent, so the zoom feels even
    const cx = lerp(V0.c.x, V1.c.x, w), cy = lerp(V0.c.y, V1.c.y, w);
    return { s, tx: SW / 2 - cx * s, ty: SH / 2 - cy * s, k };
  }
  const scr = (v, p) => [p[0] * v.s + v.tx, p[1] * v.s + v.ty];

  stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
  const map = div({ left: 0, top: 0, width: '1640px', height: '2160px', transformOrigin: '0 0' });
  // neighbouring countries (vector, same projection as the raster map)
  const land = document.createElementNS(NS, 'svg');
  Object.assign(land.style, { position: 'absolute', left: 0, top: 0, overflow: 'visible' });
  land.setAttribute('width', 1640); land.setAttribute('height', 2160);
  land.innerHTML = '<rect x="-6000" y="-6000" width="14000" height="14000" fill="#DCE4E1"/>' + G.countries.map(c => `<path d="${c.d}" fill="#F1EADC" stroke="#C9B99D" stroke-width="1.4" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>`).join('');
  map.appendChild(land);
  const de = document.createElement('img'); de.src = 'muted_de.png'; Object.assign(de.style, { position: 'absolute', left: 0, top: 0, width: '1640px', height: '2160px' }); map.appendChild(de);
  const su = document.createElement('img'); su.src = 'su_layer.png'; Object.assign(su.style, { position: 'absolute', left: 0, top: 0, width: '1640px', height: '2160px' }); map.appendChild(su);

  const fx = document.createElementNS(NS, 'svg'); fx.setAttribute('width', SW); fx.setAttribute('height', SH);
  Object.assign(fx.style, { position: 'absolute', left: 0, top: 0 }); stage.appendChild(fx);
  fx.innerHTML = '<defs><radialGradient id="g"><stop offset="0" stop-color="#C9D36A" stop-opacity=".55"/><stop offset="1" stop-color="#C9D36A" stop-opacity="0"/></radialGradient></defs>';
  const el = (tag, attrs, parent = fx) => { const e = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); parent.appendChild(e); return e; };

  // glow + rings carry on from the previous clip (its clock ended at 8s), then fade as we pull out
  const glow = el('circle', { fill: 'url(#g)' });
  const rings = Array.from({ length: 10 }, () => el('circle', { fill: 'none', stroke: '#8E9F2E' }));
  // river labels from the previous clip, fading out
  const riverLbl = (str, x, y, anchor) => { const t = el('text', { x, y, 'text-anchor': anchor, fill: '#3F6B8A', stroke: '#F8F3EA', 'stroke-width': 9, 'stroke-linejoin': 'round', 'paint-order': 'stroke', 'font-family': 'PFI', 'font-style': 'italic', 'font-size': 52, 'letter-spacing': 1 }); t.textContent = str; return t; };
  const off = WIDE ? [960 - 540, 540 - 960] : [0, 0];
  const rl = [riverLbl('Saale', 566 + off[0], 1318 + off[1], 'start'), riverLbl('Unstrut', 432 + off[0], 872 + off[1], 'end')];

  // 51°N
  const line = el('line', { stroke: '#B8925A', 'stroke-width': 4, 'stroke-linecap': 'round' });
  const latTxt = el('text', { fill: '#9C7A44', 'font-family': 'Inter', 'font-weight': 600, 'font-size': WIDE ? 30 : 32, 'letter-spacing': 3, stroke: '#F4EEE2', 'stroke-width': 7, 'paint-order': 'stroke' }); latTxt.textContent = '51°N';
  // city markers
  function city(name, lat, p, a) {
    const g = el('g', {});
    const pulse = el('circle', { fill: 'none', stroke: '#6B2636', 'stroke-width': 3 }, g);
    const dot = el('circle', { r: 11, fill: '#6B2636', stroke: '#F9F4EA', 'stroke-width': 4 }, g);
    const t1 = el('text', { 'text-anchor': 'middle', fill: '#281D16', 'font-family': 'PF', 'font-weight': 700, 'font-size': WIDE ? 46 : 50, stroke: '#F9F4EA', 'stroke-width': 10, 'stroke-linejoin': 'round', 'paint-order': 'stroke' }, g); t1.textContent = name;
    const t2 = el('text', { 'text-anchor': 'middle', fill: '#685D4A', 'font-family': 'Inter', 'font-weight': 500, 'font-size': WIDE ? 26 : 28, stroke: '#F9F4EA', 'stroke-width': 8, 'stroke-linejoin': 'round', 'paint-order': 'stroke' }, g); t2.textContent = lat;
    return (t, v) => {
      const [x, y] = scr(v, p), k = eout(seg(t, a, a + 0.45));
      g.style.opacity = k;
      dot.setAttribute('cx', x); dot.setAttribute('cy', y); dot.setAttribute('r', 11 * (0.4 + 0.6 * k));
      const q = seg(t, a, a + 1.2); pulse.setAttribute('cx', x); pulse.setAttribute('cy', y); pulse.setAttribute('r', 12 + 50 * eout(q)); pulse.setAttribute('opacity', q < 1 ? (1 - q) : 0);
      t1.setAttribute('x', x); t1.setAttribute('y', y - 62 + 8 * (1 - k)); t2.setAttribute('x', x); t2.setAttribute('y', y - 28 + 8 * (1 - k));
    };
  }
  const cities = [city('London', '51.5°N', LON, 5.7), city('Freyburg', '51.2°N', FB, 6.0)];

  anims.push(t => {
    const v = view(t);
    map.style.transform = `translate(${v.tx}px, ${v.ty}px) scale(${v.s})`;
    land.style.opacity = ease(seg(t, 2.4, 3.9));
    const fade = 1 - seg(t, 1.0, 2.2), T = t + 8, [cx, cy] = scr(v, [SU.x, SU.y]);
    glow.setAttribute('cx', cx); glow.setAttribute('cy', cy); glow.setAttribute('r', 190 * (1 + 0.08 * Math.sin(T * 4.4)) * (v.s / V0.s) ** 0.5); glow.setAttribute('opacity', fade);
    rings.forEach((c, i) => {
      const p = (T - 1.3 - i * 1.4) / 1.6;
      if (p < 0 || p > 1 || fade <= 0) { c.setAttribute('opacity', 0); return; }
      c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', lerp(30, 230, eout(p))); c.setAttribute('stroke-width', lerp(6, 2, p));
      c.setAttribute('opacity', (1 - p) * 0.9 * fade);
    });
    rl.forEach(r => r.style.opacity = 1 - seg(t, 0.3, 0.8));
    // 51st parallel draws from west to east
    const [, ly] = scr(v, [0, Y51]), d = ease(seg(t, 4.9, 6.1));
    line.setAttribute('x1', -10); line.setAttribute('y1', ly); line.setAttribute('x2', -10 + (SW + 20) * d); line.setAttribute('y2', ly); line.style.opacity = d > 0 ? 1 : 0;
    latTxt.setAttribute('x', WIDE ? 36 : 28); latTxt.setAttribute('y', ly + (WIDE ? 44 : 48)); latTxt.style.opacity = eout(seg(t, 5.3, 5.8));
    cities.forEach(f => f(t, v));
  });
  Promise.all([de, su].map(i => i.decode())).then(() => { render(0); window.ready = true; });
});
