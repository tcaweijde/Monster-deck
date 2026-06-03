import type { Monster } from '../../types';

export const barghest: Monster = {
  id: 'barghest',
  name: 'Barghest',
  level: 1,
  deckSize: 11,
  baseAbility: {
    name: 'Terrifying Howl',
    description: "Before the Player creates their Life Pool, they reduce their Shield level by 1.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'barghest-01', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'barghest-02', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'barghest-03', top: { attack: 3 }, bottom: { attack: 1 } },
    { id: 'barghest-04', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'barghest-05', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'barghest-06', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'barghest-07', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'barghest-08', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'barghest-09', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'barghest-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'barghest-11', top: { attack: 2 }, bottom: { attack: 3 } },
  ],
  cardFrontImages: [
    '/images/barghest/card-front-1.png',
  ],
};
