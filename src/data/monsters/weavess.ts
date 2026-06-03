import type { Monster } from '../../types';

export const weavess: Monster = {
  id: 'weavess',
  name: 'Weavess',
  level: 2,
  deckSize: 14,
  baseAbility: {
    name: 'Dark Ritual',
    description: "Before the Player creates their Life Pool, their Defence level is lowered by 1. Lower their Shield level if it is above their maximum.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'weavess-01', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'weavess-02', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'weavess-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'weavess-04', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'weavess-05', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'weavess-06', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'weavess-07', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'weavess-08', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'weavess-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'weavess-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'weavess-11', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'weavess-12', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'weavess-13', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'weavess-14', top: { attack: 2 }, bottom: { attack: 3 } },
  ],
  cardFrontImages: [
    '/images/weavess/card-front-1.png',
  ],
};
