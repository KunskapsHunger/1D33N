import { useState, useEffect } from 'react';
import './Countdown.css';

interface CountdownProps {
  targetDate: string;
  label?: string;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = new Date(targetDate).getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    total: difference,
  };
}

export default function Countdown({ targetDate, label, onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.total <= 0 && !hasCompleted) {
        setHasCompleted(true);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, hasCompleted, onComplete]);

  if (timeLeft.total <= 0) {
    return (
      <div className="countdown countdown-complete">
        <div className="countdown-complete-text">UTE NU</div>
      </div>
    );
  }

  const units = [
    { value: timeLeft.days, label: 'DAGAR' },
    { value: timeLeft.hours, label: 'TIM' },
    { value: timeLeft.minutes, label: 'MIN' },
    { value: timeLeft.seconds, label: 'SEK' },
  ];

  return (
    <div className="countdown">
      {label && <div className="countdown-label">{label}</div>}
      <div className="countdown-units">
        {units.map((unit, index) => (
          <div key={unit.label} className="countdown-unit">
            <div className="countdown-value">
              <span className="countdown-number">
                {String(unit.value).padStart(2, '0')}
              </span>
              <div className="countdown-glitch" aria-hidden="true">
                {String(unit.value).padStart(2, '0')}
              </div>
            </div>
            <div className="countdown-unit-label">{unit.label}</div>
            {index < units.length - 1 && (
              <div className="countdown-separator">:</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
