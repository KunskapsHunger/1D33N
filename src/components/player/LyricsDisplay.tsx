import { useRef, useEffect, useCallback, useState } from 'react';
import { LyricLine, LyricAnnotation } from '../../data/tracks';

interface LyricsDisplayProps {
  lyrics: LyricLine[];
  currentTime: number;
  bassLevel: number;
  glitchTrigger: boolean;
  onSeekTo: (time: number) => void;
  onLineChange?: (prevIndex: number, currentIndex: number, lineElement: HTMLElement | null) => void;
  onAnnotationClick?: (wikiId: string) => void;
}

interface AnnotatedWordProps {
  word: string;
  annotation: LyricAnnotation;
  onWikiClick?: (wikiId: string) => void;
}

function AnnotatedWord({ word, annotation, onWikiClick }: AnnotatedWordProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const hasWiki = !!annotation.wikiId;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasWiki && onWikiClick) {
      onWikiClick(annotation.wikiId!);
    }
  };

  return (
    <span
      className={`word-emphasis word-annotated ${hasWiki ? 'word-has-wiki' : ''}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={handleClick}
    >
      {word}
      {showTooltip && (
        <span className="word-tooltip">
          <span className="word-tooltip-content">
            {annotation.meaning}
            {hasWiki && <span className="word-tooltip-more">Klicka för mer</span>}
          </span>
        </span>
      )}
    </span>
  );
}

function renderLyricText(
  text: string,
  annotations?: LyricAnnotation[],
  onWikiClick?: (wikiId: string) => void
) {
  if (!text) return '\u00A0';
  const parts = text.split(/(\*[^*]+\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      const word = part.slice(1, -1);
      // Check if this word has an annotation
      const annotation = annotations?.find(a => a.word.toLowerCase() === word.toLowerCase());

      if (annotation) {
        return <AnnotatedWord key={i} word={word} annotation={annotation} onWikiClick={onWikiClick} />;
      }

      return (
        <span key={i} className="word-emphasis">
          {word}
        </span>
      );
    }
    return part;
  });
}

export default function LyricsDisplay({
  lyrics,
  currentTime,
  bassLevel,
  glitchTrigger,
  onSeekTo,
  onLineChange,
  onAnnotationClick,
}: LyricsDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevLineIndexRef = useRef<number>(-1);

  const getCurrentLineIndex = useCallback(() => {
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i].time) {
        return i;
      }
    }
    return 0;
  }, [currentTime, lyrics]);

  const currentLineIndex = getCurrentLineIndex();

  // Handle scrolling and line change callbacks
  useEffect(() => {
    const container = containerRef.current;
    if (container && container.children[currentLineIndex]) {
      const currentLine = container.children[currentLineIndex] as HTMLElement;
      currentLine.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }

    // Notify parent of line change for particle effects
    if (prevLineIndexRef.current !== -1 && currentLineIndex > prevLineIndexRef.current) {
      const prevLine = container?.children[prevLineIndexRef.current] as HTMLElement | null;
      onLineChange?.(prevLineIndexRef.current, currentLineIndex, prevLine);
    }
    prevLineIndexRef.current = currentLineIndex;
  }, [currentLineIndex, onLineChange]);

  // Reset on lyrics change
  useEffect(() => {
    prevLineIndexRef.current = -1;
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [lyrics]);

  return (
    <div className="lyrics-content" ref={containerRef}>
      {lyrics.map((line, index) => {
        const isActive = index === currentLineIndex;
        const isPast = index < currentLineIndex;
        let lineClass = 'lyrics-line';
        if (isActive) lineClass += ' active';
        if (isPast) lineClass += ' past';
        if (line.emphasis) lineClass += ' emphasis';
        if (isActive && glitchTrigger) lineClass += ' glitch-pulse';

        const bassScale = isActive ? 1 + bassLevel * 0.08 : 1;

        return (
          <div
            key={index}
            className={lineClass}
            onClick={() => onSeekTo(line.time)}
            style={isActive ? { transform: `scale(${bassScale})` } : undefined}
          >
            {renderLyricText(line.text, line.annotations, onAnnotationClick)}
          </div>
        );
      })}
    </div>
  );
}
