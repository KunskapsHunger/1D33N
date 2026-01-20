import { HeroConstellation } from './constellation';
import './Hero.css';

interface HeroProps {
  onExplore: () => void;
  onConstellationActivate: () => void;
}

export default function Hero({ onExplore, onConstellationActivate }: HeroProps) {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <div className="hero-gradient"></div>
        <div className="hero-lines">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="hero-line" style={{ animationDelay: i * 0.1 + 's' }}></div>
          ))}
        </div>
        {/* Hidden constellation - click 3 times to reveal */}
        <HeroConstellation onActivate={onConstellationActivate} />
      </div>

      <div className="hero-content">
        <div className="hero-label">POET. BERÄTTARE. DRÖMMARE.</div>
        <h1 className="hero-title">
          <span className="hero-title-main">1D33N</span>
          <span className="hero-title-sub">ORDEN ÄR ALLT</span>
        </h1>
        <p className="hero-desc">
          Texter från hjärtat. Musik från maskinen. <br />
          En röst från Sveriges mörker.
        </p>
        <button className="hero-cta" onClick={onExplore}>
          <span>UTFORSKA MUSIKEN</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </button>
      </div>

      <div className="hero-scroll">
        <span>SCROLLA NER</span>
        <div className="hero-scroll-line"></div>
      </div>
    </section>
  );
}
