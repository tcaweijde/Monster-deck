import type { Monster } from '../../types';

export const harpy: Monster = {
  id: 'harpy',
  name: 'Harpy',
  level: 1,
  deckSize: 12,
  baseAbility: {
    name: 'Swooping Attack',
    description: "During the Player's first Fight Turn only, their Combat level is lowered to 0. They may still play other effects to draw cards this turn.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'harpy-01', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'harpy-02', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'harpy-03', top: { attack: 3 }, bottom: { attack: 1 } },
    { id: 'harpy-04', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'harpy-05', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'harpy-06', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'harpy-07', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'harpy-08', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'harpy-09', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'harpy-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'harpy-11', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'harpy-12', top: { attack: 1 }, bottom: { attack: 2 } },
  ],
  cardFrontImages: [
    '/images/harpy/card-front-1.png',
  ],
};
