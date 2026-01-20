import { useState, useEffect } from 'react';
import { tracks, Track } from '../data/tracks';
import './FeaturedLyrics.css';

interface FeaturedLyricsProps {
  onOpenTrack: (track: Track) => void;
}

// Curated key lines from all tracks
const featuredQuotes = [
  { text: 'Jag har sett in i avgrunden', trackId: 'fornekad' },
  { text: 'Det är tankar, som tankar nya tankar', trackId: 'sisyfos-bror' },
  { text: 'Jag måste vara Sisyfos bror', trackId: 'sisyfos-bror' },
  { text: 'Du möter mig medierad', trackId: 'medierad' },
  { text: 'She\'s fighting wolves from within', trackId: 'heroine' },
  { text: 'The heroine brightens all', trackId: 'heroine' },
  { text: 'Men jag ångrar aldrig att jag alltid ångrar allt', trackId: 'sisyfos-bror' },
  { text: 'Jag är blicken från Agamemnon när han offrar sin dotter', trackId: 'sisyfos-bror' },
  { text: 'Running to reach escape velocity', trackId: 'heroine' },
  { text: 'Vart är du nu?', trackId: 'fornekad' },
  { text: 'Jag skapar livet som du tror är overkligt', trackId: 'medierad' },
  { text: 'In a heroine\'s journey', trackId: 'heroine' },
];

export default function FeaturedLyrics({ onOpenTrack }: FeaturedLyricsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  const featuredLines = featuredQuotes.map(q => ({
    ...q,
    track: tracks.find(t => t.id === q.trackId)!
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredLines.length);
        setFadeState('in');
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [featuredLines.length]);

  return (
    <section className="featured-lyrics" id="texter">
      <div className="container">
        <div className="section-header">
          <span className="section-label">UTVALDA TEXTER</span>
          <h2 className="section-title">ORDEN</h2>
        </div>

        <div className="featured-content">
          <div className="featured-quote-container">
            <div className="featured-quote-marks">"</div>
            <div className={'featured-quote ' + (fadeState === 'in' ? 'fade-in' : 'fade-out')}>
              {featuredLines[currentIndex]?.text}
            </div>
            <div className="featured-quote-marks end">"</div>
          </div>

          <div className="featured-info">
            <span className={'featured-track-name ' + (fadeState === 'in' ? 'fade-in' : 'fade-out')}>
              {featuredLines[currentIndex]?.track.title}
            </span>
            <button
              className="featured-cta"
              onClick={() => onOpenTrack(featuredLines[currentIndex]?.track)}
            >
              Upplev hela texten
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="featured-decoration">
            <div className="featured-line"></div>
            <div className="featured-dots">
              {featuredLines.map((_, i) => (
                <div
                  key={i}
                  className={'featured-dot ' + (i === currentIndex ? 'active' : '')}
                  onClick={() => {
                    setFadeState('out');
                    setTimeout(() => {
                      setCurrentIndex(i);
                      setFadeState('in');
                    }, 500);
                  }}
                ></div>
              ))}
            </div>
            <div className="featured-line"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
