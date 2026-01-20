import { Release, Track, getUpcomingReleases, getReleasedReleases } from '../data/tracks';
import UpcomingRelease from './UpcomingRelease';
import './TrackList.css';

interface TrackListProps {
  onSelectTrack: (track: Track) => void;
}

export default function TrackList({ onSelectTrack }: TrackListProps) {
  const releasedReleases = getReleasedReleases();
  const upcomingReleases = getUpcomingReleases();

  const getReleaseTypeLabel = (type: Release['type']) => {
    switch (type) {
      case 'album': return 'ALBUM';
      case 'single': return 'SINGEL';
      case 'ep': return 'EP';
    }
  };

  const isPlayable = (track: Track) => !!track.audioUrl;

  const hasStreamingLinks = (track: Track) => {
    return track.streamingLinks && Object.values(track.streamingLinks).some(link => link);
  };

  const handleTrackClick = (track: Track) => {
    if (isPlayable(track)) {
      onSelectTrack(track);
    }
  };

  return (
    <section className="tracklist" id="musik">
      <div className="container">
        <div className="section-header">
          <span className="section-label">DISKOGRAFI</span>
          <h2 className="section-title">MUSIK</h2>
        </div>

        {/* Upcoming Releases */}
        {upcomingReleases.length > 0 && (
          <div className="upcoming-section">
            <h3 className="upcoming-section-title">KOMMANDE</h3>
            <div className="upcoming-releases">
              {upcomingReleases.map(release => (
                <UpcomingRelease key={release.id} release={release} />
              ))}
            </div>
          </div>
        )}

        {/* Released */}
        <div className="releases">
          {releasedReleases.map((release, releaseIndex) => (
            <div
              key={release.id}
              className="release"
              style={{ animationDelay: `${releaseIndex * 0.15}s` }}
            >
              <div className="release-cover">
                {release.coverArt ? (
                  <img src={release.coverArt} alt={release.title} />
                ) : (
                  <div className="release-cover-placeholder">
                    <span>{release.title.charAt(0)}</span>
                  </div>
                )}
                <div className="release-type-badge">{getReleaseTypeLabel(release.type)}</div>
              </div>

              <div className="release-content">
                <div className="release-header">
                  <div className="release-meta">
                    <span className="release-year">{release.year}</span>
                    <span className="release-dot">·</span>
                    <span className="release-type">{getReleaseTypeLabel(release.type)}</span>
                    <span className="release-dot">·</span>
                    <span className="release-track-count">
                      {release.tracks.length} {release.tracks.length === 1 ? 'låt' : 'låtar'}
                    </span>
                  </div>
                  <h3 className="release-title">{release.title}</h3>
                  {release.description && (
                    <p className="release-description">{release.description}</p>
                  )}
                </div>

                <div className="release-tracks">
                  {release.tracks.map((track, index) => (
                    <div
                      key={track.id}
                      className={`track ${isPlayable(track) ? 'playable' : 'streaming-only'}`}
                      onClick={() => handleTrackClick(track)}
                    >
                      <div className="track-number">
                        {String(track.trackNumber || index + 1).padStart(2, '0')}
                      </div>

                      <div className="track-info">
                        <span className="track-title">{track.title}</span>
                        {!isPlayable(track) && hasStreamingLinks(track) && (
                          <span className="track-badge streaming">Endast streaming</span>
                        )}
                        {!isPlayable(track) && !hasStreamingLinks(track) && (
                          <span className="track-badge coming">Kommer snart</span>
                        )}
                      </div>

                      <div className="track-duration">{track.duration}</div>

                      <div className="track-actions">
                        {isPlayable(track) ? (
                          <button className="track-play-btn" title="Spela på sidan">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </button>
                        ) : hasStreamingLinks(track) ? (
                          <div className="track-links">
                            {track.streamingLinks?.spotify && (
                              <a
                                href={track.streamingLinks.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Lyssna på Spotify"
                                onClick={(e) => e.stopPropagation()}
                                className="streaming-link spotify"
                              >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                </svg>
                              </a>
                            )}
                            {track.streamingLinks?.apple && (
                              <a
                                href={track.streamingLinks.apple}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Lyssna på Apple Music"
                                onClick={(e) => e.stopPropagation()}
                                className="streaming-link apple"
                              >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.295-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.8-.228-2.403-.96-.63-.767-.7-1.636-.33-2.526.36-.87 1.04-1.36 1.94-1.536.37-.07.74-.1 1.11-.14.59-.06 1.18-.11 1.74-.32.1-.03.18-.1.18-.2V9.22c0-.13-.07-.22-.2-.24l-4.77.9c-.1.02-.18.1-.18.21v6.76c0 .45-.06.89-.27 1.29-.33.66-.86 1.06-1.58 1.22-.34.08-.69.13-1.04.15-.96.05-1.82-.2-2.45-.96-.64-.77-.71-1.65-.34-2.55.36-.87 1.05-1.37 1.95-1.55.37-.07.74-.1 1.12-.14.58-.06 1.15-.11 1.7-.31.14-.05.21-.14.21-.29V6.57c0-.3.13-.5.42-.58l6.27-1.47c.1-.02.21-.04.31-.03.24.02.38.16.38.4v5.21z"/>
                                </svg>
                              </a>
                            )}
                            {track.streamingLinks?.youtube && (
                              <a
                                href={track.streamingLinks.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Se på YouTube"
                                onClick={(e) => e.stopPropagation()}
                                className="streaming-link youtube"
                              >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="track-coming-icon" title="Kommer snart">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M12 6v6l4 2"/>
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
