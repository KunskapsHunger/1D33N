import React, { useState, useEffect } from 'react';

interface PlayerEffectsProps {
  bassLevel: number;
  parallaxX: number;
  parallaxY: number;
  videoUrl?: string;
  coverArt?: string;
}

// Check if device is mobile (touch-primary)
const isMobileDevice = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none) and (pointer: coarse)').matches;

// Get mobile video URL (480p H.264)
const getMobileVideoUrl = (videoUrl: string) =>
  videoUrl.replace('.mp4', '-mobile.mp4');

const FOG_PARTICLE_COUNT = 20;
const DEBRIS_PARTICLE_COUNT = 30;

// Generate static particles once (outside component to avoid re-creation)
const fogParticles = Array.from({ length: FOG_PARTICLE_COUNT }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 20,
  duration: 15 + Math.random() * 20,
  size: 50 + Math.random() * 150,
  opacity: 0.02 + Math.random() * 0.06,
}));

const debrisParticles = Array.from({ length: DEBRIS_PARTICLE_COUNT }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 15,
  duration: 8 + Math.random() * 12,
  size: 2 + Math.random() * 4,
  drift: (Math.random() - 0.5) * 100,
}));

export default function PlayerEffects({
  bassLevel,
  parallaxX,
  parallaxY,
  videoUrl,
  coverArt,
}: PlayerEffectsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  // Check for mobile on mount
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  // Reset video failed state when URL changes
  useEffect(() => {
    setVideoFailed(false);
  }, [videoUrl]);

  const handleVideoError = () => {
    setVideoFailed(true);
  };

  // Determine what background to show
  const showVideo = videoUrl && !videoFailed;
  const showCoverFallback = (videoUrl && videoFailed) || (!videoUrl && coverArt);

  return (
    <>
      {/* Pulsing vignette */}
      <div
        className="pulsing-vignette"
        style={{ opacity: 0.6 + bassLevel * 0.4 }}
      />

      {/* Floating debris/ash particles */}
      <div className="debris-container">
        {debrisParticles.map(p => (
          <div
            key={p.id}
            className="debris-particle"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              '--drift': `${p.drift}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Background video */}
      {showVideo && (
        <div className="lyrics-video-bg">
          <video
            key={videoUrl + (isMobile ? '-mobile' : '')}
            autoPlay
            loop
            muted
            playsInline
            onError={handleVideoError}
          >
            {isMobile ? (
              // Mobile: use optimized H.264 480p version (universal hardware support)
              <source src={getMobileVideoUrl(videoUrl)} type="video/mp4" />
            ) : (
              // Desktop: prefer WebM, fallback to full MP4
              <>
                <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
                <source src={videoUrl} type="video/mp4" />
              </>
            )}
          </video>
          <div className="lyrics-video-overlay" />
        </div>
      )}

      {/* Album cover fallback when video fails or unavailable */}
      {showCoverFallback && coverArt && (
        <div className="lyrics-video-bg lyrics-cover-bg">
          <img src={coverArt} alt="" />
          <div className="lyrics-video-overlay" />
        </div>
      )}

      {/* VHS/Static noise overlay */}
      <div className="vhs-overlay">
        <div className="vhs-scanlines" />
        <div className="vhs-noise" />
        <div className="vhs-static-burst" />
        <div className="vhs-flicker" />
      </div>

      {/* Smoke/fog particles */}
      <div
        className="fog-container"
        style={{
          transform: `translate(${parallaxX * 30}px, ${parallaxY * 30}px)`,
        }}
      >
        {fogParticles.map(p => (
          <div
            key={p.id}
            className="fog-particle"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>
    </>
  );
}
