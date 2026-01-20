import { useState, useEffect } from 'react';
import './Header.css';

interface HeaderProps {
  onNavigate: (section: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (section: string) => {
    onNavigate(section);
    setMenuOpen(false);
  };

  const headerClass = 'header' + (scrolled ? ' scrolled' : '');
  const navClass = 'nav' + (menuOpen ? ' open' : '');
  const menuClass = 'menu-toggle' + (menuOpen ? ' open' : '');

  return (
    <header className={headerClass}>
      <div className="header-inner">
        <div className="logo" onClick={() => handleNav('hero')}>
          <span className="logo-text">1D33N</span>
          <span className="logo-accent"></span>
        </div>

        <nav className={navClass}>
          <button className="nav-link" onClick={() => handleNav('musik')}>
            Musik
          </button>
          <button className="nav-link" onClick={() => handleNav('texter')}>
            Texter
          </button>
          <button className="nav-link" onClick={() => handleNav('wiki')}>
            Wiki
          </button>
          <button className="nav-link" onClick={() => handleNav('om')}>
            Om
          </button>
        </nav>

        <button
          className={menuClass}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
