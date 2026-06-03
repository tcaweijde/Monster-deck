import type { Monster } from '../../types';

export const nightwraith: Monster = {
  id: 'nightwraith',
  name: 'Nightwraith',
  level: 2,
  deckSize: 14,
  baseAbility: {
    name: 'Haunting Dread',
    description: "During the Player's first Fight Turn, they play the first card in a Combo randomly; then, they may extend this Combo.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'nightwraith-01', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'nightwraith-02', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'nightwraith-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'nightwraith-04', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'nightwraith-05', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'nightwraith-06', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'nightwraith-07', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'nightwraith-08', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'nightwraith-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'nightwraith-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'nightwraith-11', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'nightwraith-12', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'nightwraith-13', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'nightwraith-14', top: { attack: 2 }, bottom: { attack: 3 } },
  ],
  cardFrontImages: [
    '/images/nightwraith/card-front-1.png',
  ],
};
