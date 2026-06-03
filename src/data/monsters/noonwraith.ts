import type { Monster } from '../../types';

export const noonwraith: Monster = {
  id: 'noonwraith',
  name: 'Noonwraith',
  level: 2,
  deckSize: 14,
  baseAbility: {
    name: 'Blinding Mirage',
    description: "During each Player's Fight Turn, their Shield level can only be raised by 1 (in total); they ignore additional Shield raises.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'noonwraith-01', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'noonwraith-02', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'noonwraith-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'noonwraith-04', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'noonwraith-05', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'noonwraith-06', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'noonwraith-07', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'noonwraith-08', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'noonwraith-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'noonwraith-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'noonwraith-11', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'noonwraith-12', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'noonwraith-13', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'noonwraith-14', top: { attack: 2 }, bottom: { attack: 3 } },
  ],
  cardFrontImages: [
    '/images/noonwraith/card-front-1.png',
  ],
};
