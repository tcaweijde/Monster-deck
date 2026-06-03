import type { Monster } from '../../types';

export const ghoulsNest: Monster = {
  id: 'ghouls-nest',
  name: "Ghouls' Nest",
  level: 1,
  deckSize: 12,
  baseAbility: {
    name: 'Overwhelming Numbers',
    description: "During the Player's first Fight Turn only, the Monster may only discard up to 2 cards (regardless of the Damage dealt).",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'ghouls-nest-01', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'ghouls-nest-02', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'ghouls-nest-03', top: { attack: 3 }, bottom: { attack: 1 } },
    { id: 'ghouls-nest-04', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'ghouls-nest-05', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'ghouls-nest-06', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'ghouls-nest-07', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'ghouls-nest-08', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'ghouls-nest-09', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'ghouls-nest-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'ghouls-nest-11', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'ghouls-nest-12', top: { attack: 1 }, bottom: { attack: 2 } },
  ],
  cardFrontImages: [
    '/images/ghouls-nest/card-front-1.png',
  ],
};
