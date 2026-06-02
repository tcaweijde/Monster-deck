import type { Monster } from '../../types';

export const penitent: Monster = {
  id: 'penitent',
  name: 'Penitent',
  level: 2,
  deckSize: 14,
  baseAbility: {
    name: 'Overwhelming Presence',
    description: "If the Player does not have the Trail Token, they cannot deal any Damage during their first Fight Turn.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'penitent-01', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'penitent-02', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'penitent-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'penitent-04', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'penitent-05', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'penitent-06', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'penitent-07', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'penitent-08', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'penitent-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'penitent-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'penitent-11', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'penitent-12', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'penitent-13', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'penitent-14', top: { attack: 2 }, bottom: { attack: 3 } },
  ],
  cardFrontImages: [
    '/images/penitent/card-front-1.png',
  ],
};
