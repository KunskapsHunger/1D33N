// Shared types for releases and tracks

export interface LyricAnnotation {
  word: string;
  meaning: string;
  wikiId?: string;  // Links to wiki entry for "read more"
}

export interface LyricLine {
  time: number;
  text: string;
  emphasis?: boolean;
  annotations?: LyricAnnotation[];
}

export interface StreamingLinks {
  spotify?: string;
  apple?: string;
  youtube?: string;
  soundcloud?: string;
}

export interface Track {
  id: string;
  title: string;
  duration: string;
  trackNumber?: number;
  lyrics: LyricLine[];
  audioUrl?: string;
  videoUrl?: string;
  streamingLinks?: StreamingLinks;
  snippetUrl?: string;
  snippetDuration?: number;
}

export type RevealStage =
  | 'announced'
  | 'cover'
  | 'tracklist'
  | 'snippets'
  | 'released';

export interface Release {
  id: string;
  title: string;
  type: 'album' | 'single' | 'ep';
  year: number;
  coverArt?: string;
  coverArtBlurred?: string;
  description?: string;
  tracks: Track[];
  releaseDate?: string;
  revealStage?: RevealStage;
  revealedTrackCount?: number;
  announcement?: string;
}
