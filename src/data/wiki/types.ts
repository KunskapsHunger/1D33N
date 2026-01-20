// Wiki entry types

export type WikiCategory = 'event' | 'concept' | 'person' | 'place' | 'term';

export interface WikiEntry {
  id: string;
  term: string;
  shortDescription: string;      // Tooltip preview (~20 words)
  content: string;               // Full article, 1D33N voice (~200 words)
  category: WikiCategory;
  relatedEntries?: string[];     // IDs of related wiki entries
  externalLinks?: WikiExternalLink[];
}

export interface WikiExternalLink {
  label: string;
  url: string;
}

export interface WikiReference {
  entryId: string;
  trackId: string;
  lineTime: number;
}

export const categoryLabels: Record<WikiCategory, string> = {
  event: 'Händelse',
  concept: 'Koncept',
  person: 'Person',
  place: 'Plats',
  term: 'Term',
};
