#!/usr/bin/env python3
"""Voice-over: text → mp3 + word timings (for subtitles). The provider is chosen in brand.json → voice.provider

  tts.py "النص بالدارجة" out.mp3 [--provider elevenlabs|azure|edge|silent]
  → out.mp3 + out.words.json  [{"w":..,"s":..,"e":..}]

Keys come from environment variables (the environment's secrets, never in the code):
  ELEVENLABS_API_KEY · AZURE_SPEECH_KEY
The result is cached in .cache/tts by text+voice, so nothing is paid twice.
"""
import argparse, base64, hashlib, json, os, re, shutil, subprocess, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CFG = json.loads((ROOT / "brand/brand.json").read_text())["voice"]
CACHE = ROOT / ".cache/tts"


def duration(f):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                          "-of", "csv=p=0", str(f)]))


def spread_words(text, total, lead=0.05):
    """Approximate word timings, proportional to word length (good enough for 2–3 word subtitle chunks)."""
    words = text.split()
    weights = [len(w) + 2 for w in words]
    span = max(0.1, total - 2 * lead); t = lead; out = []
    for w, wt in zip(words, weights):
        d = span * wt / sum(weights)
        out.append({"w": w, "s": round(t, 3), "e": round(t + d, 3)}); t += d
    return out


def post(url, body, headers):
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()


def elevenlabs(text, out):
    c = CFG["elevenlabs"]; key = os.environ["ELEVENLABS_API_KEY"]
    body = json.dumps({"text": text, "model_id": c["model"],
                       "voice_settings": {"stability": c["stability"], "similarity_boost": c["similarity"],
                                          "style": c["style"], "use_speaker_boost": True}}).encode()
    r = json.loads(post(f"https://api.elevenlabs.io/v1/text-to-speech/{c['voice_id']}/with-timestamps"
                        "?output_format=mp3_44100_128", body,
                        {"xi-api-key": key, "Content-Type": "application/json"}))
    Path(out).write_bytes(base64.b64decode(r["audio_base64"]))
    al = r.get("alignment") or {}
    chars, st, en = al.get("characters", []), al.get("character_start_times_seconds", []), al.get("character_end_times_seconds", [])
    words, cur = [], None
    for ch, s, e in zip(chars, st, en):
        if ch.isspace():
            if cur: words.append(cur); cur = None
        elif cur is None:
            cur = {"w": ch, "s": s, "e": e}
        else:
            cur["w"] += ch; cur["e"] = e
    if cur: words.append(cur)
    return words or spread_words(text, duration(out))


def azure(text, out):
    c = CFG["azure"]
    ssml = (f"<speak version='1.0' xml:lang='ar-TN'><voice name='{c['voice']}'>"
            f"<prosody rate='{c['rate']}'>{text}</prosody></voice></speak>").encode()
    Path(out).write_bytes(post(f"https://{c['region']}.tts.speech.microsoft.com/cognitiveservices/v1", ssml,
                               {"Ocp-Apim-Subscription-Key": os.environ["AZURE_SPEECH_KEY"],
                                "Content-Type": "application/ssml+xml",
                                "X-Microsoft-OutputFormat": "audio-48khz-192kbitrate-mono-mp3",
                                "User-Agent": "studio360"}))
    return spread_words(text, duration(out))


def edge(text, out):
    import asyncio, edge_tts
    c = CFG["edge"]; words = []

    async def run():
        com = edge_tts.Communicate(text, c["voice"], rate=c["rate"], boundary="WordBoundary")
        with open(out, "wb") as f:
            async for ch in com.stream():
                if ch["type"] == "audio":
                    f.write(ch["data"])
                elif ch["type"] == "WordBoundary":
                    s = ch["offset"] / 1e7
                    words.append({"w": ch["text"], "s": round(s, 3), "e": round(s + ch["duration"] / 1e7, 3)})
    asyncio.run(run())
    return words or spread_words(text, duration(out))


def piper(text, out):
    """Offline and free (open source). The model comes from the sherpa-onnx GitHub releases (huggingface.co is blocked here):
    https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-<model>.tar.bz2 → brand/voices/"""
    import tarfile, wave
    from piper import PiperVoice, SynthesisConfig
    c = CFG["piper"]; vdir = ROOT / "brand/voices"; vdir.mkdir(parents=True, exist_ok=True)
    model = vdir / f"vits-piper-{c['model']}" / f"{c['model']}.onnx"
    if not model.exists():
        tb = vdir / "model.tar.bz2"
        urllib.request.urlretrieve("https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/"
                                   f"vits-piper-{c['model']}.tar.bz2", tb)
        with tarfile.open(tb) as t:
            t.extractall(vdir)
        tb.unlink()
    voice = PiperVoice.load(str(model))
    cfg = SynthesisConfig(length_scale=c.get("length_scale", 0.85), noise_scale=c.get("noise_scale", 0.6),
                          noise_w_scale=c.get("noise_w", 0.8))
    wav = Path(out).with_suffix(".wav")
    with wave.open(str(wav), "wb") as wf:
        voice.synthesize_wav(text, wf, syn_config=cfg)
    # light polish: warmth, presence, gentle compression
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-af",
                    "aresample=48000,highpass=f=70,equalizer=f=180:t=q:w=1:g=2,equalizer=f=3500:t=q:w=1.5:g=2.5,"
                    "acompressor=threshold=-18dB:ratio=2.5:attack=5:release=120:makeup=2,silenceremove=start_periods=1:start_threshold=-45dB",
                    "-c:a", "libmp3lame", "-b:a", "192k", out], check=True)
    wav.unlink()
    return spread_words(text, duration(out))


