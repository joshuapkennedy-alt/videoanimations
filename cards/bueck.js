// "Bückware": transparent title overlay, 9 s, centred in the top third (16:9) / between 15% and 35% of the height (9:16).
// Same tile look as the walls lower third (92% parchment, rounded corners, soft shadow). window.WIDE selects 16:9.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const BURG = '#6B2737', OUT = 8.6, END = 9.0;
const tileBg = 'rgba(246, 239, 225, 0.92)', tileBorder = '2px solid rgba(220, 205, 178, 0.9)';
const shadow = '0 10px 30px rgba(40, 29, 22, 0.28), 0 2px 6px rgba(40, 29, 22, 0.18)';

// 16:9: card 860 wide, y 50-340 (top third ends at 360). 9:16: x 90-930 (centre 510, 150 px clear on the right), y 300-650.
const G = WIDE ? { cx: SW / 2, y: 50, w: 860, pad: '28px 40px 30px', big: 108, ital: 46, small: 26 }
               : { cx: 510, y: 300, w: 840, pad: '40px 40px 44px', big: 132, ital: 52, small: 30 };
const card = div({ left: (G.cx - G.w / 2) + 'px', top: G.y + 'px', width: G.w + 'px', boxSizing: 'border-box', padding: G.pad, textAlign: 'center',
  background: tileBg, border: tileBorder, borderRadius: '20px', boxShadow: shadow });
const big = div({ position: 'static', font: `700 ${G.big}px PF`, color: BURG, lineHeight: '1' }, 'Bückware', card);
const ital = div({ position: 'static', font: `italic 400 ${G.ital}px PFI`, color: C.ink, lineHeight: '1.2', marginTop: '14px' }, '= ‘bend-down goods’', card);
const small = div({ position: 'static', font: `400 ${G.small}px Inter`, color: 'rgba(40, 29, 22, 0.7)', lineHeight: '1.35', marginTop: '16px' },
  'kept under the counter, for people in the know', card);

anims.push(t => {
  const c = eout(seg(t, 0, 0.4)), out = 1 - ease(seg(t, OUT, END));
  card.style.opacity = c * out; card.style.translate = `0 ${-40 * (1 - c)}px`;
  const i = eout(seg(t, 0.6, 1.0)); ital.style.opacity = i; ital.style.translate = `0 ${10 * (1 - i)}px`;
  const s = eout(seg(t, 3.0, 3.4)); small.style.opacity = s; small.style.translate = `0 ${10 * (1 - s)}px`;
});
render(0);
