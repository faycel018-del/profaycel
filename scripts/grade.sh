#!/usr/bin/env bash
# Color grade: ./scripts/grade.sh in.mp4 out.mp4 <preset|file.cube>
# presets: clean | warm | cinematic | moody | vivid | bw
set -euo pipefail
in="$1"; out="$2"; p="${3:-clean}"
case "$p" in
  clean)     vf="eq=contrast=1.05:saturation=1.08:gamma=1.0,unsharp=5:5:0.4" ;;
  warm)      vf="eq=contrast=1.06:saturation=1.12,colorbalance=rs=.05:gs=.01:bs=-.05:rm=.04:bm=-.04,unsharp=5:5:0.4" ;;
  cinematic) vf="eq=contrast=1.12:saturation=0.92,colorbalance=rs=-.06:bs=.08:rh=.08:bh=-.06,curves=master='0/0.04 0.5/0.48 1/0.96',vignette=PI/5,unsharp=5:5:0.3" ;;
  moody)     vf="eq=contrast=1.15:saturation=0.8:brightness=-0.03,colorbalance=bs=.06:bm=.03,curves=master='0/0.05 0.6/0.55 1/0.92',vignette=PI/4" ;;
  vivid)     vf="eq=contrast=1.1:saturation=1.3,vibrance=intensity=0.25,unsharp=5:5:0.6" ;;
  bw)        vf="hue=s=0,eq=contrast=1.2,curves=master='0/0.03 1/0.97'" ;;
  *.cube)    vf="lut3d=file='$p'" ;;
  *) echo "unknown preset: $p"; exit 1 ;;
esac
ffmpeg -hide_banner -y -loglevel error -i "$in" -vf "$vf,format=yuv420p" -c:v libx264 -crf 17 -preset medium -c:a copy "$out"
echo "$out"
