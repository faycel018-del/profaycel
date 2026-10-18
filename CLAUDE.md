# Studio 360 — a video content studio

A studio for making short and long videos for TikTok, Instagram Reels, YouTube (Shorts and long-form) and Facebook.
The owner speaks **Tunisian Arabic**: reply in Tunisian dialect, and put technical terms in English or French.

## How we work (always follow this order)
1. **Idea** → `/video-idea`: ideas, hooks and a script. Store them in `ideas/ideas.md`, or in the project's `script.md`.
2. **Project** → `./scripts/new_project.sh <slug>`, then the raw footage goes into `projects/<date>_<slug>/raw/`.
3. **Edit** → `/video-edit`, or for everything at once: `./scripts/pipeline.sh <raw.mp4> [grade] ["vertical landscape"]`.
4. **Publish** → `/video-publish`: caption, hashtags, timing, and scheduling through Metricool when it is connected.

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
| `thumbnail.py video out.jpg --text ".." [--sub] [--at] [--size yt\|vertical]` | thumbnail with Arabic text |

The specs live in `config/platforms.json`. The brand (colors, fonts, tone) lives in `brand/brand.json`.

## Rules
- Never overwrite files in `raw/`. Intermediate work goes in `work/`, final output in `exports/`.
- Audio: -14 LUFS, true peak -1 dB. Video: yuv420p, 30fps, CRF 18.
- Subtitles: check the spelling in `*.words.json` before `style`, because Whisper gets Tunisian words wrong. Keep them out of the bottom 20% (safe zone).
- After every export, run `probe.sh` and take a frame (`ffmpeg -ss T -i f -frames:v 1 x.png`) and look at it before saying it's done.
- When writing hooks and scripts, follow `docs/viral-playbook.md`. For a shoot, give advice from `docs/lighting.md`.
- `subs.py` reverses the order of Arabic words on purpose, because libass splits bidi at tags. Don't "fix" it.

## Connectors (if connected)
- **Metricool**: post scheduling, best time to post, analytics.
- **Canva**: professional thumbnails and covers, plus a brand kit.
- **Google Drive**: store raw footage and exports, which is important because the cloud container gets deleted.
