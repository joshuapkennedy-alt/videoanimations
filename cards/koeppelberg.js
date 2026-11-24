// Köppelberg: transparent overlay for the Google Earth clip (1920x1080). The camera settles at ~3.0 s;
// then everything outside the vineyard dims, a gold outline draws round it and the title fades in.
const SW = 1920, SH = 1080, NS = 'http://www.w3.org/2000/svg';
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const S = 3.0;   // camera settled

// vineyard outline, traced on the settled frame (clockwise from the top-left of the upper block)
const P = [[750,200],[770,128],[910,113],[985,138],[1010,175],[998,250],[972,400],[958,500],[1050,548],[1130,598],
  [1230,658],[1328,712],[1316,770],[1270,792],[1130,817],[945,857],[925,878],[760,947],[718,942],[690,820],[655,702],
  [530,657],[462,636],[418,580],[402,460],[480,438],[595,418],[712,448],[718,350]];
// smooth closed path (Catmull-Rom, light tension so the corners stay crisp)
function smooth(pts, k = 0.12) {
  const n = pts.length, p = i => pts[(i + n) % n];
  let d = `M${p(0)[0]} ${p(0)[1]}`;
  for (let i = 0; i < n; i++) {
    const a = p(i - 1), b = p(i), c = p(i + 1), e = p(i + 2);
    d += `C${b[0] + (c[0] - a[0]) * k} ${b[1] + (c[1] - a[1]) * k} ${c[0] - (e[0] - b[0]) * k} ${c[1] - (e[1] - b[1]) * k} ${c[0]} ${c[1]}`;
  }
  return d + 'Z';
}
const shape = smooth(P);

const svg = document.createElementNS(NS, 'svg');
svg.setAttribute('width', SW); svg.setAttribute('height', SH); svg.style.position = 'absolute';
svg.innerHTML = `
  <defs><filter id="glow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="6"/></filter></defs>
  <path class="dim" fill-rule="evenodd" fill="#140E09" d="M0 0H${SW}V${SH}H0Z ${shape}"/>
  <path class="warm" fill="#E9CC8E" d="${shape}"/>
  <path class="halo" fill="none" stroke="#F2D9A0" stroke-width="12" stroke-linejoin="round" filter="url(#glow)" d="${shape}"/>
  <path class="line" fill="none" stroke="#F2D9A0" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" d="${shape}"/>`;
stage.appendChild(svg);
const [dim, warm, halo, line] = ['dim', 'warm', 'halo', 'line'].map(c => svg.querySelector('.' + c));
const L = line.getTotalLength();
[halo, line].forEach(p => { p.style.strokeDasharray = L; });

// title over the open fields, top right
const title = div({ right: '80px', top: '290px', font: '700 100px PF', color: '#FBF6EC', whiteSpace: 'nowrap',
  letterSpacing: '5px', lineHeight: '1', textShadow: '0 4px 24px rgba(0,0,0,.55), 0 1px 3px rgba(0,0,0,.6)' }, 'KÖPPELBERG');
const rule = div({ right: '80px', top: '412px', width: '120px', height: '3px', background: '#F2D9A0', transformOrigin: 'center',
  boxShadow: '0 1px 6px rgba(0,0,0,.5)' });

// rule centred under the title
let placed = false;
anims.push(t => {
  if (!placed) { placed = true; const w = title.offsetWidth; rule.style.right = (80 + w / 2 - 60) + 'px'; }
  dim.style.opacity = 0.5 * ease(seg(t, S, S + 0.9));
  const d = ease(seg(t, S + 0.1, S + 1.5));
  [halo, line].forEach(p => { p.style.strokeDashoffset = L * (1 - d); });
  halo.style.opacity = 0.7 * d;
  warm.style.opacity = 0.12 * ease(seg(t, S + 0.8, S + 1.8));
  const h = eout(seg(t, S + 1.1, S + 1.8)); title.style.opacity = h; title.style.translate = `0 ${16 * (1 - h)}px`;
  rule.style.transform = `scaleX(${eout(seg(t, S + 1.4, S + 2.0))})`;
});
render(0);
