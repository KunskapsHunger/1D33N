# Transcribe Song

Transcribe a song using the whisper script and add it to the releases.

## Arguments
- $ARGUMENTS: Song name or path to audio file (e.g., "Rösten" or "public/music/Rösten.mp3")

## Workflow

### 1. Locate the audio file
- Audio files are in `public/music/`
- If only a song name is given, look for `public/music/<song name>.mp3`

### 2. Check for ground truth lyrics
- Look in `src/assets/lyrics/<song name>.txt`
- If ground truth exists, use it for the final lyrics text (whisper is bad at Swedish)
- If no ground truth exists, warn the user but continue with whisper output

### 3. Run whisper transcription
```bash
python scripts/extract_lyrics.py "public/music/<song>.mp3" --model turbo --output-ts
```

**Model**: Default to `turbo` (fast and good enough for timestamps)
**Language**: Infer from song title:
- Swedish (sv): titles with å, ä, ö or Swedish words
- English (en): otherwise
- Use `--language sv` or `--language en`

### 4. Map timestamps to ground truth
- Use whisper's timestamps but replace the text with ground truth lyrics
- Each whisper segment maps to one or more lines from ground truth
- Pay attention to the natural breaks in the lyrics

### 5. Create the track file
Create a new file at `src/data/releases/<album-folder>/<track-id>.ts`:

```typescript
import type { Track } from '../../types';

export const trackName: Track = {
  id: 'track-id',
  title: 'Track Title',
  duration: 'M:SS',
  trackNumber: N,
  audioUrl: '/music/Track.mp3',
  streamingLinks: {
    spotify: 'https://open.spotify.com/',
    apple: 'https://music.apple.com/',
    youtube: 'https://youtube.com/',
  },
  lyrics: [
    { time: 0, text: '' },
    { time: X.X, text: 'Lyric line with *emphasis* markers' },
    { time: X.X, text: 'Line with annotation', annotations: [
      { word: 'word', meaning: 'explanation' }
    ]},
  ]
};
```

### 6. Add to album index
Update `src/data/releases/<album-folder>/index.ts`:
- Import the new track
- Add it to the tracks array
- Re-export it

### 7. Lyrics formatting conventions
- Use `*asterisks*` around emphasized words
- Add `emphasis: true` for important/chorus lines
- Add `annotations` for words needing explanation
- Start with `{ time: 0, text: '' }` for empty intro

## Current album structure
- Album: `inga-skuggor-utan-ljus`
- Tracks folder: `src/data/releases/inga-skuggor-utan-ljus/`
- Ground truth: `src/assets/lyrics/`

## Notes
- Whisper often misses early vocals (before ~30s) - may need manual timestamp adjustment
- The turbo model is fastest but all models struggle with early detection
- Always verify timestamps by checking the audio
