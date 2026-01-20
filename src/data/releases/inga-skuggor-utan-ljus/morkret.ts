import type { Track } from '../../types';

export const morkret: Track = {
  id: 'morkret',
  title: 'Mörkret',
  duration: '0:49',
  trackNumber: 9,
  audioUrl: '/music/Mörkret.mp3',
  streamingLinks: {
    spotify: 'https://open.spotify.com/',
    apple: 'https://music.apple.com/',
    youtube: 'https://youtube.com/',
  },
  lyrics: [
    { time: 0, text: '' },
    { time: 11.8, text: 'Looking for *clarity* in an ever growing void' },
    { time: 16.4, text: 'Searching for *sanity* before the world recoils' },
    { time: 20.6, text: 'The air is filled with its *essence*' },
    { time: 23.7, text: 'The shadows illuminate its *presence*' },
    { time: 26.6, text: 'I never truly stopped to *look*' },
    { time: 29.2, text: 'The *abyss*, still has hooks', annotations: [
      { word: 'abyss', meaning: 'Nietzsche\'s metaphor - stare into the abyss and it stares back', wikiId: 'avgrunden' }
    ]},
    { time: 32.1, text: 'The light was never for me to *find*' },
    { time: 34.8, text: '-- The brutal truth is that I don\'t *mind*', emphasis: true },
    { time: 39.3, text: 'Hello *darkness*, my old friend', emphasis: true, annotations: [
      { word: 'Hello darkness', meaning: 'Reference to Simon & Garfunkel\'s "The Sound of Silence"', wikiId: 'sound-of-silence' }
    ]},
    { time: 45.7, text: 'I\'ve come to *embrace* you once again', emphasis: true },
  ]
};
