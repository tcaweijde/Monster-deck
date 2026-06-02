import type { Monster } from '../../types';

export const griffin: Monster = {
  id: 'griffin',
  name: 'Griffin',
  level: 2,
  deckSize: 15,
  baseAbility: {
    name: 'Windstorm',
    description: "During the entire Fight, in the last step of the Player's Fight Turn, they draw 1 card less (to a minimum of 1).",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'griffin-01', top: { attack: 3, effect: 'Shield 1' }, bottom: { attack: 2 } },
    { id: 'griffin-02', top: { attack: 2 }, bottom: { attack: 4, effect: 'Bleed 1' } },
    { id: 'griffin-03', top: { attack: 1, effect: 'Shield 2' }, bottom: { attack: 3 } },
    { id: 'griffin-04', top: { attack: 4 }, bottom: { attack: 2, effect: 'Shield 1' } },
    { id: 'griffin-05', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'griffin-06', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'griffin-07', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'griffin-08', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'griffin-09', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'griffin-10', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'griffin-11', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'griffin-12', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'griffin-13', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'griffin-14', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'griffin-15', top: { attack: 2 }, bottom: { attack: 3 } },
  ],
  cardFrontImages: [
    '/images/griffin/card-front-1.png',
  ],
};
