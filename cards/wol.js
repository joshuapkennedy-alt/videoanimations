// "Climate change: winner or loser?" title card, 4.8 s, no fade-out (it cuts to the next card).
// 16:9: "Winner" (olive) slides in from the left, "or loser?" (burgundy) from the right, on one line.
// 9:16: "Winner" above "or loser?", centred, between 15% and 75% of the height.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const OLIVE = '#7E8F26', BURG = '#6B2737';
const CX = SW / 2;
const Y = WIDE ? { head: 360, title: 420, sub: 610 } : { head: 700, title: 770, sub: 1150 };
fadeIn(text(CX, Y.head, SW - 80, 'CLIMATE CHANGE', Object.assign({}, T.eyebrow, { font: `600 ${WIDE ? 30 : 32}px Inter`, letterSpacing: '9px' })), 0, 0.5);
const row = div(WIDE ? { left: 0, top: Y.title + 'px', width: SW + 'px', display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '34px' }
                     : { left: 0, top: Y.title + 'px', width: SW + 'px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' });
const big = { position: 'static', font: `700 ${WIDE ? 150 : 160}px PF`, lineHeight: '1.08', whiteSpace: 'nowrap' };
const win = div(Object.assign({ color: OLIVE }, big), 'Winner', row), lose = div(Object.assign({ color: BURG }, big), 'or loser?', row);
const sub = text(CX, Y.sub, SW - 80, 'Honestly, both.', { font: `400 ${WIDE ? 40 : 44}px Inter`, color: C.ink });
anims.push(t => {
  const a = eout(seg(t, 0.2, 0.9)), b = eout(seg(t, 0.6, 1.3));
  win.style.opacity = a; win.style.translate = `${-90 * (1 - a)}px 0`;
  lose.style.opacity = b; lose.style.translate = `${90 * (1 - b)}px 0`;
  const s = eout(seg(t, 3.0, 3.5)); sub.style.opacity = s; sub.style.translate = `0 ${12 * (1 - s)}px`;
});
render(0);
