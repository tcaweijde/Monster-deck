import type { Monster } from '../../types';

export const foglet: Monster = {
  id: 'foglet',
  name: 'Foglet',
  level: 1,
  deckSize: 8,
  baseAbility: {
    name: 'Fog Cloak',
    description: 'The Foglet has Shield 1 on every attack.',
    trigger: 'passive',
  },
  secondaryAbility: {
    name: 'Illusory Copies',
    description: 'When the deck reaches half size, shuffle the discard pile back into the deck once.',
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Mist Retaliation',
    description: 'When cards are discarded, the Foglet deals 1 damage to the player if 3+ cards were discarded at once.',
    trigger: 'discard',
  },
  cardPool: [
    { id: 'foglet-01', top: { attack: 2, effect: 'Shield 1' }, bottom: { attack: 1 } },
    { id: 'foglet-02', top: { attack: 1 }, bottom: { attack: 3, effect: 'Bleed 1' } },
    { id: 'foglet-03', top: { attack: 3, effect: 'Shield 1' }, bottom: { attack: 2 } },
    { id: 'foglet-04', top: { attack: 2 }, bottom: { attack: 2, effect: 'Shield 1' } },
  ],
  cardFrontImages: [
    '/images/foglet/card-front-1.svg',
    '/images/foglet/card-front-2.svg',
    '/images/foglet/card-front-3.svg',
    '/images/foglet/card-front-4.svg',
    '/images/foglet/card-front-5.svg',
  ],
};
