import type { Monster } from '../../types';

export const griffin: Monster = {
  id: 'griffin',
  name: 'Griffin',
  level: 2,
  deckSize: 12,
  baseAbility: {
    name: 'Aerial Predator',
    description: 'The Griffin attacks from above. +1 attack when it acts first.',
    trigger: 'passive',
  },
  secondaryAbility: {
    name: 'Screech',
    description: 'The player must discard 1 card from their hand after each Griffin attack.',
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Frenzy',
    description: 'When cards are discarded from the Griffin deck, it deals 1 damage to the player.',
    trigger: 'discard',
  },
  cardPool: [
    { id: 'griffin-01', top: { attack: 3, effect: 'Shield 1' }, bottom: { attack: 2 } },
    { id: 'griffin-02', top: { attack: 2 }, bottom: { attack: 4, effect: 'Bleed 1' } },
    { id: 'griffin-03', top: { attack: 1, effect: 'Shield 2' }, bottom: { attack: 3 } },
    { id: 'griffin-04', top: { attack: 4 }, bottom: { attack: 2, effect: 'Shield 1' } },
  ],
  cardFrontImages: [
    '/images/griffin/card-front-1.png',
  ],
};
