#!/usr/bin/env python3
"""Local speech recognition (Whisper small via sherpa-onnx, no internet needed). For checking the voice-over and for subtitles.
usage: asr.py audio.(wav|mp3|mp4) [--lang ar]"""
import argparse, subprocess, tempfile, wave
from pathlib import Path
import numpy as np, sherpa_onnx

ROOT = Path(__file__).resolve().parent.parent
M = ROOT / "brand/asr/sherpa-onnx-whisper-small"


def transcribe(path, lang="ar"):
    rec = sherpa_onnx.OfflineRecognizer.from_whisper(
        encoder=str(M / "small-encoder.int8.onnx"), decoder=str(M / "small-decoder.int8.onnx"),
        tokens=str(M / "small-tokens.txt"), language=lang, task="transcribe", num_threads=4)
    with tempfile.NamedTemporaryFile(suffix=".wav") as t:
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(path), "-ar", "16000", "-ac", "1", t.name], check=True)
        with wave.open(t.name) as w:
            pcm = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    out = []
    for i in range(0, len(pcm), 16000 * 28):  # whisper works on chunks of <30s
        s = rec.create_stream(); s.accept_waveform(16000, pcm[i:i + 16000 * 28]); rec.decode_stream(s)
        out.append(s.result.text.strip())
    return " ".join(out)


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("audio"); ap.add_argument("--lang", default="ar")
    a = ap.parse_args(); print(transcribe(a.audio, a.lang))
