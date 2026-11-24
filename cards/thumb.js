// YouTube thumbnail, 1280x720: "Wine on London's Latitude? Inside Germany's Saale-Unstrut".
// window.THUMB = { variant: 'A' | 'B', bg: <background photo url or ''>, cut: <transparent cut-out PNG url or ''> }
//   A: "51°N" (gold) over "WINE HERE?" (parchment).  B: "LONDON'S" (gold) over "LATITUDE?" (parchment).
// Layers: background photo (darkened ~30%, warmer, more contrast, dark vignette on the left), the presenter cut-out in the
// right third with a 6 px parchment outline and soft shadow, the text on the left, a small Germany outline with a burgundy
// pin on Saale-Unstrut bottom-left. Nothing in the bottom-right corner (YouTube's timestamp). Empty slots show placeholders.
const W = 1280, H = 720, NS = 'http://www.w3.org/2000/svg';
stage.style.width = W + 'px'; stage.style.height = H + 'px';
const { variant = 'A', bg = '', cut = '', cutW = 470, cutRight = 30 } = window.THUMB || {};
const PARCH = '#F0E7D6', GOLD = '#B8935A', BURG = '#6B2737';

// 1. background
if (bg) div({ left: 0, top: 0, width: W + 'px', height: H + 'px', backgroundImage: `url("${bg}")`, backgroundSize: 'cover', backgroundPosition: 'center',
  filter: 'brightness(0.7) contrast(1.12) saturate(1.08) sepia(0.12)' });
else div({ left: 0, top: 0, width: W + 'px', height: H + 'px', background: 'linear-gradient(160deg, #6f6a4b 0%, #4c4a34 45%, #3a2e22 100%)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
  font: '600 22px Inter', color: 'rgba(240,231,214,.45)', letterSpacing: '4px', paddingTop: '16px', boxSizing: 'border-box' }, 'BACKGROUND PHOTO: TERRACES ABOVE FREYBURG');
// soft dark vignette, strongest on the left half where the text sits
div({ left: 0, top: 0, width: W + 'px', height: H + 'px', background:
  'linear-gradient(90deg, rgba(18,12,8,.78) 0%, rgba(18,12,8,.55) 30%, rgba(18,12,8,.18) 55%, rgba(18,12,8,0) 70%), radial-gradient(ellipse 85% 95% at 60% 45%, rgba(0,0,0,0) 55%, rgba(12,8,5,.45) 100%)' });

// 2. presenter cut-out, right third (head ~30-35% of the frame height when the photo is framed chest-up)
const svgDefs = document.createElementNS(NS, 'svg'); svgDefs.setAttribute('width', 0); svgDefs.setAttribute('height', 0); svgDefs.style.position = 'absolute';
svgDefs.innerHTML = `<filter id="outline" x="-10%" y="-10%" width="120%" height="120%"><feMorphology in="SourceAlpha" operator="dilate" radius="6" result="d"/>
  <feFlood flood-color="${PARCH}"/><feComposite in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
stage.appendChild(svgDefs);
const person = div({ right: cutRight + 'px', bottom: 0, height: '700px', width: (cut ? cutW : 470) + 'px', filter: 'url(#outline) drop-shadow(0 10px 22px rgba(0,0,0,.55))' }, '', stage);
if (cut) person.innerHTML = `<img src="${cut}" style="position:absolute;right:0;bottom:0;height:100%;width:auto;display:block;filter:contrast(1.06) saturate(1.02) sepia(0.1)">`;
else person.innerHTML = `<svg width="470" height="700" viewBox="0 0 470 700" style="position:absolute;left:0;top:0">
  <path d="M235 120c62 0 100 50 100 112 0 70-42 120-100 120s-100-50-100-120c0-62 38-112 100-112z" fill="#8b8377"/>
  <path d="M30 700c0-150 80-280 205-300 125 20 205 150 205 300z" fill="#8b8377"/>
  <path d="M300 470l26 0 0 70c0 22-10 34-26 38v58h-6v-58c-16-4-26-16-26-38z" fill="#d8cfb8" opacity=".9"/>
  <text x="235" y="560" text-anchor="middle" font-family="Inter" font-weight="600" font-size="20" letter-spacing="3" fill="#F0E7D6" opacity=".8">YOUR CUT-OUT</text></svg>`;

// 3. text, left
const shadow = '0 6px 22px rgba(0,0,0,.55), 0 2px 4px rgba(0,0,0,.6)';
const block = div({ left: '64px', top: variant === 'A' ? '58px' : '120px', width: '700px' }, '', stage);
if (variant === 'A') {
  div({ position: 'static', font: '800 372px PF', color: GOLD, lineHeight: '0.9', letterSpacing: '-6px', textShadow: shadow, fontVariantNumeric: 'lining-nums', whiteSpace: 'nowrap' }, '51°N', block);
  div({ position: 'static', font: '700 92px Inter', color: PARCH, letterSpacing: '5px', lineHeight: '1', marginTop: '14px', textShadow: shadow, whiteSpace: 'nowrap' }, 'WINE HERE?', block);
} else {
  div({ position: 'static', font: '800 150px PF', color: GOLD, lineHeight: '0.95', textShadow: shadow, whiteSpace: 'nowrap' }, 'LONDON’S', block);
  div({ position: 'static', font: '700 112px Inter', color: PARCH, letterSpacing: '4px', lineHeight: '1', marginTop: '18px', textShadow: shadow, whiteSpace: 'nowrap' }, 'LATITUDE?', block);
}

// 4. Germany outline with a burgundy pin on Saale-Unstrut (Freyburg), bottom-left, about 120 px tall
// GEO.germany is in the map image's pixel space (see paths.js); Freyburg sits at about (1044, 1067) in it.
const g = document.createElementNS(NS, 'svg');
Object.assign(g.style, { position: 'absolute', left: '60px', bottom: '34px', overflow: 'visible', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,.5))' });
g.innerHTML = `<path d="${GEO.germany}" fill="rgba(240,231,214,.12)" stroke="${PARCH}" stroke-width="20" stroke-linejoin="round"/>
  <g transform="translate(1044 1067) scale(1.5)"><path d="M0 0C0 0-110-135-110-220a110 110 0 0 1 220 0C110-135 0 0 0 0z" fill="${BURG}" stroke="${PARCH}" stroke-width="18"/><circle cy="-220" r="42" fill="${PARCH}"/></g>`;
stage.appendChild(g);
// fit the outline itself to 120 px tall
const bb = g.querySelector('path').getBBox();
g.setAttribute('viewBox', `${bb.x} ${bb.y} ${bb.width} ${bb.height}`); g.setAttribute('height', 120); g.setAttribute('width', Math.round(120 * bb.width / bb.height));

// the renderer waits for window.ready: make sure the ExtraBold Playfair (and any photos) have loaded
window.ready = false;
window.render = () => {};
Promise.all([document.fonts.load('800 100px PF'), document.fonts.load('700 100px Inter'), ...[...document.images].map(i => i.complete ? 0 : new Promise(res => { i.onload = i.onerror = res; }))]).then(() => { window.ready = true; });
