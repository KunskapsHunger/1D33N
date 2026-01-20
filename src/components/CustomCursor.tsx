import { useEffect, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const trailIndex = useRef(0);
  const isVisible = useRef(false);
  const rafId = useRef<number>(0);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Skip on touch devices - no mouse cursor needed
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchDevice) return;

    const TRAIL_LENGTH = 6;

    // Create trail elements once
    const container = containerRef.current;
    if (!container) return;

    // Clear existing trails
    trailRefs.current = [];
    const existingTrails = container.querySelectorAll('.cursor-trail');
    existingTrails.forEach(el => el.remove());

    // Create new trail elements
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.opacity = '0';
      container.appendChild(trail);
      trailRefs.current.push(trail);
    }

    // Use passive event listener for better scroll performance
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (!isVisible.current) {
        isVisible.current = true;
        if (container) container.style.opacity = '1';
      }

      // Update cursor position directly (no React re-render)
      if (mainRef.current) {
        mainRef.current.style.left = `${e.clientX}px`;
        mainRef.current.style.top = `${e.clientY}px`;
      }
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }

      // Add trail point using circular buffer
      const trail = trailRefs.current[trailIndex.current % TRAIL_LENGTH];
      if (trail) {
        trail.style.left = `${e.clientX}px`;
        trail.style.top = `${e.clientY}px`;
        trail.style.opacity = '0.4';
      }
      trailIndex.current++;
    };

    const handleMouseLeave = () => {
      isVisible.current = false;
      if (container) container.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      isVisible.current = true;
      if (container) container.style.opacity = '1';
    };

    // Fade out trail points using RAF (not setInterval)
    const fadeTrails = () => {
      trailRefs.current.forEach(trail => {
        const currentOpacity = parseFloat(trail.style.opacity) || 0;
        if (currentOpacity > 0.01) {
          trail.style.opacity = `${currentOpacity * 0.85}`;
        } else if (currentOpacity > 0) {
          trail.style.opacity = '0';
        }
      });
      rafId.current = requestAnimationFrame(fadeTrails);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    rafId.current = requestAnimationFrame(fadeTrails);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className="custom-cursor-container" ref={containerRef}>
      <div className="cursor-main" ref={mainRef} />
      <div className="cursor-glow" ref={glowRef} />
      {/* Trail elements are created via DOM manipulation for performance */}
    </div>
  );
}
