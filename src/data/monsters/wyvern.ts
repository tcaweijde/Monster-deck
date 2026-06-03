import type { Monster } from '../../types';

export const wyvern: Monster = {
  id: 'wyvern',
  name: 'Wyvern',
  level: 2,
  deckSize: 15,
  baseAbility: {
    name: 'Venom Strike',
    description: "At the end of the Monster's first Fight Turn, the Player discards 1 random card from their hand.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'wyvern-01', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'wyvern-02', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'wyvern-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'wyvern-04', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'wyvern-05', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'wyvern-06', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'wyvern-07', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'wyvern-08', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'wyvern-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'wyvern-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'wyvern-11', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'wyvern-12', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'wyvern-13', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'wyvern-14', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'wyvern-15', top: { attack: 3 }, bottom: { attack: 2 } },
  ],
  cardFrontImages: [
    '/images/wyvern/card-front-1.png',
  ],
};
