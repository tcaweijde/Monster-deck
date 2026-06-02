import type { Monster } from '../../types';

export const foglet: Monster = {
  id: 'foglet',
  name: 'Foglet',
  level: 1,
  deckSize: 10,
  baseAbility: {
    name: 'Disorienting Mist',
    description: "During the Monster's first Fight Turn: pick the Attack Type that makes the Player discard more cards from their deck/hand.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'foglet-01', top: { attack: 2, effect: 'Shield 1' }, bottom: { attack: 1 } },
    { id: 'foglet-02', top: { attack: 1 }, bottom: { attack: 3, effect: 'Bleed 1' } },
    { id: 'foglet-03', top: { attack: 3, effect: 'Shield 1' }, bottom: { attack: 2 } },
    { id: 'foglet-04', top: { attack: 2 }, bottom: { attack: 2, effect: 'Shield 1' } },
    { id: 'foglet-05', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'foglet-06', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'foglet-07', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'foglet-08', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'foglet-09', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'foglet-10', top: { attack: 2 }, bottom: { attack: 1 } },
  ],
  cardFrontImages: [
    '/images/foglet/card-front-1.png',
  ],
};
