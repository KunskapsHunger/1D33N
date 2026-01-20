import { useState, useRef, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TrackList from './components/TrackList';
import FeaturedLyrics from './components/FeaturedLyrics';
import LyricsPlayer from './components/LyricsPlayer';
import LyricsReader from './components/LyricsReader';
import { WikiPage } from './components/wiki';
import { ConstellationModal } from './components/constellation';
import LoadingScreen from './components/LoadingScreen';
import About from './components/About';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import { Track, getPlayableTracks } from './data/tracks';
import { useBrowserDetect } from './hooks';
import './App.css';

type ViewState = 'main' | 'player' | 'reader' | 'wiki';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [viewState, setViewState] = useState<ViewState>('main');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number | null>(null);
  const [readerInitialTrack, setReaderInitialTrack] = useState<Track | undefined>(undefined);
  const [isConstellationOpen, setIsConstellationOpen] = useState(false);
  const musikRef = useRef<HTMLDivElement>(null);

  // Add browser-specific classes to <html> for CSS targeting
  useBrowserDetect();

  const playableTracks = useMemo(() => getPlayableTracks(), []);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const transitionTo = useCallback((newState: ViewState, callback?: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback?.();
      setViewState(newState);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  }, []);

  const handleNavigate = (section: string) => {
    if (section === 'texter') {
      transitionTo('reader', () => {
        setReaderInitialTrack(undefined);
      });
      return;
    }

    if (section === 'wiki') {
      transitionTo('wiki', () => {
        document.body.style.overflow = 'hidden';
      });
      return;
    }

    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExplore = () => {
    if (musikRef.current) {
      musikRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConstellationActivate = useCallback(() => {
    setIsConstellationOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleConstellationClose = useCallback(() => {
    setIsConstellationOpen(false);
    document.body.style.overflow = '';
  }, []);

  const handleSelectTrack = (track: Track) => {
    const index = playableTracks.findIndex(t => t.id === track.id);
    if (index !== -1) {
      transitionTo('player', () => {
        setSelectedTrackIndex(index);
        document.body.style.overflow = 'hidden';
      });
    }
  };

  const handleClosePlayer = () => {
    transitionTo('main', () => {
      setSelectedTrackIndex(null);
      document.body.style.overflow = '';
    });
  };

  const handleCloseReader = () => {
    transitionTo('main', () => {
      setReaderInitialTrack(undefined);
      document.body.style.overflow = '';
    });
  };

  const handleCloseWiki = () => {
    transitionTo('main', () => {
      document.body.style.overflow = '';
    });
  };

  const handleNavigateToTrackFromWiki = (trackId: string, time: number) => {
    const index = playableTracks.findIndex(t => t.id === trackId);
    if (index !== -1) {
      transitionTo('player', () => {
        setSelectedTrackIndex(index);
        document.body.style.overflow = 'hidden';
        // Seek to time after a short delay to ensure audio is loaded
        setTimeout(() => {
          const audio = document.querySelector('audio');
          if (audio) {
            audio.currentTime = time;
          }
        }, 500);
      });
    }
  };

  const handleTrackChange = (index: number) => {
    setSelectedTrackIndex(index);
  };

  // Handler for opening reader with a specific track (used by FeaturedLyrics)
  const _handleOpenReader = (track?: Track) => {
    transitionTo('reader', () => {
      setReaderInitialTrack(track);
      document.body.style.overflow = 'hidden';
    });
  };
  void _handleOpenReader; // Suppress unused warning - available for future use

  return (
    <div className="app">
      {/* Loading screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Page transition overlay */}
      <div className={`page-transition ${isTransitioning ? 'active' : ''}`}>
        <div className="transition-glitch" />
      </div>

      <CustomCursor />
      <div className="noise-overlay"></div>

      {/* Main content */}
      <div className={`main-content ${viewState !== 'main' ? 'hidden' : ''}`}>
        <Header onNavigate={handleNavigate} />

        <main>
          <Hero onExplore={handleExplore} onConstellationActivate={handleConstellationActivate} />

          <div ref={musikRef}>
            <TrackList onSelectTrack={handleSelectTrack} />
          </div>

          <FeaturedLyrics onOpenTrack={handleSelectTrack} />

          <About />
        </main>

        <Footer />
      </div>

      {/* Lyrics Player */}
      {viewState === 'player' && selectedTrackIndex !== null && (
        <LyricsPlayer
          tracks={playableTracks}
          currentIndex={selectedTrackIndex}
          onClose={handleClosePlayer}
          onTrackChange={handleTrackChange}
        />
      )}

      {/* Lyrics Reader */}
      {viewState === 'reader' && (
        <LyricsReader
          onClose={handleCloseReader}
          initialTrack={readerInitialTrack}
        />
      )}

      {/* Wiki Page */}
      {viewState === 'wiki' && (
        <WikiPage
          onClose={handleCloseWiki}
          onNavigateToTrack={handleNavigateToTrackFromWiki}
        />
      )}

      {/* Hidden Constellation Modal */}
      <ConstellationModal
        isOpen={isConstellationOpen}
        onClose={handleConstellationClose}
      />
    </div>
  );
}

export default App;
