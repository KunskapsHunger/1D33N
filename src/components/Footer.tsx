import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">1D33N</span>
            <p className="footer-tagline">Emo Rap. Svenska texter. AI beats.</p>
          </div>

          <div className="footer-links">
            <a href="#" className="footer-link">Spotify</a>
            <a href="#" className="footer-link">SoundCloud</a>
            <a href="#" className="footer-link">Instagram</a>
          </div>

          <div className="footer-bottom">
            <span className="footer-copy">2025 1D33N. Alla rättigheter förbehållna.</span>
            <span className="footer-made">Gjord med passion i Sverige</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
