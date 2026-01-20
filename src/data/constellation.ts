/**
 * Constellation Data
 * Defines the thematic universe connecting songs, concepts, and wiki entries
 */

export interface ConstellationNode {
  id: string;
  label: string;
  category: 'theme' | 'character' | 'concept' | 'place';
  wikiId?: string;  // Link to wiki entry
  trackIds: string[];  // Songs that reference this theme
  // Position in constellation (0-1 normalized, will be scaled)
  x: number;
  y: number;
}

export interface ConstellationEdge {
  from: string;
  to: string;
  strength: 'strong' | 'medium' | 'weak';
}

// Core themes that form the constellation
export const constellationNodes: ConstellationNode[] = [
  // Central themes
  {
    id: 'faderloshet',
    label: 'Faderlöshet',
    category: 'theme',
    wikiId: 'faderlosa-man',
    trackIds: ['far-och-jag', 'narhet', 'artificiell'],
    x: 0.5,
    y: 0.3,
  },
  {
    id: 'identitet',
    label: 'Identitet',
    category: 'theme',
    trackIds: ['medierad', 'heroine', 'rosten', 'narhet', 'morkret', 'artificiell'],
    x: 0.35,
    y: 0.5,
  },
  {
    id: 'kamp',
    label: 'Kampen',
    category: 'theme',
    wikiId: 'sisyfos',
    trackIds: ['sisyfos-bror', 'fornekad', 'drakar', 'artificiell'],
    x: 0.65,
    y: 0.5,
  },
  {
    id: 'myter',
    label: 'Myter & Hjältar',
    category: 'concept',
    wikiId: 'bocker-om-stora-man',
    trackIds: ['sisyfos-bror', 'heroine', 'far-och-jag', 'drakar'],
    x: 0.5,
    y: 0.7,
  },
  {
    id: 'trauma',
    label: 'Barndomstrauma',
    category: 'theme',
    trackIds: ['drakar', 'narhet'],
    x: 0.5,
    y: 0.15,
  },

  // Character nodes
  {
    id: 'sisyfos',
    label: 'Sisyfos',
    category: 'character',
    wikiId: 'sisyfos',
    trackIds: ['sisyfos-bror', 'artificiell'],
    x: 0.75,
    y: 0.35,
  },
  {
    id: 'odysseus',
    label: 'Odysseus',
    category: 'character',
    wikiId: 'odysseus',
    trackIds: ['sisyfos-bror'],
    x: 0.82,
    y: 0.55,
  },
  {
    id: 'raskolnikov',
    label: 'Raskolnikov',
    category: 'character',
    wikiId: 'raskolnikov',
    trackIds: ['medierad'],
    x: 0.2,
    y: 0.35,
  },
  {
    id: 'ziggy',
    label: 'Ziggy Stardust',
    category: 'character',
    wikiId: 'ziggy-stardust',
    trackIds: ['heroine'],
    x: 0.15,
    y: 0.6,
  },

  // Concept nodes
  {
    id: 'persona',
    label: 'Persona',
    category: 'concept',
    wikiId: 'froken-snusk',
    trackIds: ['medierad', 'heroine'],
    x: 0.25,
    y: 0.75,
  },
  {
    id: 'avgrund',
    label: 'Avgrunden',
    category: 'concept',
    wikiId: 'avgrunden',
    trackIds: ['fornekad', 'morkret'],
    x: 0.7,
    y: 0.75,
  },
  {
    id: 'solidaritet',
    label: 'Solidaritet',
    category: 'concept',
    wikiId: 'solidaritet',
    trackIds: ['rosten'],
    x: 0.4,
    y: 0.85,
  },
  {
    id: 'uppoffring',
    label: 'Uppoffring',
    category: 'concept',
    wikiId: 'uncle-ben',
    trackIds: ['fornekad', 'far-och-jag'],
    x: 0.6,
    y: 0.85,
  },
  {
    id: 'draken',
    label: 'Draken',
    category: 'concept',
    wikiId: 'draken',
    trackIds: ['drakar'],
    x: 0.85,
    y: 0.2,
  },
  {
    id: 'narhet-tema',
    label: 'Närhet',
    category: 'theme',
    wikiId: 'narhet',
    trackIds: ['narhet'],
    x: 0.15,
    y: 0.25,
  },
  {
    id: 'generationstrauma',
    label: 'Generationstrauma',
    category: 'concept',
    wikiId: 'generationstrauma',
    trackIds: ['narhet', 'far-och-jag'],
    x: 0.3,
    y: 0.15,
  },
];

