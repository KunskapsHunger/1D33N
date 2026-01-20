import { useState, useRef, useCallback } from 'react';
import { Track, Release, releases } from '../data/tracks';
import './LyricsReader.css';

interface LyricsReaderProps {
  onClose: () => void;
  initialTrack?: Track;
}

function renderPlainText(text: string): string {
  return text.replace(/\*/g, '');
}

function renderLyricText(text: string) {
  if (!text) return '\u00A0';
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <span key={i} className="reader-emphasis">
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
}

type ReaderMode = 'image' | 'copy';

export default function LyricsReader({ onClose, initialTrack }: LyricsReaderProps) {
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(
    initialTrack ? releases.find(r => r.tracks.some(t => t.id === initialTrack.id)) || null : null
  );
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(initialTrack || null);
  const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<ReaderMode>('image');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const toggleLineSelection = useCallback((index: number) => {
    setSelectedLines(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedLines(new Set());
  }, []);

  const generateImage = useCallback(async () => {
    if (!selectedTrack || !canvasRef.current || selectedLines.size === 0) return;

    // Get selected lines in order
    const sortedIndices = Array.from(selectedLines).sort((a, b) => a - b);
    const selectedLyrics = sortedIndices
      .map(i => selectedTrack.lyrics[i])
      .filter(line => line && line.text);

    if (selectedLyrics.length === 0) return;

    setIsGenerating(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for Instagram story (1080x1920) aspect ratio, scaled down
    const scale = 0.5;
    canvas.width = 1080 * scale;
    canvas.height = 1920 * scale;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(0.5, '#141414');
    gradient.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle noise texture (simulated)
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 1;

    // Prepare all lines with word wrapping
    const maxWidth = canvas.width * 0.8;
    const fontSize = Math.max(14, Math.min(28, 32 - selectedLyrics.length * 2)) * scale;
    const lineSpacing = fontSize * 1.8;
    const verseSpacing = fontSize * 2.4;

    ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
    ctx.fillStyle = '#f5f5f5';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Process all lyrics and wrap text
    const allWrappedLines: { text: string; isNewVerse: boolean }[] = [];

    selectedLyrics.forEach((lyric, lyricIndex) => {
      const text = renderPlainText(lyric.text);
      const words = text.split(' ');
      let currentLine = '';
      let isFirst = true;

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          allWrappedLines.push({
            text: currentLine,
            isNewVerse: isFirst && lyricIndex > 0,
          });
          currentLine = word;
          isFirst = false;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        allWrappedLines.push({
          text: currentLine,
          isNewVerse: isFirst && lyricIndex > 0,
        });
      }
    });

    // Calculate total height and starting Y
    let totalHeight = 0;
    allWrappedLines.forEach((line, i) => {
      if (i > 0) {
        totalHeight += line.isNewVerse ? verseSpacing : lineSpacing;
      }
    });

    let currentY = canvas.height * 0.5 - totalHeight / 2;

    // Draw all lines (centered)
    allWrappedLines.forEach((line, i) => {
      if (i > 0) {
        currentY += line.isNewVerse ? verseSpacing : lineSpacing;
      }
      ctx.fillText(line.text, canvas.width / 2, currentY);
    });

    // Red accent lines on sides
    const accentHeight = Math.min(canvas.height * 0.35, totalHeight + 80);
    const accentY = canvas.height * 0.5 - accentHeight / 2;
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(canvas.width * 0.06, accentY, 3, accentHeight);
    ctx.fillRect(canvas.width * 0.94 - 3, accentY, 3, accentHeight);

    // Artist name
    ctx.font = `${14 * scale}px "JetBrains Mono", monospace`;
    ctx.fillStyle = '#dc2626';
    ctx.textAlign = 'center';
    ctx.fillText('1D33N', canvas.width / 2, canvas.height * 0.88);

    // Track title
    ctx.font = `${12 * scale}px "Space Grotesk", sans-serif`;
    ctx.fillStyle = '#a0a0a0';
    ctx.fillText(`— ${selectedTrack.title} —`, canvas.width / 2, canvas.height * 0.91);

    // Glitch effect lines
    ctx.fillStyle = 'rgba(220, 38, 38, 0.3)';
    ctx.fillRect(0, canvas.height * 0.2, canvas.width, 2);
    ctx.fillRect(0, canvas.height * 0.8, canvas.width, 1);

    // Generate image URL
    const imageUrl = canvas.toDataURL('image/png');
    setGeneratedImage(imageUrl);
    setIsGenerating(false);
  }, [selectedTrack, selectedLines]);

  const downloadImage = useCallback(() => {
    if (!generatedImage || !selectedTrack) return;

    const link = document.createElement('a');
    link.download = `1D33N-${selectedTrack.title}-lyric.png`;
    link.href = generatedImage;
    link.click();
  }, [generatedImage, selectedTrack]);

  const shareImage = useCallback(async () => {
    if (!generatedImage || !selectedTrack) return;

    // Convert base64 to blob
    const response = await fetch(generatedImage);
    const blob = await response.blob();
    const file = new File([blob], `1D33N-${selectedTrack.title}-lyric.png`, { type: 'image/png' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `${selectedTrack.title} - 1D33N`,
          text: 'Check out this lyric from 1D33N',
        });
      } catch {
        // User cancelled or error, fallback to download
        downloadImage();
      }
    } else {
      // Fallback to download
      downloadImage();
    }
  }, [generatedImage, selectedTrack, downloadImage]);

  const closePreview = useCallback(() => {
    setGeneratedImage(null);
  }, []);

  const handleTrackSelect = useCallback((track: Track) => {
    setSelectedTrack(track);
    setSelectedLines(new Set());
  }, []);

  return (
    <div className="lyrics-reader">
      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Close button */}
      <button className="reader-close" onClick={onClose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Header */}
      <header className="reader-header">
        <h1 className="reader-title">TEXTER</h1>
        <p className="reader-subtitle">Valj en eller flera rader</p>

        {/* Mode toggle */}
        <div className="reader-mode-toggle">
          <button
            className={`reader-mode-btn ${mode === 'image' ? 'active' : ''}`}
            onClick={() => setMode('image')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            Skapa bild
          </button>
          <button
            className={`reader-mode-btn ${mode === 'copy' ? 'active' : ''}`}
            onClick={() => setMode('copy')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            Kopiera text
          </button>
        </div>
      </header>

      <div className="reader-layout">
        {/* Sidebar - Release/Track selection */}
        <aside className="reader-sidebar">
          <div className="reader-releases">
            {releases.map(release => (
              <div key={release.id} className="reader-release">
                <button
                  className={`reader-release-btn ${selectedRelease?.id === release.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedRelease(release);
                    setSelectedTrack(null);
                    setSelectedLines(new Set());
                  }}
                >
                  <span className="reader-release-type">{release.type.toUpperCase()}</span>
                  <span className="reader-release-title">{release.title}</span>
                  <span className="reader-release-year">{release.year}</span>
                </button>

                {selectedRelease?.id === release.id && (
                  <div className="reader-tracks">
                    {release.tracks.map(track => (
                      <button
                        key={track.id}
                        className={`reader-track-btn ${selectedTrack?.id === track.id ? 'active' : ''}`}
                        onClick={() => handleTrackSelect(track)}
                      >
                        {track.trackNumber && (
                          <span className="reader-track-num">{track.trackNumber}.</span>
                        )}
                        <span className="reader-track-title">{track.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main content - Lyrics */}
        <main className="reader-content">
          {selectedTrack ? (
            <>
              <div className="reader-track-header">
                <h2 className="reader-current-track">{selectedTrack.title}</h2>
                {selectedRelease && (
                  <span className="reader-current-release">{selectedRelease.title}</span>
                )}
              </div>

              {mode === 'image' ? (
                <div className="reader-lyrics">
                  {selectedTrack.lyrics.map((line, index) => (
                    <button
                      key={index}
                      className={`reader-line ${line.emphasis ? 'emphasis' : ''} ${selectedLines.has(index) ? 'selected' : ''}`}
                      onClick={() => line.text && toggleLineSelection(index)}
                      disabled={!line.text || isGenerating}
                    >
                      {selectedLines.has(index) && (
                        <span className="reader-line-number">{Array.from(selectedLines).sort((a, b) => a - b).indexOf(index) + 1}</span>
                      )}
                      {line.text ? renderLyricText(line.text) : <span className="reader-line-empty" />}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="reader-lyrics reader-lyrics-selectable">
                  {selectedTrack.lyrics.map((line, index) => (
                    <p
                      key={index}
                      className={`reader-line-text ${line.emphasis ? 'emphasis' : ''}`}
                    >
                      {line.text ? renderPlainText(line.text) : '\u00A0'}
                    </p>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="reader-empty">
              <div className="reader-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12h6M9 16h6M5 8h14M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                </svg>
              </div>
              <p>Valj en lat for att lasa texterna</p>
            </div>
          )}
        </main>
      </div>

      {/* Selection action bar - only in image mode */}
      {mode === 'image' && selectedLines.size > 0 && (
        <div className="reader-action-bar">
          <div className="reader-action-info">
            <span className="reader-action-count">{selectedLines.size}</span>
            <span className="reader-action-label">
              {selectedLines.size === 1 ? 'rad vald' : 'rader valda'}
            </span>
          </div>
          <div className="reader-action-buttons">
            <button className="reader-btn reader-btn-ghost" onClick={clearSelection}>
              Rensa
            </button>
            <button
              className="reader-btn reader-btn-primary"
              onClick={generateImage}
              disabled={isGenerating}
            >
              {isGenerating ? 'Skapar...' : 'Skapa bild'}
            </button>
          </div>
        </div>
      )}

      {/* Image preview modal */}
      {generatedImage && (
        <div className="reader-preview-overlay" onClick={closePreview}>
          <div className="reader-preview" onClick={e => e.stopPropagation()}>
            <button className="reader-preview-close" onClick={closePreview}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <img src={generatedImage} alt="Generated lyric" className="reader-preview-image" />

            <div className="reader-preview-actions">
              <button className="reader-btn reader-btn-secondary" onClick={downloadImage}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Ladda ner
              </button>
              <button className="reader-btn reader-btn-primary" onClick={shareImage}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                </svg>
                Dela
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
