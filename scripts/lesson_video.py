#!/usr/bin/env python3
"""Lesson video from a storyboard: slide frames (deck_steps.py) + voice (tts.py) + zoom + sounds + subtitles + intro/outro.

usage: lesson_video.py storyboard.json [--format landscape|vertical] [--out file.mp4] [--provider silent]

storyboard.json:
{
  "title": "الإسقاط المتعامد", "subtitle": "إصلاح الكرّاس · ثامنة أساسي",
  "frames": "lessons/frames/isqat",
  "hook": "اليميني يترسم على اليسار؟! 🤯",          # vertical: the banner at the top
  "outro": "الإصلاح الكامل على YouTube",
  "scenes": [
    {"img": "s08_k00", "say": "...", "zoom": [0.35, 0.55, 0.6]},   # zoom = [center x, center y, width] as fractions
    {"img": "s08_k01", "say": "..."}                              # a step on the same slide → "pop" + keeps the zoom
  ]
}
"""
import argparse, json, subprocess, sys, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import tts  # noqa: E402

BRAND = json.loads((ROOT / "brand/brand.json").read_text())
FPS = 30
NAVY, YELLOW = (17, 35, 64), (255, 202, 40)
SFX = ROOT / "brand/sfx"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def run(cmd):
    subprocess.run(cmd, check=True)


def font(px):
    for f in [*sorted((ROOT / "brand/fonts").glob("*.[ot]tf")), Path(FONT)]:
        try:
            return ImageFont.truetype(str(f), px, layout_engine=ImageFont.Layout.RAQM)
        except OSError:
            pass


def clean(text):
    """Remove emoji/symbols outside the BMP: the fonts can't draw them (they show up as boxes)."""
    return "".join(ch for ch in text if ord(ch) < 0x2600).strip()


def fit_text(d, text, max_w, px):
    f = font(px)
    while d.textlength(text, font=f) > max_w and px > 24:
        px -= 4; f = font(px)
    return f


def card(path, W, H, title, sub, foot):
    """Brand card (intro / outro): navy background, yellow arcs, large title."""
    title, sub, foot = clean(title), clean(sub), clean(foot)
    img = Image.new("RGB", (W, H), NAVY); d = ImageDraw.Draw(img)
    r = int(min(W, H) * 0.55)
    d.ellipse((W - r * 0.7, -r * 0.6, W + r * 1.1, r * 1.0), outline=YELLOW, width=6)
    d.ellipse((-r * 0.8, H - r * 0.5, r * 0.6, H + r * 0.9), fill=(26, 52, 92))
    cy = H * 0.42
    f = fit_text(d, title, W * 0.85, int(H * (0.11 if W > H else 0.065)))
    d.text((W / 2, cy), title, font=f, fill="white", anchor="mm")
    if sub:
        f2 = fit_text(d, sub, W * 0.8, int(f.size * 0.45))
        tw = d.textlength(sub, font=f2); pad = f2.size * 0.6
        y2 = cy + f.size * 1.0
        d.rounded_rectangle((W / 2 - tw / 2 - pad, y2 - f2.size * 0.8, W / 2 + tw / 2 + pad, y2 + f2.size * 0.8),
                            radius=f2.size, fill=YELLOW)
        d.text((W / 2, y2), sub, font=f2, fill=NAVY, anchor="mm")
    if foot:
        f3 = font(int(f.size * 0.33))
        d.text((W / 2, H * 0.86), foot, font=f3, fill=YELLOW, anchor="mm")
    img.save(path)


def vertical_bg(path, hook, title):
    """9:16 background: hook at the top, room for the slide, brand at the bottom."""
    W, H = 1080, 1920
    img = Image.new("RGB", (W, H), NAVY); d = ImageDraw.Draw(img)
    for y in range(H):  # soft vertical gradient
        t = y / H
        d.line([(0, y), (W, y)], fill=(int(17 + 10 * t), int(35 + 14 * t), int(64 + 26 * t)))
    hook, title = clean(hook), clean(title)
    if hook:
        f = fit_text(d, hook, W * 0.9, 92)
        d.text((W / 2, 300), hook, font=f, fill=YELLOW, anchor="mm", stroke_width=5, stroke_fill="#000000")
    if title:
        f2 = font(44); tw = d.textlength(title, font=f2)
        d.rounded_rectangle((W / 2 - tw / 2 - 28, 410 - 34, W / 2 + tw / 2 + 28, 410 + 34), radius=34, fill="white")
        d.text((W / 2, 410), title, font=f2, fill=NAVY, anchor="mm")
    f3 = font(40)
    d.text((W / 2, 1640), f"{BRAND['name']} · {BRAND['handle']}", font=f3, fill=(200, 210, 230), anchor="mm")
    img.save(path)


