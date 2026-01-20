
interface AudioVisualizersProps {
  frequencies: number[];
  parallaxX: number;
  parallaxY: number;
}

export default function AudioVisualizers({
  frequencies,
  parallaxX,
  parallaxY,
}: AudioVisualizersProps) {
  return (
    <>
      {/* Left visualizer */}
      <div
        className="visualizer visualizer-left"
        style={{
          transform: `translate(${parallaxX * 15}px, ${parallaxY * 15}px)`,
        }}
      >
        {frequencies.map((freq, i) => (
          <div
            key={i}
            className="visualizer-bar"
            style={{
              width: `${Math.max(5, freq * 100)}%`,
              opacity: 0.4 + freq * 0.6,
            }}
          />
        ))}
      </div>

      {/* Right visualizer */}
      <div
        className="visualizer visualizer-right"
        style={{
          transform: `translate(${parallaxX * 15}px, ${parallaxY * 15}px)`,
        }}
      >
        {[...frequencies].reverse().map((freq, i) => (
          <div
            key={i}
            className="visualizer-bar"
            style={{
              width: `${Math.max(5, freq * 100)}%`,
              opacity: 0.4 + freq * 0.6,
            }}
          />
        ))}
      </div>
    </>
  );
}
