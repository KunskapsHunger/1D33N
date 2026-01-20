import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAudioAnalyserOptions {
  barCount?: number;
  bassThreshold?: number;
  smoothingTimeConstant?: number;
}

export function useAudioAnalyser(
  audioElement: HTMLAudioElement | null,
  isPlaying: boolean,
  options: UseAudioAnalyserOptions = {}
) {
  const {
    barCount = 12,
    bassThreshold = 0.975,
    smoothingTimeConstant = 0.8,
  } = options;

  const [frequencies, setFrequencies] = useState<number[]>(new Array(barCount).fill(0));
  const [bassLevel, setBassLevel] = useState(0);
  const [glitchTrigger, setGlitchTrigger] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number>(0);
  const lastBassHitRef = useRef(0);

  const initAudioContext = useCallback(() => {
    if (!audioElement || audioContextRef.current) return;

    const AudioContextClass = window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    const audioContext = new AudioContextClass();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = smoothingTimeConstant;

    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    sourceRef.current = source;
  }, [audioElement, smoothingTimeConstant]);

  // Initialize on play
  useEffect(() => {
    if (!audioElement) return;

    const handlePlay = () => {
      initAudioContext();
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    audioElement.addEventListener('play', handlePlay);
    return () => {
      audioElement.removeEventListener('play', handlePlay);
    };
  }, [audioElement, initAudioContext]);

  // Animation loop with mobile throttling
  useEffect(() => {
    // Throttle on mobile devices for performance (30fps instead of 60fps)
    const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const targetFps = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFps;
    let lastFrameTime = 0;

    const updateFrequencies = (timestamp: number) => {
      // Throttle updates based on target FPS
      if (timestamp - lastFrameTime < frameInterval) {
        animationRef.current = requestAnimationFrame(updateFrequencies);
        return;
      }
      lastFrameTime = timestamp;

      if (analyserRef.current && isPlaying) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Sample frequencies for bars
        const newFreqs: number[] = [];
        const step = Math.floor(dataArray.length / barCount);
        for (let i = 0; i < barCount; i++) {
          const value = dataArray[i * step] / 255;
          newFreqs.push(value);
        }
        setFrequencies(newFreqs);

        // Calculate bass level
        const bassSum = (dataArray[0] + dataArray[1] + dataArray[2]) / 3 / 255;
        setBassLevel(bassSum);

        // Trigger glitch on strong bass hits (skip on mobile)
        if (!isMobile) {
          const now = Date.now();
          if (bassSum > bassThreshold && now - lastBassHitRef.current > 200) {
            lastBassHitRef.current = now;
            setGlitchTrigger(true);
            setTimeout(() => setGlitchTrigger(false), 150);
          }
        }
      } else if (!isPlaying) {
        // Fade out when paused
        setFrequencies(prev => prev.map(v => v * 0.9));
        setBassLevel(prev => prev * 0.9);
      }
      animationRef.current = requestAnimationFrame(updateFrequencies);
    };

    animationRef.current = requestAnimationFrame(updateFrequencies);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, barCount, bassThreshold]);

  return {
    frequencies,
    bassLevel,
    glitchTrigger,
  };
}
