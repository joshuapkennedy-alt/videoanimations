// Vineyard site overlay for a Google Earth clip (transparent, 1920x1080). Once the camera settles (SITE.S), the rest of
// the frame dims, the Einzellage parcels outline in cream and the title comes in; at SITE.GL the VDP.Große Lage parcels
// fill in gold (gold = VDP.Große Lage, as on the VDP card). Reads window.SITE = { title, S, GL, at: [x, y] } and
// window.SITE_GEO = { lage, gl } (SVG paths in video pixels, from the per-site *_geo.js file).
const SW = 1920, SH = 1080, NS = 'http://www.w3.org/2000/svg', { title: NAME, S, GL, at: [TX, TY] } = window.SITE, EDEL = window.SITE_GEO;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const LAGE = EDEL.lage.join(''), GOLD = '#C9A35F';

const svg = document.createElementNS(NS, 'svg');
svg.setAttribute('width', SW); svg.setAttribute('height', SH); svg.style.position = 'absolute';
svg.innerHTML = `<defs>
    <mask id="out" maskUnits="userSpaceOnUse" x="0" y="0" width="${SW}" height="${SH}"><rect width="${SW}" height="${SH}" fill="#fff"/><path d="${LAGE}" fill="#000"/></mask>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
  <rect class="dim" width="${SW}" height="${SH}" fill="#140E09" mask="url(#out)"/>
  <path class="fill" d="${LAGE}" fill="#FBF6EC"/>
  <g class="lines">${EDEL.lage.map(d => `<path d="${d}" fill="none" stroke="#140E09" stroke-width="6" stroke-linejoin="round" opacity=".55"/>` +
    `<path d="${d}" fill="none" stroke="#FBF6EC" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`).join('')}</g>
  <g class="gl">${EDEL.gl.map(d => `<path d="${d}" fill="${GOLD}" filter="url(#soft)" opacity=".8"/>` +
    `<path d="${d}" fill="${GOLD}" stroke="#F6E3B4" stroke-width="2.5" stroke-linejoin="round"/>`).join('')}</g>`;
stage.appendChild(svg);
const q = c => svg.querySelector('.' + c), [dim, fill, gl] = ['dim', 'fill', 'gl'].map(q);
const strokes = [...q('lines').querySelectorAll('path')].map(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L + 1; return [p, L]; });

// ---- title and key: placed per site on a dark, quiet area (clear of the Google Earth logo and the top-left cards) ----
const shadow = '0 3px 18px rgba(0,0,0,.55), 0 1px 3px rgba(0,0,0,.6)';
const title = div({ left: TX + 'px', top: TY + 'px', font: '700 100px PF', color: '#FBF6EC', letterSpacing: '5px', lineHeight: '1', whiteSpace: 'nowrap', textShadow: shadow }, NAME);
const key = (html, top) => div({ left: (TX + 4) + 'px', top: (TY + top) + 'px', font: '500 28px Inter', color: '#FBF6EC', whiteSpace: 'nowrap', textShadow: shadow }, html);
const k1 = key(`<span style="display:inline-block;width:24px;height:18px;border:2.5px solid #FBF6EC;background:rgba(251,246,236,.22);border-radius:3px;vertical-align:-2px;margin-right:14px;box-shadow:0 0 0 1px rgba(20,14,9,.5)"></span>Einzellage (official site)`, 130);
const k2 = key(`<span style="display:inline-block;width:29px;height:23px;background:${GOLD};border-radius:3px;vertical-align:-4px;margin-right:14px;box-shadow:0 0 0 1px rgba(20,14,9,.4)"></span>VDP.Große Lage`, 176);

anims.push(t => {
  dim.style.opacity = 0.42 * ease(seg(t, S, S + 0.9));
  const d = ease(seg(t, S + 0.1, S + 1.7)); strokes.forEach(([p, L]) => { p.style.strokeDashoffset = (L + 1) * (1 - d); });
  q('lines').style.opacity = d > 0 ? 1 : 0;
  fill.style.opacity = 0.2 * ease(seg(t, S + 1.0, S + 2.0));
  [[title, S + 1.6], [k1, S + 2.0], [k2, GL + 0.4]].forEach(([el, a]) => { const k = eout(seg(t, a, a + 0.6)); el.style.opacity = k; el.style.translate = `0 ${14 * (1 - k)}px`; });
  const g = ease(seg(t, GL, GL + 0.8)); gl.style.opacity = g;
});
render(0);
