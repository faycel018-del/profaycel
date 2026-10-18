#!/usr/bin/env bash
# Clean up the voice: cut rumble, remove noise, compress, normalize to -14 LUFS. Video is copied untouched.
# ./scripts/clean_audio.sh in.mp4 out.mp4 [light|strong]
set -euo pipefail
in="$1"; out="$2"; level="${3:-light}"
case "$level" in
  light)  nr="afftdn=nf=-25:nr=10" ;;
  strong) nr="afftdn=nf=-20:nr=20,anlmdn=s=4" ;;
  *) echo "level: light|strong"; exit 1 ;;
esac
chain="highpass=f=80,lowpass=f=15000,$nr,equalizer=f=3000:t=q:w=1.2:g=2,acompressor=threshold=-20dB:ratio=3:attack=10:release=150:makeup=2"
# two-pass loudnorm for accurate levels
stats=$(ffmpeg -hide_banner -nostats -i "$in" -af "$chain,loudnorm=I=-14:TP=-1:LRA=9:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
get(){ echo "$stats" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ln="loudnorm=I=-14:TP=-1:LRA=9:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true"
ffmpeg -hide_banner -y -loglevel error -i "$in" -map 0 -c:v copy -af "$chain,$ln" -ar 48000 -c:a aac -b:a 192k "$out"
echo "$out"
