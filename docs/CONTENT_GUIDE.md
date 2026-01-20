# 1D33N Content Management Guide

This guide explains how to add, update, and manage music content on the site.

## File Structure

```
src/
├── data/
│   └── tracks.ts          # All release and track data
├── assets/
│   └── lyrics/            # Raw lyrics text files (ground truth)
public/
├── music/                 # MP3 audio files
├── videos/                # MP4 looping background videos
├── covers/                # Album/single cover art
└── snippets/              # Short audio previews for unreleased tracks
scripts/
└── extract_lyrics.py      # Whisper-based lyrics extraction tool
```

## Adding a New Track

### 1. Prepare Audio Files

Place your files in the `public/` directory:

```
public/music/TrackName.mp3       # Full audio file
public/videos/TrackName.mp4      # Optional: looping background video
public/covers/release-name.jpg   # Cover art (square, min 500x500px)
```

### 2. Extract Timestamped Lyrics

Use the Whisper script to generate initial timestamps:

```bash
python scripts/extract_lyrics.py "public/music/TrackName.mp3" --model large --output-json
```

This creates `public/music/TrackName.lyrics.json` with timestamped segments.

### 3. Correct Lyrics with Ground Truth

1. Create/update `src/assets/lyrics/trackname.txt` with the correct lyrics
2. Compare Whisper output against the ground truth
3. Use Whisper timestamps but replace text with correct lyrics

### 4. Add Track to tracks.ts

Edit `src/data/tracks.ts` and add the track to the appropriate release:

```typescript
{
  id: 'track-name',           // Unique ID (lowercase, hyphenated)
  title: 'Track Name',        // Display title
  duration: '3:45',           // Format: M:SS
  trackNumber: 1,             // Position in release
  audioUrl: '/music/TrackName.mp3',
  videoUrl: '/videos/TrackName.mp4',  // Optional
  streamingLinks: {
    spotify: 'https://open.spotify.com/track/...',
    apple: 'https://music.apple.com/...',
    youtube: 'https://youtube.com/watch?v=...',
  },
  lyrics: [
    { time: 0, text: '' },    // Empty line for intro
    { time: 12.5, text: 'First line of lyrics' },
    { time: 15.3, text: 'Second line with *emphasis*', emphasis: true },
    // ...
  ]
}
```

## Lyrics Formatting

### Basic Format

Each lyric line has:
- `time`: Start time in seconds (decimal)
- `text`: The lyric text
- `emphasis`: Optional boolean for visual emphasis

### Word Emphasis

Wrap words in asterisks for visual highlighting:

```typescript
{ time: 24.4, text: 'Men om natten sveper *mörkret* in över staden' }
```

### Annotations (Hover Tooltips)

Add explanations for specific words:

```typescript
{
  time: 86.4,
  text: 'Jag måste vara *Sisyfos bror*',
  emphasis: true,
  annotations: [
    {
      word: 'Sisyfos',
      meaning: 'Kung som dömdes att rulla en sten upp för ett berg i evighet'
    }
  ]
}
```

The annotated word must be wrapped in asterisks in the text.

### Empty Lines

Use empty text for instrumental sections or pauses:

```typescript
{ time: 0, text: '' },      // Intro
{ time: 45.0, text: '' },   // Instrumental break
```

## Adding a New Release

### Release Types

- `'album'` - Full album
- `'ep'` - Extended play (3-6 tracks)
- `'single'` - Single track release

### Basic Release Structure

```typescript
{
  id: 'release-name',
  title: 'Release Title',
  type: 'album',              // 'album' | 'ep' | 'single'
  year: 2025,
  coverArt: '/covers/release-name.jpg',
  description: 'Optional description text.',
  tracks: [
    // Track objects here
  ]
}
```

## Staged/Upcoming Releases

For releases that aren't out yet, use the staged reveal system:

```typescript
{
  id: 'upcoming-release',
  title: 'Future Album',
  type: 'album',
  year: 2026,
  coverArt: '/covers/future-album.jpg',
  coverArtBlurred: '/covers/future-album-blur.jpg',  // Optional blurred version
  description: 'Coming soon...',

  // Staged release fields
  releaseDate: '2026-06-15T00:00:00',  // ISO date for countdown
  revealStage: 'tracklist',             // Current reveal stage
  revealedTrackCount: 2,                // How many track titles to show
  announcement: 'Något nytt är på väg...',

  tracks: [
    // Include all tracks, hidden ones will be masked as "???"
  ]
}
```

### Reveal Stages

Progress through stages as release date approaches:

| Stage | Cover | Track Titles | Snippets | Full Audio |
|-------|-------|--------------|----------|------------|
| `'announced'` | Hidden/Blurred | Hidden | No | No |
| `'cover'` | Visible | Hidden | No | No |
| `'tracklist'` | Visible | Partial (use `revealedTrackCount`) | No | No |
| `'snippets'` | Visible | All | Yes | No |
| `'released'` | Visible | All | N/A | Yes |

### Audio Snippets

For pre-release teasers:

```typescript
{
  id: 'upcoming-track',
  title: 'New Song',
  duration: '3:45',
  snippetUrl: '/snippets/new-song-preview.mp3',  // 15-30 second preview
  snippetDuration: 30,
  // No audioUrl until released
}
```

## Streaming-Only Tracks

For tracks only available on external platforms (not playable on site):

```typescript
{
  id: 'streaming-track',
  title: 'External Track',
  duration: '4:00',
  // No audioUrl - makes it non-playable on site
  streamingLinks: {
    spotify: 'https://open.spotify.com/track/...',
    apple: 'https://music.apple.com/...',
  },
  lyrics: [
    { time: 0, text: '[Endast tillgänglig på streaming]' }
  ]
}
```

## Helper Functions

Available in `tracks.ts`:

```typescript
// Get all tracks across all releases
getAllTracks()

// Get only tracks with audioUrl (playable on site)
getPlayableTracks()

// Find track by ID
getTrackById('track-id')

// Get releases with countdown (not yet released)
getUpcomingReleases()

// Get fully released releases
getReleasedReleases()

// Check if release has active countdown
hasCountdown(release)

// Get visible tracks based on reveal stage
getVisibleTracks(release)

// Check if snippets are available
hasSnippets(release)
```

## Checklist for New Release

- [ ] Audio file in `public/music/`
- [ ] Cover art in `public/covers/`
- [ ] Optional: Background video in `public/videos/`
- [ ] Ground truth lyrics in `src/assets/lyrics/`
- [ ] Run Whisper extraction for timestamps
- [ ] Correct lyrics against ground truth
- [ ] Add release/track to `src/data/tracks.ts`
- [ ] Add annotations for notable references
- [ ] Update streaming links when available
- [ ] Run `npm run build` to verify no errors

## Tips

1. **Timing**: Whisper timestamps are usually accurate. Fine-tune by playing the track and adjusting times that feel off.

2. **Emphasis**: Use `emphasis: true` sparingly on choruses or impactful lines.

3. **Annotations**: Great for literary references, slang, or wordplay that adds meaning.

4. **Cover Art**: Use square images (1:1 ratio) for best display.

5. **Videos**: Looping MP4s work like Spotify Canvas - keep them 5-15 seconds, seamless loop.
