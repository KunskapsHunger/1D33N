import type { Track } from '../../types';

export const heroine: Track = {
  id: 'heroine',
  title: 'Heroine',
  duration: '2:29',
  trackNumber: 4,
  audioUrl: '/music/Heroine.mp3',
  videoUrl: '/videos/Heroine.mp4',
  streamingLinks: {
    spotify: 'https://open.spotify.com/',
    apple: 'https://music.apple.com/',
    youtube: 'https://youtube.com/',
  },
  lyrics: [
    { time: 0, text: '' },
    { time: 15.6, text: 'She fought the wolves in the forest night' },
    { time: 20.0, text: 'All alone - forced to fight' },
    { time: 23.6, text: 'Her back against the stone wall' },
    { time: 25.9, text: 'Chin up, she was born tall' },
    { time: 27.7, text: 'No giving up is the core call' },
    { time: 29.1, text: '*Fangs* treating her like a torn ball', annotations: [
      { word: 'Fangs', meaning: 'The wolves - representing life\'s harsh challenges' }
    ]},
    { time: 31.4, text: '*Scarred* tissue - the final page of the issue', emphasis: true },
    { time: 33.6, text: 'On the floor the magazine lies' },
    { time: 35.5, text: 'Our hero got *heroine* ties', annotations: [
      { word: 'heroine', meaning: 'Ordlek mellan hjältinna och drogen heroin', wikiId: 'heroine-ordlek' }
    ]},
    { time: 38.2, text: 'Lying on with needles in her skin' },
    { time: 39.7, text: 'She\'s fighting wolves from *within*', emphasis: true },
    { time: 44.8, text: 'Sorrow in the midnight call' },
    { time: 52.3, text: 'The *heroine* brightens all', emphasis: true },
    { time: 57.9, text: 'Joy finds the place of no escape' },
    { time: 65.0, text: 'Short lived flame' },
    { time: 71.1, text: 'In the fireplace' },
    { time: 73.3, text: 'Her kids watching her fall' },
    { time: 75.4, text: 'Grasping hands with no reach at all' },
    { time: 77.2, text: 'Forced to grow where no one sows' },
    { time: 79.0, text: 'Forced to tow the ungrown spoils' },
    { time: 80.9, text: '*Dissociation*, her destination', annotations: [
      { word: 'Dissociation', meaning: 'Mental escape from reality as a coping mechanism' }
    ]},
    { time: 83.0, text: 'Resting with *Ziggy* on a space station', annotations: [
      { word: 'Ziggy', meaning: 'David Bowies alter ego - symbol för eskapism', wikiId: 'ziggy-stardust' }
    ]},
    { time: 84.4, text: 'No energy for rumination' },
    { time: 86.2, text: 'Running to reach *escape velocity*', emphasis: true },
    { time: 88.3, text: 'Running away from her own atrocity' },
    { time: 90.8, text: 'The dust settles down on us' },
    { time: 92.9, text: 'We keep yearning, but there\'s no learning' },
    { time: 97.1, text: 'In a *heroine\'s* journey', emphasis: true, annotations: [
      { word: 'heroine\'s', meaning: 'Den inre resan nedåt - inte hjältens triumf, utan själens läkning', wikiId: 'heroines-journey' }
    ]},
    { time: 104.0, text: 'Sorrow in the midnight call' },
    { time: 110.8, text: 'The *heroine* brightens all', emphasis: true },
    { time: 116.7, text: 'Joy finds the place of no escape' },
    { time: 124.1, text: 'Short lived flame' },
    { time: 128.7, text: 'In the fireplace' },
  ]
};
