// "Name / VDP rank" key: two small parchment tiles (transparent overlay), 8.5 s.
// 16:9: side by side, bottom centre, 80 px from the bottom. 9:16: stacked, centred on x 510, middle at 65% of the height (about 60-70%).
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const OUT = 8.1, END = 8.5;
const tileBg = 'rgba(246, 239, 225, 0.92)', tileBorder = '2px solid rgba(220, 205, 178, 0.9)';
const shadow = '0 10px 30px rgba(40, 29, 22, 0.28), 0 2px 6px rgba(40, 29, 22, 0.18)';
const Z = WIDE ? 1 : 1.15, px = n => Math.round(n * Z) + 'px';
const swatch = `<span style="display:inline-block;width:${px(26)};height:${px(26)};border-radius:${px(5)};background:${C.gold};box-shadow:inset 0 0 0 1px rgba(40,29,22,.15);` +
  `vertical-align:middle;margin-right:${px(14)};position:relative;top:-${px(2)}"></span>`;
const TILES = [
  { main: 'Name', sub: 'where it’s from', at: 0.2 },
  { main: swatch + 'VDP rank', sub: 'how highly the VDP rates it', at: 2.2 },
];
const wrap = div(Object.assign({ display: 'flex', gap: px(20), alignItems: 'stretch' },
  WIDE ? { left: '50%', bottom: '80px', transform: 'translateX(-50%)' }
       : { left: '510px', top: Math.round(SH * 0.65) + 'px', transform: 'translate(-50%, -50%)', flexDirection: 'column', width: px(560) }));
TILES.forEach(tl => {
  const tile = div({ position: 'static', boxSizing: 'border-box', padding: `${px(18)} ${px(30)} ${px(20)}`, background: tileBg, border: tileBorder,
    borderRadius: '16px', boxShadow: shadow, whiteSpace: 'nowrap', textAlign: WIDE ? 'left' : 'center' }, '', wrap);
  div({ position: 'static', font: `700 ${px(38)} PF`, color: C.ink, lineHeight: '1.15' }, tl.main, tile);
  div({ position: 'static', font: `400 ${px(23)} Inter`, color: C.ink, lineHeight: '1.35', marginTop: px(4) }, tl.sub, tile);
  anims.push(t => {
    const k = eout(seg(t, tl.at, tl.at + 0.4)), out = 1 - ease(seg(t, OUT, END));
    tile.style.opacity = k * out; tile.style.translate = `0 ${24 * (1 - k)}px`;
  });
});
render(0);
