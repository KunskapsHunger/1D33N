import type { Track } from '../../types';

export const drakar: Track = {
  id: 'drakar',
  title: 'Drakar',
  duration: '3:36',
  trackNumber: 7,
  audioUrl: '/music/Drakar.mp3',
  streamingLinks: {
    spotify: 'https://open.spotify.com/',
    apple: 'https://music.apple.com/',
    youtube: 'https://youtube.com/',
  },
  lyrics: [
    { time: 0, text: '' },
    // Verse 1 - intro
    { time: 14.0, text: 'Burkarna i tältet bredvid stolar *tomma*' },
    { time: 18.0, text: 'Välta glas och trasigt *bord*' },
    { time: 21.0, text: 'Ingen vill i ord *beskriva*' },
    { time: 24.0, text: 'Allt väntas ändå på att *rivas*' },
    { time: 27.1, text: 'Tjugo år senare börjar det *nerskrivas*' },
    // Verse 2
    { time: 35.6, text: 'Ett barn som ser och inte kan *lämna*', emphasis: true },
    { time: 38.0, text: 'Skapar världar där han kan *hämnas*' },
    { time: 39.7, text: 'En hjälte som borgen *försvarar*' },
    { time: 41.1, text: 'Låt inte draken se oss *försvagad*' },
    { time: 42.9, text: 'Ta fram sköld, svärd och *spjut*' },
    { time: 44.6, text: 'Döden har aldrig tagit oss *förut*' },
    { time: 46.3, text: 'Tre män vid porten släpper ingen *förbi*' },
    { time: 48.0, text: 'Saknar vi korten för att vinna denna *strid*?' },
    // Chorus 1
    { time: 54.7, text: '*Verkligheten* är ett barns illusion', emphasis: true, annotations: [
      { word: 'Verkligheten', meaning: 'Barnets fantasi som skydd mot traumatisk verklighet', wikiId: 'barns-illusion' }
    ]},
    { time: 60.2, text: 'Fyller det sorgliga med sin *mission*' },
    { time: 67.3, text: 'Befria landet från drakens *bett*' },
    { time: 74.0, text: 'Det sista slaget har ännu inte *skett*' },
    // Verse 3
    { time: 80.8, text: 'Vad väntar *draken* på?', emphasis: true },
    { time: 83.1, text: 'Vad är det som *står* på?' },
    { time: 84.7, text: '*ALARM*', emphasis: true },
    { time: 86.0, text: 'Hotet kommer *inifrån*' },
    { time: 88.0, text: 'Kungen med *dolk*' },
    { time: 90.0, text: 'Mot drottningens *hud*' },
    { time: 91.8, text: 'Påverkad man som tror sig vara *gud*' },
    { time: 95.2, text: 'Siktar min pil mot hans *hand*' },
    { time: 97.1, text: 'Siktet stabilt, säkert och *sant*' },
    { time: 98.9, text: 'Räddar fröken för *stunden*' },
    { time: 100.3, text: 'Men draken attackerar på *sekunden*' },
    // Chorus 2
    { time: 107.5, text: '*Verkligheten* är ett barns illusion', emphasis: true },
    { time: 113.8, text: 'Fyller det sorgliga med sin *mission*' },
    { time: 120.3, text: 'Befria landet från drakens *bett*' },
    { time: 127.0, text: 'Det sista slaget har ännu inte *skett*' },
    // Bridge
    { time: 132.5, text: 'En mamma som gått in i *dörren*' },
    { time: 137.2, text: 'En pappa med skam i *själen*' },
    { time: 140.5, text: 'Ett barn drömmer bort till den egna *världen*', emphasis: true, annotations: [
      { word: 'världen', meaning: 'Fantasi som flykt från familjens dysfunktion', wikiId: 'egna-varlden' }
    ]},
    // Verse 4
    { time: 148.9, text: 'Borgen faller när elden tar *vid*', emphasis: true },
    { time: 151.9, text: 'Hjältar ligger döda *bredvid*' },
    { time: 155.7, text: 'Ensam kvar står pojken i sin *rustning*' },
    { time: 159.4, text: 'Lyfter svärdet med skakad *hand*' },
    { time: 162.7, text: '*Draken* måste bort från vårat land', emphasis: true, annotations: [
      { word: 'Draken', meaning: 'Symbol för destruktiv kraft i familjen', wikiId: 'draken' }
    ]},
    // Bridge 2
    { time: 166.7, text: 'På parkeringen slåss en fader och *son*' },
    { time: 170.9, text: 'Den ene drar i den andres *hår*' },
    { time: 175.1, text: 'Skapar ett evigt *sår*', emphasis: true },
    // Outro
    { time: 181.9, text: 'Borgen *faller*' },
    { time: 183.4, text: 'Hjälten *flyr*' },
    { time: 186.2, text: 'Inget kunde hjälpa, inte ens en *myt*' },
    // Final chorus line
    { time: 196.4, text: '*Verkligheten* är ett barns illusion', emphasis: true },
  ]
};
