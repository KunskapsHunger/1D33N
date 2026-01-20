import React from 'react';

interface PlayerControlsProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isRepeat: boolean;
  isWikiMode: boolean;
  bassLevel: number;
  canPlayPrevious: boolean;
  canPlayNext: boolean;
  onTogglePlay: () => void;
  onSeek: (percent: number) => void;
  onSeekRelative: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleRepeat: () => void;
  onToggleWikiMode: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

function formatTime(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return min + ':' + (sec < 10 ? '0' : '') + sec;
}

export default function PlayerControls({
  currentTime,
  duration,
  isPlaying,
  volume,
  isMuted,
  isRepeat,
  isWikiMode,
  bassLevel,
  canPlayPrevious,
  canPlayNext,
  onTogglePlay,
  onSeek,
  onSeekRelative,
  onVolumeChange,
  onToggleMute,
  onToggleRepeat,
  onToggleWikiMode,
  onPrevious,
  onNext,
}: PlayerControlsProps) {
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onSeek(percent);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(parseFloat(e.target.value));
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const progressSvg = duration ? (currentTime / duration) * 1000 : 0;

  return (
    <div className="lyrics-controls">
      {/* Heartbeat progress bar */}
      <div className="heartbeat-progress" onClick={handleProgressClick}>
        <svg className="heartbeat-progress-svg" viewBox="0 0 1000 80" preserveAspectRatio="none">
          <defs>
            <clipPath id="progress-clip">
              <rect x="0" y="0" width={progressSvg} height="80" />
            </clipPath>
            <linearGradient id="heartbeat-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--red)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--red)" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path d="M0,40 L1000,40" fill="none" stroke="var(--white-dim)" strokeWidth="1" opacity="0.3" />
          <g clipPath="url(#progress-clip)">
            <path
              className="heartbeat-active"
              d={`M0,40 L${80 - bassLevel * 30},40 L${100 - bassLevel * 15},${40 - bassLevel * 25} L${120},${40 + bassLevel * 15} L${140 + bassLevel * 15},${40 - bassLevel * 35} L${170},${40 + bassLevel * 18} L${200 + bassLevel * 20},40 L${280},40 L${300 - bassLevel * 20},${40 - bassLevel * 28} L${320},${40 + bassLevel * 12} L${340 + bassLevel * 12},${40 - bassLevel * 32} L${370},${40 + bassLevel * 15} L${400 + bassLevel * 15},40 L${480},40 L${500 - bassLevel * 25},${40 - bassLevel * 30} L${520},${40 + bassLevel * 18} L${540 + bassLevel * 18},${40 - bassLevel * 38} L${570},${40 + bassLevel * 20} L${600 + bassLevel * 12},40 L${680},40 L${700 - bassLevel * 18},${40 - bassLevel * 26} L${720},${40 + bassLevel * 14} L${740 + bassLevel * 15},${40 - bassLevel * 34} L${770},${40 + bassLevel * 18} L${800 + bassLevel * 10},40 L${880},40 L${900 - bassLevel * 22},${40 - bassLevel * 28} L${920},${40 + bassLevel * 16} L${940 + bassLevel * 12},${40 - bassLevel * 36} L${970},${40 + bassLevel * 20} L1000,40`}
              fill="none"
              stroke="url(#heartbeat-gradient)"
              strokeWidth="2"
            />
            <path
              className="heartbeat-glow"
              d={`M0,40 L${80 - bassLevel * 30},40 L${100 - bassLevel * 15},${40 - bassLevel * 25} L${120},${40 + bassLevel * 15} L${140 + bassLevel * 15},${40 - bassLevel * 35} L${170},${40 + bassLevel * 18} L${200 + bassLevel * 20},40 L${280},40 L${300 - bassLevel * 20},${40 - bassLevel * 28} L${320},${40 + bassLevel * 12} L${340 + bassLevel * 12},${40 - bassLevel * 32} L${370},${40 + bassLevel * 15} L${400 + bassLevel * 15},40 L${480},40 L${500 - bassLevel * 25},${40 - bassLevel * 30} L${520},${40 + bassLevel * 18} L${540 + bassLevel * 18},${40 - bassLevel * 38} L${570},${40 + bassLevel * 20} L${600 + bassLevel * 12},40 L${680},40 L${700 - bassLevel * 18},${40 - bassLevel * 26} L${720},${40 + bassLevel * 14} L${740 + bassLevel * 15},${40 - bassLevel * 34} L${770},${40 + bassLevel * 18} L${800 + bassLevel * 10},40 L${880},40 L${900 - bassLevel * 22},${40 - bassLevel * 28} L${920},${40 + bassLevel * 16} L${940 + bassLevel * 12},${40 - bassLevel * 36} L${970},${40 + bassLevel * 20} L1000,40`}
              fill="none"
              stroke="var(--red)"
              strokeWidth="6"
              opacity="0.3"
              filter="blur(3px)"
            />
          </g>
          <line x1={progressSvg} y1="40" x2="1000" y2="40" stroke="var(--white-dim)" strokeWidth="1" opacity="0.2" />
        </svg>
        <div className="progress-dot" style={{ left: `${progress}%` }} />
      </div>

      <div className="lyrics-time">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="lyrics-buttons">
        <button className="lyrics-btn" onClick={onPrevious} disabled={!canPlayPrevious}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>

        <button className="lyrics-btn" onClick={() => onSeekRelative(-10)}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
          </svg>
        </button>

        <button className="lyrics-btn play" onClick={onTogglePlay}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        <button className="lyrics-btn" onClick={() => onSeekRelative(10)}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
          </svg>
        </button>

        <button className="lyrics-btn" onClick={onNext} disabled={!canPlayNext}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>

      <div className="lyrics-secondary-controls">
        <button
          className={`lyrics-btn wiki-btn ${isWikiMode ? 'active' : ''}`}
          onClick={onToggleWikiMode}
          title="Wiki-läge"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
          </svg>
        </button>

        <button
          className={`lyrics-btn repeat-btn ${isRepeat ? 'active' : ''}`}
          onClick={onToggleRepeat}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
          </svg>
        </button>

        <div className="lyrics-volume">
          <button className="lyrics-btn volume-btn" onClick={onToggleMute}>
            {isMuted || volume === 0 ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : volume < 0.5 ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  );
}
