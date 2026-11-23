# usage: python3 ov_fill.py <frame.png> ov_masks.json <out.png>  (also imported by outlying_vineyards.sh)
# erase leader lines: top half of the band copies the row just above it, bottom half the row just below
import numpy as np, json
def load(path): return json.load(open(path))
def fill(fr, cols):
  for x, y0, y1 in cols:
    mid = (y0 + y1 + 1) // 2
    fr[y0:mid, x] = fr[y0 - 1, x]; fr[mid:y1 + 1, x] = fr[y1 + 1, x]
if __name__ == '__main__':
  import sys; from PIL import Image
  im = np.array(Image.open(sys.argv[1]).convert('RGB')); m = load(sys.argv[2])
  for k in m: fill(im, m[k])
  Image.fromarray(im).save(sys.argv[3])
