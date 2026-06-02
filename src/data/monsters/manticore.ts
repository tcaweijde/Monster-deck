import type { Monster } from '../../types';

export const manticore: Monster = {
  id: 'manticore',
  name: 'Manticore',
  level: 2,
  deckSize: 14,
  baseAbility: {
    name: 'Venomous Sting',
    description: "Each time the Monster deals any Damage, it is lowered by 1, and the Player discards 1 random card from their hand.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'manticore-01', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'manticore-02', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'manticore-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'manticore-04', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'manticore-05', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'manticore-06', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'manticore-07', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'manticore-08', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'manticore-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'manticore-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'manticore-11', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'manticore-12', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'manticore-13', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'manticore-14', top: { attack: 2 }, bottom: { attack: 3 } },
  ],
  cardFrontImages: [
    '/images/manticore/card-front-1.png',
  ],
};
