import type { Monster } from '../../types';

export const leshen: Monster = {
  id: 'leshen',
  name: 'Leshen',
  level: 3,
  deckSize: 18,
  baseAbility: {
    name: 'Regeneration',
    description: 'At the start of each round, return the top card from the discard pile to the bottom of the deck.',
    trigger: 'passive',
  },
  cardPool: [
    { id: 'leshen-01', top: { attack: 3 }, bottom: { attack: 2, effect: 'Bleed 1' } },
    { id: 'leshen-02', top: { attack: 2, effect: 'Shield 1' }, bottom: { attack: 4 } },
    { id: 'leshen-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'leshen-04', top: { attack: 1, effect: 'Bleed 2' }, bottom: { attack: 3 } }
  ],
  cardFrontImages: [
    '/images/leshen/card-front-1.svg',
    '/images/leshen/card-front-2.svg',
    '/images/leshen/card-front-3.svg',
    '/images/leshen/card-front-4.svg',
    '/images/leshen/card-front-5.svg',
  ],
};
