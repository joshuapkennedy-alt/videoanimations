// Extracts the Edelacker Einzellage parcels from screenshot 2 (black outlines + purple tint) in video-frame pixels.
// 1) warp the screenshot onto the frame; 2) outline pixels = clearly darker than the frame; 3) regions enclosed by
// outline pixels whose fill is tinted purple = parcels; 4) trace each parcel's boundary and simplify it.
// Writes sm/parcels.json ([[x,y],...] per parcel) and sm/mask.png (debug).
const { chromium } = require(process.cwd() + '/src/node_modules/playwright'); const fs = require('fs');
const u = f => 'data:image/' + (f.endsWith('.png') ? 'png' : 'webp') + ';base64,' + fs.readFileSync(f).toString('base64');
const SETS = (process.argv[2] || '14,3,2;20,0.5,2').split(';').map(p => p.split(',').map(Number)), MINA = 60;
(async () => { const b = await chromium.launch(); const p = await b.newPage(); await p.setContent('<html></html>');
  const out = await p.evaluate(async ([a, c, T, SETS, MINA]) => {
    const load = s => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = s; });
    const A = await load(a), B = await load(c), W = 1920, H = 1080, N = W * H;
    const get = (img, tf) => { const cv = new OffscreenCanvas(W, H), x = cv.getContext('2d'); if (tf) x.setTransform(...tf); x.drawImage(img, 0, 0); return x.getImageData(0, 0, W, H).data; };
    const v = get(A), s = get(B, [T.s, 0, 0, T.s, T.tx, T.ty]);
    const blur = d => { const o = new Float32Array(N * 3); for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) for (let ch = 0; ch < 3; ch++) {
      let t = 0; for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) t += d[4 * ((y + j) * W + x + i) + ch]; o[3 * (y * W + x) + ch] = t / 9; } return o; };
    const V = blur(v), S = blur(s), valid = new Uint8Array(N);
    for (let i = 0; i < N; i++) valid[i] = s[4 * i + 3] > 250 ? 1 : 0;
    const dark = new Float32Array(N), tint = new Float32Array(N);
    for (let i = 0; i < N; i++) { const r = S[3 * i] - V[3 * i], g = S[3 * i + 1] - V[3 * i + 1], bb = S[3 * i + 2] - V[3 * i + 2];
      dark[i] = -(r + g + bb) / 3; tint[i] = ((bb - g) + (r - g)) / 2; }
    const dil = m => { const o = new Uint8Array(N); for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x;
      o[i] = m[i] || m[i - 1] || m[i + 1] || m[i - W] || m[i + W] ? 1 : 0; } return o; };
    const st = new Int32Array(N);
    function build(DARK, TINT, DIL) {
    // outline pixels, closed up a little so the loops have no gaps
    let line = new Uint8Array(N); for (let i = 0; i < N; i++) line[i] = valid[i] && dark[i] > DARK ? 1 : 0;
    for (let k = 0; k < DIL; k++) line = dil(line);
    // label the non-line regions
    const lab = new Int32Array(N).fill(-1), regions = [];
    for (let i0 = 0; i0 < N; i0++) { if (line[i0] || lab[i0] >= 0 || !valid[i0]) continue;
      const id = regions.length; let sp = 0, n = 0, ts = 0, edge = false; st[sp++] = i0; lab[i0] = id;
      while (sp) { const i = st[--sp]; n++; ts += tint[i]; const x = i % W, y = (i / W) | 0; if (x < 2 || y < 2 || x > W - 3 || y > H - 3) edge = true;
        for (const j of [i - 1, i + 1, i - W, i + W]) { if (j < 0 || j >= N || line[j] || lab[j] >= 0) continue; if (!valid[j]) { edge = true; continue; } lab[j] = id; st[sp++] = j; } }
      regions.push({ n, t: ts / n, edge }); }
    const keep = regions.map(r => !r.edge && r.n >= MINA && r.n < 200000 && r.t > TINT);
    // parcel mask = kept regions + the line pixels around them
    let mask = new Uint8Array(N); for (let i = 0; i < N; i++) if (lab[i] >= 0 && keep[lab[i]]) mask[i] = 1;
    for (let k = 0; k < 2; k++) { const o = dil(mask); for (let i = 0; i < N; i++) if (o[i] && line[i]) mask[i] = 1; }
    return mask; }
    // union of several threshold settings: each catches parcels the others miss
    let mask = new Uint8Array(N); for (const [d, t, k] of SETS) { const m = build(d, t, k); for (let i = 0; i < N; i++) if (m[i]) mask[i] = 1; }
    // close small gaps and fill holes left by inner dividing lines (holes = enclosed background, < 4000 px)
    const ero = m => { const o = new Uint8Array(N); for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x;
      o[i] = m[i] && m[i - 1] && m[i + 1] && m[i - W] && m[i + W] ? 1 : 0; } return o; };
    for (let k = 0; k < 3; k++) mask = dil(mask); for (let k = 0; k < 3; k++) mask = ero(mask);
    { const bl = new Int32Array(N).fill(-1); for (let i0 = 0; i0 < N; i0++) { if (mask[i0] || bl[i0] >= 0) continue; let sp = 0; const mem = []; let edge = false; st[sp++] = i0; bl[i0] = 1;
        while (sp) { const i = st[--sp]; mem.push(i); const x = i % W, y = (i / W) | 0; if (x < 1 || y < 1 || x > W - 2 || y > H - 2) edge = true;
          for (const j of [i - 1, i + 1, i - W, i + W]) if (j >= 0 && j < N && !mask[j] && bl[j] < 0) { bl[j] = 1; st[sp++] = j; } }
        if (!edge && mem.length < 4000) mem.forEach(i => mask[i] = 1); } }
    // merge parcels that touch, label components, trace outer boundaries (square tracing on the pixel grid)
    const comp = new Int32Array(N).fill(-1); const polys = [];
    for (let i0 = 0; i0 < N; i0++) { if (!mask[i0] || comp[i0] >= 0) continue; const id = polys.length; let sp = 0, n = 0; st[sp++] = i0; comp[i0] = id;
      while (sp) { const i = st[--sp]; n++; for (const j of [i - 1, i + 1, i - W, i + W]) if (j >= 0 && j < N && mask[j] && comp[j] < 0) { comp[j] = id; st[sp++] = j; } }
      // boundary trace (Moore neighbourhood) starting from the topmost-leftmost pixel i0
      const dirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
      const isIn = (x, y) => x >= 0 && y >= 0 && x < W && y < H && comp[y * W + x] === id;
      let x = i0 % W, y = (i0 / W) | 0; const sx = x, sy = y; let d = 6; const pts = [[x, y]]; let guard = 0;
      do { let found = false; for (let k = 0; k < 8; k++) { const dd = (d + 6 + k) % 8, nx = x + dirs[dd][0], ny = y + dirs[dd][1];
          if (isIn(nx, ny)) { x = nx; y = ny; d = dd; found = true; break; } }
        if (!found) break; pts.push([x, y]); } while ((x !== sx || y !== sy) && ++guard < 200000);
      polys.push({ n, pts }); }
    // Douglas-Peucker
    const rdp = (P, e) => { if (P.length < 3) return P; let dm = 0, im = 0; const [ax, ay] = P[0], [bx, by] = P[P.length - 1], L = Math.hypot(bx - ax, by - ay) || 1;
      for (let i = 1; i < P.length - 1; i++) { const dd = Math.abs((bx - ax) * (ay - P[i][1]) - (ax - P[i][0]) * (by - ay)) / L; if (dd > dm) { dm = dd; im = i; } }
      return dm > e ? [...rdp(P.slice(0, im + 1), e).slice(0, -1), ...rdp(P.slice(im), e)] : [P[0], P[P.length - 1]]; };
    const res = polys.filter(q => q.n >= MINA).map(q => { const h = q.pts.length >> 1; return [...rdp(q.pts.slice(0, h + 1), 0.9).slice(0, -1), ...rdp(q.pts.slice(h), 0.9)]; });
    // debug image: frame with mask in magenta
    const cv = new OffscreenCanvas(W, H), x = cv.getContext('2d'), id = x.createImageData(W, H);
    for (let i = 0; i < N; i++) { const m = mask[i]; id.data[4 * i] = m ? 255 : v[4 * i] * .6; id.data[4 * i + 1] = m ? 0 : v[4 * i + 1] * .6; id.data[4 * i + 2] = m ? 255 : v[4 * i + 2] * .6; id.data[4 * i + 3] = 255; }
    x.putImageData(id, 0, 0);
    const png = await cv.convertToBlob({ type: 'image/png' }).then(bl => new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(bl); }));
    return { polys: res, sizes: polys.map(q => q.n), png };
  }, [u("sm/last.png"), u("sm/3.webp"), { s: 1.3185, tx: 91, ty: -271 }, SETS, MINA]);
  fs.writeFileSync('sm/mask.png', Buffer.from(out.png.split(',')[1], 'base64'));
  fs.writeFileSync('sm/parcels.json', JSON.stringify(out.polys));
  console.log('parcels', out.polys.length, 'pixel sizes', out.sizes.join(' '), 'points', out.polys.map(q => q.length).join(' '));
  await b.close(); })();
