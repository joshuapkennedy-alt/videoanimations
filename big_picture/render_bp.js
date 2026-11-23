// Renders the seven "The big picture" chapter cards (4 s each, 30 fps, 2160x3840).
//   node big_picture/render_bp.js <outdir>
// Card k highlights chapter k; the page's render(t, active) draws one frame.
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const path = require('path'); const fs = require('fs');
const OUT = process.argv[2], FPS = 30, DUR = 4;
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(__dirname, 'bp.html'));
  await p.evaluate(() => Promise.all(['600 100px PF', '700 100px PF', '800 100px PF', '600 20px Inter'].map(f => document.fonts.load(f))).then(() => document.fonts.ready));
  for (let a = 0; a < 7; a++) {
    const file = `${OUT}/bigpicture_${a + 1}_9x16.mp4`;
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', file]);
    for (let f = 0; f < FPS * DUR; f++) { await p.evaluate(([t, a]) => render(t, a), [f / FPS, a]); ff.stdin.write(await p.screenshot({ type: 'png' })); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); console.log('wrote', file);
  }
  await b.close();
})();
