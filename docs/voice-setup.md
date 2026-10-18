# 🎙️ Setting up the voice (one time only)

| option | quality | cost | what's needed |
|---|---|---|---|
| **Edge TTS: ar-TN-HediNeural** ⭐ free | excellent, a natural voice (fusha with a Tunisian accent) | free, no account | just allow `speech.platform.bing.com` |
| **Piper: ar_JO-kareem** | good, fully offline | free, open source | allow `huggingface.co` (once, to download the model) |
| **ElevenLabs: clone of Prof Faycel's voice** ⭐ | the best, his own voice in Tunisian | about $5–22 a month | an account + 1–3 minutes of clean audio of his voice (from his own TikTok videos) |
| **Azure Speech: ar-TN-HediNeural** | a Tunisian voice, closer to formal Arabic | free up to 500k characters a month | an Azure account + a Speech key |

## The steps (in the environment's settings: the cloud environment menu in the session's title bar → Edit)
1. **Network access → Allowed domains:** add
   - Edge (free): `speech.platform.bing.com`
   - Piper (free): `huggingface.co`
   - ElevenLabs: `api.elevenlabs.io`
   - Azure: `westeurope.tts.speech.microsoft.com` (or your key's region)
2. **Secrets / environment variables:** add the key
   - `ELEVENLABS_API_KEY`, and put the cloned voice's `voice_id` in `brand/brand.json`
   - or `AZURE_SPEECH_KEY`
3. Open a new session, and set `voice.provider` in `brand/brand.json`.

⚠️ Never put the key in the chat or in the code.
