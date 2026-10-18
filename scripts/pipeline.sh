#!/usr/bin/env bash
# The whole process in one command:
#   clean audio → cut silences → color grade → subtitles (if available) → export for all platforms
# ./scripts/pipeline.sh projects/<project>/raw/video.mp4 [grade=warm] [formats="vertical landscape"] [lang=ar]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; S="$ROOT/scripts"
in="$(realpath "$1")"; grade="${2:-warm}"; formats="${3:-vertical landscape}"; lang="${4:-ar}"
proj="$(dirname "$(dirname "$in")")"; work="$proj/work"; mkdir -p "$work" "$proj/exports"
n="$(basename "${in%.*}")"
echo "▶ 1/5 audio";   "$S/clean_audio.sh" "$in" "$work/${n}_1audio.mp4"
echo "▶ 2/5 cuts";    "$S/cut_silence.py" "$work/${n}_1audio.mp4" "$work/${n}_2cut.mp4"
echo "▶ 3/5 grade";   "$S/grade.sh" "$work/${n}_2cut.mp4" "$work/${n}_3grade.mp4" "$grade"
final="$work/${n}_3grade.mp4"
for f in $formats; do
  echo "▶ 4/5 export $f"
  out=$("$S/export.sh" "$final" "$f" blur "$work" | tail -1)
  if [ "${SUBS:-1}" = 1 ]; then
    words="$work/${n}_3grade.words.json"
    if [ ! -f "$words" ]; then python3 "$S/subs.py" transcribe "$final" --lang "$lang" || echo "⚠ transcription failed — continuing without subtitles"; fi
    if [ -f "$words" ]; then
      pos=0.68; [ "$f" = landscape ] && pos=0.85
      echo "▶ 5/5 subtitles $f"
      python3 "$S/subs.py" overlay "$out" "$words" "$proj/exports/${n}_$f.mp4" --pos $pos >/dev/null
      continue
    fi
  fi
  mv "$out" "$proj/exports/${n}_$f.mp4"
done
python3 "$S/thumbnail.py" "$final" "$proj/thumbs/${n}_yt.jpg" --text "${THUMB_TEXT:-$n}" >/dev/null || true
echo "✅ done:"; ls -1 "$proj/exports" "$proj/thumbs"
