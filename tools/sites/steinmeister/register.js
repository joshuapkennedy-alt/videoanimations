// Finds the similarity transform (scale, rotation, shift) that maps screenshot 2 onto the video's last frame,
// by maximising the correlation of their gradient images at low resolution, then refining.
const { chromium } = require(process.cwd() + '/src/node_modules/playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  const fs = require('fs'), u = f => 'data:image/' + (f.endsWith('.png') ? 'png' : 'webp') + ';base64,' + fs.readFileSync(f).toString('base64');
  await p.setContent('<html></html>');
  const r = await p.evaluate(async ([a, c]) => {
    const load = s => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = s; });
    const A = await load(a), B = await load(c);
    function grad(img, w, h, tf) {   // grayscale gradient magnitude of img drawn into w x h with transform tf
      const cv = new OffscreenCanvas(w, h), x = cv.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, w, h);
      if (tf) x.setTransform(...tf); x.drawImage(img, 0, 0); const d = x.getImageData(0, 0, w, h).data, g = new Float32Array(w * h), m = new Uint8Array(w * h);
      const L = new Float32Array(w * h); for (let i = 0; i < w * h; i++) L[i] = d[4 * i] * .3 + d[4 * i + 1] * .59 + d[4 * i + 2] * .11;
      for (let y = 1; y < h - 1; y++) for (let X = 1; X < w - 1; X++) { const i = y * w + X; g[i] = Math.hypot(L[i + 1] - L[i - 1], L[i + w] - L[i - w]); }
      // mask: where the warped image actually has pixels (alpha)
      for (let i = 0; i < w * h; i++) m[i] = d[4 * i + 3] > 250 ? 1 : 0;
      return { g, m };
    }
    const VC = {};
    function score(k, s, rot, tx, ty) {   // k = downsample factor
      const w = Math.round(1920 / k), h = Math.round(1080 / k);
      const V = VC[k] || (VC[k] = grad(A, w, h, [1 / k, 0, 0, 1 / k, 0, 0]));
      const c = Math.cos(rot) * s / k, sn = Math.sin(rot) * s / k;
      const cv = new OffscreenCanvas(w, h), x = cv.getContext('2d'); x.setTransform(c, sn, -sn, c, tx / k, ty / k); x.drawImage(B, 0, 0);
      const d = x.getImageData(0, 0, w, h).data, L = new Float32Array(w * h); for (let i = 0; i < w * h; i++) L[i] = d[4 * i] * .3 + d[4 * i + 1] * .59 + d[4 * i + 2] * .11;
      let sab = 0, saa = 0, sbb = 0, sa = 0, sb = 0, n = 0;
      for (let y = 2; y < h - 2; y++) for (let X = 2; X < w - 2; X++) { const i = y * w + X; if (d[4 * i + 3] < 250 || d[4 * (i + 1) + 3] < 250 || d[4 * (i + w) + 3] < 250 || d[4 * (i - 1) + 3] < 250 || d[4 * (i - w) + 3] < 250) continue;
        const gb = Math.hypot(L[i + 1] - L[i - 1], L[i + w] - L[i - w]), ga = V.g[i]; sab += ga * gb; saa += ga * ga; sbb += gb * gb; sa += ga; sb += gb; n++; }
      if (n < 1000) return -1; const cov = sab / n - sa / n * sb / n; return cov / Math.sqrt((saa / n - (sa / n) ** 2) * (sbb / n - (sb / n) ** 2));
    }
    let best = { v: -2 };
    // coarse search around the rough estimate (scale ~1.37, shift ~(-165,-309))
    for (let s = 1.26; s <= 1.40; s += 0.01) for (let rot = -0.02; rot <= 0.021; rot += 0.01) for (let tx = 0; tx <= 170; tx += 8) for (let ty = -370; ty <= -190; ty += 8) {
      const v = score(8, s, rot, tx, ty); if (v > best.v) best = { v, s, rot, tx, ty }; }
    const coarse = { ...best };
    // refine at higher resolution
    for (const [k, ds, dr, dt] of [[4, 0.004, 0.004, 3], [2, 0.0015, 0.0015, 1]]) {
      const c0 = { ...best };
      for (let s = c0.s - 3 * ds; s <= c0.s + 3 * ds + 1e-9; s += ds) for (let rot = c0.rot - 2 * dr; rot <= c0.rot + 2 * dr + 1e-9; rot += dr)
        for (let tx = c0.tx - 3 * dt; tx <= c0.tx + 3 * dt; tx += dt) for (let ty = c0.ty - 3 * dt; ty <= c0.ty + 3 * dt; ty += dt) {
          const v = score(k, s, rot, tx, ty); if (v > best.v || best.k !== k) { if (best.k !== k) best = { v: -2, k }; if (v > best.v) best = { v, s, rot, tx, ty, k }; } }
    }
    return { coarse, best };
  }, [u('sm/last.png'), u('sm/3.webp')]);
  console.log(JSON.stringify(r)); await b.close(); })();
