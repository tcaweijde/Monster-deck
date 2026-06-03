import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

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
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/archespore/1.jpg',
  ],
};
