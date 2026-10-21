---
name: whisper-transcribe
description: Transcribe any video or audio file (MP4, MKV, MOV, WEBM, MP3, WAV, M4A) or online video URL into clean, timestamped text using local OpenAI Whisper and FFmpeg. Solves the limitation where Claude, Codex, and other LLMs cannot natively listen to video audio tracks. Use whenever asked to "listen to a video", "transcribe audio", "extract speech from video", or analyze what is said in a multimedia file.
license: MIT
metadata:
  version: "1.0.0"
  author: "MiProyectoAI Team"
---

# Whisper Transcribe: Audio & Video Speech-to-Text

Enables AI agents to "hear" what is spoken in video and audio files by generating verbatim transcripts with exact minute/second timestamps (`[00:15 - 00:22]`).

## Why this skill is necessary

LLMs like Claude (Sonnet, Opus) and Codex are multimodal only for **text and visual frames**. When given a video file, they extract visual images and read on-screen text, but **discard the raw audio track**. 

This skill bridges the gap: it extracts the audio with `ffmpeg`, transcribes it locally using OpenAI's **Whisper** model, and provides the full speech breakdown to the agent.

---

## Quick Usage for Agents

When a user asks:
- *"¿Qué dice este vídeo?"*
- *"Transcribe este archivo de audio/vídeo"*
- *"Analiza lo que hablan en este clip"*

### 1. Execute the transcription script
```bash
python .agents/skills/whisper-transcribe/scripts/transcribe.py "ruta/al/video.mp4"
```

For Spanish videos (faster & more accurate):
```bash
python .agents/skills/whisper-transcribe/scripts/transcribe.py "ruta/al/video.mp4" --language es
```

For online videos (YouTube, Twitter, TikTok):
```bash
python .agents/skills/whisper-transcribe/scripts/transcribe.py "https://www.youtube.com/watch?v=..." --language es
```

### 2. Output generated
The script automatically produces:
1. `<nombre_video>_transcript.md`: Markdown document with continuous text and timestamped segments (`[MM:SS - MM:SS]`).
2. `<nombre_video>_transcript.txt`: Plain raw text.

The agent reads this file and answers the user's questions with complete knowledge of what was said in the audio.

---

## Model Selection

Pass `--model <nombre>` according to speed vs. accuracy requirements:
- `base` (default): Ultra-fast (<10s for typical clips), very accurate for clear speech.
- `small`: Higher accuracy for noisy environments or fast speech.
- `turbo` / `medium`: Maximum accuracy for multiple overlapping speakers or technical jargon.
- `tiny`: Lightest and fastest for low-resource environments.

---

## Guardrails
- **100% Local & Free:** Runs on the machine using local Python and `ffmpeg`. No paid external API calls.
- **Privacy:** Audio and transcripts remain completely local on the user's machine.