def zoom_filter(start, end, frames, out_w, out_h, src_w, src_h):
    """zoompan from box start→end in 0.5s (smoothstep), then hold. box = [cx, cy, w] as fractions."""
    n = max(1, int(FPS * 0.5))
    e = f"(min(on/{n},1)*min(on/{n},1)*(3-2*min(on/{n},1)))"
    bw = f"({start[2]}+({end[2]}-{start[2]})*{e})"
    cx = f"({start[0]}+({end[0]}-{start[0]})*{e})"
    cy = f"({start[1]}+({end[1]}-{start[1]})*{e})"
    # keep the box inside the image
    x = f"max(0,min(iw-iw*{bw},iw*{cx}-iw*{bw}/2))"
    y = f"max(0,min(ih-ih*{bw},ih*{cy}-ih*{bw}/2))"
    return (f"scale={src_w}:{src_h},zoompan=z='1/{bw}':x='{x}':y='{y}':d={frames}:s={out_w}x{out_h}:fps={FPS}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("story"); ap.add_argument("--format", default="landscape", choices=["landscape", "vertical"])
    ap.add_argument("--out"); ap.add_argument("--provider"); ap.add_argument("--subs", choices=["on", "off", "auto"], default="auto")
    a = ap.parse_args()
    sb = json.loads(Path(a.story).read_text())
    frames = ROOT / sb["frames"]
    vert = a.format == "vertical"
    W, H = (1080, 1920) if vert else (1920, 1080)
    vw, vh = (1080, 608) if vert else (1920, 1080)       # slide viewport
    vy = 470 if vert else 0
    out = Path(a.out or Path(a.story).with_suffix(f".{a.format}.mp4"))
    burn = a.subs == "on" or (a.subs == "auto" and vert)

    with tempfile.TemporaryDirectory() as tmpd:
        tmp = Path(tmpd); segs, words_all, t0 = [], [], 0.0
        bg = tmp / "bg.png"
        if vert:
            vertical_bg(bg, sb.get("hook", ""), sb.get("title", ""))

        def finish(seg_v, audio_inputs, dur, name, full=False):
            """Composite the slide onto the background (vertical), mix the audio. full = the clip already fills the frame."""
            seg = tmp / f"{name}.mp4"
            ins = ["-i", str(seg_v)]
            if vert and not full:
                ins += ["-loop", "1", "-i", str(bg)]
                vf = f"[1:v][0:v]overlay=0:{vy}:shortest=1,format=yuv420p[v]"
            else:
                vf = "[0:v]format=yuv420p[v]"
            k = 2 if vert and not full else 1
            amix, labels = [], ""
            for i, (f, delay, vol) in enumerate(audio_inputs):
                ins += ["-i", str(f)]
                amix.append(f"[{k + i}:a]aresample=48000,aformat=channel_layouts=mono,volume={vol},adelay={int(delay * 1000)}[a{i}]")
                labels += f"[a{i}]"
            amix.append(f"{labels}amix=inputs={len(audio_inputs)}:normalize=0,apad,atrim=0:{dur:.3f}[a]")
            run(["ffmpeg", "-y", "-loglevel", "error", *ins, "-filter_complex", vf + ";" + ";".join(amix),
                 "-map", "[v]", "-map", "[a]", "-t", f"{dur:.3f}", "-r", str(FPS),
                 "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", str(seg)])
            segs.append(seg)

        def card_seg(name, title, sub, foot, dur, sfx):
            png = tmp / f"{name}.png"
            card(png, W, H, title, sub, foot)  # cards fill the whole frame
            v = tmp / f"{name}_v.mp4"
            fr = int(dur * FPS)
            run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", str(png), "-vf",
                 zoom_filter([0.5, 0.5, 1.0], [0.5, 0.5, 0.94], fr, W, H, int(W * 1.5), int(H * 1.5)) + ",fade=t=in:d=0.25",
                 "-frames:v", str(fr), "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", str(v)])
            finish(v, [(SFX / sfx, 0, 1.0)], dur, name, full=True)

        # ---- cover (TikTok/Reels/YouTube): the background + the slide with its answers, no subtitles
        cover_img = frames / f"{sb.get('cover', sb['scenes'][-1]['img'])}.png"
        if vert:
            cv = Image.open(bg).convert("RGB")
            cv.paste(Image.open(cover_img).convert("RGB").resize((vw, vh)), (0, vy))
        else:
            cv = Image.open(cover_img).convert("RGB").resize((W, H))
            d = ImageDraw.Draw(cv); hook = clean(sb.get("hook", sb["title"]))
            f = fit_text(d, hook, W * 0.9, 120)
            d.rectangle((0, H * 0.70, W, H), fill=NAVY)
            d.text((W / 2, H * 0.85), hook, font=f, fill=YELLOW, anchor="mm", stroke_width=5, stroke_fill="#000000")
        out.parent.mkdir(parents=True, exist_ok=True)
        cv.save(out.with_suffix(".cover.jpg"), quality=92)

        # ---- intro
        if sb.get("intro", True):
            card_seg("intro", sb["title"], sb.get("subtitle", ""), f"{BRAND['name']} · {BRAND.get('academy', '')}", 2.6, "whoosh.wav")
            t0 += 2.6

        # ---- scenes
        prev_slide, prev_img, box = None, None, [0.5, 0.5, 1.0]
        for i, sc in enumerate(sb["scenes"]):
            slide = sc["img"].split("_")[0]
            same = slide == prev_slide
            start = box if same else [0.5, 0.5, 1.0]
            end = sc.get("zoom", start if same else [0.5, 0.5, 1.0])
            mp3 = tmp / f"s{i}.mp3"
            words = tts.synth(sc["say"], str(mp3), a.provider)
            lead = 0.25
            dur = lead + tts.duration(mp3) + sc.get("hold", 0.45)
            for w in words:
                words_all.append({"w": w["w"], "s": round(t0 + lead + w["s"], 3), "e": round(t0 + lead + w["e"], 3)})
            v = tmp / f"s{i}_v.mp4"; fr = int(round(dur * FPS))
            vf = zoom_filter(start, end, fr, vw, vh, 2880 if not vert else 2160, 1620 if not vert else 1215)
            if not same:
                vf += ",fade=t=in:d=0.2"
            run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", str(frames / f"{sc['img']}.png"),
                 "-vf", vf, "-frames:v", str(fr), "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", str(v)])
            fx = [(mp3, lead, 1.0)]
            if same and sc["img"] != prev_img:
                fx.append((SFX / "pop.wav", 0.02, 0.9))
            elif not same and i > 0:
                fx.append((SFX / "whoosh.wav", 0, 0.6))
            finish(v, fx, dur, f"s{i:03d}")
            t0 += dur; prev_slide, prev_img, box = slide, sc["img"], end
            print(f"  scene {i + 1}/{len(sb['scenes'])}  {dur:.1f}s", flush=True)

        # ---- outro
        if sb.get("outro"):
            card_seg("outro", sb["outro"], sb.get("outro_sub", BRAND["handle"]), "تابعني · Like · Partage", 3.0, "hit.wav")

        # ---- join
        lst = tmp / "list.txt"
        lst.write_text("".join(f"file '{s}'\n" for s in segs))
        joined = tmp / "joined.mp4"
        run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(joined)])

        # subtitles: always write an SRT (YouTube/Facebook CC); burn in for vertical
        wj = out.with_suffix(".words.json"); wj.write_text(json.dumps(words_all, ensure_ascii=False))
        srt_lines, n = [], 0
        for j in range(0, len(words_all), 7):
            g = words_all[j:j + 7]; n += 1
            ts = lambda s: f"{int(s // 3600):02d}:{int(s % 3600 // 60):02d}:{int(s % 60):02d},{int(s % 1 * 1000):03d}"
            srt_lines.append(f"{n}\n{ts(g[0]['s'])} --> {ts(g[-1]['e'])}\n{' '.join(w['w'] for w in g)}\n")
        out.with_suffix(".srt").write_text("\n".join(srt_lines))

        music = next(iter(sorted((ROOT / "brand/music").glob("*.mp3"))), None)
        ins = ["-i", str(joined)]
        if music:
            ins += ["-stream_loop", "-1", "-i", str(music)]
            af = (f"[1:a]volume={BRAND.get('music_volume', 0.2) * 0.6}[mu];[0:a]asplit[vo][sc];"
                  "[mu][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[du];"
                  "[vo][du]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1:LRA=9[a]")
        else:
            af = "[0:a]loudnorm=I=-14:TP=-1:LRA=9[a]"
        out.parent.mkdir(parents=True, exist_ok=True)
        run(["ffmpeg", "-y", "-loglevel", "error", *ins, "-filter_complex", f"[0:v]null[v];{af}",
             "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-profile:v", "high",
             "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", str(out)])
        if burn:  # Pillow-rendered karaoke subtitles (correct Arabic order)
            pos = 1330 / 1920 if vert else 0.9
            raw = tmp / "nosubs.mp4"; out.replace(raw)
            run([sys.executable, str(ROOT / "scripts/subs.py"), "overlay", str(raw), str(wj), str(out), "--pos", str(pos)])
    print(out)


if __name__ == "__main__":
    main()
