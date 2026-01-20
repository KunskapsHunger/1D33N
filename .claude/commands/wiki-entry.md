# Create Wiki Entry

Analyze a song's lyrics for references and create wiki entries for them.

## Arguments
- $ARGUMENTS: Song name or track ID (e.g., "Rösten" or "rosten")

## Workflow

### 1. Find the track file
- Look in `src/data/releases/*/` for the track file
- Read the lyrics and identify all annotations with or without `wikiId`
- Also scan for potential references that aren't annotated yet

### 2. Identify references to research
Look for:
- Named events (attacks, protests, historical moments)
- Named people (philosophers, politicians, artists)
- Specific places (streets, cities, landmarks)
- Technical/political terms (stratokrati, avbildningsrätt)
- Cultural references (books, films, quotes)
- Swedish-specific references (companies, institutions, slang)

### 3. Research each reference
Use WebSearch to find accurate information:
- Verify facts and dates
- Find context and significance
- Look for Swedish sources when relevant
- Check Wikipedia for reliable background

### 4. Create wiki entries
For each reference, create a file at `src/data/wiki/entries/<id>.ts`:

```typescript
import type { WikiEntry } from '../types';

export const entryName: WikiEntry = {
  id: 'kebab-case-id',
  term: 'Display Term',
  shortDescription: 'One sentence, max 20 words',
  category: 'event' | 'concept' | 'person' | 'place' | 'term',
  content: `
[1D33N voice content here - see style guide below]
  `,
  externalLinks: [
    { label: 'Source Name', url: 'https://...' }
  ],
  relatedEntries: ['other-entry-id'],  // optional
};
```

### 5. Update wiki index
Add the new entry to `src/data/wiki/index.ts`:
- Import the entry
- Add to `wikiEntries` array
- Re-export it

### 6. Link annotations to wiki
Update the track file to add `wikiId` to relevant annotations:
```typescript
annotations: [
  { word: 'term', meaning: 'Short explanation', wikiId: 'entry-id' }
]
```

---

## 1D33N Voice Style Guide

The wiki entries should feel like 1D33N explaining references to a friend - not a Wikipedia article, not a textbook. Brief, punchy, with a dark undertone.

### Tone
- **Direct**: Short sentences. Fragments are fine.
- **Personal**: "I" perspective when connecting to the song
- **Dark but not edgy**: Acknowledge heavy topics without being performative
- **Swedish context**: Assume reader knows Sweden but maybe not specifics

### Structure
- Open with impact (a date, a quote, a stark image)
- Give essential context (2-3 short paragraphs)
- Connect to the song (how/why this reference appears)
- Total: ~150-200 words

### What to avoid
- Academic language ("furthermore", "in conclusion")
- Excessive explanation (trust the reader)
- Moralizing (state facts, let them land)
- Emojis or casual internet speak

### Examples

**Good opening:**
```
Den 7 april 2017. En lastbil. Drottninggatan i Stockholm.
```

**Bad opening:**
```
Drottninggatan is a major shopping street in Stockholm, Sweden, which became the site of a tragic terrorist attack.
```

**Good connection to song:**
```
I "Rösten" är Drottninggatan inte bara en plats - det är ett sår som fortfarande är öppet.
```

**Bad connection:**
```
This reference appears in the song "Rösten" where it symbolizes the impact of terrorism on Swedish society.
```

### Category guidelines
- **event**: Something that happened (attacks, protests, elections)
- **concept**: Abstract ideas (ondskans banalitet, stratokrati)
- **person**: Named individuals (Hannah Arendt, historical figures)
- **place**: Physical locations (Drottninggatan, specific buildings)
- **term**: Swedish words/slang needing explanation (Fonus, specific jargon)

---

## File locations
- Wiki entries: `src/data/wiki/entries/`
- Wiki index: `src/data/wiki/index.ts`
- Wiki types: `src/data/wiki/types.ts`
- Track files: `src/data/releases/<album>/`

## Notes
- Always verify facts with web search before writing
- Prefer Swedish sources for Swedish-specific topics
- Keep `shortDescription` under 20 words (used in tooltips)
- Use `relatedEntries` to connect thematically linked entries
- External links should be reliable sources (Wikipedia, SVT, established news)
