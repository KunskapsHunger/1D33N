import type { Track } from '../../types';

export const rosten: Track = {
  id: 'rosten',
  title: 'Rösten',
  duration: '2:58',
  trackNumber: 6,
  audioUrl: '/music/Rösten.mp3',
  streamingLinks: {
    spotify: 'https://open.spotify.com/',
    apple: 'https://music.apple.com/',
    youtube: 'https://youtube.com/',
  },
  lyrics: [
    { time: 0, text: '' },
    // Intro
    { time: 9.6, text: '*Blommorna* ruttnade, skyltarna försvann', emphasis: true },
    { time: 22.7, text: 'Ändå någonstans minns jag deras *namn*' },
    // Verse 1 - fast rap
    { time: 36.3, text: '*Avbildningsrätt* sätts på sin spets', annotations: [
      { word: 'Avbildningsrätt', meaning: 'Rätten att avbilda och sprida bilder av objekt, platser eller personer' }
    ]},
    { time: 38.6, text: 'Kameror filmar *hemskhet* med hets' },
    { time: 41.6, text: 'Alla nakna inför *sanningen*' },
    { time: 43.4, text: '*Offrens* röst söker sista andningen' },
    { time: 46.4, text: 'Politiker som inte tappar *rösten*, när de erbjuder trösten' },
    { time: 50.7, text: 'Rak i ryggen utan *ånger*, när de lovar ut i sånger' },
    { time: 53.8, text: '*Vänster* och *höger* – båda sidorna söker' },
    { time: 58.2, text: 'Upptagna med att *locka*' },
    { time: 60.5, text: 'Använder sanningen och *lögnen* som en docka' },
    { time: 63.5, text: 'Två sidor av samma *land*, varje nytt fall ger båda sidor blodad tand' },
    // Verse 2
    { time: 70.5, text: 'Dokument inifrån ett land som *delas*' },
    { time: 73.6, text: 'Visuellt långt ifrån det band som *helas*' },
    { time: 76.6, text: 'Saknar *broar* över ruinens kanal' },
    { time: 79.5, text: '*Ondskan* har aldrig varit så banal', emphasis: true, annotations: [
      { word: 'Ondskan', meaning: 'Referens till Hannah Arendts "ondskans banalitet"', wikiId: 'hannah-arendt' }
    ]},
    // Verse 3
    { time: 82.5, text: '*Skogen* och *bergen* – sätter landet först', emphasis: true },
    { time: 85.9, text: 'Floder av *sorger* som föder all dess törst' },
    { time: 89.0, text: 'Folk mot folk längst ner på *botten*' },
    { time: 91.9, text: 'Enigheten göms längst in i *slotten*' },
    // Chorus 1
    { time: 95.1, text: 'En *röst* i vimlet hoppas på att förändra nått', emphasis: true },
    { time: 99.0, text: 'En *näve* möter kinden - se hur långt det har gått' },
    { time: 103.0, text: 'Ett folk isär med minnen av *skräckfylld* misär', emphasis: true },
    { time: 107.0, text: '*Auktoritet* är det enda vi vet' },
    { time: 111.0, text: '*Solidaritet* - vad är ens det?', emphasis: true, annotations: [
      { word: 'Solidaritet', meaning: 'Det tomma ordet som alltid ropas efter tragedier', wikiId: 'solidaritet' }
    ]},
    // Bridge - "En ensam karl"
    { time: 118.0, text: 'En ensam *karl*' },
    { time: 120.0, text: 'En *evighet* utan enighet' },
    { time: 122.4, text: 'Siktar in målet inom en *mil*' },
    { time: 125.0, text: 'Riktar blicken - blir en kastad *pil*' },
    { time: 128.0, text: '*Tjurens* öga rött' },
    { time: 130.0, text: '*Djurisk* instinkt söker kött' },
    { time: 132.5, text: 'Berättelsen sydd i *sorgens* namn' },
    { time: 135.0, text: '*Lejonen* har folket i sin barm' },
    { time: 138.0, text: 'Den *blinde* bredvid den som ber' },
    { time: 141.0, text: 'När det *hemskaste* man kan tänka sig sker' },
    { time: 145.0, text: 'En man, en *lastbil* och satan', emphasis: true },
    { time: 148.0, text: 'Kör tillsammans längsmed *Drottninggatan*', emphasis: true, annotations: [
      { word: 'Drottninggatan', meaning: 'Platsen för terrorattentatet i Stockholm 7 april 2017', wikiId: 'drottninggatan' }
    ]},
    // Outro
    { time: 157.6, text: '*Blommorna* ruttnade, skyltarna försvann', emphasis: true },
    { time: 169.0, text: 'Ändå någonstans minns jag deras *namn*' },
  ]
};
