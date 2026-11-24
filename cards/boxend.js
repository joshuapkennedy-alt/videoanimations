// "Vine to Table · Box #1 · Saale-Unstrut · Out now" end card, 8 s, no fade-out. Centred.
// 9:16: everything stacked (the three items one per line), between 15% and 75% of the height, centred on x 510.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const BURG = '#6B2737', CX = WIDE ? SW / 2 : 510, HW = WIDE ? 1700 : 900;
const Y = WIDE ? { head: 250, title: 296, now: 440, items: 540, link: 650, age: 778 } : { head: 520, title: 570, now: 720, items: 820, link: 1080, age: 1210 };
const head = text(CX, Y.head, HW, 'VINE TO TABLE · BOX #1', Object.assign({}, T.eyebrow, { font: `600 ${WIDE ? 28 : 28}px Inter`, letterSpacing: '8px' }));
const title = text(CX, Y.title, HW, 'Saale-Unstrut', { font: `700 ${WIDE ? 124 : 118}px PF`, color: C.ink, lineHeight: '1.05' });
const now = text(CX, Y.now, HW, 'Out now', { font: `500 ${WIDE ? 40 : 40}px Inter`, color: BURG, letterSpacing: '1px' });
const ITEMS = ['5 bottles', 'a card for each wine', 'regional &amp; hosting guide'];
const dot = `<span style="display:inline-block;width:${WIDE ? 1.5 : 50}px;height:${WIDE ? 26 : 1.5}px;background:${C.gold};margin:${WIDE ? '0 26px' : '14px auto'};vertical-align:middle;${WIDE ? '' : 'display:block'}"></span>`;
const items = text(CX, Y.items, HW, ITEMS.map(s => `<span>${s}</span>`).join(dot), { font: `400 ${WIDE ? 30 : 32}px Inter`, color: C.ink, lineHeight: WIDE ? '1.3' : '1.35' });
const link = text(CX, Y.link, HW, `<span style="position:relative;display:inline-block">kennedywine.com<span class="ul" style="position:absolute;left:0;right:0;bottom:-6px;height:2.5px;background:${C.gold};transform-origin:left;transform:scaleX(0)"></span></span>`,
  { font: `700 ${WIDE ? 62 : 60}px PF`, color: BURG, lineHeight: '1.2' });
const ul = link.querySelector('.ul');
const age = text(CX, Y.age, HW, '18+ only', { font: `400 ${WIDE ? 24 : 27}px Inter`, color: 'rgba(40, 29, 22, 0.6)', letterSpacing: '1px' });
fadeIn(head, 0, 0.5); fadeIn(title, 0, 0.6, 18); fadeIn(now, 0.4, 0.5); fadeIn(items, 1.0, 0.6); fadeIn(link, 4.0, 0.5); fadeIn(age, 4.4, 0.5);
anims.push(t => { ul.style.transform = `scaleX(${ease(seg(t, 4.0, 4.6))})`; });
render(0);
