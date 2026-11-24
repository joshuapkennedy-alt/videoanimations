// Newsletter end card, 6.3 s, no fade-out (the cut ends it). Reads window.EC = { link, bio } and window.WIDE.
// 16:9 centred; 9:16 centred on x 510 (120+ px clear on the right), everything between 15% and 75% of the height.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const { link, bio } = window.EC, BURG = '#6B2737';
const CX = WIDE ? SW / 2 : 510, W = WIDE ? 1600 : 900;
// vertical layout: the block is centred on the frame (16:9) / on 45% of the height (9:16)
const Y = WIDE ? { head: 300, title: 350, sub: 500, link: 610, bio: 0, age: 790 }
               : { head: 560, title: 616, sub: 896, link: 1020, bio: 1110, age: bio ? 1250 : 1170 };
const els = {
  head: text(CX, Y.head, W, 'VINE TO TABLE', Object.assign({}, T.eyebrow, { font: `600 ${WIDE ? 28 : 30}px Inter`, letterSpacing: '8px' })),
  title: text(CX, Y.title, W, WIDE ? 'Join the newsletter' : 'Join the<br>newsletter', { font: `700 ${WIDE ? 112 : 112}px PF`, color: C.ink, lineHeight: '1.05' }),
  sub: text(CX, Y.sub, W, WIDE ? 'Be the first to hear when a new box drops' : 'Be the first to hear<br>when a new box drops', { font: `400 ${WIDE ? 36 : 38}px Inter`, color: 'rgba(40, 29, 22, 0.8)', lineHeight: '1.35' }),
  age: text(CX, Y.age, W, '18+ only', { font: `400 ${WIDE ? 24 : 27}px Inter`, color: 'rgba(40, 29, 22, 0.6)', letterSpacing: '1px' }),
};
// link with a thin gold underline that draws in from the left
const lk = text(CX, Y.link, W, `<span style="position:relative;display:inline-block">${link}<span class="ul" style="position:absolute;left:0;right:0;bottom:-6px;height:2.5px;background:${C.gold};transform-origin:left;transform:scaleX(0)"></span></span>`,
  { font: `700 ${WIDE ? 58 : 54}px PF`, color: BURG, lineHeight: '1.2' });
const ul = lk.querySelector('.ul');
const bioEl = bio ? text(CX, Y.bio, W, bio, { font: `500 ${WIDE ? 28 : 32}px Inter`, color: C.ink, letterSpacing: '0.5px' }) : null;

fadeIn(els.head, 0, 0.5); fadeIn(els.title, 0, 0.6, 18); fadeIn(els.sub, 0.5, 0.5); fadeIn(lk, 1.0, 0.5); fadeIn(els.age, 1.4, 0.5);
if (bioEl) fadeIn(bioEl, 1.2, 0.5);
anims.push(t => { ul.style.transform = `scaleX(${ease(seg(t, 1.0, 1.6))})`; });
render(0);
