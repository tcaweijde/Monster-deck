import type { Monster } from '../../types';

export const troll: Monster = {
  id: 'troll',
  name: 'Troll',
  level: 3,
  deckSize: 19,
  baseAbility: {
    name: 'Mighty Slam',
    description: "During the Monster's first Fight Turn only, the Monster deals 3 additional Damage.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'troll-01', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'troll-02', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'troll-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'troll-04', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'troll-05', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'troll-06', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'troll-07', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'troll-08', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'troll-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'troll-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'troll-11', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'troll-12', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'troll-13', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'troll-14', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'troll-15', top: { attack: 3 }, bottom: { attack: 1 } },
    { id: 'troll-16', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'troll-17', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'troll-18', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'troll-19', top: { attack: 2 }, bottom: { attack: 3 } },
  ],
  cardFrontImages: [
    '/images/troll/card-front-1.png',
  ],
};
