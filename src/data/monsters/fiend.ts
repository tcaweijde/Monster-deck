import type { Monster } from '../../types';

export const fiend: Monster = {
  id: 'fiend',
  name: 'Fiend',
  level: 2,
  deckSize: 13,
  baseAbility: {
    name: 'Magic Resistance',
    description: "Offensive Sign (purple) cards have no effect in the Fight. The Player may still use them to extend the Combo.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'fiend-01', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'fiend-02', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'fiend-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'fiend-04', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'fiend-05', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'fiend-06', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'fiend-07', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'fiend-08', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'fiend-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'fiend-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'fiend-11', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'fiend-12', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'fiend-13', top: { attack: 3 }, bottom: { attack: 3 } },
  ],
  cardFrontImages: [
    '/images/fiend/card-front-1.png',
  ],
};
