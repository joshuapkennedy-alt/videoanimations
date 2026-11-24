// "Next time: Sachsen" end-screen background, 15 s, 16:9 only. Parchment with faint gold vineyard terraces (about 15% opacity)
// drifting slowly. Text only in the centre column (x 640-1280) and above the bottom 20% (y < 864); the left and right
// thirds stay empty for YouTube's end-screen elements.
const SW = 1920, SH = 1080, NS = 'http://www.w3.org/2000/svg';
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';

// ---- terraces: stepped contour lines with short vine-row ticks, drawn wider than the frame so they can drift ----
const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('width', SW + 400); svg.setAttribute('height', SH);
svg.style.position = 'absolute'; svg.style.left = '-200px'; svg.style.top = 0; stage.appendChild(svg);
const g = document.createElementNS(NS, 'g'); g.setAttribute('fill', 'none'); g.setAttribute('stroke', C.gold); g.setAttribute('stroke-linecap', 'round'); g.setAttribute('stroke-linejoin', 'round'); svg.appendChild(g);
let paths = '';
for (let k = 0; k < 9; k++) {
  // a gentle slope falling to the right, broken into terraces: flat treads and short steep risers
  const y0 = 470 + k * 78, steps = 7, w = (SW + 400) / steps;
  let d = `M0 ${y0}`;
  for (let s = 0; s < steps; s++) {
    const x = s * w, y = y0 + s * 22 + Math.sin(k * 1.3 + s) * 6;
    d += `L${(x + w * 0.82).toFixed(1)} ${y.toFixed(1)}Q${(x + w * 0.9).toFixed(1)} ${(y + 2).toFixed(1)} ${(x + w).toFixed(1)} ${(y + 22).toFixed(1)}`;
    // vine-row ticks on the tread
    for (let v = 0.08; v < 0.78; v += 0.07) { const vx = x + w * v, vy = y - 1; paths += `<path d="M${vx.toFixed(1)} ${vy.toFixed(1)}v-10" stroke-width="1.6"/>`; }
  }
  paths += `<path d="${d}" stroke-width="2.4"/>`;
}
g.innerHTML = paths;
svg.style.opacity = 0.15;
// soft paper grain (very faint, static)
const grain = document.createElementNS(NS, 'svg'); grain.setAttribute('width', SW); grain.setAttribute('height', SH); grain.style.position = 'absolute'; grain.style.left = 0; grain.style.top = 0;
grain.innerHTML = '<filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 0.16 0 0 0 0 0.12 0 0 0 0 0.09 0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity=".18"/>';
stage.appendChild(grain);
// a soft parchment glow behind the centre column keeps the text clear of the lines
const glow = div({ left: '560px', top: '200px', width: '800px', height: '520px', background: 'radial-gradient(closest-side, rgba(238,229,212,0.95), rgba(238,229,212,0.75) 60%, rgba(238,229,212,0))' });

// ---- centre text ----
const head = text(SW / 2, 330, 640, 'NEXT TIME', Object.assign({}, T.eyebrow, { font: '600 30px Inter', letterSpacing: '10px' }));
const title = text(SW / 2, 380, 640, 'Sachsen', { font: '700 150px PF', color: C.ink, lineHeight: '1.05' });
const sub = text(SW / 2, 560, 640, 'along the Elbe', { font: '500 38px Inter', color: '#6B2737', letterSpacing: '1px' });
fadeIn(head, 0.5, 0.6); fadeIn(title, 0.65, 0.7, 18); fadeIn(sub, 0.9, 0.6);

anims.push(t => {
  // slow drift: about 90 px over 15 s, with a tiny vertical sway
  svg.style.transform = `translate(${-90 * (t / 15)}px, ${4 * Math.sin(t * 0.4)}px)`;
});
render(0);
