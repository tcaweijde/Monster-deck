import type { Monster } from '../../types';

export const brewess: Monster = {
  id: 'brewess',
  name: 'Brewess',
  level: 3,
  deckSize: 17,
  baseAbility: {
    name: 'Coven Magic',
    description: "During the entire Fight: each time the Player's combo includes a Dodge (green) or Defensive Sign (yellow) card, the Player deals 1 Damage less.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'brewess-01', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'brewess-02', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'brewess-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'brewess-04', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'brewess-05', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'brewess-06', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'brewess-07', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'brewess-08', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'brewess-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'brewess-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'brewess-11', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'brewess-12', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'brewess-13', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'brewess-14', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'brewess-15', top: { attack: 3 }, bottom: { attack: 1 } },
    { id: 'brewess-16', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'brewess-17', top: { attack: 2 }, bottom: { attack: 3 } },
  ],
  cardFrontImages: [
    '/images/brewess/card-front-1.png',
  ],
};
