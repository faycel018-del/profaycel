#!/usr/bin/env python3
"""Eye-catching thumbnail: pick a frame, boost contrast, add big text with an outline (Arabic works).

usage: thumbnail.py video.mp4 out.jpg --text "لا تعمل هالغلطة" [--at 3.5] [--size yt|vertical] [--sub "small line"]
"""
import argparse, json, subprocess, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
BRAND = json.loads((ROOT / "brand/brand.json").read_text())
ap = argparse.ArgumentParser()
ap.add_argument("video"); ap.add_argument("out"); ap.add_argument("--text", required=True)
ap.add_argument("--sub", default=""); ap.add_argument("--at", type=float, default=None)
ap.add_argument("--size", choices=["yt", "vertical"], default="yt")
a = ap.parse_args()
W, H = (1280, 720) if a.size == "yt" else (1080, 1920)

if a.at is None:  # default: one third of the way in
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.video]))
    a.at = d / 3
with tempfile.NamedTemporaryFile(suffix=".png") as tmp:
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(a.at), "-i", a.video, "-frames:v", "1",
                    "-vf", f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}", tmp.name], check=True)
    img = Image.open(tmp.name).convert("RGB")

img = ImageEnhance.Contrast(img).enhance(1.15)
img = ImageEnhance.Color(img).enhance(1.25)
img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=80))
# dark gradient at the bottom so the text stays readable
grad = Image.new("L", (1, H))
for y in range(H):
    grad.putpixel((0, y), int(200 * max(0, (y / H - 0.45) / 0.55)))
img.paste(Image.new("RGB", (W, H), (0, 0, 0)), (0, 0), grad.resize((W, H)))


def font(px):
    for f in [*sorted((ROOT / "brand/fonts").glob("*.[ot]tf")), Path(BRAND["thumbnail"]["fallback_font"])]:
        try: return ImageFont.truetype(str(f), px, layout_engine=ImageFont.Layout.RAQM)
        except OSError: continue
    return ImageFont.load_default()


d = ImageDraw.Draw(img)
fs = int(H * (0.14 if a.size == "yt" else 0.075))
f = font(fs)
while d.textlength(a.text, font=f) > W * 0.9 and fs > 20:
    fs -= 4; f = font(fs)
y = int(H * (0.62 if a.size == "yt" else 0.66))
d.text((W // 2, y), a.text, font=f, fill=BRAND["colors"]["accent"], anchor="mm",
       stroke_width=max(4, fs // 12), stroke_fill="#000000")
if a.sub:
    fs2 = fs // 2; f2 = font(fs2)
    d.text((W // 2, y + int(fs * 0.95)), a.sub, font=f2, fill="#FFFFFF", anchor="mm",
           stroke_width=max(3, fs2 // 10), stroke_fill="#000000")
logo = next(iter(sorted((ROOT / "brand/logo").glob("*.png"))), None)
if logo:
    lg = Image.open(logo).convert("RGBA"); lg.thumbnail((W // 8, W // 8))
    img.paste(lg, (W - lg.width - 24, 24), lg)
img.save(a.out, quality=92)
print(a.out)
