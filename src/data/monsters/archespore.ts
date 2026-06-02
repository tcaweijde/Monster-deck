import type { Monster } from '../../types';

export const archespore: Monster = {
  id: 'archespore',
  name: 'Archespore',
  level: 1,
  deckSize: 12,
  baseAbility: {
    name: 'Toxic Spores',
    description: "The Player must discard any 1 of their unused Potions (with no effect) to initiate a Fight with this Monster.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'archespore-01', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'archespore-02', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'archespore-03', top: { attack: 3 }, bottom: { attack: 1 } },
    { id: 'archespore-04', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'archespore-05', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'archespore-06', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'archespore-07', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'archespore-08', top: { attack: 1 }, bottom: { attack: 2 } },
    { id: 'archespore-09', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'archespore-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'archespore-11', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'archespore-12', top: { attack: 1 }, bottom: { attack: 2 } },
  ],
  cardFrontImages: [
    '/images/archespore/card-front-1.png',
  ],
};
