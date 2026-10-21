"""Transcribe a video locally with faster-whisper.

Extracts mono 16kHz audio via ffmpeg, runs faster-whisper on CPU inside
an isolated venv, and writes a Scribe-compatible JSON response
to <edit_dir>/transcripts/<video_stem>.json.

This is a drop-in replacement for the ElevenLabs Scribe backend. It produces
the exact same {"words": [...]} structure with 'word' and 'spacing' types
so that pack_transcripts.py and render.py continue to work unmodified.

Usage:
    python helpers/transcribe.py <video_path>
    python helpers/transcribe.py <video_path> --edit-dir /custom/edit
    python helpers/transcribe.py <video_path> --language en
"""

from __future__ import annotations

import argparse
import json
import math
import subprocess
import sys
import tempfile
import time
import wave
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


# Hardcoded path to the isolated venv we created
VENV_PYTHON = Path.home() / ".config" / "watch" / "venv-whisper" / "Scripts" / "python.exe"


def count_audio_tracks(video_path: Path) -> int:
    """How many audio streams the container holds."""
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "a",
         "-show_entries", "stream=index", "-of", "csv=p=0", str(video_path)],
        capture_output=True, text=True,
    )
    return len([ln for ln in out.stdout.splitlines() if ln.strip()])


def extract_audio(video_path: Path, dest: Path, audio_track: int = 0) -> None:
    cmd = [
        "ffmpeg", "-y", "-i", str(video_path),
        "-map", f"0:a:{audio_track}",
        "-vn", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le",
        str(dest),
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def load_api_key() -> str:
    """Mock for backwards compatibility with transcribe_batch.py. No API key needed."""
    return "local-whisper-no-key-needed"


def transcript_path(edit_dir: Path, video: Path, audio_track: int = 0) -> Path:
    suffix = "" if audio_track == 0 else f".track{audio_track}"
    return edit_dir / "transcripts" / f"{video.stem}{suffix}.json"


def call_whisper_local(audio_path: Path, language: str | None = None) -> dict:
    """Run faster-whisper in the venv and format output to match ElevenLabs Scribe."""
    if not VENV_PYTHON.exists():
        raise RuntimeError(f"Venv Python not found at {VENV_PYTHON}. Run setup first.")

    lang_arg = f'"{language}"' if language else "None"
    
    # We ask faster-whisper for word_timestamps=True so we can build the exact Scribe format
    script = f'''
import json, sys
# Forzar UTF-8 para evitar corrupcion de acentos en Windows stdout
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from faster_whisper import WhisperModel
model = WhisperModel("small", device="cpu", compute_type="int8")

segments, info = model.transcribe(r"{audio_path}", language={lang_arg}, beam_size=5, word_timestamps=True)

words_list = []
prev_end = 0.0

for seg in segments:
    for word in seg.words:
        # If there's a gap between words, Scribe inserts a 'spacing' event
        if word.start > prev_end:
            words_list.append({{
                "type": "spacing",
                "start": round(prev_end, 3),
                "end": round(word.start, 3)
            }})
        
        words_list.append({{
            "type": "word",
            "text": word.word.strip(),
            "start": round(word.start, 3),
            "end": round(word.end, 3),
            "speaker_id": "S0" # Diarization not natively supported in basic faster-whisper
        }})
        prev_end = word.end

payload = {{"words": words_list}}
print(json.dumps(payload, ensure_ascii=False))
'''

    proc = subprocess.run(
        [str(VENV_PYTHON), "-c", script],
        capture_output=True, text=True, encoding="utf-8", errors="replace"
    )
    if proc.returncode != 0:
        raise RuntimeError(f"faster-whisper failed:\n{proc.stderr}")
    
    return json.loads(proc.stdout)


def transcribe_one(
    video: Path,
    edit_dir: Path,
    api_key: str,  # Kept for signature compatibility
    language: str | None = None,
    num_speakers: int | None = None, # Ignored, diarization not in this local build
    verbose: bool = True,
    audio_track: int = 0,
) -> Path:
    """Transcribe a single video. Returns path to transcript JSON. Cached."""
    transcripts_dir = edit_dir / "transcripts"
    transcripts_dir.mkdir(parents=True, exist_ok=True)
    out_path = transcript_path(edit_dir, video, audio_track)

    if out_path.exists():
        if verbose:
            print(f"cached: {out_path.name}")
        return out_path

    if verbose:
        print(f"  extracting audio from {video.name}", flush=True)

    t0 = time.time()
    with tempfile.TemporaryDirectory() as tmp:
        audio = Path(tmp) / f"{video.stem}.wav"
        extract_audio(video, audio, audio_track)

        if verbose:
            print(f"  transcribing local_audio.wav with faster-whisper (small model)...", flush=True)
        
        payload = call_whisper_local(audio, language)

    out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    dt = time.time() - t0

    if verbose:
        kb = out_path.stat().st_size / 1024
        print(f"  saved: {out_path.name} ({kb:.1f} KB) in {dt:.1f}s")
        if isinstance(payload, dict) and "words" in payload:
            print(f"    words: {len(payload['words'])}")

    return out_path


def main() -> None:
    ap = argparse.ArgumentParser(description="Transcribe a video locally with faster-whisper")
    ap.add_argument("video", type=Path, help="Path to video file")
    ap.add_argument(
        "--edit-dir",
        type=Path,
        default=None,
        help="Edit output directory (default: <video_parent>/edit)",
    )
    ap.add_argument(
        "--language",
        type=str,
        default=None,
        help="Optional ISO language code (e.g., 'en'). Omit to auto-detect.",
    )
    ap.add_argument(
        "--num-speakers",
        type=int,
        default=None,
        help="Ignored in local version.",
    )
    ap.add_argument(
        "--audio-track",
        type=int,
        default=0,
        help="Zero-based audio track to transcribe.",
    )
    args = ap.parse_args()

    video = args.video.resolve()
    if not video.exists():
        sys.exit(f"video not found: {video}")

    edit_dir = (args.edit_dir or (video.parent / "edit")).resolve()

    transcribe_one(
        video=video,
        edit_dir=edit_dir,
        api_key="local",
        language=args.language,
        num_speakers=args.num_speakers,
        audio_track=args.audio_track,
    )


if __name__ == "__main__":
    main()
