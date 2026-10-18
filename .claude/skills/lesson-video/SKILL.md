---
name: lesson-video
description: Turn a PowerPoint lesson (pptx) into professional videos with a Tunisian-dialect voice-over. Short TikTok/Reels clips with a strong hook, plus a full "textbook correction" video for YouTube/Facebook. Use when the user gives you a lesson, a deck, a correction, or asks for a lesson video.
---
# Lesson video (pptx → video)

## 1. Prepare the frames (once per lesson)
`python3 scripts/deck_steps.py "lessons/<x>.pptx" lessons/frames/<slug>`
→ `sNN_kMM.png` = slide NN after MM clicks (each "?" opens its answer), plus `steps.json` (clicks per slide).
Read the slide text (`python3 -c` with zipfile) and look at the images before writing anything.

## 2. Write the storyboard (in `lessons/storyboards/<slug>_<type>.json`)
Format: see the top of `scripts/lesson_video.py`. Each scene = one image + what's said + an optional zoom `[cx, cy, w]`.
**Narration rules (Tunisian dialect):**
- Speak like Prof Faycel to his students: close, simple, with a light touch of humor. Short sentences (under 20 words per scene).
- Words: توا، برشا، ديما، باش، ركّز معايا، ساهلة، شوف… plus the technical terms exactly as they appear in the textbook (المسقط الرأسي، الصمام الثنائي…).
- One scene per click, and the voice explains **why** the answer is what it is, not just what it is.
- Accuracy first: every piece of information must match the slide and the textbook. When something is unclear, ask.
- Write the words fully spelled out (the TTS reads them): "ثمانية" not "8" if the reading matters.

## 3. Content types
| type | platform | length | structure |
|---|---|---|---|
| **short** (hook) | TikTok, Reels, Shorts | 30–60s | hook question/mistake (0–2s) → 3–6 key clicks → a one-sentence rule → CTA "the full correction on YouTube" |
| **full** (full correction) | YouTube, Facebook | 8–20 min | 5–8s hook → intro → each activity in order → summary → CTA |
| **quiz** | TikTok | 15–25s | question + 3s countdown → answer (pop) → "how many did you get right? write it in the comments" |

## 4. Render
- `python3 scripts/lesson_video.py <story.json> --format vertical`  (TikTok: karaoke subtitles burned in)
- `python3 scripts/lesson_video.py <story.json> --format landscape` (YouTube/FB: an `.srt` file is produced to upload as CC)
- Output goes in `projects/lessons/`. Check: `scripts/probe.sh`, plus 4–6 frames assembled with montage and looked at.
- Thumbnail: `scripts/thumbnail.py` (frame from the slide + a short hook).

## 5. The voice
`brand/brand.json → voice.provider`: `elevenlabs` (Prof Faycel's cloned voice), `azure` (ar-TN-HediNeural), `silent` (preview).
If the voice can't be produced (no key / host blocked): render a silent preview and tell the user what's missing.
