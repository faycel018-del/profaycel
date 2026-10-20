#!/usr/bin/env python3
"""Sound effects generated locally (royalty-free by construction) → brand/sfx/<name>.wav
(*.wav is gitignored, so setup.sh rebuilds them in each new session.)

usage: sfx.py [--force]      names: whoosh pop ding hit buzz click
"""
import sys, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
rng = np.random.default_rng(3)


def t_(d):
    return np.arange(int(d * SR)) / SR


def whoosh():
    t = t_(.55); n = rng.standard_normal(len(t))
    env = np.sin(np.pi * np.minimum(1, t / .55)) ** 2
    # sweeping band-pass: mix of a slow and a fast low-pass, the balance moves over time
    lp = np.zeros_like(n); a = 0.0
    for i, x in enumerate(n):
        k = .02 + .25 * (t[i] / .55); a += k * (x - a); lp[i] = a
    return lp * env * 2.2


def pop():
    t = t_(.12)
    f = 900 * np.exp(-t * 30) + 380
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 38)


def ding():
    t = t_(.9); env = np.exp(-t * 4.5) * np.minimum(1, t / .004)
    return env * (np.sin(2 * np.pi * 1318.5 * t) + .45 * np.sin(2 * np.pi * 2637 * t) + .25 * np.sin(2 * np.pi * 1975.5 * t)) * .6


def hit():
    t = t_(.6)
    body = np.sin(2 * np.pi * (45 + 110 * np.exp(-t * 22)) * t) * np.exp(-t * 6)
    crack = rng.standard_normal(len(t)) * np.exp(-t * 45) * .35
    return np.tanh(1.6 * (body + crack))


def buzz():
    t = t_(.35); env = np.minimum(1, t / .01) * np.minimum(1, (.35 - t) / .05)
    saw = 2 * ((t * 110) % 1) - 1 + .6 * (2 * ((t * 116) % 1) - 1)
    return np.tanh(2 * saw) * env * .45


def click():
    t = t_(.04)
    return rng.standard_normal(len(t)) * np.exp(-t * 180) * .7


def write(path, x):
    x = x / max(1e-6, np.abs(x).max()) * .89
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


SFX = {"whoosh": whoosh, "pop": pop, "ding": ding, "hit": hit, "buzz": buzz, "click": click}

if __name__ == "__main__":
    out = ROOT / "brand/sfx"; out.mkdir(parents=True, exist_ok=True)
    for name, fn in SFX.items():
        p = out / f"{name}.wav"
        if "--force" in sys.argv or not p.exists():
            write(p, fn())
    print(" ".join(sorted(f.stem for f in out.glob("*.wav"))))
