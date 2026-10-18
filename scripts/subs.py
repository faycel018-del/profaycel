#!/usr/bin/env python3
"""Animated TikTok-style subtitles (large, a few words at a time, the spoken word highlighted).

  subs.py transcribe in.mp4 [--lang ar|fr|en] [--model small]   -> in.words.json (+ in.srt)
  subs.py style in.words.json out.ass [--w 1080 --h 1920] [--words 3] [--pos 0.68]
  subs.py from-srt in.srt out.ass [--w 1080 --h 1920]           (when you already have an SRT)
  subs.py burn in.mp4 subs.ass out.mp4

Transcription uses faster-whisper. The model must be downloadable (huggingface.co) or
already present in ~/.cache/huggingface.
Fix spelling in words.json by hand before running style, especially for Tunisian dialect.
"""
import argparse, json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RTL = re.compile(r"[\u0590-\u08FF\uFB1D-\uFEFC]")
BRAND = json.loads((ROOT / "brand/brand.json").read_text())


def ts_ass(t):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def ts_srt(t):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int((s % 1) * 1000):03d}"


def ass_color(hex_):  # #RRGGBB -> &H00BBGGRR
    h = hex_.lstrip("#"); return f"&H00{h[4:6]}{h[2:4]}{h[0:2]}".upper()


def header(w, h):
    s = BRAND["subtitles"]
    fs = int(h * s["size_ratio"])
    return f"""[Script Info]
ScriptType: v4.00+
PlayResX: {w}
PlayResY: {h}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Main,{s['font']},{fs},{ass_color(s['color'])},{ass_color(s['highlight'])},{ass_color(s['outline'])},&H80000000,-1,0,0,0,100,100,0,0,1,{max(3, fs // 12)},2,5,60,60,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""


def transcribe(a):
    from faster_whisper import WhisperModel
    model = WhisperModel(a.model, device="cpu", compute_type="int8")
    segs, info = model.transcribe(a.inp, language=a.lang, word_timestamps=True, vad_filter=True)
    words, srt = [], []
    for i, seg in enumerate(segs, 1):
        srt.append(f"{i}\n{ts_srt(seg.start)} --> {ts_srt(seg.end)}\n{seg.text.strip()}\n")
        for w in seg.words or []:
            words.append({"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)})
    base = Path(a.inp).with_suffix("")
    Path(f"{base}.words.json").write_text(json.dumps(words, ensure_ascii=False, indent=1))
    Path(f"{base}.srt").write_text("\n".join(srt))
    print(f"{base}.words.json  ({len(words)} words, lang={info.language})")


def style(a):
    words = json.loads(Path(a.inp).read_text())
    hl = ass_color(BRAND["subtitles"]["highlight"])
    y = int(a.h * a.pos); x = a.w // 2
    out = [header(a.w, a.h)]
    for i in range(0, len(words), a.words):
        grp = words[i:i + a.words]
        for j, cur in enumerate(grp):
            end = grp[j + 1]["s"] if j + 1 < len(grp) else cur["e"]
            parts = [(f"{{\\c{hl}\\fscx110\\fscy110}}{g['w']}{{\\r}}" if k == j else g["w"])
                     for k, g in enumerate(grp)]
            # libass lays out each tag run left-to-right, so Arabic words must go in visual (reversed) order
            if any(RTL.search(g["w"]) for g in grp):
                parts.reverse()
            txt = " ".join(parts)
            pop = "{\\t(0,80,\\fscx104\\fscy104)\\t(80,160,\\fscx100\\fscy100)}" if j == 0 else ""
            out.append(f"Dialogue: 0,{ts_ass(cur['s'])},{ts_ass(max(end, cur['s'] + 0.05))},Main,,0,0,0,,"
                       f"{{\\pos({x},{y})}}{pop}{txt}")
    Path(a.out).write_text("\n".join(out) + "\n")
    print(a.out)


def from_srt(a):
    blocks = re.split(r"\n\s*\n", Path(a.inp).read_text(encoding="utf-8-sig").strip())
    out = [header(a.w, a.h)]
    to_s = lambda t: sum(float(x) * m for x, m in zip(t.replace(",", ".").split(":"), (3600, 60, 1)))
    for b in blocks:
        lines = b.strip().splitlines()
        m = next((l for l in lines if "-->" in l), None)
        if not m: continue
        s, e = [to_s(x.strip()) for x in m.split("-->")]
        text = "\\N".join(lines[lines.index(m) + 1:])
        out.append(f"Dialogue: 0,{ts_ass(s)},{ts_ass(e)},Main,,0,0,0,,{{\\pos({a.w//2},{int(a.h*a.pos)})}}{text}")
    Path(a.out).write_text("\n".join(out) + "\n")
    print(a.out)


def burn(a):
    fonts = ROOT / "brand/fonts"
    vf = f"ass='{a.subs}':fontsdir='{fonts}'"
    subprocess.run(["ffmpeg", "-hide_banner", "-y", "-loglevel", "error", "-i", a.inp, "-vf", vf,
                    "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-c:a", "copy", a.out], check=True)
    print(a.out)


p = argparse.ArgumentParser(); sp = p.add_subparsers(dest="cmd", required=True)
t = sp.add_parser("transcribe"); t.add_argument("inp"); t.add_argument("--lang", default=None); t.add_argument("--model", default="small")
for name in ("style", "from-srt"):
    s = sp.add_parser(name); s.add_argument("inp"); s.add_argument("out")
    s.add_argument("--w", type=int, default=1080); s.add_argument("--h", type=int, default=1920)
    s.add_argument("--words", type=int, default=3); s.add_argument("--pos", type=float, default=0.68)
b = sp.add_parser("burn"); b.add_argument("inp"); b.add_argument("subs"); b.add_argument("out")
a = p.parse_args()
{"transcribe": transcribe, "style": style, "from-srt": from_srt, "burn": burn}[a.cmd](a)
