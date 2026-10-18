#!/usr/bin/env bash
# Export for social platforms
# ./scripts/export.sh in.mp4 <vertical|portrait|square|landscape|all> [blur|crop|fit] [outdir]
#   blur = blurred copy of the video fills the background (best for landscape → vertical)
#   crop = crop the center   fit = black bars
set -euo pipefail
in="$1"; fmt="$2"; mode="${3:-blur}"; outdir="${4:-$(dirname "$in")/../exports}"
mkdir -p "$outdir"
name="$(basename "${in%.*}")"
render(){
  local f="$1" W H
  case "$f" in
    vertical) W=1080; H=1920;; portrait) W=1080; H=1350;;
    square) W=1080; H=1080;; landscape) W=1920; H=1080;;
    *) echo "bad format $f"; exit 1;;
  esac
  case "$mode" in
    crop) vf="scale=$W:$H:force_original_aspect_ratio=increase,crop=$W:$H,setsar=1";;
    fit)  vf="scale=$W:$H:force_original_aspect_ratio=decrease,pad=$W:$H:(ow-iw)/2:(oh-ih)/2:black,setsar=1";;
    blur) vf="split[a][b];[a]scale=$W:$H:force_original_aspect_ratio=increase,crop=$W:$H,gblur=sigma=40,eq=brightness=-0.08[bg];[b]scale=$W:$H:force_original_aspect_ratio=decrease[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1";;
  esac
  local out="$outdir/${name}_${f}.mp4"
  ffmpeg -hide_banner -y -loglevel error -i "$in" -filter_complex "[0:v]$vf,fps=30,format=yuv420p[v]" -map "[v]" -map 0:a? \
    -c:v libx264 -preset slow -crf 18 -profile:v high -level 4.2 -maxrate 16M -bufsize 32M \
    -af "loudnorm=I=-14:TP=-1:LRA=9" -ar 48000 -c:a aac -b:a 192k -movflags +faststart "$out"
  echo "$out"
}
if [ "$fmt" = all ]; then for f in vertical portrait square landscape; do render $f; done; else render "$fmt"; fi
