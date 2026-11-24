// "+1.4 °C warmer than 1961–1990" (Saxony-Anhalt, annual mean, 2001–2025): small transparent overlay, 3 s, no fade-out
// (it cuts with the map). 16:9: top-right, 80 px from the top and right edges. 9:16: centred on x 540, from 15% of the height.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const BURG = '#6B2737';
const tileBg = 'rgba(246, 239, 225, 0.92)', tileBorder = '2px solid rgba(220, 205, 178, 0.9)';
const shadow = '0 10px 30px rgba(40, 29, 22, 0.28), 0 2px 6px rgba(40, 29, 22, 0.18)';
const Z = WIDE ? 1 : 1.15, px = n => Math.round(n * Z);
const card = div(Object.assign({ display: 'flex', alignItems: 'center', gap: px(24) + 'px', boxSizing: 'border-box', padding: `${px(22)}px ${px(34)}px ${px(24)}px ${px(26)}px`,
  background: tileBg, border: tileBorder, borderRadius: '16px', boxShadow: shadow, whiteSpace: 'nowrap' },
  WIDE ? { right: '80px', top: '80px' } : { left: '540px', top: Math.round(SH * 0.15) + 'px', transform: 'translateX(-50%)' }));
// gold line thermometer
card.insertAdjacentHTML('beforeend', `<svg width="${px(46)}" height="${px(116)}" viewBox="0 0 40 100" style="flex:none;display:block;overflow:visible">
  <g fill="none" stroke="${C.gold}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M13 66V14a7 7 0 0 1 14 0V66a14 14 0 1 1-14 0Z"/><path d="M31 24H36M31 36H36M31 48H36"/></g>
  <circle cx="20" cy="78" r="8" fill="${C.gold}"/><path d="M20 70V34" stroke="${C.gold}" stroke-width="5" stroke-linecap="round"/></svg>`);
const col = div({ position: 'static' }, '', card);
const num = div({ position: 'static', font: `700 ${px(76)}px PF`, color: BURG, lineHeight: '1', fontVariantNumeric: 'lining-nums tabular-nums' }, '+0.0 °C', col);
div({ position: 'static', font: `500 ${px(25)}px Inter`, color: C.ink, lineHeight: '1.3', marginTop: px(10) + 'px' }, 'warmer than 1961–1990', col);
div({ position: 'static', font: `400 ${px(18)}px Inter`, color: 'rgba(40, 29, 22, 0.6)', lineHeight: '1.3', marginTop: px(4) + 'px' }, 'Saxony-Anhalt, annual mean, 2001–2025', col);
anims.push(t => {
  const a = eout(seg(t, 0, 0.3)); card.style.opacity = a; card.style.translate = `0 ${-12 * (1 - a)}px`;
  num.textContent = `+${(1.4 * eout(seg(t, 0.3, 1.8))).toFixed(1)} °C`;
});
render(0);
