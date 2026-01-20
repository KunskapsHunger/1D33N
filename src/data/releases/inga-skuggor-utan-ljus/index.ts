import type { Release } from '../../types';

import { sisyfosBror } from './sisyfos-bror';
import { fornekad } from './fornekad';
import { medierad } from './medierad';
import { heroine } from './heroine';
import { narhet } from './narhet';
import { rosten } from './rosten';
import { drakar } from './drakar';
import { farOchJag } from './far-och-jag';
import { artificiell } from './artificiell';
import { morkret } from './morkret';

export const ingaSkuggorUtanLjus: Release = {
  id: 'skuggor-och-ljus',
  title: 'Inga skuggor utan ljus',
  type: 'album',
  year: 2025,
  coverArt: '/covers/inga_skuggor_utan_ljus.png',
  description: 'I skuggorna syns ljuset enbart med sin frånvaro.',
  tracks: [
    sisyfosBror,
    fornekad,
    medierad,
    heroine,
    narhet,
    rosten,
    drakar,
    farOchJag,
    morkret,
    artificiell,
  ].sort((a, b) => (a.trackNumber ?? 0) - (b.trackNumber ?? 0))
};

// Re-export individual tracks for direct access
export { sisyfosBror, fornekad, medierad, heroine, narhet, rosten, drakar, farOchJag, artificiell, morkret };
