// Small Steinmeister plots between the big block and the upper cluster, traced by hand on a 5x zoom of the outline
// screenshot (crop origin 330,470), converted to video pixels (x 1.3185 + 91, y 1.3185 - 271). Appended to sm/parcels.json.
const fs = require('fs');
const Z = {
  a: [[190, 225], [240, 208], [245, 222], [197, 240]],
  c: [[800, 125], [830, 98], [865, 140], [835, 163]],
  d: [[618, 430], [640, 420], [658, 438], [640, 450]],
  e: [[492, 465], [515, 455], [553, 475], [540, 497], [500, 488]],
  f: [[190, 512], [215, 505], [240, 525], [232, 555], [190, 555]],
  g: [[198, 592], [225, 588], [262, 595], [262, 638], [240, 625], [205, 610]],
  h: [[128, 618], [165, 625], [185, 645], [178, 665], [150, 655], [128, 640]],
  i: [[470, 618], [490, 620], [505, 635], [480, 640]],
  j: [[320, 718], [345, 712], [355, 730], [330, 742]],
  k: [[310, 790], [330, 775], [345, 760], [372, 778], [340, 810], [315, 832]],
  l: [[120, 700], [165, 703], [190, 715], [175, 760], [128, 755]],
  n: [[150, 880], [205, 860], [232, 880], [215, 925], [165, 950], [150, 925]],
};
const toV = ([zx, zy]) => [(330 + zx / 5) * 1.3185 + 91, (470 + zy / 5) * 1.3185 - 271];
const P = JSON.parse(fs.readFileSync('sm/parcels_auto.json'));
const add = Object.values(Z).map(q => q.map(toV));
fs.writeFileSync('sm/parcels.json', JSON.stringify([...P, ...add]));
fs.writeFileSync('sm/small_zoom.json', JSON.stringify(Object.values(Z)));
console.log('auto', P.length, '+ hand', add.length);
