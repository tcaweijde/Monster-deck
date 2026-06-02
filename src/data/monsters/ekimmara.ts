import type { Monster } from '../../types';

export const ekimmara: Monster = {
  id: 'ekimmara',
  name: 'Ekimmara',
  level: 1,
  deckSize: 12,
  baseAbility: {
    name: 'Blood Drain',
    description: "After the Player creates their Life Pool, if they don't have the Trail Token for Ekimmara, they discard any 1 card from their hand.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'ekimmara-01', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'ekimmara-02', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'ekimmara-03', top: { attack: 3 }, bottom: { attack: 1 } },
    { id: 'ekimmara-04', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'ekimmara-05', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'ekimmara-06', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'ekimmara-07', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'ekimmara-08', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'ekimmara-09', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'ekimmara-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'ekimmara-11', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'ekimmara-12', top: { attack: 1 }, bottom: { attack: 2 } },
  ],
  cardFrontImages: [
    '/images/ekimmara/card-front-1.png',
  ],
};
