import type { WikiEntry, WikiCategory, WikiReference } from './types';
import { getAllTracks } from '../releases';

// Import all entries
import { drottninggatan } from './entries/drottninggatan';
import { stratokrati } from './entries/stratokrati';
import { hannahArendt } from './entries/hannah-arendt';
import { fonus } from './entries/fonus';
import { pappasorgen } from './entries/pappasorgen';
import { faaderlosaMaan } from './entries/faderlosa-man';
import { sigilletPaBorgen } from './entries/sigillet-pa-borgen';
import { sisyfos } from './entries/sisyfos';
import { agamemnon } from './entries/agamemnon';
import { odysseus } from './entries/odysseus';
import { heroineOrdlek } from './entries/heroine-ordlek';
import { ziggyStardust } from './entries/ziggy-stardust';
import { raskolnikov } from './entries/raskolnikov';
import { npc } from './entries/npc';
import { frokenSnusk } from './entries/froken-snusk';
import { aLagshjalten } from './entries/a-lagshjalten';
import { uncleBen } from './entries/uncle-ben';
import { avgrunden } from './entries/avgrunden';
import { heroinesJourney } from './entries/heroines-journey';
import { kalkOchLera } from './entries/kalk-och-lera';
import { solidaritet } from './entries/solidaritet';
import { bockerOmStoraMan } from './entries/bocker-om-stora-man';
import { soundOfSilence } from './entries/sound-of-silence';
import { narcissus } from './entries/narcissus';
import { sirenerna } from './entries/sirenerna';
import { sanktPeter } from './entries/sankt-peter';

// Export all entries as array
export const wikiEntries: WikiEntry[] = [
  drottninggatan,
  stratokrati,
  hannahArendt,
  fonus,
  pappasorgen,
  faaderlosaMaan,
  sigilletPaBorgen,
  sisyfos,
  agamemnon,
  odysseus,
  heroineOrdlek,
  ziggyStardust,
  raskolnikov,
  npc,
  frokenSnusk,
  aLagshjalten,
  uncleBen,
  avgrunden,
  heroinesJourney,
  kalkOchLera,
  solidaritet,
  bockerOmStoraMan,
  soundOfSilence,
  narcissus,
  sirenerna,
  sanktPeter,
];

// Get entry by ID
export const getWikiEntryById = (id: string): WikiEntry | null => {
  return wikiEntries.find(entry => entry.id === id) || null;
};

// Search entries by term or content
export const searchWikiEntries = (query: string): WikiEntry[] => {
  const lowerQuery = query.toLowerCase();
  return wikiEntries.filter(entry =>
    entry.term.toLowerCase().includes(lowerQuery) ||
    entry.shortDescription.toLowerCase().includes(lowerQuery) ||
    entry.content.toLowerCase().includes(lowerQuery)
  );
};

// Get entries by category
export const getWikiEntriesByCategory = (category: WikiCategory): WikiEntry[] => {
  return wikiEntries.filter(entry => entry.category === category);
};

// Get all references to a wiki entry (which songs use it)
export const getWikiReferences = (entryId: string): WikiReference[] => {
  const references: WikiReference[] = [];
  const tracks = getAllTracks();

  for (const track of tracks) {
    for (const line of track.lyrics) {
      if (line.annotations) {
        for (const annotation of line.annotations) {
          if (annotation.wikiId === entryId) {
            references.push({
              entryId,
              trackId: track.id,
              lineTime: line.time,
            });
          }
        }
      }
    }
  }

  return references;
};

// Get all categories that have entries
export const getActiveCategories = (): WikiCategory[] => {
  const categories = new Set<WikiCategory>();
  wikiEntries.forEach(entry => categories.add(entry.category));
  return Array.from(categories);
};

// Re-export types
export * from './types';

// Re-export individual entries
export { drottninggatan } from './entries/drottninggatan';
export { stratokrati } from './entries/stratokrati';
export { hannahArendt } from './entries/hannah-arendt';
export { fonus } from './entries/fonus';
export { pappasorgen } from './entries/pappasorgen';
export { faaderlosaMaan } from './entries/faderlosa-man';
export { sigilletPaBorgen } from './entries/sigillet-pa-borgen';
export { sisyfos } from './entries/sisyfos';
export { agamemnon } from './entries/agamemnon';
export { odysseus } from './entries/odysseus';
export { heroineOrdlek } from './entries/heroine-ordlek';
export { ziggyStardust } from './entries/ziggy-stardust';
export { raskolnikov } from './entries/raskolnikov';
export { npc } from './entries/npc';
export { frokenSnusk } from './entries/froken-snusk';
export { aLagshjalten } from './entries/a-lagshjalten';
export { uncleBen } from './entries/uncle-ben';
export { avgrunden } from './entries/avgrunden';
export { heroinesJourney } from './entries/heroines-journey';
export { kalkOchLera } from './entries/kalk-och-lera';
export { solidaritet } from './entries/solidaritet';
export { bockerOmStoraMan } from './entries/bocker-om-stora-man';
export { soundOfSilence } from './entries/sound-of-silence';
export { narcissus } from './entries/narcissus';
export { sirenerna } from './entries/sirenerna';
export { sanktPeter } from './entries/sankt-peter';