// Connections between themes
export const constellationEdges: ConstellationEdge[] = [
  // Core connections
  { from: 'faderloshet', to: 'identitet', strength: 'strong' },
  { from: 'faderloshet', to: 'kamp', strength: 'strong' },
  { from: 'faderloshet', to: 'myter', strength: 'strong' },
  { from: 'identitet', to: 'kamp', strength: 'medium' },
  { from: 'identitet', to: 'myter', strength: 'medium' },
  { from: 'kamp', to: 'myter', strength: 'strong' },

  // Character connections
  { from: 'kamp', to: 'sisyfos', strength: 'strong' },
  { from: 'sisyfos', to: 'odysseus', strength: 'medium' },
  { from: 'myter', to: 'odysseus', strength: 'medium' },
  { from: 'identitet', to: 'raskolnikov', strength: 'medium' },
  { from: 'identitet', to: 'ziggy', strength: 'strong' },
  { from: 'persona', to: 'ziggy', strength: 'strong' },

  // Concept connections
  { from: 'identitet', to: 'persona', strength: 'strong' },
  { from: 'kamp', to: 'avgrund', strength: 'strong' },
  { from: 'myter', to: 'solidaritet', strength: 'medium' },
  { from: 'myter', to: 'uppoffring', strength: 'strong' },
  { from: 'faderloshet', to: 'uppoffring', strength: 'medium' },
  { from: 'avgrund', to: 'uppoffring', strength: 'weak' },
  { from: 'solidaritet', to: 'uppoffring', strength: 'weak' },

  // Trauma connections (new)
  { from: 'trauma', to: 'faderloshet', strength: 'strong' },
  { from: 'trauma', to: 'identitet', strength: 'strong' },
  { from: 'trauma', to: 'kamp', strength: 'medium' },
  { from: 'trauma', to: 'narhet-tema', strength: 'strong' },
  { from: 'trauma', to: 'generationstrauma', strength: 'strong' },

  // Draken connections (new)
  { from: 'draken', to: 'trauma', strength: 'strong' },
  { from: 'draken', to: 'myter', strength: 'medium' },
  { from: 'draken', to: 'kamp', strength: 'medium' },

  // Närhet connections (new)
  { from: 'narhet-tema', to: 'identitet', strength: 'strong' },
  { from: 'narhet-tema', to: 'generationstrauma', strength: 'strong' },
  { from: 'narhet-tema', to: 'faderloshet', strength: 'medium' },

  // Generationstrauma connections (new)
  { from: 'generationstrauma', to: 'faderloshet', strength: 'strong' },
  { from: 'generationstrauma', to: 'identitet', strength: 'medium' },

  // Avgrund-Morkret connection (new)
  { from: 'avgrund', to: 'identitet', strength: 'medium' },
];

// Get node by ID
export const getConstellationNode = (id: string): ConstellationNode | undefined => {
  return constellationNodes.find(n => n.id === id);
};

// Get all edges connected to a node
export const getNodeEdges = (nodeId: string): ConstellationEdge[] => {
  return constellationEdges.filter(e => e.from === nodeId || e.to === nodeId);
};

// Get connected node IDs
export const getConnectedNodes = (nodeId: string): string[] => {
  const edges = getNodeEdges(nodeId);
  const connected = new Set<string>();
  edges.forEach(e => {
    if (e.from === nodeId) connected.add(e.to);
    if (e.to === nodeId) connected.add(e.from);
  });
  return Array.from(connected);
};
