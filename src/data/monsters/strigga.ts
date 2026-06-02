import type { Monster } from '../../types';

export const strigga: Monster = {
  id: 'strigga',
  name: 'Strigga',
  level: 3,
  deckSize: 19,
  baseAbility: {
    name: 'Regeneration',
    description: 'At the start of each round, return the top card from the discard pile to the bottom of the deck.',
    trigger: 'passive',
  },
  cardPool: [
    { id: 'strigga-01', top: { attack: 3 }, bottom: { attack: 2, effect: 'Bleed 1' } },
    { id: 'strigga-02', top: { attack: 2, effect: 'Shield 1' }, bottom: { attack: 4 } },
    { id: 'strigga-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'strigga-04', top: { attack: 1, effect: 'Bleed 2' }, bottom: { attack: 3 } }
  ],
  cardFrontImages: [
    '/images/strigga/card-front-1.svg',
    '/images/strigga/card-front-2.svg',
    '/images/strigga/card-front-3.svg',
    '/images/strigga/card-front-4.svg',
    '/images/strigga/card-front-5.svg',
  ],
};
