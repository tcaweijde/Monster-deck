import type { Monster } from '../../types';

export const waterHag: Monster = {
  id: 'water-hag',
  name: 'Water Hag',
  level: 2,
  deckSize: 15,
  baseAbility: {
    name: 'Fetid Aura',
    description: "During the entire Fight, the Player can only use up to 1 Potion.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'water-hag-01', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'water-hag-02', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'water-hag-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'water-hag-04', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'water-hag-05', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'water-hag-06', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'water-hag-07', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'water-hag-08', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'water-hag-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'water-hag-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'water-hag-11', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'water-hag-12', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'water-hag-13', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'water-hag-14', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'water-hag-15', top: { attack: 3 }, bottom: { attack: 2 } },
  ],
  cardFrontImages: [
    '/images/water-hag/card-front-1.png',
  ],
};
