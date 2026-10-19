# Studio 360 — a video content studio

A studio for making short and long videos for TikTok, Instagram Reels, YouTube (Shorts and long-form) and Facebook.
The owner speaks **Tunisian Arabic**: reply in Tunisian dialect, and put technical terms in English or French.

## New session
The container starts empty: run `./scripts/setup.sh` first (libraries + voice and Whisper models from GitHub).
The studio lives in the `studio` branch of `faycel018-del/profaycel`. The lessons (pptx) are in the `lesson-decks` branch → `lessons/`.

## How we work (always follow this order)
1. **Idea** → `/video-idea`: ideas, hooks and a script. Store them in `ideas/ideas.md`, or in the project's `script.md`.
2. **Lessons (pptx)** → `/lesson-video`.
3. **Project** → `./scripts/new_project.sh <slug>`, then the raw footage goes into `projects/<date>_<slug>/raw/`.
4. **Edit** → `/video-edit`, or for everything at once: `./scripts/pipeline.sh <raw.mp4> [grade] ["vertical landscape"]`.
5. **Publish** → `/video-publish`: caption, hashtags, timing, and scheduling through Metricool when it is connected.

## Tools (scripts/)
| script | what it does |
|---|---|
| `probe.sh f` | video facts plus loudness. **Run it first on any new video** |
| `clean_audio.sh in out [light\|strong]` | noise removal, EQ, compression, -14 LUFS (2-pass) |
| `cut_silence.py in out [--db -35 --min 0.45 --pad 0.12]` | jump cuts that remove silences |
| `grade.sh in out <clean\|warm\|cinematic\|moody\|vivid\|bw\|x.cube>` | color grade |
| `music.sh video music out [vol]` | music with ducking under the voice |
| `export.sh in <vertical\|portrait\|square\|landscape\|all> [blur\|crop\|fit]` | export to platform specs (H.264, AAC, faststart) |
| `subs.py transcribe/style/from-srt/burn` | animated subtitles with word highlighting (Arabic OK) |
| `deck_steps.py deck.pptx outdir` | PowerPoint → one image per click (the answers appear) |
| `tts.py "text" out.mp3` | voice-over (piper / edge / elevenlabs / azure / silent) + word timings |
| `lesson_video.py story.json --format vertical\|landscape` | full lesson video: zoom, sounds, intro/outro, subtitles |
| `motion_video.py story.json` | **motion design**: HTML page (motion/) + voice + sounds + music → mp4 |
| `asr.py audio` | local Whisper speech recognition: to check the voice |
| `thumbnail.py video out.jpg --text ".." [--sub] [--at] [--size yt\|vertical]` | thumbnail with Arabic text |

The specs live in `config/platforms.json`. The brand (colors, fonts, tone) lives in `brand/brand.json`.

## Rules
- Never overwrite files in `raw/`. Intermediate work goes in `work/`, final output in `exports/`.
- Audio: -14 LUFS, true peak -1 dB. Video: yuv420p, 30fps, CRF 18.
- Subtitles: check the spelling in `*.words.json` before `style`, because Whisper gets Tunisian words wrong. Keep them out of the bottom 20% (safe zone).
- After every export, run `probe.sh` and take a frame (`ffmpeg -ss T -i f -frames:v 1 x.png`) and look at it before saying it's done.
- When writing hooks and scripts, follow `docs/viral-playbook.md`. For a shoot, give advice from `docs/lighting.md`.
- Arabic subtitles: use `subs.py overlay` (Pillow). libass gets the word order wrong when the colors change inside a line.
- Lessons (pptx): follow `/lesson-video`. Lessons live in `lessons/`, storyboards in `lessons/storyboards/`.
- The voice: `docs/voice-setup.md`. Keys only come from environment variables.

## Production standards (agreed with Prof Faycel)
- **Never deliver a video without a voice.** The voice: `piper` (free, works now) or `edge` (better, once speech.platform.bing.com is allowed).
- **The font:** Cairo (Black for headings, ExtraBold/Bold for body text) from `brand/fonts/`. Never DejaVu.
- **The look:** the brand's blue gradient (#1F2C9C → #0B1350), yellow #FFC928, white, rounded pills, light grid in the background.
- **Don't copy the textbook slides as they are:** use them as reference for the content, and design the scenes yourself in `motion/<name>/index.html`
  (CSS/3D/SVG) → `scripts/motion_video.py`. Reference example: `motion/tiktok1/`.
- Strong hook in the first 2s, a visual change every 2–4s, sound effects on every appearance, karaoke subtitles, a progress bar, a clear CTA.
- Before delivery: `scripts/asr.py` on the video (check the pronunciation) + 6 frames assembled with montage and looked at.

## Content strategy (Prof Faycel, @profaycel)
- **TikTok/Reels:** a hook short from each lesson ("the mistake that trips up a lot of students"), a challenge, a quiz. No talk that sounds like an ad.
- **YouTube/Facebook:** "the full textbook correction", one lesson per video, with chapters, organized in playlists by year (7th, 8th, 9th grade).
- Every short points to the full correction, and the full correction points to the website/app and the courses.

## Connectors (if connected)
- **Metricool**: post scheduling, best time to post, analytics.
- **Canva**: professional thumbnails and covers, plus a brand kit.
- **Google Drive**: store raw footage and exports, which is important because the cloud container gets deleted.
