import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Track, getTrackById } from '../data/releases';
import { PlayerControls, PlayerEffects, LyricsDisplay, AudioVisualizers } from './player';
import { WikiPanel } from './wiki';
import { useAudioAnalyser } from '../hooks';
import './LyricsPlayer.css';

interface LyricsPlayerProps {
  tracks: Track[];
  currentIndex: number;
  onClose: () => void;
  onTrackChange: (index: number) => void;
}

export default function LyricsPlayer({
  tracks,
  currentIndex,
  onClose,
  onTrackChange,
}: LyricsPlayerProps) {
  const track = tracks[currentIndex];

  // Get album cover art for video fallback
  const coverArt = useMemo(() => {
    const result = getTrackById(track.id);
    return result?.release.coverArt;
  }, [track.id]);

  // Audio state
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  // UI state
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; char: string }[]>([]);

  // Wiki state
  const [wikiModeEnabled, setWikiModeEnabled] = useState(false);
  const [wikiPanelEntry, setWikiPanelEntry] = useState<string | null>(null);

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const particleIdRef = useRef(0);

  // Audio analyser for visualizations
  const { frequencies, bassLevel, glitchTrigger } = useAudioAnalyser(
    audioRef.current,
    isPlaying
  );

  // Reset state when track changes
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [currentIndex]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleEnded = () => {
      setIsPlaying(false);
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else if (currentIndex < tracks.length - 1) {
        onTrackChange(currentIndex + 1);
        setTimeout(() => audioRef.current?.play(), 100);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [isRepeat, currentIndex, tracks.length, onTrackChange]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Mouse tracking for parallax (disabled on touch devices)
  useEffect(() => {
    // Skip on touch devices - they don't have mouse parallax and this causes lag
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Control handlers
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  }, [isPlaying]);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, time));
    }
  }, [duration]);

  const seekByPercent = useCallback((percent: number) => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = percent * duration;
    }
  }, [duration]);

  const seekRelative = useCallback((seconds: number) => {
    seekTo(currentTime + seconds);
  }, [currentTime, seekTo]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  }, []);

  const playPrevious = useCallback(() => {
    if (currentTime > 3) {
      seekTo(0);
    } else if (currentIndex > 0) {
      onTrackChange(currentIndex - 1);
      setTimeout(() => audioRef.current?.play(), 100);
    }
  }, [currentTime, currentIndex, onTrackChange, seekTo]);

  const playNext = useCallback(() => {
    if (currentIndex < tracks.length - 1) {
      onTrackChange(currentIndex + 1);
      setTimeout(() => audioRef.current?.play(), 100);
    }
  }, [currentIndex, tracks.length, onTrackChange]);

  // Wiki handlers
  const handleAnnotationClick = useCallback((wikiId: string) => {
    setWikiPanelEntry(wikiId);
  }, []);

  const handleWikiEntryChange = useCallback((entryId: string) => {
    setWikiPanelEntry(entryId);
  }, []);

  const handleCloseWikiPanel = useCallback(() => {
    setWikiPanelEntry(null);
  }, []);

  const toggleWikiMode = useCallback(() => {
    setWikiModeEnabled(prev => !prev);
  }, []);

  // Particle effect on line change
  const handleLineChange = useCallback((
    prevIndex: number,
    currentLineIndex: number,
    lineElement: HTMLElement | null
  ) => {
    // Particle dissolve effect
    if (lineElement) {
      const rect = lineElement.getBoundingClientRect();
      const text = track.lyrics[prevIndex]?.text || '';
      const cleanText = text.replace(/\*/g, '');

      const newParticles: { id: number; x: number; y: number; char: string }[] = [];
      const charCount = Math.min(15, cleanText.length);

      for (let i = 0; i < charCount; i++) {
        const charIndex = Math.floor(Math.random() * cleanText.length);
        const char = cleanText[charIndex] || '·';
        if (char === ' ') continue;

        newParticles.push({
          id: particleIdRef.current++,
          x: rect.left + (rect.width * (i / charCount)),
          y: rect.top + rect.height / 2,
          char,
        });
      }

      setParticles(prev => [...prev, ...newParticles]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 1500);
    }

    // Auto-slide wiki panel when wiki mode is enabled
    if (wikiModeEnabled) {
      const currentLine = track.lyrics[currentLineIndex];
      if (currentLine?.annotations) {
        const wikiAnnotation = currentLine.annotations.find(a => a.wikiId);
        if (wikiAnnotation?.wikiId) {
          setWikiPanelEntry(wikiAnnotation.wikiId);
        }
      }
    }
  }, [track.lyrics, wikiModeEnabled]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (e.shiftKey) {
            playPrevious();
          } else {
            seekRelative(-5);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (e.shiftKey) {
            playNext();
          } else {
            seekRelative(5);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 0.1));
          break;
        case 'KeyM':
          e.preventDefault();
          setIsMuted(prev => !prev);
          break;
        case 'KeyR':
          e.preventDefault();
          setIsRepeat(prev => !prev);
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'Home':
          e.preventDefault();
          seekTo(0);
          break;
        case 'End':
          e.preventDefault();
          seekTo(duration - 0.1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seekRelative, playPrevious, playNext, handleVolumeChange, volume, seekTo, duration, onClose]);

  // Calculate parallax offsets
  const parallaxX = (mousePos.x - 0.5) * 2;
  const parallaxY = (mousePos.y - 0.5) * 2;

  const canPlayPrevious = currentIndex > 0 || currentTime > 3;
  const canPlayNext = currentIndex < tracks.length - 1;

  return (
    <div className={`lyrics-player ${track.videoUrl ? 'has-video' : ''}`}>
      <audio ref={audioRef} src={track.audioUrl} preload="metadata" />

      {/* Visual effects layer */}
      <PlayerEffects
        bassLevel={bassLevel}
        parallaxX={parallaxX}
        parallaxY={parallaxY}
        videoUrl={track.videoUrl}
        coverArt={coverArt}
      />

      {/* Particle dissolve effect */}
      <div className="particles-container">
        {particles.map(p => (
          <span
            key={p.id}
            className="particle"
            style={{
              left: p.x,
              top: p.y,
              '--random-x': `${(Math.random() - 0.5) * 100}px`,
              '--random-y': `${-50 - Math.random() * 100}px`,
            } as React.CSSProperties}
          >
            {p.char}
          </span>
        ))}
      </div>

      {/* Close button */}
      <button className="lyrics-close" onClick={onClose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Header */}
      <div className="lyrics-header">
        <div className="lyrics-track-info">
          <span className="lyrics-now-playing">SPELAR NU</span>
          <h2 className="lyrics-track-title">{track.title}</h2>
          <span className="lyrics-track-counter">{currentIndex + 1} / {tracks.length}</span>
        </div>
      </div>

      {/* Audio visualizers */}
      <AudioVisualizers
        frequencies={frequencies}
        parallaxX={parallaxX}
        parallaxY={parallaxY}
      />

      {/* Lyrics display */}
      <LyricsDisplay
        lyrics={track.lyrics}
        currentTime={currentTime}
        bassLevel={bassLevel}
        glitchTrigger={glitchTrigger}
        onSeekTo={seekTo}
        onLineChange={handleLineChange}
        onAnnotationClick={handleAnnotationClick}
      />

      {/* Player controls */}
      <PlayerControls
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        volume={volume}
        isMuted={isMuted}
        isRepeat={isRepeat}
        isWikiMode={wikiModeEnabled}
        bassLevel={bassLevel}
        canPlayPrevious={canPlayPrevious}
        canPlayNext={canPlayNext}
        onTogglePlay={togglePlay}
        onSeek={seekByPercent}
        onSeekRelative={seekRelative}
        onVolumeChange={handleVolumeChange}
        onToggleMute={() => setIsMuted(prev => !prev)}
        onToggleRepeat={() => setIsRepeat(prev => !prev)}
        onToggleWikiMode={toggleWikiMode}
        onPrevious={playPrevious}
        onNext={playNext}
      />

      {/* Wiki slide-in panel */}
      <WikiPanel
        entryId={wikiPanelEntry}
        isOpen={wikiPanelEntry !== null}
        onClose={handleCloseWikiPanel}
        onEntryChange={handleWikiEntryChange}
      />
    </div>
  );
}
