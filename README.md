# 🎬 Studio 360 — استوديو المحتوى

استوديو كامل في Claude Code: من الفكرة → السكريبت → التصوير → المونتاج → النشر على TikTok · Reels · Shorts · YouTube · Facebook.

## البداية السريعة
```bash
./scripts/new_project.sh "اسم-الفيديو"          # يعمل مشروع جديد
# حط الفيديو الخام في projects/<...>/raw/
./scripts/pipeline.sh projects/<...>/raw/video.mp4 warm "vertical landscape" ar
```
ولا ببساطة احكي مع كلود: *"عندي فيديو، اعملو reel بسبتيتل و grade سينمائي"*.

## الأوامر في كلود
- `/video-idea` — أفكار، hooks، سكريبت كامل
- `/video-edit` — المونتاج الكامل
- `/video-publish` — كابشن، هاشتاغ، جدولة

## المحتوى
- `docs/lighting.md` — الإضاءة، الكاميرا، الصوت
- `docs/viral-playbook.md` — hooks، retention، formats، فرق المنصات
- `config/platforms.json` — مقاسات كل منصة
- `brand/` — هويتك (ألوان، خطوط، لوغو، LUTs، موسيقى)
