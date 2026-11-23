// Renders the river-warmth night-to-day scene (10 s, 30 fps, 2160x3840).
//   node big_picture/render_river_warmth.js <page.html> <out.mp4>
// Pages: river_warmth.html (3 terraces, final), river_warmth_5terraces.html, river_warmth_6terraces.html
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const path = require('path');
const [page_, out] = process.argv.slice(2), FPS = 30, DUR = 10;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });
  p.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await p.goto('file://' + path.resolve(page_));
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
  for (let f = 0; f < FPS * DUR; f++) { await p.evaluate(t => render(t), f / FPS); ff.stdin.write(await p.screenshot({ type: 'png' })); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('wrote', out);
})();
