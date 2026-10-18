#!/usr/bin/env python3
"""Automatic jump cuts: remove silences (pauses, "uh...") to keep the video tight.

usage: cut_silence.py in.mp4 out.mp4 [--db -35] [--min 0.45] [--pad 0.12]
  --db   anything quieter than this counts as silence (lower it for a noisy room, e.g. -30)
  --min  shortest silence to cut, in seconds
  --pad  silence kept around each cut, in seconds, so speech does not sound clipped
"""
import argparse, re, subprocess, tempfile, os

ap = argparse.ArgumentParser()
ap.add_argument("inp"); ap.add_argument("out")
ap.add_argument("--db", type=float, default=-35)
ap.add_argument("--min", type=float, default=0.45)
ap.add_argument("--pad", type=float, default=0.12)
a = ap.parse_args()

dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                     "-of", "csv=p=0", a.inp]).decode())
log = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", a.inp, "-af",
                      f"silencedetect=n={a.db}dB:d={a.min}", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
if len(ends) < len(starts):
    ends.append(dur)

keep, t = [], 0.0
for s, e in zip(starts, ends):
    s2, e2 = s + a.pad, e - a.pad
    if s2 > t:
        keep.append((t, s2))
    t = max(t, e2)
if t < dur:
    keep.append((t, dur))
keep = [(s, e) for s, e in keep if e - s > 0.08]

removed = dur - sum(e - s for s, e in keep)
print(f"segments: {len(keep)}  removed: {removed:.1f}s of {dur:.1f}s")
if not starts:
    print("no silence found — copying as is")

parts, labels = [], ""
for i, (s, e) in enumerate(keep):
    parts.append(f"[0:v]trim={s:.3f}:{e:.3f},setpts=PTS-STARTPTS[v{i}];"
                 f"[0:a]atrim={s:.3f}:{e:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,"
                 f"afade=t=out:st={max(0, e - s - 0.01):.3f}:d=0.01[a{i}];")
    labels += f"[v{i}][a{i}]"
graph = "".join(parts) + f"{labels}concat=n={len(keep)}:v=1:a=1[v][a]"
with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as f:
    f.write(graph)
try:
    subprocess.run(["ffmpeg", "-hide_banner", "-y", "-loglevel", "error", "-i", a.inp,
                    "-filter_complex_script", f.name, "-map", "[v]", "-map", "[a]",
                    "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-c:a", "aac", "-b:a", "192k",
                    a.out], check=True)
finally:
    os.unlink(f.name)
print(a.out)
