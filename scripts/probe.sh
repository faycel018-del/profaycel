#!/usr/bin/env bash
# Video facts: duration, resolution, fps, codecs, loudness (LUFS)
set -euo pipefail
f="$1"
ffprobe -v error -show_entries format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels \
  -of default=noprint_wrappers=1 "$f"
echo "--- loudness"
ffmpeg -hide_banner -nostats -i "$f" -af ebur128=peak=true -f null - 2>&1 \
  | awk '/Summary:/{s=1} s&&/(I:|LRA:|Peak:)/{print}'
