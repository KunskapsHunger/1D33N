import { useState, useEffect } from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onComplete: () => void;
  minDuration?: number;
}

export default function LoadingScreen({ onComplete, minDuration = 2500 }: LoadingScreenProps) {
  const [phase, setPhase] = useState<'glitch' | 'reveal' | 'fadeout'>('glitch');

  useEffect(() => {
    // Phase 1: Glitch effect (0-1.5s)
    const revealTimer = setTimeout(() => {
      setPhase('reveal');
    }, 1500);

    // Phase 2: Reveal complete, start fadeout (2s)
    const fadeTimer = setTimeout(() => {
      setPhase('fadeout');
    }, minDuration - 500);

    // Phase 3: Complete
    const completeTimer = setTimeout(() => {
      onComplete();
    }, minDuration);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, minDuration]);

  return (
    <div className={`loading-screen ${phase}`}>
      {/* Scan lines */}
      <div className="loading-scanlines" />

      {/* Static noise */}
      <div className="loading-static" />

      {/* Main logo */}
      <div className="loading-content">
        <div className="loading-logo">
          <span className="loading-logo-text" data-text="1D33N">1D33N</span>
        </div>

        {/* Loading bar */}
        <div className="loading-bar-container">
          <div className="loading-bar" />
        </div>

        {/* Subtitle */}
        <div className="loading-subtitle">
          <span>INITIERAR</span>
          <span className="loading-dots">...</span>
        </div>
      </div>

      {/* Glitch fragments */}
      <div className="loading-fragments">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="loading-fragment"
            style={{
              '--delay': `${i * 0.1}s`,
              '--offset-x': `${(Math.random() - 0.5) * 200}px`,
              '--offset-y': `${(Math.random() - 0.5) * 100}px`,
            } as React.CSSProperties}
          >
            1D33N
          </div>
        ))}
      </div>
    </div>
  );
}
