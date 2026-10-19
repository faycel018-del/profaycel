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
[ -n "${GEMINI_API_KEY:-}" ] && echo "✅ GEMINI_API_KEY found" || echo "⚠️ GEMINI_API_KEY is missing (see docs/voice-setup.md)"
echo "✅ ready"
