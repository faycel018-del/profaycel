---
name: video-publish
description: Prepare a video for publishing and schedule it: captions per platform, hashtags, titles, best time, and scheduling through Metricool. Use when the user asks for a caption, a title, hashtags, publishing, scheduling, or performance analysis.
---
# Publishing

1. For each platform, write a version that fits it:
   - **TikTok**: short caption plus a question that gets people commenting, 3–5 hashtags (mixing niche and broad)
   - **Reels**: hook in the first line, then value, CTA (save/share), 3–5 hashtags
   - **Shorts**: a title under 60 characters with a keyword + #shorts
   - **YouTube long-form**: 3 title options, a description with chapters (timestamps), tags, and a thumbnail idea
   - **Facebook**: a slightly longer, story-style caption, with no long hashtag lists
2. **Timing**: if Metricool is connected → `getBestTimeToPostByNetwork`. Otherwise, the defaults in `docs/viral-playbook.md`.
3. **Scheduling**: Metricool `createScheduledPost`. **Always confirm with the user first** (platforms, time, text), because publishing is public.
4. **Analytics**: Metricool `getAnalyticsDataByMetrics` → which formats/hooks won, and what to repeat next week.
5. **Thumbnails/covers through Canva** if it is connected (the brand kit), or `scripts/thumbnail.py`.
