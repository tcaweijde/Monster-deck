import type { Monster } from '../../types';

export const nekkersNest: Monster = {
  id: 'nekkers-nest',
  name: "Nekkers' Nest",
  level: 1,
  deckSize: 11,
  baseAbility: {
    name: 'Swarming Pack',
    description: "During the entire Fight, in the last step of the Player's Fight Turn, if there is no Dodge (green) card in the combo, the Player draws 1 card less.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'nekkers-nest-01', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'nekkers-nest-02', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'nekkers-nest-03', top: { attack: 3 }, bottom: { attack: 1 } },
    { id: 'nekkers-nest-04', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'nekkers-nest-05', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'nekkers-nest-06', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'nekkers-nest-07', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'nekkers-nest-08', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'nekkers-nest-09', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'nekkers-nest-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'nekkers-nest-11', top: { attack: 2 }, bottom: { attack: 3 } },
  ],
  cardFrontImages: [
    '/images/nekkers-nest/card-front-1.png',
  ],
};
