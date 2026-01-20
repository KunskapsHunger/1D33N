import type { WikiEntry } from '../../data/wiki';
import { categoryLabels } from '../../data/wiki';
import './WikiEntryCard.css';

interface WikiEntryCardProps {
  entry: WikiEntry;
  compact?: boolean;
  onRelatedClick?: (entryId: string) => void;
}

export function WikiEntryCard({ entry, compact = false, onRelatedClick }: WikiEntryCardProps) {
  return (
    <article className={`wiki-entry-card ${compact ? 'wiki-entry-card--compact' : ''}`}>
      <header className="wiki-entry-header">
        <span className="wiki-entry-category">{categoryLabels[entry.category]}</span>
        <h2 className="wiki-entry-term">{entry.term}</h2>
      </header>

      <div className="wiki-entry-content">
        {entry.content.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {entry.externalLinks && entry.externalLinks.length > 0 && (
        <div className="wiki-entry-links">
          {entry.externalLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="wiki-external-link"
            >
              {link.label}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          ))}
        </div>
      )}

      {entry.relatedEntries && entry.relatedEntries.length > 0 && onRelatedClick && (
        <div className="wiki-entry-related">
          <span className="wiki-related-label">Relaterat:</span>
          {entry.relatedEntries.map((relatedId) => (
            <button
              key={relatedId}
              className="wiki-related-link"
              onClick={() => onRelatedClick(relatedId)}
            >
              {relatedId}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
