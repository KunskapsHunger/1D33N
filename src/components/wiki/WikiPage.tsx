import { useState, useMemo } from 'react';
import {
  wikiEntries,
  getWikiEntriesByCategory,
  searchWikiEntries,
  getWikiReferences,
  categoryLabels,
  type WikiEntry,
  type WikiCategory,
} from '../../data/wiki';
import { getTrackById } from '../../data/releases';
import { WikiEntryCard } from './WikiEntryCard';
import './WikiPage.css';

interface WikiPageProps {
  onClose: () => void;
  onNavigateToTrack?: (trackId: string, time: number) => void;
  initialEntryId?: string;
}

const categories: WikiCategory[] = ['event', 'concept', 'person', 'place', 'term'];

export function WikiPage({ onClose, onNavigateToTrack, initialEntryId }: WikiPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<WikiCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<WikiEntry | null>(
    initialEntryId ? wikiEntries.find(e => e.id === initialEntryId) || null : null
  );

  const filteredEntries = useMemo(() => {
    let entries = selectedCategory === 'all'
      ? wikiEntries
      : getWikiEntriesByCategory(selectedCategory);

    if (searchQuery.trim()) {
      const searchResults = searchWikiEntries(searchQuery);
      entries = entries.filter(e => searchResults.some(r => r.id === e.id));
    }

    return entries;
  }, [selectedCategory, searchQuery]);

  const references = selectedEntry ? getWikiReferences(selectedEntry.id) : [];

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="wiki-page">
      {/* Close button */}
      <button className="wiki-page-close" onClick={onClose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className="wiki-sidebar">
        <div className="wiki-sidebar-header">
          <h1 className="wiki-title">Referenser</h1>
          <p className="wiki-subtitle">Bakgrund till texterna</p>
        </div>

        {/* Search */}
        <div className="wiki-search">
          <input
            type="text"
            placeholder="Sök..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="wiki-search-input"
          />
        </div>

        {/* Categories */}
        <nav className="wiki-categories">
          <button
            className={`wiki-category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Alla ({wikiEntries.length})
          </button>
          {categories.map(cat => {
            const count = getWikiEntriesByCategory(cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                className={`wiki-category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {categoryLabels[cat]} ({count})
              </button>
            );
          })}
        </nav>

        {/* Entry list */}
        <div className="wiki-entry-list">
          {filteredEntries.map(entry => (
            <button
              key={entry.id}
              className={`wiki-entry-item ${selectedEntry?.id === entry.id ? 'active' : ''}`}
              onClick={() => setSelectedEntry(entry)}
            >
              <span className="wiki-entry-item-term">{entry.term}</span>
              <span className="wiki-entry-item-category">{categoryLabels[entry.category]}</span>
            </button>
          ))}
          {filteredEntries.length === 0 && (
            <p className="wiki-no-results">Inga träffar</p>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="wiki-main">
        {selectedEntry ? (
          <div className="wiki-entry-detail">
            <WikiEntryCard
              entry={selectedEntry}
              onRelatedClick={(id) => {
                const entry = wikiEntries.find(e => e.id === id);
                if (entry) setSelectedEntry(entry);
              }}
            />

            {references.length > 0 && (
              <div className="wiki-entry-references">
                <h3 className="wiki-references-heading">Refereras i</h3>
                <div className="wiki-references-list">
                  {references.map((ref, i) => {
                    const trackData = getTrackById(ref.trackId);
                    if (!trackData) return null;

                    return (
                      <button
                        key={i}
                        className="wiki-reference-item"
                        onClick={() => onNavigateToTrack?.(ref.trackId, ref.lineTime)}
                      >
                        <span className="wiki-reference-track-name">{trackData.track.title}</span>
                        <span className="wiki-reference-timestamp">{formatTime(ref.lineTime)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="wiki-empty-state">
            <div className="wiki-empty-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
              </svg>
            </div>
            <h2>Välj en referens</h2>
            <p>Utforska bakgrunden till ord och begrepp i texterna.</p>
          </div>
        )}
      </main>
    </div>
  );
}
