// Name / fact lower third: transparent, reads window.LABEL = { main, sub, dur } (or { words, dur }) and window.WIDE.
// words: a single line of words joined by gold dots, each word fading in 0.4 s after the one before; sub is optional.
// 16:9: bottom-right, 80 px from the bottom and right edges. 9:16: centred on x 510 (120+ px clear on the right), middle at 65% of the height.
// Fades and slides up in 0.4 s, holds, fades out over the last 0.4 s.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const { main, sub, words, dur } = window.LABEL, BURG = '#6B2737';
const tileBg = 'rgba(246, 239, 225, 0.92)', tileBorder = '2px solid rgba(220, 205, 178, 0.9)';
const shadow = '0 10px 30px rgba(40, 29, 22, 0.28), 0 2px 6px rgba(40, 29, 22, 0.18)';
const MAXW = WIDE ? 1200 : 900;   // widest the band may get

const band = div(Object.assign({ boxSizing: 'border-box', padding: WIDE ? '20px 34px 22px' : '24px 34px 26px', background: tileBg, border: tileBorder,
  borderRadius: '16px', boxShadow: shadow, whiteSpace: 'nowrap', textAlign: WIDE ? 'left' : 'center' },
  WIDE ? { right: '80px', bottom: '80px' } : { left: '510px', top: Math.round(SH * 0.65) + 'px', transform: 'translate(-50%, -50%)' }));
const m = div({ position: 'static', font: `700 ${WIDE ? 46 : 50}px PF`, color: BURG, lineHeight: '1.1', letterSpacing: words ? '2px' : '0.5px' },
  words ? words.map((w, i) => (i ? '<span class="wd" style="color:' + C.gold + ';padding:0 0.45em">·</span>' : '') + '<span class="wd">' + w + '</span>').join('') : main, band);
const s = sub == null ? null : div({ position: 'static', font: `400 ${WIDE ? 25 : 28}px Inter`, color: C.ink, lineHeight: '1.3', marginTop: '8px' }, sub, band);

// shrink the type if a long line would make the band wider than MAXW (measured once, after the fonts load)
let fitted = false;
function fit() {
  if (fitted || document.fonts.status !== 'loaded') return; fitted = true;
  const k = Math.min(1, MAXW / band.offsetWidth);
  if (k < 1) [m, s].filter(Boolean).forEach(el => { el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * k * 0.98) + 'px'; });
}
anims.push(t => {
  fit();
  const a = eout(seg(t, 0, 0.4)), out = 1 - ease(seg(t, dur - 0.4, dur));
  band.style.opacity = a * out; band.style.translate = `0 ${24 * (1 - a)}px`;
  // words: word i (and the dot before it) fades in from 0.3 + 0.4 i s
  if (words) m.querySelectorAll('.wd').forEach((el, j) => { const i = Math.ceil(j / 2), k = eout(seg(t, 0.3 + 0.4 * i, 0.7 + 0.4 * i)); el.style.opacity = k; });
});
render(0);
