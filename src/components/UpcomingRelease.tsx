import { useState, useRef } from 'react';
import { Release, getVisibleTracks, hasSnippets } from '../data/tracks';
import Countdown from './Countdown';
import './UpcomingRelease.css';

interface UpcomingReleaseProps {
  release: Release;
}

export default function UpcomingRelease({ release }: UpcomingReleaseProps) {
  const [playingSnippet, setPlayingSnippet] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const visibleTracks = getVisibleTracks(release);
  const showSnippets = hasSnippets(release);
  const showCover = release.revealStage !== 'announced';
  const showTracklist = release.revealStage === 'tracklist' || release.revealStage === 'snippets';

  const handlePlaySnippet = (trackId: string, snippetUrl?: string) => {
    if (!snippetUrl || !audioRef.current) return;

    if (playingSnippet === trackId) {
      audioRef.current.pause();
      setPlayingSnippet(null);
    } else {
      audioRef.current.src = snippetUrl;
      audioRef.current.play();
      setPlayingSnippet(trackId);
    }
  };

  const handleSnippetEnded = () => {
    setPlayingSnippet(null);
  };

  return (
    <div className="upcoming-release">
      <audio ref={audioRef} onEnded={handleSnippetEnded} />

      {/* Cover art */}
      <div className={`upcoming-cover ${!showCover ? 'hidden' : ''}`}>
        {showCover && release.coverArt ? (
          <img src={release.coverArt} alt={release.title} />
        ) : (
          <div className="upcoming-cover-placeholder">
            <div className="upcoming-cover-blur" />
            <span className="upcoming-cover-icon">?</span>
          </div>
        )}
        <div className="upcoming-cover-overlay" />
        <span className="upcoming-type">{release.type.toUpperCase()}</span>
      </div>

      {/* Release info */}
      <div className="upcoming-info">
        <h3 className="upcoming-title">{release.title}</h3>

        {release.announcement && release.revealStage === 'announced' && (
          <p className="upcoming-announcement">{release.announcement}</p>
        )}

        {release.description && release.revealStage !== 'announced' && (
          <p className="upcoming-description">{release.description}</p>
        )}

        {/* Countdown */}
        {release.releaseDate && (
          <div className="upcoming-countdown">
            <Countdown
              targetDate={release.releaseDate}
              label="SLPPS OM"
            />
          </div>
        )}

        {/* Tracklist */}
        {showTracklist && visibleTracks.length > 0 && (
          <div className="upcoming-tracklist">
            <h4 className="upcoming-tracklist-title">SPARLISTA</h4>
            <ul className="upcoming-tracks">
              {visibleTracks.map((track, index) => (
                <li key={track.id} className="upcoming-track">
                  <span className="upcoming-track-num">{index + 1}</span>
                  <span className={`upcoming-track-title ${track.title === '???' ? 'hidden-track' : ''}`}>
                    {track.title}
                  </span>
                  <span className="upcoming-track-duration">{track.duration}</span>

                  {/* Snippet play button */}
                  {showSnippets && track.snippetUrl && (
                    <button
                      className={`upcoming-snippet-btn ${playingSnippet === track.id ? 'playing' : ''}`}
                      onClick={() => handlePlaySnippet(track.id, track.snippetUrl)}
                      aria-label={playingSnippet === track.id ? 'Pausa' : 'Spela forhandsvisning'}
                    >
                      {playingSnippet === track.id ? (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16" />
                          <rect x="14" y="4" width="4" height="16" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                      <span className="upcoming-snippet-label">
                        {track.snippetDuration ? `${track.snippetDuration}s` : 'Preview'}
                      </span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stage indicator */}
        <div className="upcoming-stage">
          <div className="upcoming-stage-dots">
            {(['announced', 'cover', 'tracklist', 'snippets', 'released'] as const).map((stage) => (
              <div
                key={stage}
                className={`upcoming-stage-dot ${
                  release.revealStage === stage ? 'active' : ''
                } ${
                  ['announced', 'cover', 'tracklist', 'snippets', 'released'].indexOf(stage) <=
                  ['announced', 'cover', 'tracklist', 'snippets', 'released'].indexOf(release.revealStage || 'released')
                    ? 'passed'
                    : ''
                }`}
                title={stage}
              />
            ))}
          </div>
          <span className="upcoming-stage-label">
            {release.revealStage === 'announced' && 'Annonserad'}
            {release.revealStage === 'cover' && 'Omslag avslöjat'}
            {release.revealStage === 'tracklist' && 'Spårlista avslöjad'}
            {release.revealStage === 'snippets' && 'Förhandsvisning tillgänglig'}
          </span>
        </div>
      </div>
    </div>
  );
}
