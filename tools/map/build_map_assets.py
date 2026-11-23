"""Rebuilds the map images used by saale*.html and lat51*.html from the 16:9 rivers & regions source video.

  python3 build_map_assets.py <rivers_regions_16x9_4K.mp4> ../../cards

Writes muted.png (Germany with every wine region muted to beige), su_layer.png (Saale-Unstrut only, transparent
elsewhere) and muted_de.png (muted.png cut to Germany's border, for compositing over the Europe map).
muted_de.png needs ../../cards/paths.js, so run paths.mjs first.
"""
import json, re, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

video, out = sys.argv[1], sys.argv[2]
CROP = 'crop=1640:2160:1100:0'   # Germany's map area in the 3840x2160 frame


def frame(n):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', video, '-vf', f'select=eq(n\\,{n}),{CROP}', '-frames:v', '1',
                          '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], check=True, capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(2160, 1640, 3).astype(float)


base, fin = frame(110), frame(239)                 # rivers drawn / regions coloured in
a = np.clip((np.abs(fin - base).max(2) - 8) / 40, 0, 1)   # where the regions are


def dilate(m, r):
    o = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            o = np.maximum(o, np.roll(np.roll(m, dy, 0), dx, 1))
    return o


beige, edge = np.array([228, 217, 197.]), np.array([196, 182, 156.])
ring = np.clip(a - (1 - dilate(1 - a, 1)), 0, 1)
muted = base * (1 - a[..., None]) + beige * a[..., None]
muted = muted * (1 - ring[..., None]) + edge * ring[..., None]
Image.fromarray(muted.round().astype(np.uint8)).save(f'{out}/muted.png')

su = np.zeros_like(a); su[970:1135, 950:1120] = a[970:1135, 950:1120]   # Saale-Unstrut's box
Image.fromarray(np.dstack([fin, su * 255]).round().astype(np.uint8), 'RGBA').save(f'{out}/su_layer.png')

geo = json.loads(open(f'{out}/paths.js').read().split('=', 1)[1].rstrip().rstrip(';'))
mask = Image.new('L', (1640, 2160), 0); d = ImageDraw.Draw(mask)
for sub in re.findall(r'M[^M]+', geo['germany']):
    pts = [tuple(map(float, p.split(','))) for p in re.findall(r'-?\d+\.?\d*,-?\d+\.?\d*', sub)]
    if len(pts) > 2: d.polygon(pts, fill=255)
mask = mask.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(1.2))
m = Image.fromarray(muted.round().astype(np.uint8)); m.putalpha(mask); m.save(f'{out}/muted_de.png')
print('wrote muted.png, su_layer.png, muted_de.png')
