#!/usr/bin/env python3
"""
1D33N Lyrics Extractor
Extracts timestamped lyrics from audio files using OpenAI Whisper.

Usage:
    python scripts/extract_lyrics.py <audio_file> [--model medium] [--language sv]
    python scripts/extract_lyrics.py src/assets/music/*.mp3

Output:
    Creates a .lyrics.json file next to each audio file with timestamped lyrics.
"""

import argparse
import json
import os
import sys
from pathlib import Path

# Add project root to PATH for ffmpeg
project_root = Path(__file__).parent.parent
os.environ["PATH"] = str(project_root) + os.pathsep + os.environ.get("PATH", "")

def check_whisper():
    """Check if whisper is installed."""
    try:
        import whisper
        return whisper
    except ImportError:
        print("Error: openai-whisper not installed.")
        print("Install with: pip install openai-whisper")
        sys.exit(1)

def extract_lyrics(audio_path: str, model_name: str = "medium", language: str = "sv") -> dict:
    """Extract timestamped lyrics from an audio file."""
    import torch
    whisper = check_whisper()

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")
    print(f"Loading Whisper model '{model_name}'...")
    model = whisper.load_model(model_name, device=device)
    
    print(f"Transcribing: {audio_path}")
    result = model.transcribe(
        audio_path,
        language=language,
        word_timestamps=True,
        verbose=False
    )
    
    # Process segments into lyrics format
    lyrics = []
    for segment in result["segments"]:
        lyrics.append({
            "time": round(segment["start"], 1),
            "text": segment["text"].strip(),
            "end": round(segment["end"], 1)
        })
    
    return {
        "title": Path(audio_path).stem,
        "language": language,
        "duration": round(result["segments"][-1]["end"], 1) if result["segments"] else 0,
        "lyrics": lyrics,
        "full_text": result["text"]
    }

def format_duration(seconds: float) -> str:
    """Format seconds as MM:SS."""
    mins = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{mins}:{secs:02d}"

def to_tracks_format(data: dict) -> str:
    """Convert extracted data to TypeScript tracks.ts format."""
    title = data["title"]
    track_id = title.lower().replace(" ", "-").replace("å", "a").replace("ä", "a").replace("ö", "o")
    duration = format_duration(data["duration"])
    
    lines = []
    lines.append("  {")
    lines.append(f'    id: "{track_id}",')
    lines.append(f'    title: "{title}",')
    lines.append(f'    duration: "{duration}",')
    lines.append(f'    year: 2025,')
    lines.append(f'    lyrics: [')
    
    for lyric in data["lyrics"]:
        time = lyric["time"]
        text = lyric["text"].replace('"', '\\"')
        lines.append(f'      {{ time: {time}, text: "{text}" }},')
    
    lines.append('    ]')
    lines.append('  }')
    
    return '\n'.join(lines)

def main():
    parser = argparse.ArgumentParser(description="Extract lyrics from audio using Whisper")
    parser.add_argument("audio_files", nargs="+", help="Audio file(s) to process")
    parser.add_argument("--model", default="medium", help="Whisper model (tiny, base, small, medium, large)")
    parser.add_argument("--language", default="sv", help="Language code (default: sv for Swedish)")
    parser.add_argument("--output-json", action="store_true", help="Output JSON files")
    parser.add_argument("--output-ts", action="store_true", help="Output TypeScript format for tracks.ts")
    args = parser.parse_args()
    
    if not args.output_json and not args.output_ts:
        args.output_ts = True  # Default to TypeScript output
    
    all_tracks = []
    
    for audio_file in args.audio_files:
        if not os.path.exists(audio_file):
            print(f"Warning: File not found: {audio_file}")
            continue
            
        try:
            data = extract_lyrics(audio_file, args.model, args.language)
            all_tracks.append(data)
            
            if args.output_json:
                output_path = Path(audio_file).with_suffix(".lyrics.json")
                with open(output_path, "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                print(f"Saved: {output_path}")
            
            if args.output_ts:
                print("\n" + "=" * 60)
                print(f"TypeScript format for: {data['title']}")
                print("=" * 60)
                print(to_tracks_format(data))
                print()
                
        except Exception as e:
            print(f"Error processing {audio_file}: {e}")
            raise
    
    if args.output_ts and len(all_tracks) > 1:
        print("\n" + "=" * 60)
        print("COMBINED TRACKS ARRAY")
        print("=" * 60)
        print("export const tracks: Track[] = [")
        for data in all_tracks:
            print(to_tracks_format(data) + ",")
        print("];")

if __name__ == "__main__":
    main()
