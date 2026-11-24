// "Place first": the Weingut Musterhof label again (same invented label, fonts, colours and callout style as winelabel.js),
// now reading Saale-Unstrut -> Freyburger -> Edelacker. 9 s, no fade-out (it cuts to the speaker).
// 16:9: label centre-left, header top-right, three callouts on the right joined to their words by thin gold lines.
// 9:16: header on top, label in the upper half, callouts stacked below (each repeats its word); 15%-75% of the height.
// The estate is invented: no real names, logos, crests or eagles.
const WIDE = !!window.WIDE, SW = WIDE ? 1920 : 1080, SH = WIDE ? 1080 : 1920;
stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
const NS = 'http://www.w3.org/2000/svg', BURG = '#6B2737', GOLD = C.gold;
const T_LABEL = 1.65, T_HEAD = 5.2, CALL_AT = [6.9, 7.5, 8.15];

// ---- label ----
const L = WIDE ? { x: 270, y: 150, w: 600, h: 800 } : { x: 170, y: 470, w: 680, h: 560 };
const label = div({ left: L.x + 'px', top: L.y + 'px', width: L.w + 'px', height: L.h + 'px', boxSizing: 'border-box', background: '#FBF6EC',
  border: `2px solid ${GOLD}`, boxShadow: '0 18px 40px rgba(40, 29, 22, 0.16), 0 3px 8px rgba(40, 29, 22, 0.10)', display: 'flex',
  flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' });
div({ left: '12px', top: '12px', right: '12px', bottom: '12px', border: `1px solid ${GOLD}`, opacity: 0.7 }, '', label);   // inner rule
const st = o => Object.assign({ position: 'static', lineHeight: '1.1' }, o);
const rule = (w, m) => `<div style="display:flex;align-items:center;justify-content:center;gap:10px;margin:${m}">` +
  `<span style="width:${w}px;height:1px;background:${GOLD}"></span><span style="width:7px;height:7px;background:${GOLD};transform:rotate(45deg)"></span>` +
  `<span style="width:${w}px;height:1px;background:${GOLD}"></span></div>`;
const big = WIDE ? 74 : 66;
div(st({ font: '600 19px Inter', letterSpacing: '6px', color: C.ink, textTransform: 'uppercase' }), 'Weingut Musterhof', label);
div(st({}), rule(70, WIDE ? '28px 0 30px' : '18px 0 20px'), label);
const w0 = div(st({ font: `600 ${WIDE ? 21 : 20}px Inter`, letterSpacing: '6px', color: C.sub, textTransform: 'uppercase', display: 'inline-block', marginBottom: WIDE ? '18px' : '12px' }), 'Saale-Unstrut', label);
const w1 = div(st({ font: `700 ${big}px PF`, color: C.ink, display: 'inline-block' }), 'Freyburger', label);
const w2 = div(st({ font: `700 ${big}px PF`, color: C.ink, display: 'inline-block', marginTop: '10px' }), 'Edelacker', label);
div(st({}), rule(110, WIDE ? '32px 0 24px' : '20px 0 16px'), label);
div(st({ font: `italic 400 ${WIDE ? 31 : 29}px PFI`, color: C.ink }), 'Weißburgunder · trocken · 2026', label);
const WORDS = [w0, w1, w2];
const under = WORDS.map((w, i) => { w.style.position = 'relative';
  return div({ left: '0', right: i ? '0' : '6px', bottom: i ? '-6px' : '-5px', height: (i ? 5 : 3) + 'px', borderRadius: '3px', background: BURG, transformOrigin: 'left', transform: 'scaleX(0)' }, '', w); });

// ---- header ----
const hp = WIDE ? { right: '80px', textAlign: 'right' } : { left: '60px', width: '900px', textAlign: 'center' };
const head = div(Object.assign({ top: (WIDE ? 84 : 300) + 'px', font: `600 ${WIDE ? 24 : 26}px Inter`, letterSpacing: '7px', color: GOLD, whiteSpace: 'nowrap' }, hp), 'NEW FROM THE 2026 VINTAGE');
const title = div(Object.assign({ top: (WIDE ? 120 : 338) + 'px', font: `700 ${WIDE ? 84 : 84}px PF`, color: C.ink, lineHeight: '1.05', whiteSpace: 'nowrap' }, hp), 'Place first');

// ---- callouts ----
const CALL = [['Saale-Unstrut', 'the wine region'], ['Freyburger', 'the village'], ['Edelacker', 'the vineyard']];
const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('width', SW); svg.setAttribute('height', SH);
svg.style.position = 'absolute'; svg.style.left = 0; svg.style.top = 0; stage.appendChild(svg);
const callouts = CALL.map(([word, what], i) => {
  const box = WIDE ? div({ left: '1090px', width: '700px', whiteSpace: 'nowrap' })
                   : div({ left: '510px', transform: 'translateX(-50%)', top: (1066 + i * 124) + 'px', textAlign: 'center', whiteSpace: 'nowrap' });
  if (!WIDE) {
    const kw = div({ position: 'relative', display: 'inline-block', font: '700 38px PF', color: BURG, lineHeight: '1.1' }, word, box);
    div({ left: 0, right: 0, bottom: '-5px', height: '3.5px', borderRadius: '2px', background: BURG, opacity: 0.85 }, '', kw);
  }
  div({ position: 'static', font: `700 ${WIDE ? 50 : 34}px PF`, color: C.ink, lineHeight: '1.15', marginTop: WIDE ? 0 : '10px' }, what, box);
  const line = document.createElementNS(NS, 'polyline'), dot = document.createElementNS(NS, 'circle');
  Object.entries({ fill: 'none', stroke: GOLD, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }).forEach(([k, v]) => line.setAttribute(k, v));
  dot.setAttribute('r', 6); dot.setAttribute('fill', GOLD);
  if (WIDE) { svg.appendChild(line); svg.appendChild(dot); }
  return { at: CALL_AT[i], box, line, dot, len: 0 };
});

// 16:9 line geometry, measured once the fonts have loaded, with the label at its resting place
let laid = false;
function layout() {
  if (laid || document.fonts.status !== 'loaded' || !WIDE) return; laid = true;
  const lr = label.getBoundingClientRect(), dy = L.y - lr.top, dx = L.x - lr.left;
  const ys = WORDS.map(w => { const r = w.getBoundingClientRect(); return [r.right + dx + 22, r.top + dy + r.height * 0.55]; });
  const CY = [370, 560, 750];   // callouts spread down the right side, below the header
  callouts.forEach((o, i) => {
    const [wx, wy] = ys[i], cy = CY[i];
    o.box.style.top = (cy - 32) + 'px';
    const pts = [[wx, wy], [990, wy], [1062, cy]];
    o.line.setAttribute('points', pts.map(p => p.join(',')).join(' '));
    o.dot.setAttribute('cx', wx); o.dot.setAttribute('cy', wy);
    o.len = pts.reduce((s, p, k) => k ? s + Math.hypot(p[0] - pts[k - 1][0], p[1] - pts[k - 1][1]) : 0, 0);
    o.line.style.strokeDasharray = o.len;
  });
}

anims.push(t => {
  layout();
  const a = eout(seg(t, T_LABEL, T_LABEL + 0.8)); label.style.opacity = a; label.style.translate = `0 ${40 * (1 - a)}px`;
  [head, title].forEach((e, i) => { const k = eout(seg(t, T_HEAD + i * 0.15, T_HEAD + 0.5 + i * 0.15)); e.style.opacity = k; e.style.translate = `0 ${12 * (1 - k)}px`; });
  callouts.forEach((o, i) => {
    const at = o.at;
    under[i].style.transform = `scaleX(${ease(seg(t, at, at + 0.35))})`;
    const d = ease(seg(t, at + 0.1, at + 0.55));
    o.line.style.strokeDashoffset = o.len * (1 - d); o.line.style.opacity = d > 0 ? 1 : 0;
    o.dot.setAttribute('opacity', eout(seg(t, at + 0.05, at + 0.25)));
    const f = eout(seg(t, at + (WIDE ? 0.35 : 0.15), at + (WIDE ? 0.75 : 0.55))); o.box.style.opacity = f; o.box.style.translate = `0 ${12 * (1 - f)}px`;
  });
});
render(0);
