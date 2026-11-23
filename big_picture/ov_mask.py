# usage: python3 ov_mask.py <last_frame_cropped.png> ov_masks.json
# Finds each leader line in the cropped (x 1140-2700) last frame and writes a thin band per line to erase.
# build leader-line masks in crop coordinates (crop x0=1140 of the 4K frame)
import numpy as np, json, sys
from PIL import Image
im = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(int)
lum = im @ np.array([.299, .587, .114])
X0 = 1140; f = 1.92
segs = {  # display coords of each leader (start, end); start kept clear of dots
  'schlieben': ((1214, 104), (1425, 104)),
  'sachsen':   ((1306, 262), (1425, 268)),
  'wurtt':     ((578, 752), (690, 746)),
  'lindau':    ((578, 1028), (716, 1040)),
}
out = {}
for k, ((ax, ay), (bx, by)) in segs.items():
  cols = []
  xa, xb = int(ax*f) - X0, int(bx*f) - X0
  for x in range(max(xa, 0), min(xb, im.shape[1] - 1) + 1):
    yc = ay*f + (by - ay)*f*((x + X0)/f - ax)/(bx - ax)
    ys = [y for y in range(int(yc) - 16, int(yc) + 17) if lum[y, x] < 95]
    if ys: cols.append((x, float(np.median(ys))))
  # robust straight-line fit, then a thin band along it
  xs = np.array([c[0] for c in cols], float); ys = np.array([c[1] for c in cols])
  keep = np.ones(len(xs), bool)
  for _ in range(5):
    b, a = np.polyfit(xs[keep], ys[keep], 1); keep = np.abs(ys - (a + b*xs)) < 2.5
  cols = [[int(x), int(round(a + b*x)) - 6, int(round(a + b*x)) + 6] for x in range(max(xa, 0), min(xb, im.shape[1] - 1) + 1)]
  out[k] = cols
  print(k, 'columns', len(cols), 'rows span', (min(c[1] for c in cols), max(c[2] for c in cols)) if cols else None)
json.dump(out, open(sys.argv[2], 'w'))
