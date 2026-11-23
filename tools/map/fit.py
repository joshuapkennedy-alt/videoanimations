# fit each candidate projection to the raster map's border (ICP: scale_x, scale_y, translation)
import json, sys, numpy as np
from PIL import Image
from scipy import ndimage
im = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(int)
border = (np.abs(im - np.array([124, 106, 81])).max(2) < 28)
border = ndimage.binary_opening(border, iterations=1) | border  # keep thin lines
dist, (iy, ix) = ndimage.distance_transform_edt(~border, return_indices=True)
ys, xs = np.nonzero(border); bb = (xs.min(), xs.max(), ys.min(), ys.max())
print('raster border bbox', bb)
C = json.load(open(sys.argv[2])); H, W = border.shape
res = {}
for k, pts in C.items():
  P = np.array(pts)
  # initial: fit bbox
  sx = (bb[1] - bb[0]) / (P[:, 0].max() - P[:, 0].min()); sy = (bb[3] - bb[2]) / (P[:, 1].max() - P[:, 1].min())
  s = np.array([sx, sy]); t = np.array([bb[0] - P[:, 0].min() * sx, bb[2] - P[:, 1].min() * sy])
  for it in range(40):
    Q = P * s + t
    qi = np.clip(np.round(Q).astype(int), 0, [W - 1, H - 1])
    tx = ix[qi[:, 1], qi[:, 0]]; ty = iy[qi[:, 1], qi[:, 0]]
    d = dist[qi[:, 1], qi[:, 0]]; w = d < max(6, np.percentile(d, 80))
    for a, tgt in ((0, tx), (1, ty)):  # least squares per axis: tgt = P*s + t
      A = np.vstack([P[w, a], np.ones(w.sum())]).T; s[a], t[a] = np.linalg.lstsq(A, tgt[w], rcond=None)[0]
  Q = P * s + t; qi = np.clip(np.round(Q).astype(int), 0, [W - 1, H - 1]); d = dist[qi[:, 1], qi[:, 0]]
  res[k] = dict(s=s.tolist(), t=t.tolist(), mean=float(d.mean()), median=float(np.median(d)), p90=float(np.percentile(d, 90)), aspect=float(s[1] / s[0]))
  print(f"{k:16s} mean {d.mean():6.2f} median {np.median(d):5.2f} p90 {np.percentile(d,90):6.2f} sy/sx {s[1]/s[0]:.4f}")
json.dump(res, open(sys.argv[3], 'w'))
