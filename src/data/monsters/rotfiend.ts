import type { Monster } from '../../types';

export const rotfiend: Monster = {
  id: 'rotfiend',
  name: 'Rotfiend',
  level: 1,
  deckSize: 11,
  baseAbility: {
    name: 'Death Explosion',
    description: 'When the Rotfiend is defeated, the player draws only 1 card during Phase III. This cannot be modified.',
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue)
  cardPool: [
    { id: 'rotfiend-01', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'rotfiend-02', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'rotfiend-03', top: { attack: 3 }, bottom: { attack: 1 } },
    { id: 'rotfiend-04', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'rotfiend-05', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'rotfiend-06', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'rotfiend-07', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'rotfiend-08', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'rotfiend-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'rotfiend-10', top: { attack: 1 }, bottom: { attack: 1 } },
    { id: 'rotfiend-11', top: { attack: 2 }, bottom: { attack: 2 } },
  ],
  cardFrontImages: [
    '/images/rotfiend/card-front-1.png',
  ],
};
