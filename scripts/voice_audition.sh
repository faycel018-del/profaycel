#!/usr/bin/env bash
# Hear several Gemini voices on the same sentence, then pick one → brand.json voice.gemini.voice
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; out="$ROOT/projects/voices"; mkdir -p "$out"
txt="${1:-عندما ننظرُ إلى القطعةِ من اليمين، نظنُّ أنّنا نرسمُها على اليمين… وهذا خطأٌ يقعُ فيه كثيرٌ من التلاميذ!}"
for v in Charon Orus Puck Fenrir Kore Aoede; do
  python3 "$ROOT/scripts/tts.py" "$txt" "$out/$v.mp3" --provider gemini --voice "$v"
done
ls "$out"
