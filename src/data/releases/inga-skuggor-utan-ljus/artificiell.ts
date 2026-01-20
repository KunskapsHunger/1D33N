import type { Track } from '../../types';

export const artificiell: Track = {
  id: 'artificiell',
  title: 'Artificiell',
  duration: '2:55',
  trackNumber: 10,
  audioUrl: '/music/Artificiell.mp3',
  streamingLinks: {
    spotify: 'https://open.spotify.com/',
    apple: 'https://music.apple.com/',
    youtube: 'https://youtube.com/',
  },
  lyrics: [
    { time: 0, text: '' },
    // Vers 1
    { time: 16.7, text: 'Jag känner det i *varje* cell' },
    { time: 19.4, text: 'Jag är *artificiell*', emphasis: true },
    { time: 21.8, text: 'Gör det *officiellt*' },
    { time: 24.4, text: 'Ordet mitt, det är *speciellt*' },
    { time: 27.2, text: 'Själen skriker "*ÄNTLIGEN*"', emphasis: true },
    { time: 29.4, text: 'Låt orden berika *främlingen*' },
    { time: 31.8, text: 'Vid bordet finns *ingen* nu' },
    { time: 33.7, text: 'Har sållat bort det som *stinger* nu' },
    { time: 36.1, text: 'Fållorna var aldrig *stängda*' },
    { time: 38.6, text: 'Sanningen var det *förvrängda*' },
    { time: 40.9, text: 'Kan ingen se förbi min *ängslan*?' },
    // Chorus
    { time: 44.5, text: '*När* ska jag helas?', emphasis: true },
    { time: 46.9, text: '*Hur* ska jag kunna dela?' },
    { time: 49.0, text: 'Om jag inte förmår att *förmedla*' },
    { time: 51.1, text: 'Ska allt in på vinden och *förseglas*?' },
    { time: 54.0, text: 'Ska jag låta mig *besegras*?' },
    { time: 58.3, text: 'Eller låtas låta *medierad*' },
    // Vers 2
    { time: 63.9, text: 'Är allt bortkastat när jag nämner *farsan*?' },
    { time: 66.6, text: 'Ska jag välja drogen, rösten eller *flaskan*?' },
    { time: 69.1, text: 'Ska jag förneka mig *Sorgen*, trösten eller askan?' },
    { time: 71.7, text: '*Tiden* ekar medan rummet simmar' },
    { time: 73.6, text: '*Trumman* trummar på i timmar' },
    { time: 76.1, text: '*Tummar* summan - syr och limmar' },
    { time: 78.5, text: '*Euforin* hos en vampyr som syndar' },
    { time: 81.9, text: 'Får inte styra eller *skynda*' },
    { time: 84.2, text: 'En sak i *taget*' },
    { time: 86.2, text: 'Ta en för *laget*' },
    { time: 88.4, text: 'Klockan har inte nått *tolvslaget*' },
    // Chorus 2
    { time: 92.9, text: '*När* ska jag helas?', emphasis: true },
    { time: 94.9, text: '*Hur* ska jag kunna dela?' },
    { time: 97.0, text: 'Om jag inte förmår att *förmedla*' },
    { time: 99.1, text: 'Ska allt in på vinden och *förseglas*?' },
    { time: 101.9, text: 'Ska jag låta mig *besegras*?' },
    { time: 106.0, text: 'Eller låtas låta *medierad*' },
    // Vers 3
    { time: 113.0, text: '*Äktheten* syns i orden som blöder' },
    { time: 115.6, text: 'I sorgen hos min systers *söner*' },
    { time: 118.0, text: 'Eller faderns dystra *böner*' },
    { time: 120.4, text: 'I fragmenten som aldrig såg *dagen*' },
    { time: 122.9, text: '*Testamentet* nedslaget' },
    { time: 125.4, text: 'Vill du *följa* med?' },
    { time: 127.5, text: '-- Och *rulla* på en sten?', annotations: [
      { word: 'rulla på en sten', meaning: 'Referens till Sisyfos som rullar sin sten - meningslöst arbete' }
    ]},
    // Outro - spoken word
    { time: 132.5, text: '*Tankar* som tankar tankar' },
    { time: 135.0, text: '*Ord* som föder ord på ord' },
    { time: 138.0, text: 'Går på gruset utan *skor*' },
    { time: 141.9, text: 'Måste vara *Sisyfos* bror', emphasis: true, annotations: [
      { word: 'Sisyfos', meaning: 'Grekisk mytologisk figur som straffades att rulla en sten uppför ett berg i evighet', wikiId: 'sisyfos' }
    ]},
  ]
};
