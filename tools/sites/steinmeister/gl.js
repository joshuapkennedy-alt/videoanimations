// Große Lage parcels from screenshot 1 (red on the vineyard map), traced and moved into video-frame pixels with the
// similarity fitted from reference points (scale 1.414, rotation ~2.1 deg). Writes sm/gl.json and sm/gl_check.png
// (the map laid over the frame at 45%, with the traced outlines in cyan).
const { chromium } = require(process.cwd() + '/src/node_modules/playwright'); const fs = require('fs');
const u = f => 'data:image/' + (f.endsWith('.png') ? 'png' : 'webp') + ';base64,' + fs.readFileSync(f).toString('base64');
const T = { a: 0.7384, b: 0, tx: 194.7, ty: 125.3 };
(async () => { const b = await chromium.launch(); const p = await b.newPage(); await p.setContent('<html></html>');
  const out = await p.evaluate(async ([s1, v, T]) => {
    const load = s => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = s; });
    const A = await load(s1), V = await load(v), W = A.width, H = A.height, N = W * H;
    const cv = new OffscreenCanvas(W, H), x = cv.getContext('2d'); x.drawImage(A, 0, 0); const d = x.getImageData(0, 0, W, H).data;
    let m = new Uint8Array(N); for (let i = 0; i < N; i++) { const r = d[4 * i], g = d[4 * i + 1], bb = d[4 * i + 2]; m[i] = r > 140 && g < 90 && bb < 100 && r - g > 80 ? 1 : 0; }
    const dil = (m, on) => { const o = new Uint8Array(N); for (let y = 1; y < H - 1; y++) for (let X = 1; X < W - 1; X++) { const i = y * W + X;
      const n = [m[i], m[i - 1], m[i + 1], m[i - W], m[i + W]]; o[i] = on ? (n.some(Boolean) ? 1 : 0) : (n.every(Boolean) ? 1 : 0); } return o; };
    for (let k = 0; k < 8; k++) m = dil(m, true); for (let k = 0; k < 8; k++) m = dil(m, false);   // close up the gaps left by the labels
    // components + boundary trace
    const comp = new Int32Array(N).fill(-1), st = new Int32Array(N), polys = [];
    const dirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
    for (let i0 = 0; i0 < N; i0++) { if (!m[i0] || comp[i0] >= 0) continue; const id = polys.length; let sp = 0, n = 0; st[sp++] = i0; comp[i0] = id;
      while (sp) { const i = st[--sp]; n++; for (const j of [i - 1, i + 1, i - W, i + W]) if (j >= 0 && j < N && m[j] && comp[j] < 0) { comp[j] = id; st[sp++] = j; } }
      const isIn = (X, Y) => X >= 0 && Y >= 0 && X < W && Y < H && comp[Y * W + X] === id;
      let X = i0 % W, Y = (i0 / W) | 0; const sx = X, sy = Y; let dd = 6; const pts = [[X, Y]]; let guard = 0;
      do { let f = false; for (let k = 0; k < 8; k++) { const q = (dd + 6 + k) % 8, nx = X + dirs[q][0], ny = Y + dirs[q][1]; if (isIn(nx, ny)) { X = nx; Y = ny; dd = q; f = true; break; } }
        if (!f) break; pts.push([X, Y]); } while ((X !== sx || Y !== sy) && ++guard < 100000);
      polys.push({ n, pts }); }
    const rdp = (P, e) => { if (P.length < 3) return P; let dm = 0, im = 0; const [ax, ay] = P[0], [bx, by] = P[P.length - 1], L = Math.hypot(bx - ax, by - ay) || 1;
      for (let i = 1; i < P.length - 1; i++) { const q = Math.abs((bx - ax) * (ay - P[i][1]) - (ax - P[i][0]) * (by - ay)) / L; if (q > dm) { dm = q; im = i; } }
      return dm > e ? [...rdp(P.slice(0, im + 1), e).slice(0, -1), ...rdp(P.slice(im), e)] : [P[0], P[P.length - 1]]; };
    const tf = ([X, Y]) => [T.a * (X + .5) - T.b * (Y + .5) + T.tx, T.b * (X + .5) + T.a * (Y + .5) + T.ty];
    const res = polys.filter(q => q.n > 80).map(q => { const h = q.pts.length >> 1; return [...rdp(q.pts.slice(0, h + 1), 0.7).slice(0, -1), ...rdp(q.pts.slice(h), 0.7)].map(tf); });
    // check image
    const c2 = new OffscreenCanvas(1920, 1080), y = c2.getContext('2d'); y.drawImage(V, 0, 0); y.globalAlpha = 0.45;
    y.setTransform(T.a, T.b, -T.b, T.a, T.tx, T.ty); y.drawImage(A, 0, 0); y.setTransform(1, 0, 0, 1, 0, 0); y.globalAlpha = 1;
    y.strokeStyle = '#00ffff'; y.lineWidth = 2; res.forEach(P => { y.beginPath(); P.forEach(([X, Y], k) => k ? y.lineTo(X, Y) : y.moveTo(X, Y)); y.closePath(); y.stroke(); });
    const png = await c2.convertToBlob({ type: 'image/png' }).then(bl => new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(bl); }));
    return { res, sizes: polys.map(q => q.n), png };
  }, [u('sm/4.webp'), u('sm/last.png'), T]);
  fs.writeFileSync('sm/gl.json', JSON.stringify(out.res)); fs.writeFileSync('sm/gl_check.png', Buffer.from(out.png.split(',')[1], 'base64'));
  console.log('red parts', out.sizes.join(' '), '-> kept', out.res.length, out.res.map(P => P.length + ' pts, first ' + P[0].map(v => v.toFixed(0))).join(' | '));
  await b.close(); })();
