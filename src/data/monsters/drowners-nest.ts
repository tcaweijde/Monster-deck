import type { Monster } from '../../types';

export const drownersNest: Monster = {
  id: 'drowners-nest',
  name: "Drowners' Nest",
  level: 1,
  deckSize: 10,
  baseAbility: {
    name: 'Murky Waters',
    description: "After the Player creates their Life Pool, they discard any 1 card from their deck. Afterwards, they shuffle their deck.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'drowners-nest-01', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'drowners-nest-02', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'drowners-nest-03', top: { attack: 3 }, bottom: { attack: 1 } },
    { id: 'drowners-nest-04', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'drowners-nest-05', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'drowners-nest-06', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'drowners-nest-07', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'drowners-nest-08', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'drowners-nest-09', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'drowners-nest-10', top: { attack: 3 }, bottom: { attack: 2 } },
  ],
  cardFrontImages: [
    '/images/drowners-nest/card-front-1.png',
  ],
};
