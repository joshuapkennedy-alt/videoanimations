// Werderaner Wachtelberg: the vineyard traced by hand on the clip's settled last frame (1.5x zoom from 380,180),
// in video pixels. Two outlines: the two western blocks (either side of the diagonal path) and the eastern block across
// the farm road; the farmyard and barn between them are left out. No VDP.Große Lage here.
const fs = require('fs');
const Z = {
  west: [[35, 215], [520, 48], [565, 62], [700, 210], [725, 295], [820, 395], [930, 392], [1215, 712], [980, 812], [740, 892], [300, 515]],
  east: [[765, 160], [1150, 45], [1335, 25], [1500, 212], [1460, 265], [1420, 300], [1440, 420], [1480, 560], [1200, 600], [960, 400], [895, 300], [880, 280], [800, 250]],
};
const d = P => 'M' + P.map(([x, y]) => [380 + x / 1.5, 180 + y / 1.5].map(v => v.toFixed(1)).join(',')).join('L') + 'Z';
fs.writeFileSync('src/cards/wachtelberg_geo.js', '// Werderaner Wachtelberg, traced by hand on the settled frame of the Werder clip (video pixels, 1920x1080)\r\nwindow.SITE_GEO = ' +
  JSON.stringify({ lage: Object.values(Z).map(d), gl: [] }) + ';\r\n');
fs.writeFileSync('wv/check.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1560" height="930">${Object.values(Z).map(P => `<polygon points="${P.map(p => p.join(',')).join(' ')}" fill="none" stroke="#00ffff" stroke-width="3"/>`).join('')}</svg>`);
