// Scrolling list of Saale-Unstrut vineyard sites (Bereich Schloss Neuenburg), about five at a time, 3.3 s.
// Each row: the village (small caps) over the site name (Playfair). The list moves up steadily; soft fades top and bottom.
// 16:9: centred. 9:16: centred on x 540, the list window between ~21% and 73% of the height.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const SITES = [
  ['Burgscheidungen', 'Veitsgrube'], ['Dorndorf (Unstrut)', 'Rappental'], ['Freyburg', 'Edelacker'], ['Freyburg', 'Herrenberg'], ['Freyburg', 'Mühlberg'],
  ['Gröst', 'Steinberg'], ['Karsdorf', 'Hohe Gräte'], ['Steigra', 'Hahnenberge'], ['Vitzenburg', 'Schlossberg'], ['Weischütz', 'Nüssenberg'],
  ['Bad Kösen', 'Saalhäuser'], ['Bad Kösen', 'Schöne Aussicht'], ['Bad Kösen', 'Pfortenser Köppelberg'], ['Klosterhäseler', 'Hasseltal'],
];
const W = WIDE ? { top: 250, h: 700, row: 128, name: 58, vill: 21 } : { top: 400, h: 1000, row: 150, name: 62, vill: 23 };
const VISIBLE = W.h / W.row, SCROLL = (SITES.length - VISIBLE) * W.row;   // ends with the last site in view
const END = 3.3;

// header
fadeIn(text(SW / 2, WIDE ? 110 : 290, SW - 80, 'SAALE-UNSTRUT VINEYARDS', Object.assign({}, T.eyebrow, { font: `600 ${WIDE ? 26 : 28}px Inter`, letterSpacing: '7px' })), 0, 0.3, 8);
const rule = div({ left: (SW / 2 - 60) + 'px', top: (WIDE ? 158 : 340) + 'px', width: '120px', height: '3px', background: '#C3A06A', transformOrigin: 'center' });

// list window with soft top/bottom fades
const win = div({ left: 0, top: W.top + 'px', width: SW + 'px', height: W.h + 'px', overflow: 'hidden',
  maskImage: 'linear-gradient(to bottom, transparent 0, #000 22%, #000 78%, transparent 100%)' });
win.style.webkitMaskImage = win.style.maskImage;
const list = div({ left: 0, top: 0, width: SW + 'px' }, '', win);
SITES.forEach(([village, site], i) => div({ left: 0, top: (i * W.row) + 'px', width: SW + 'px', height: W.row + 'px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  `<div style="font:600 ${W.vill}px Inter;letter-spacing:5px;color:${C.gold};text-transform:uppercase">${village}</div>` +
  `<div style="font:700 ${W.name}px PF;color:${C.ink};line-height:1.1;margin-top:4px">${site}</div>`, list));

anims.push(t => {
  rule.style.transform = `scaleX(${ease(seg(t, 0.1, 0.5))})`;
  win.style.opacity = eout(seg(t, 0, 0.35));
  // steady scroll with a gentle start and finish
  const p = seg(t, 0, END), k = p < 0.12 ? (p * p) / (2 * 0.12 * 0.88) : p > 0.88 ? 1 - ((1 - p) * (1 - p)) / (2 * 0.12 * 0.88) : (p - 0.06) / 0.88;
  list.style.transform = `translateY(${-SCROLL * k}px)`;
});
render(0);
