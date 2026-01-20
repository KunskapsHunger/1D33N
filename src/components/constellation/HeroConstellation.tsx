import { useState } from 'react';
import './HeroConstellation.css';

interface HeroConstellationProps {
  onActivate: () => void;
}

// Simple star positions for the subtle hero pattern
// These form a loose constellation shape
const stars = [
  { x: 15, y: 20, size: 2, delay: 0 },
  { x: 25, y: 35, size: 1.5, delay: 0.5 },
  { x: 18, y: 50, size: 2, delay: 1 },
  { x: 30, y: 60, size: 1, delay: 1.5 },
  { x: 22, y: 75, size: 1.5, delay: 2 },
  // Right side
  { x: 85, y: 25, size: 1.5, delay: 0.3 },
  { x: 78, y: 40, size: 2, delay: 0.8 },
  { x: 82, y: 55, size: 1, delay: 1.3 },
  { x: 75, y: 70, size: 1.5, delay: 1.8 },
  { x: 80, y: 82, size: 2, delay: 2.3 },
];

// Lines connecting the stars
const lines = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4 },
  { from: 5, to: 6 },
  { from: 6, to: 7 },
  { from: 7, to: 8 },
  { from: 8, to: 9 },
];

export default function HeroConstellation({ onActivate }: HeroConstellationProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Activate on third click (secret!)
    if (newCount >= 3) {
      onActivate();
      setClickCount(0);
    }
  };

  return (
    <div
      className={`hero-constellation ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        // Reset click count if they leave
        setTimeout(() => setClickCount(0), 2000);
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Hidden constellation"
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* SVG for lines */}
      <svg className="constellation-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        {lines.map((line, i) => {
          const from = stars[line.from];
          const to = stars[line.to];
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className="constellation-line"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          );
        })}
      </svg>

      {/* Stars */}
      {stars.map((star, i) => (
        <div
          key={i}
          className={`constellation-star ${clickCount > 0 ? 'pulse' : ''}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size * 3,
            height: star.size * 3,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Hint that appears on hover */}
      <div className={`constellation-hint ${isHovered ? 'visible' : ''}`}>
        <span className="hint-dots">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className={`hint-dot ${i < clickCount ? 'active' : ''}`}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
