#!/usr/bin/env bash
# Add background music that ducks automatically while someone talks
# ./scripts/music.sh video.mp4 music.mp3 out.mp4 [music_volume=0.25]
set -euo pipefail
v="$1"; m="$2"; out="$3"; vol="${4:-0.25}"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$v")
fade_st=$(python3 -c "print(max(0,$dur-2))")
ffmpeg -hide_banner -y -loglevel error -i "$v" -stream_loop -1 -i "$m" -filter_complex \
 "[1:a]volume=$vol,atrim=0:$dur,afade=t=in:d=1,afade=t=out:st=$fade_st:d=2[mu];\
  [0:a]asplit[voice][sc];\
  [mu][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[duck];\
  [voice][duck]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.89[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k "$out"
echo "$out"
