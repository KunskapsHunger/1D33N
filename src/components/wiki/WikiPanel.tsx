import { useEffect, useRef } from 'react';
import { getWikiEntryById, getWikiReferences } from '../../data/wiki';
import { getTrackById } from '../../data/releases';
import { WikiEntryCard } from './WikiEntryCard';
import './WikiPanel.css';

interface WikiPanelProps {
  entryId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEntryChange: (entryId: string) => void;
  onNavigateToTrack?: (trackId: string, time: number) => void;
}

export function WikiPanel({
  entryId,
  isOpen,
  onClose,
  onEntryChange,
  onNavigateToTrack
}: WikiPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const entry = entryId ? getWikiEntryById(entryId) : null;
  const references = entryId ? getWikiReferences(entryId) : [];

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      // Delay adding listener to prevent immediate close
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`wiki-panel ${isOpen ? 'wiki-panel--open' : ''}`} ref={panelRef}>
      <button className="wiki-panel-close" onClick={onClose} aria-label="Stäng">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="wiki-panel-content">
        {entry ? (
          <>
            <WikiEntryCard
              entry={entry}
              compact
              onRelatedClick={onEntryChange}
            />

            {references.length > 0 && (
              <div className="wiki-panel-references">
                <h3 className="wiki-references-title">Refereras i</h3>
                {references.map((ref, i) => {
                  const trackData = getTrackById(ref.trackId);
                  if (!trackData) return null;

                  return (
                    <button
                      key={i}
                      className="wiki-reference-link"
                      onClick={() => onNavigateToTrack?.(ref.trackId, ref.lineTime)}
                    >
                      <span className="wiki-reference-track">{trackData.track.title}</span>
                      <span className="wiki-reference-time">{formatTime(ref.lineTime)}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="wiki-panel-empty">
            <p>Välj en markerad referens för att läsa mer.</p>
          </div>
        )}
      </div>
    </div>
  );
}
