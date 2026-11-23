// Renders one card page to an MP4 (30 fps, 2x device scale = 4K) and optionally a lossless end-frame PNG.
//   node render.js <page.html> <seconds> <out.mp4> [endframe.png]
//   node render.js <page.html> stills <outdir> <t1,t2,...>      (PNG stills at the given times; DPR=2 for 4K)
// Viewport is 1080x1920 (9:16) by default; set VW=1920 VH=1080 for the 16:9 pages.
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const path = require('path'); const fs = require('fs');
const [page_, dur, out, extra] = process.argv.slice(2); const FPS = 30;
(async () => {
  const b = await chromium.launch(); const stills = dur === 'stills';
  const p = await b.newPage({ viewport: { width: +(process.env.VW || 1080), height: +(process.env.VH || 1920) }, deviceScaleFactor: stills ? +(process.env.DPR || 1) : 2 });
  p.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await p.goto('file://' + path.resolve(page_));
  await p.evaluate(() => Promise.all(['700 50px PF', 'italic 400 50px PFI', '400 20px Inter', '500 20px Inter', '600 20px Inter', '700 20px Inter'].map(f => document.fonts.load(f))).then(() => document.fonts.ready));
  await p.waitForFunction(() => window.ready === undefined || window.ready === true);
  const el = await p.$('#stage');
  if (stills) { fs.mkdirSync(out, { recursive: true }); for (const t of extra.split(',').map(Number)) { await p.evaluate(t => render(t), t); await el.screenshot({ path: `${out}/t${t}.png` }); } await b.close(); return; }
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
  const N = Math.round(FPS * Number(dur));
  for (let f = 0; f < N; f++) { await p.evaluate(t => render(t), f / FPS); ff.stdin.write(await el.screenshot({ type: 'png' })); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  if (extra) { await p.evaluate(t => render(t), 100); await el.screenshot({ path: extra }); }
  await b.close(); console.log('wrote', out, extra || '');
})();
