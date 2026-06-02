import type { Monster } from '../../types';

export const glustyworp: Monster = {
  id: 'glustyworp',
  name: 'Glustyworp',
  level: 3,
  deckSize: 18,
  baseAbility: {
    name: 'Paralyzing Grip',
    description: "During the Player's first Fight Turn only, they can deal a maximum of 1 Damage.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'glustyworp-01', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'glustyworp-02', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'glustyworp-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'glustyworp-04', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'glustyworp-05', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'glustyworp-06', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'glustyworp-07', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'glustyworp-08', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'glustyworp-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'glustyworp-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'glustyworp-11', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'glustyworp-12', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'glustyworp-13', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'glustyworp-14', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'glustyworp-15', top: { attack: 3 }, bottom: { attack: 1 } },
    { id: 'glustyworp-16', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'glustyworp-17', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'glustyworp-18', top: { attack: 3 }, bottom: { attack: 2 } },
  ],
  cardFrontImages: [
    '/images/glustyworp/card-front-1.png',
  ],
};
