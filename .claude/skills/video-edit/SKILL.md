---
name: video-edit
description: Professional video editing with the studio's ffmpeg scripts. Covers audio cleanup, silence cuts, color grading, subtitles, music, export for every platform, and thumbnails. Use when the user gives you a video or asks for editing, subtitles, color, export, or a thumbnail.
---
# Editing

1. `./scripts/probe.sh <video>`: resolution, orientation, fps, loudness. Report problems (dark, quiet, 60fps, wrong orientation).
2. Ask, or pick sensible defaults: platforms (vertical + landscape?), grade (`brand.grade_default`), music?, subtitles?
3. Full pipeline: `./scripts/pipeline.sh raw/x.mp4 <grade> "<formats>" <lang>`.
   Or step by step:
   - `clean_audio.sh` (`strong` when there is a lot of noise)
   - `cut_silence.py` (for a noisy room try `--db -30`; for more breathing room, `--pad 0.2`)
   - `grade.sh` → take a frame from before and after, show the user and compare
   - `music.sh` (music from `brand/music/`, volume 0.15–0.25)
   - `export.sh … blur` (for landscape footage going vertical; `crop` when the subject is centered)
   - `subs.py transcribe` → **fix the spelling in words.json** → `style` (--w/--h match the format; landscape --pos 0.85) → `burn`
   - `thumbnail.py` for 2–3 versions with different hooks
4. **QA before delivery**: `probe.sh` on every export (I ≈ -14 LUFS), plus a frame at the start, middle, and a subtitle moment. Read the images and check the text sits inside the safe zone.
5. Deliver the files from `exports/` and `thumbs/` with SendUserFile.

If transcription fails (huggingface.co is blocked): tell the user to allow huggingface.co in the network settings, or ask them for an SRT and use `subs.py from-srt`.
