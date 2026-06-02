import type { Monster } from '../../types';

export const werewolf: Monster = {
  id: 'werewolf',
  name: 'Werewolf',
  level: 2,
  deckSize: 10,
  baseAbility: {
    name: 'Regeneration',
    description: 'At the start of each round, return the top card from the discard pile to the bottom of the deck.',
    trigger: 'passive',
  },
  cardPool: [
    { id: 'werewolf-01', top: { attack: 3 }, bottom: { attack: 2, effect: 'Bleed 1' } },
    { id: 'werewolf-02', top: { attack: 2, effect: 'Shield 1' }, bottom: { attack: 4 } },
    { id: 'werewolf-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'werewolf-04', top: { attack: 1, effect: 'Bleed 2' }, bottom: { attack: 3 } }
  ],
  cardFrontImages: [
    '/images/werewolf/card-front-1.svg',
    '/images/werewolf/card-front-2.svg',
    '/images/werewolf/card-front-3.svg',
    '/images/werewolf/card-front-4.svg',
    '/images/werewolf/card-front-5.svg',
  ],
};