def polish(src, out, tempo=1.0):
    """Light voice polish: warmth, presence, compression, trimmed leading silence."""
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-af",
                    f"aresample=48000,atempo={tempo},highpass=f=70,equalizer=f=200:t=q:w=1:g=1.5,"
                    "equalizer=f=3500:t=q:w=1.5:g=2,acompressor=threshold=-18dB:ratio=2.5:attack=5:release=120:makeup=2,"
                    "silenceremove=start_periods=1:start_threshold=-45dB",
                    "-c:a", "libmp3lame", "-b:a", "192k", str(out)], check=True)


def gtts(text, out):
    """Google voice (Translate endpoint): free, no key. Max ~180 characters per request → split at punctuation."""
    import urllib.parse
    c = CFG.get("gtts", {})
    parts, cur = [], ""
    for piece in re.split(r"(?<=[،,.!؟?:])\s+", text):
        if len(cur) + len(piece) + 1 > 180 and cur:
            parts.append(cur); cur = piece
        else:
            cur = f"{cur} {piece}".strip()
    if cur: parts.append(cur)
    raw = Path(out).with_suffix(".raw.mp3")
    with open(raw, "wb") as f:
        for p in parts:
            url = ("https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=" + c.get("lang", "ar")
                   + "&ttsspeed=1&q=" + urllib.parse.quote(p))
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=60) as r:
                f.write(r.read())
    polish(raw, out, c.get("tempo", 1.06)); raw.unlink()
    return spread_words(text, duration(out))


def gemini(text, out):
    """Gemini TTS (Google AI Studio): very natural voice, free key from aistudio.google.com → GEMINI_API_KEY."""
    c = CFG["gemini"]
    body = json.dumps({"contents": [{"parts": [{"text": f"{c['style']}: {text}"}]}],
                       "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {
                           "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": c["voice"]}}}}}).encode()
    r = json.loads(post(f"https://generativelanguage.googleapis.com/v1beta/models/{c['model']}:generateContent",
                        body, {"Content-Type": "application/json", "x-goog-api-key": os.environ["GEMINI_API_KEY"]}))
    pcm = base64.b64decode(r["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
    raw = Path(out).with_suffix(".pcm"); raw.write_bytes(pcm)
    wav = Path(out).with_suffix(".g.wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", str(raw), str(wav)], check=True)
    polish(wav, out, c.get("tempo", 1.0)); raw.unlink(); wav.unlink()
    return spread_words(text, duration(out))


def silent(text, out):
    d = max(1.2, len(text.split()) / CFG["silent"]["words_per_sec"])
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono",
                    "-t", f"{d:.2f}", "-c:a", "libmp3lame", "-b:a", "64k", out], check=True)
    return spread_words(text, d)


PROVIDERS = {"gemini": gemini, "gtts": gtts, "elevenlabs": elevenlabs, "azure": azure, "edge": edge, "piper": piper,
             "silent": silent}


def synth(text, out, provider=None):
    provider = provider or CFG["provider"]
    text = re.sub(r"\s+", " ", text).strip()
    sub = CFG.get(provider, {})
    h = hashlib.sha1(json.dumps([provider, sub, text], ensure_ascii=False).encode()).hexdigest()[:16]
    CACHE.mkdir(parents=True, exist_ok=True)
    cmp3, cjson = CACHE / f"{h}.mp3", CACHE / f"{h}.json"
    if not cmp3.exists():
        words = PROVIDERS[provider](text, str(cmp3))
        cjson.write_text(json.dumps(words, ensure_ascii=False))
    shutil.copy(cmp3, out)
    words = json.loads(cjson.read_text())
    Path(out).with_suffix(".words.json").write_text(json.dumps(words, ensure_ascii=False, indent=1))
    return words


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("text"); ap.add_argument("out"); ap.add_argument("--provider")
    a = ap.parse_args()
    w = synth(a.text, a.out, a.provider)
    print(a.out, f"{duration(a.out):.2f}s", len(w), "words")
