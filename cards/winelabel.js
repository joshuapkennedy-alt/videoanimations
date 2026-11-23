// "How to read a German wine label": a fictional label (Weingut Musterhof), with "Freyburger" and "Edelacker" explained. 10 s.
// 16:9: label centre-left, callouts on the right joined by thin gold lines.
// 9:16: label in the upper half, callouts stacked below (each repeats its word, underlined, instead of a long line).
// The estate is invented: no real names, logos, crests or eagles.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const NS = 'http://www.w3.org/2000/svg', BURG = '#6B2737', GOLD = C.gold, OUT = 9.6, END = 10.0;
const all = div({ left: 0, top: 0, width: SW + 'px', height: SH + 'px' });   // wrapper for the closing fade

// ---- label ----
const L = WIDE ? { x: 300, y: 120, w: 600, h: 840 } : { x: 150, y: 300, w: 720, h: 640 };
const label = div({ left: L.x + 'px', top: L.y + 'px', width: L.w + 'px', height: L.h + 'px', boxSizing: 'border-box', background: '#FBF6EC',
  border: `2px solid ${GOLD}`, boxShadow: '0 18px 40px rgba(40, 29, 22, 0.16), 0 3px 8px rgba(40, 29, 22, 0.10)', display: 'flex',
  flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }, '', all);
div({ left: '12px', top: '12px', right: '12px', bottom: '12px', border: `1px solid ${GOLD}`, opacity: 0.7 }, '', label);   // inner rule
const st = (o) => Object.assign({ position: 'static', lineHeight: '1.1' }, o);
const rule = (w, m) => `<div style="display:flex;align-items:center;justify-content:center;gap:10px;margin:${m}">` +
  `<span style="width:${w}px;height:1px;background:${GOLD}"></span><span style="width:7px;height:7px;background:${GOLD};transform:rotate(45deg)"></span>` +
  `<span style="width:${w}px;height:1px;background:${GOLD}"></span></div>`;
const big = WIDE ? 74 : 72;
div(st({ font: `600 ${WIDE ? 20 : 20}px Inter`, letterSpacing: '6px', color: C.ink, textTransform: 'uppercase' }), 'Weingut Musterhof', label);
div(st({}), rule(70, WIDE ? '30px 0 34px' : '24px 0 26px'), label);
const w1 = div(st({ font: `700 ${big}px PF`, color: C.ink, display: 'inline-block' }), 'Freyburger', label);
const w2 = div(st({ font: `700 ${big}px PF`, color: C.ink, display: 'inline-block', marginTop: '10px' }), 'Edelacker', label);
div(st({}), rule(110, WIDE ? '34px 0 26px' : '26px 0 20px'), label);
div(st({ font: `italic 400 ${WIDE ? 31 : 30}px PFI`, color: C.ink }), 'Weißburgunder · trocken · 2024', label);
div(st({ font: '500 18px Inter', letterSpacing: '5px', color: C.sub, textTransform: 'uppercase', marginTop: WIDE ? '64px' : '40px' }), 'Saale-Unstrut', label);

// burgundy underlines, attached to the words
const under = [w1, w2].map(w => { w.style.position = 'relative';
  return div({ left: '0', right: '0', bottom: '-6px', height: '5px', borderRadius: '3px', background: BURG, transformOrigin: 'left', transform: 'scaleX(0)' }, '', w); });

// ---- callouts ----
const CALL = [
  { word: 'Freyburger', head: 'the town:', body: 'from Freyburg', at: 1.8 },
  { word: 'Edelacker', head: 'the vineyard:', body: 'its official name', at: 4.5 },
];
const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('width', SW); svg.setAttribute('height', SH);
svg.style.position = 'absolute'; svg.style.left = 0; svg.style.top = 0; all.appendChild(svg);
const callouts = CALL.map((c, i) => {
  const box = WIDE
    ? div({ left: '1090px', width: '640px' }, '', all)
    : div({ left: '510px', transform: 'translateX(-50%)', top: (1010 + i * 210) + 'px', textAlign: 'center', whiteSpace: 'nowrap' }, '', all);
  if (!WIDE) {
    const kw = div({ position: 'relative', display: 'inline-block', font: '700 50px PF', color: BURG, lineHeight: '1.1' }, c.word, box);
    div({ left: 0, right: 0, bottom: '-6px', height: '4px', borderRadius: '2px', background: BURG, opacity: 0.85 }, '', kw);
  }
  const head = div({ position: 'static', font: `700 ${WIDE ? 46 : 44}px PF`, color: C.ink, lineHeight: '1.15', marginTop: WIDE ? 0 : '18px' }, c.head, box);
  div({ position: 'static', font: `400 ${WIDE ? 32 : 34}px Inter`, color: C.sub, lineHeight: '1.3', marginTop: '6px' }, c.body, box);
  const line = document.createElementNS(NS, 'polyline'), dot = document.createElementNS(NS, 'circle');
  Object.entries({ fill: 'none', stroke: GOLD, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }).forEach(([k, v]) => line.setAttribute(k, v));
  dot.setAttribute('r', 6); dot.setAttribute('fill', GOLD);
  if (WIDE) { svg.appendChild(line); svg.appendChild(dot); }
  return { c, box, line, dot, len: 0 };
});

// geometry for the 16:9 lines, measured once the fonts have loaded (label at its resting place)
let laid = false;
function layout() {
  if (laid || document.fonts.status !== 'loaded') return; laid = true;
  if (!WIDE) return;
  const lr = label.getBoundingClientRect(), dy = L.y - lr.top, dx = L.x - lr.left;   // undo the slide-in offset
  callouts.forEach((o, i) => {
    const r = (i ? w2 : w1).getBoundingClientRect(), wy = r.top + dy + r.height * 0.55, wx = r.right + dx + 22;
    const cy = i ? wy + 120 : wy - 120;                       // spread the callouts above and below the words
    o.box.style.top = (cy - 48) + 'px';
    const pts = [[wx, wy], [990, wy], [1060, cy]];
    o.line.setAttribute('points', pts.map(p => p.join(',')).join(' '));
    o.dot.setAttribute('cx', wx); o.dot.setAttribute('cy', wy);
    o.len = pts.reduce((s, p, k) => k ? s + Math.hypot(p[0] - pts[k - 1][0], p[1] - pts[k - 1][1]) : 0, 0);
    o.line.style.strokeDasharray = o.len;
  });
}

anims.push(t => {
  layout();
  const a = eout(seg(t, 0, 0.8)); label.style.opacity = a; label.style.translate = `0 ${40 * (1 - a)}px`;
  callouts.forEach((o, i) => {
    const at = o.c.at;
    under[i].style.transform = `scaleX(${ease(seg(t, at, at + 0.45))})`;
    const d = ease(seg(t, at + 0.2, at + 0.8));
    o.line.style.strokeDashoffset = o.len * (1 - d); o.line.style.opacity = d > 0 ? 1 : 0;
    o.dot.setAttribute('opacity', eout(seg(t, at + 0.15, at + 0.35)));
    const f = eout(seg(t, at + (WIDE ? 0.6 : 0.3), at + (WIDE ? 1.1 : 0.8))); o.box.style.opacity = f; o.box.style.translate = `0 ${14 * (1 - f)}px`;
  });
  all.style.opacity = 1 - ease(seg(t, OUT, END));
});
render(0);
