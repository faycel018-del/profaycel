#!/usr/bin/env python3
"""Motion-design video: an HTML page (motion/<name>/index.html) + Piper voice + sounds + music.

usage: motion_video.py story.json [--out file.mp4] [--preview 0]   (preview N = render only the first N seconds)

story.json:
{ "page": "motion/tiktok1/index.html", "music": true,
  "scenes": [ {"id": "hook", "say": "…", "pad": 0.3, "min": 2.0,
               "sfx": [["whoosh", 0], ["pop", "w2"]]} ] }        # sfx at a time (s) or at a word ("w2")
The page reads window.SCENES (written to timings.js): [{id, start, end, words:[{w,s,e}]}].
"""
import argparse, json, subprocess, sys, tempfile
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import tts  # noqa: E402

SR = 48000


def music_bed(dur, path, bpm=96):
    """A light 'tech pulse' background (kick + hat + soft pad) generated locally, royalty-free by construction."""
    n = int(dur * SR); t = np.arange(n) / SR; out = np.zeros(n)
    beat = 60 / bpm
    kt = np.arange(int(.35 * SR)) / SR
    kick = np.sin(2 * np.pi * (48 + 70 * np.exp(-kt * 28)) * kt) * np.exp(-kt * 9)
    ht = np.arange(int(.06 * SR)) / SR
    rng = np.random.default_rng(7)
    hat = rng.standard_normal(len(ht)) * np.exp(-ht * 70)
    hat = np.diff(np.concatenate([[0], hat]))  # crude high-pass
    i = 0
    while i * beat < dur:
        s = int(i * beat * SR)
        k = kick[: max(0, min(len(kick), n - s))]; out[s:s + len(k)] += .55 * k
        s2 = int((i + .5) * beat * SR)
        h = hat[: max(0, min(len(hat), n - s2))]; out[s2:s2 + len(h)] += .18 * h
        i += 1
    chords = [[220, 261.6, 329.6], [196, 246.9, 293.7], [174.6, 220, 261.6], [196, 246.9, 329.6]]  # Am G F G
    bar = 4 * beat
    for b in range(int(dur / bar) + 1):
        s, e = int(b * bar * SR), min(n, int((b + 1) * bar * SR))
        if s >= n: break
        tt = t[s:e] - b * bar
        env = np.minimum(1, tt / .4) * np.minimum(1, (bar - tt) / .4)
        for f in chords[b % 4]:
            out[s:e] += .06 * env * (np.sin(2 * np.pi * f * tt) + .3 * np.sin(2 * np.pi * 2 * f * tt))
    fade = np.minimum(1, np.minimum(t / 1.0, (dur - t) / 1.5))
    out = out * fade / max(1e-6, np.abs(out).max()) * .8
    import wave
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((out * 32767).astype(np.int16).tobytes())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("story"); ap.add_argument("--out"); ap.add_argument("--preview", type=float, default=0)
    ap.add_argument("--provider", help="override the voice provider (e.g. silent for a timing preview)")
    a = ap.parse_args()
    sb = json.loads(Path(a.story).read_text())
    page = (ROOT / sb["page"]).resolve()
    out = Path(a.out or Path(a.story).with_suffix(".mp4"))
    if sb.get("voice_style"):  # per-video speaking style (Gemini)
        tts.CFG.setdefault("gemini", {})["style"] = sb["voice_style"]
    with tempfile.TemporaryDirectory() as tmpd:
        tmp = Path(tmpd); t, scenes, voice, cues = 0.0, [], [], []
        for i, sc in enumerate(sb["scenes"]):
            lead = sc.get("lead", .15)
            words = []
            if sc.get("say"):
                mp3 = tmp / f"v{i}.mp3"
                ws = tts.synth(sc["say"], str(mp3), a.provider)
                d = tts.duration(mp3)
                voice.append((mp3, t + lead))
                words = [{"w": w["w"], "s": round(t + lead + w["s"], 3), "e": round(t + lead + w["e"], 3)} for w in ws]
            else:
                d = 0
            dur = max(sc.get("min", 0), lead + d + sc.get("pad", .35))
            scenes.append({"id": sc["id"], "start": round(t, 3), "end": round(t + dur, 3), "words": words,
                           "nosubs": sc.get("nosubs", False)})
            for name, at in sc.get("sfx", []):
                ts = words[min(int(at[1:]), len(words) - 1)]["s"] if isinstance(at, str) and at.startswith("w") else t + float(at)
                cues.append((ROOT / f"brand/sfx/{name}.wav", ts, sc.get("sfx_vol", .8)))
            t += dur
        total = a.preview or t
        (page.parent / "timings.js").write_text("window.SCENES = " + json.dumps(scenes, ensure_ascii=False) + ";\n")
        print(f"total {t:.1f}s, {len(scenes)} scenes")

        video = tmp / "video.mp4"
        subprocess.run(["node", str(ROOT / "motion/render.mjs"), str(page), str(video), f"{total:.3f}"], check=True)

        # audio mix: voice + sfx + music (ducked under the voice)
        ins, fl, labels = [], [], ""
        for k, (f, at, vol) in enumerate([(f, at, 1.0) for f, at in voice] + cues):
            ins += ["-i", str(f)]
            fl.append(f"[{k}:a]aresample={SR},aformat=channel_layouts=mono,volume={vol},adelay={int(at * 1000)}[x{k}]")
            labels += f"[x{k}]"
        nvo = len(voice); nall = nvo + len(cues)
        fl.append(f"{labels}amix=inputs={nall}:normalize=0,apad,atrim=0:{total:.3f}[mix]")
        if sb.get("music", True):
            bed = tmp / "bed.wav"; music_bed(total, bed)
            ins += ["-i", str(bed)]
            vlabels = "".join(f"[x{k}]" for k in range(nvo))
            # rebuild: voice-only bus for the sidechain
            fl = fl[:-1]
            fl.append(f"{labels}amix=inputs={nall}:normalize=0,apad,atrim=0:{total:.3f},asplit[mix][sc]")
            fl.append(f"[{nall}:a]volume=0.30[bed]")
            fl.append("[bed][sc]sidechaincompress=threshold=0.04:ratio=6:attack=15:release=350[duck]")
            fl.append("[mix][duck]amix=inputs=2:normalize=0[pre]")
            fl.append("[pre]loudnorm=I=-14:TP=-1:LRA=9[a]")
        else:
            fl.append("[mix]loudnorm=I=-14:TP=-1:LRA=9[a]")
        audio = tmp / "audio.m4a"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *ins, "-filter_complex", ";".join(fl), "-map", "[a]",
                        "-ar", str(SR), "-ac", "2", "-c:a", "aac", "-b:a", "192k", str(audio)], check=True)
        out.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(video), "-i", str(audio), "-map", "0:v", "-map", "1:a",
                        "-c:v", "copy", "-c:a", "copy", "-shortest", "-movflags", "+faststart", str(out)], check=True)
    print(out)


if __name__ == "__main__":
    main()
