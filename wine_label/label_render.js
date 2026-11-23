// usage: node wine_label/label_render.js <wine_label_explained_all_steps_16x9.mp4> <out.mp4> <stepPngPrefix>
// 15 s, 30 fps, 2160x3840. Writes <prefix>1.png ... <prefix>6.png: the last frame of each 2.5 s step.
// Top: the bottle/label/callout area of the source, unscaled. Bottom: the rebuilt list.
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const path = require('path');
const [src, out, pngPrefix] = process.argv.slice(2); const FPS = 30, N = 450, STEP = 75;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 940 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(__dirname, '..', 'cards', 'label_list.html'));
  await p.evaluate(() => Promise.all(['700 50px PF', '400 20px Inter', '600 20px Inter'].map(f => document.fonts.load(f))));
  const el = await p.$('#stage');
  const fc = '[0:v]split[a][b];[a]crop=64:64:16:16,scale=2160:3840[bg];[b]crop=1804:1880:200:140[top];' +
    '[bg][top]overlay=178:40[base];[base][1:v]overlay=0:1960,format=rgb24,split[v][s];' +
    `[s]select='eq(mod(n+1\\,${STEP})\\,0)'[st];[v]format=yuv420p[vo]`;
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-i', src, '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-filter_complex', fc,
    '-map', '[vo]', '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-movflags', '+faststart', out,
    '-map', '[st]', '-fps_mode', 'passthrough', '-start_number', '1', `${pngPrefix}%d.png`], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = 0; f < N; f++) { await p.evaluate(t => render(t), f / FPS); ff.stdin.write(await el.screenshot({ type: 'png' })); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('wrote', out);
})();
