import type { Monster } from '../../types';

export const yghern: Monster = {
  id: 'yghern',
  name: 'Yghern',
  level: 3,
  deckSize: 18,
  baseAbility: {
    name: 'Thick Hide',
    description: "During the entire Fight: each time the Player's combo includes a Fast Attack (blue) card, the Player deals 1 Damage less.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'yghern-01', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'yghern-02', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'yghern-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'yghern-04', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'yghern-05', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'yghern-06', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'yghern-07', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'yghern-08', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'yghern-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'yghern-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'yghern-11', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'yghern-12', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'yghern-13', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'yghern-14', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'yghern-15', top: { attack: 3 }, bottom: { attack: 1 } },
    { id: 'yghern-16', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'yghern-17', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'yghern-18', top: { attack: 3 }, bottom: { attack: 2 } },
  ],
  cardFrontImages: [
    '/images/yghern/card-front-1.png',
  ],
};
