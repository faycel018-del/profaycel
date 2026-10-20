#!/usr/bin/env bash
# Prepare a new session (the container starts empty): Python libraries + local models from GitHub.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
pip install -q piper-tts sherpa-onnx edge-tts fonttools brotli numpy 2>&1 | grep -v WARNING || true
R=https://github.com/k2-fsa/sherpa-onnx/releases/download
if [ ! -d "$ROOT/brand/asr/sherpa-onnx-whisper-small" ]; then
  mkdir -p "$ROOT/brand/asr" && curl -sSL "$R/asr-models/sherpa-onnx-whisper-small.tar.bz2" | tar xj -C "$ROOT/brand/asr"
  rm -f "$ROOT/brand/asr/sherpa-onnx-whisper-small/small-"{encoder,decoder}.onnx
fi
if [ ! -d "$ROOT/brand/voices/vits-piper-ar_JO-kareem-medium" ]; then
  mkdir -p "$ROOT/brand/voices" && curl -sSL "$R/tts-models/vits-piper-ar_JO-kareem-medium.tar.bz2" | tar xj -C "$ROOT/brand/voices"
fi
python3 "$ROOT/scripts/sfx.py" >/dev/null
code=$(curl -s -o /dev/null -w "%{http_code}" "https://generativelanguage.googleapis.com/v1beta/models${GEMINI_API_KEY:+?key=$GEMINI_API_KEY}")
[ "$code" = 200 ] && echo "✅ Gemini: OK" || echo "⚠️ Gemini: HTTP $code (secret network / GEMINI_API_KEY ?)"
echo "✅ ready"
