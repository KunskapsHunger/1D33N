import type { Release, Track } from '../types';

// Import all releases
import { ingaSkuggorUtanLjus } from './inga-skuggor-utan-ljus';

// Export all releases as an array
export const releases: Release[] = [
  ingaSkuggorUtanLjus,
];

// Helper to get all tracks across releases
export const getAllTracks = (): Track[] => {
  return releases.flatMap(release => release.tracks);
};

// Helper to get only playable tracks (with audioUrl)
export const getPlayableTracks = (): Track[] => {
  return getAllTracks().filter(track => track.audioUrl);
};

// Helper to find a track by ID
export const getTrackById = (id: string): { track: Track; release: Release } | null => {
  for (const release of releases) {
    const track = release.tracks.find(t => t.id === id);
    if (track) {
      return { track, release };
    }
  }
  return null;
};

// Legacy export for backwards compatibility
export const tracks = getAllTracks();

// Helper to get upcoming (unreleased) releases
export const getUpcomingReleases = (): Release[] => {
  return releases.filter(r => r.revealStage && r.revealStage !== 'released');
};

// Helper to get released releases
export const getReleasedReleases = (): Release[] => {
  return releases.filter(r => !r.revealStage || r.revealStage === 'released');
};

// Helper to check if a release has a countdown
export const hasCountdown = (release: Release): boolean => {
  return !!(release.releaseDate && release.revealStage && release.revealStage !== 'released');
};

// Helper to get visible tracks based on reveal stage
export const getVisibleTracks = (release: Release): Track[] => {
  if (!release.revealStage || release.revealStage === 'released') {
    return release.tracks;
  }

  if (release.revealStage === 'announced' || release.revealStage === 'cover') {
    return [];
  }

  // 'tracklist' or 'snippets' stage
  const count = release.revealedTrackCount ?? release.tracks.length;
  return release.tracks.map((track, index) => {
    if (index < count) {
      return track;
    }
    return {
      ...track,
      title: '???',
      duration: '?:??',
    };
  });
};

// Helper to check if snippets are available
export const hasSnippets = (release: Release): boolean => {
  return release.revealStage === 'snippets' || release.revealStage === 'released';
};

// Re-export types
export type { Release, Track, LyricLine, LyricAnnotation, StreamingLinks, RevealStage } from '../types';

// Re-export individual releases for direct import
export { ingaSkuggorUtanLjus } from './inga-skuggor-utan-ljus';
