import type { Monster } from '../../types';

export const arachas: Monster = {
  id: 'arachas',
  name: 'Arachas',
  level: 1,
  deckSize: 10,
  baseAbility: {
    name: 'Venomous Bite',
    description: "Before the Player creates their Life Pool, they discard 1 card from their hand.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'arachas-01', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'arachas-02', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'arachas-03', top: { attack: 3 }, bottom: { attack: 1 } },
    { id: 'arachas-04', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'arachas-05', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'arachas-06', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'arachas-07', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'arachas-08', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'arachas-09', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'arachas-10', top: { attack: 3 }, bottom: { attack: 2 } },
  ],
  cardFrontImages: [
    '/images/arachas/card-front-1.png',
  ],
};
