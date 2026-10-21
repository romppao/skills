#!/usr/bin/env python3
"""
whisper-transcribe: Transcribe local video/audio files or URLs into clean, timestamped text.
Works seamlessly across Windows, Linux, and macOS with UTF-8 encoding.
"""

import sys
import os
import argparse
import subprocess
from pathlib import Path

# Fix Windows console UTF-8 output
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

def format_timestamp(seconds: float) -> str:
    """Format seconds into HH:MM:SS or MM:SS string."""
    mins, secs = divmod(int(seconds), 60)
    hours, mins = divmod(mins, 60)
    if hours > 0:
        return f"{hours:02d}:{mins:02d}:{secs:02d}"
    return f"{mins:02d}:{secs:02d}"

def download_audio_from_url(url: str, output_dir: Path) -> Path:
    """Download audio from YouTube/Twitter/web video using yt-dlp."""
    output_template = str(output_dir / "%(id)s.%(ext)s")
    cmd = [
        "yt-dlp",
        "-x",
        "--audio-format", "mp3",
        "-o", output_template,
        url
    ]
    print(f"[whisper-transcribe] Downloading audio from {url}...", file=sys.stderr)
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"yt-dlp failed: {result.stderr}")
    
    # Find downloaded mp3
    for f in output_dir.glob("*.mp3"):
        return f
    raise FileNotFoundError("Could not locate downloaded audio file.")

def transcribe(
    input_path: str,
    model_name: str = "base",
    language: str = None,
    output_dir: str = None,
    output_format: str = "both"
):
    import whisper

    input_str = str(input_path).strip()
    is_url = input_str.startswith("http://") or input_str.startswith("https://")
    
    temp_dir = None
    if is_url:
        import tempfile
        temp_dir = tempfile.TemporaryDirectory()
        audio_file = download_audio_from_url(input_str, Path(temp_dir.name))
    else:
        audio_file = Path(input_str)
        if not audio_file.exists():
            raise FileNotFoundError(f"Input file not found: {audio_file}")

    print(f"[whisper-transcribe] Loading Whisper model '{model_name}'...", file=sys.stderr)
    model = whisper.load_model(model_name)

    print(f"[whisper-transcribe] Transcribing audio from {audio_file.name}...", file=sys.stderr)
    transcribe_options = {"verbose": False}
    if language:
        transcribe_options["language"] = language

    result = model.transcribe(str(audio_file), **transcribe_options)
    
    detected_lang = result.get("language", "unknown")
    text = result.get("text", "").strip()
    segments = result.get("segments", [])

    # Prepare outputs
    if output_dir:
        out_path = Path(output_dir)
        out_path.mkdir(parents=True, exist_ok=True)
    else:
        out_path = audio_file.parent if not is_url else Path.cwd()

    base_name = audio_file.stem
    txt_file = out_path / f"{base_name}_transcript.txt"
    srt_file = out_path / f"{base_name}_transcript.srt"
    md_file = out_path / f"{base_name}_transcript.md"

    # Save Markdown with timestamps
    md_lines = [
        f"# Transcripción de Audio / Vídeo: {audio_file.name}",
        f"- **Idioma detectado:** {detected_lang}",
        f"- **Modelo Whisper:** {model_name}",
        "",
        "## Texto Completo (Continuo)",
        text,
        "",
        "## Desglose por Marcas de Tiempo",
    ]
    for seg in segments:
        start_str = format_timestamp(seg["start"])
        end_str = format_timestamp(seg["end"])
        seg_text = seg["text"].strip()
        md_lines.append(f"- `[{start_str} - {end_str}]` {seg_text}")

    md_content = "\n".join(md_lines)
    with open(md_file, "w", encoding="utf-8") as f:
        f.write(md_content)

    # Save plain text
    with open(txt_file, "w", encoding="utf-8") as f:
        f.write(text)

    # Print summary to stdout for the calling agent
    print(f"\n=== TRANSCRIPCIÓN COMPLETADA [{detected_lang.upper()}] ===")
    print(f"Archivo guardado: {md_file.resolve()}\n")
    print(md_content)

    if temp_dir:
        temp_dir.cleanup()

    return md_file

def main():
    parser = argparse.ArgumentParser(
        description="Whisper Transcribe: Transcribe local video/audio files or URLs for AI agents."
    )
    parser.add_argument("input", help="Path to video/audio file or URL (YouTube, Twitter, etc.)")
    parser.add_argument(
        "--model",
        default="base",
        choices=["tiny", "base", "small", "medium", "turbo", "large"],
        help="Whisper model size (default: base, fast and accurate for most tasks)."
    )
    parser.add_argument(
        "--language",
        default=None,
        help="Audio language code (e.g. 'es', 'en', 'fr'). If not specified, auto-detected."
    )
    parser.add_argument(
        "--output-dir",
        default=None,
        help="Directory to save transcript files (default: same as input file)."
    )

    args = parser.parse_args()
    try:
        transcribe(
            input_path=args.input,
            model_name=args.model,
            language=args.language,
            output_dir=args.output_dir
        )
    except Exception as e:
        print(f"[Error] {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
