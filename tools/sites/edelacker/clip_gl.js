// Trims each Große Lage parcel to the Einzellage outline (raster intersection, then traced back to a polygon).
const { chromium } = require(process.cwd() + '/src/node_modules/playwright'); const fs = require('fs');
const src = fs.readFileSync('src/cards/edelacker_geo.js', 'utf8'); const EDEL = JSON.parse(src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1));
(async () => { const b = await chromium.launch(); const p = await b.newPage(); await p.setContent('<html></html>');
  const gl = await p.evaluate(E => {
    const W = 1920, H = 1080, S = 4;   // trace at 4x for smooth edges
    return E.gl.map(d => {
      const cv = new OffscreenCanvas(W, H), x = cv.getContext('2d');
      x.fillStyle = '#000'; x.fill(new Path2D(d)); x.globalCompositeOperation = 'destination-in'; x.fill(new Path2D(E.lage.join('')));
      const big = new OffscreenCanvas(W, H), y = big.getContext('2d'); y.fillStyle = '#000';
      // render the intersection at 4x around its box
      const im = x.getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = 0, y1 = 0;
      for (let i = 0; i < W * H; i++) if (im[4 * i + 3] > 127) { const X = i % W, Y = (i / W) | 0; x0 = Math.min(x0, X); x1 = Math.max(x1, X); y0 = Math.min(y0, Y); y1 = Math.max(y1, Y); }
      x0 -= 2; y0 -= 2; const w = (x1 - x0 + 4) * S, h = (y1 - y0 + 4) * S;
      const c2 = new OffscreenCanvas(w, h), z = c2.getContext('2d'); z.setTransform(S, 0, 0, S, -x0 * S, -y0 * S);
      z.fillStyle = '#000'; z.fill(new Path2D(d)); z.globalCompositeOperation = 'destination-in'; z.fill(new Path2D(E.lage.join('')));
      const dd = z.getImageData(0, 0, w, h).data, m = new Uint8Array(w * h); for (let i = 0; i < w * h; i++) m[i] = dd[4 * i + 3] > 127 ? 1 : 0;
      // biggest component, Moore trace
      const comp = new Int32Array(w * h).fill(-1), st = new Int32Array(w * h); let best = -1, bestN = 0, bestStart = 0, id = 0;
      for (let i0 = 0; i0 < w * h; i0++) { if (!m[i0] || comp[i0] >= 0) continue; let sp = 0, n = 0; st[sp++] = i0; comp[i0] = id;
        while (sp) { const i = st[--sp]; n++; for (const j of [i - 1, i + 1, i - w, i + w]) if (j >= 0 && j < w * h && m[j] && comp[j] < 0) { comp[j] = id; st[sp++] = j; } }
        if (n > bestN) { bestN = n; best = id; bestStart = i0; } id++; }
      const dirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]], isIn = (X, Y) => X >= 0 && Y >= 0 && X < w && Y < h && comp[Y * w + X] === best;
      let X = bestStart % w, Y = (bestStart / w) | 0; const sx = X, sy = Y; let q = 6; const pts = [[X, Y]], G = 1e6; let g = 0;
      do { let f = false; for (let k = 0; k < 8; k++) { const r = (q + 6 + k) % 8, nx = X + dirs[r][0], ny = Y + dirs[r][1]; if (isIn(nx, ny)) { X = nx; Y = ny; q = r; f = true; break; } }
        if (!f) break; pts.push([X, Y]); } while ((X !== sx || Y !== sy) && ++g < G);
      const rdp = (P, e) => { if (P.length < 3) return P; let dm = 0, im2 = 0; const [ax, ay] = P[0], [bx, by] = P[P.length - 1], L = Math.hypot(bx - ax, by - ay) || 1;
        for (let i = 1; i < P.length - 1; i++) { const v = Math.abs((bx - ax) * (ay - P[i][1]) - (ax - P[i][0]) * (by - ay)) / L; if (v > dm) { dm = v; im2 = i; } }
        return dm > e ? [...rdp(P.slice(0, im2 + 1), e).slice(0, -1), ...rdp(P.slice(im2), e)] : [P[0], P[P.length - 1]]; };
      const hh = pts.length >> 1, P = [...rdp(pts.slice(0, hh + 1), 2).slice(0, -1), ...rdp(pts.slice(hh), 2)];
      return 'M' + P.map(([a, c]) => [(a + .5) / S + x0, (c + .5) / S + y0].map(v => v.toFixed(1)).join(',')).join('L') + 'Z';
    });
  }, EDEL);
  EDEL.gl = gl; fs.writeFileSync('src/cards/edelacker_geo.js', src.slice(0, src.indexOf('window.EDEL')) + 'window.EDEL = ' + JSON.stringify(EDEL) + ';\r\n');
  console.log(gl.map(d => d.length + ' chars').join(', ')); await b.close(); })();
