import type { Monster } from '../../types';

export const graveHag: Monster = {
  id: 'grave-hag',
  name: 'Grave Hag',
  level: 2,
  deckSize: 13,
  baseAbility: {
    name: 'Consume the Dead',
    description: "If the Player takes any Damage during the Monster's first Fight Turn, they first discard cards from their hand. Any exceeding Damage is taken following the standard rules.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'grave-hag-01', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'grave-hag-02', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'grave-hag-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'grave-hag-04', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'grave-hag-05', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'grave-hag-06', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'grave-hag-07', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'grave-hag-08', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'grave-hag-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'grave-hag-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'grave-hag-11', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'grave-hag-12', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'grave-hag-13', top: { attack: 3 }, bottom: { attack: 3 } },
  ],
  cardFrontImages: [
    '/images/grave-hag/card-front-1.png',
  ],
};
