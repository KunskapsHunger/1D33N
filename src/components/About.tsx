import './About.css';

export default function About() {
  return (
    <section className="about" id="om">
      <div className="container">
        <div className="about-grid">
          <div className="about-visual">
            <div className="about-image">
              <div className="about-image-overlay"></div>
              <div className="about-image-text">1D33N</div>
            </div>
            <div className="about-decoration">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="about-dec-line" style={{ animationDelay: i * 0.2 + 's' }}></div>
              ))}
            </div>
          </div>

          <div className="about-content">
            <div className="section-header">
              <span className="section-label">ARTISTEN</span>
              <h2 className="section-title">OM 1D33N</h2>
            </div>

            <div className="about-text">
              <p>
                <strong>1D33N</strong> är en emo rap-artist från Sverige som
                blandar råa känslor med experimentella beats. Med rötter
                i det skandinaviska mörkret skapar han musik som talar
                till den inre kampen vi alla bär på.
              </p>
              <p>
                Det unika med 1D33N är hans arbetssätt: medan beats och
                produktionen skapas med hjälp av generativ AI, är varje
                ord och varje rad hans egna. <em>Texten är helig.</em> Det
                är i orden som själen lever, och det är genom prosan som
                han uttrycker det som annars förblir osagt.
              </p>
              <p>
                För 1D33N handlar musik om autenticitet i uttrycket, inte
                i verktyget. AI är penseln, men han är konstnären. Varje
                låt är en bekännelse, varje vers en del av hans resa.
              </p>
            </div>

            <div className="about-quote">
              <blockquote>
                "Orden är allt jag har. Resten är bara ljud."
              </blockquote>
              <cite>- 1D33N</cite>
            </div>

            <div className="about-stats">
              <div className="stat">
                <span className="stat-value">100%</span>
                <span className="stat-label">Egna texter</span>
              </div>
              <div className="stat">
                <span className="stat-value">AI</span>
                <span className="stat-label">Genererade beats</span>
              </div>
              <div className="stat">
                <span className="stat-value">SE</span>
                <span className="stat-label">Sverige</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
