import type { Monster } from '../../types';

export const whispess: Monster = {
  id: 'whispess',
  name: 'Whispess',
  level: 2,
  deckSize: 15,
  baseAbility: {
    name: 'Cursed Whispers',
    description: "During the entire Fight: each time the Player's Combo includes a Defensive Sign (yellow) card, they lower their Shield level by 2.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'whispess-01', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'whispess-02', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'whispess-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'whispess-04', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'whispess-05', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'whispess-06', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'whispess-07', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'whispess-08', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'whispess-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'whispess-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'whispess-11', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'whispess-12', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'whispess-13', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'whispess-14', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'whispess-15', top: { attack: 3 }, bottom: { attack: 2 } },
  ],
  cardFrontImages: [
    '/images/whispess/card-front-1.png',
  ],
};
