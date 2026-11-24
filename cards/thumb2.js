// YouTube thumbnail, 1280x720, no people: terrace photo, a two-line headline on the left and a parchment map inset on
// the right (51°N line from London to Freyburg). window.THUMB2 = { variant: 'A' | 'B', bg: <photo url> }
//   A: "TOO FAR" (parchment) / "NORTH?" (gold).  B: "WINE" (parchment) / "HERE?" (gold).
// Nothing in the bottom-right corner (YouTube's timestamp).
const W = 1280, H = 720, NS = 'http://www.w3.org/2000/svg';
stage.style.width = W + 'px'; stage.style.height = H + 'px';
const { variant = 'A', bg = 'thumb_bg.jpg' } = window.THUMB2 || {};
const PARCH = '#F0E7D6', INK = '#2A2018', BURG = '#6B2737', GOLD = '#B8935A';

// 1. background: darkened ~25%, slightly warmer, dark vignette on the left behind the headline
div({ left: 0, top: 0, width: W + 'px', height: H + 'px', backgroundImage: `url("${bg}")`, backgroundSize: 'cover', backgroundPosition: 'center',
  filter: 'brightness(0.75) contrast(1.1) saturate(1.06) sepia(0.1)' });
div({ left: 0, top: 0, width: W + 'px', height: H + 'px', background:
  'linear-gradient(90deg, rgba(18,12,8,.8) 0%, rgba(18,12,8,.58) 28%, rgba(18,12,8,.2) 52%, rgba(18,12,8,0) 66%), radial-gradient(ellipse 85% 95% at 55% 55%, rgba(0,0,0,0) 55%, rgba(12,8,5,.4) 100%)' });

// 2. headline, left (Playfair Display at its heaviest bundled weight, 800; 158 px so "TOO FAR" clears the map card)
const [l1, l2] = variant === 'A' ? ['TOO FAR', 'NORTH?'] : ['WINE', 'HERE?'];
const shadow = '0 6px 24px rgba(0,0,0,.6), 0 2px 5px rgba(0,0,0,.55)';
const head = div({ left: '60px', top: '58px' }, '', stage);
const hl = (s, col) => div({ position: 'static', font: '800 158px PF', color: col, lineHeight: '1', letterSpacing: '-1px', textShadow: shadow, whiteSpace: 'nowrap' }, s, head);
hl(l1, PARCH); hl(l2, GOLD);

// 3. map inset, right third: Western Europe in ink line art, the 51st parallel from London to Freyburg
// GEO is in the map image's pixel space (see paths.js): x = 168.45*lon + c, y = -266.96*lat + c.
const CW = 440, CH = 300, CX0 = 1280 - 48 - CW, CY0 = 118;
const card = div({ left: CX0 + 'px', top: CY0 + 'px', width: CW + 'px', height: CH + 'px', borderRadius: '20px', overflow: 'hidden',
  background: 'rgba(240,231,214,.92)', boxShadow: '0 8px 20px rgba(42,32,24,.25)' }, '', stage);
const LON = GEO.cities.London, FB = GEO.cities.Freyburg, Y51 = GEO.lat51[0][1];
const S = 0.115;                                   // map px -> card px
const mx = (LON[0] + FB[0]) / 2, my = Y51 - 40;    // view centre: midway along the line, the line a little below the middle
const ox = CW / 2 - mx * S, oy = CH / 2 - my * S;
const P = p => [p[0] * S + ox, p[1] * S + oy];
const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('width', CW); svg.setAttribute('height', CH); svg.style.position = 'absolute';
const shapes = GEO.countries.map(c => c.d).concat(GEO.germany)
  .map(d => `<path d="${d}" fill="rgba(42,32,24,.06)" stroke="${INK}" stroke-opacity=".5" stroke-width="0.8" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`).join('');
const [lx] = P(LON), [fx] = P(FB), ly = Y51 * S + oy;
const halo = `stroke="${PARCH}" stroke-width="7" stroke-linejoin="round" paint-order="stroke"`;
svg.innerHTML = `<g transform="translate(${ox} ${oy}) scale(${S})">${shapes}</g>
  <line x1="${lx}" y1="${ly}" x2="${fx}" y2="${ly}" stroke="${GOLD}" stroke-width="5" stroke-linecap="round"/>
  <rect x="${(lx + fx) / 2 - 48}" y="${ly - 50}" width="96" height="38" rx="19" fill="${PARCH}"/>
  <text x="${(lx + fx) / 2}" y="${ly - 21}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="28" fill="${GOLD}">51°N</text>
  ${[[lx, 'London'], [fx, 'Freyburg']].map(([x, n]) => `<circle cx="${x}" cy="${ly}" r="15" fill="${BURG}" stroke="${PARCH}" stroke-width="2.5"/>
  <text x="${x}" y="${ly + 50}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="28" fill="${INK}" ${halo}>${n}</text>`).join('')}`;
card.appendChild(svg);

window.ready = false;
window.render = () => {};
const img = new Image(); img.src = bg;
Promise.all([document.fonts.load('800 100px PF'), document.fonts.load('700 28px Inter'), new Promise(r => { img.onload = img.onerror = r; })]).then(() => { window.ready = true; });
