import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const ghoulsNest: Monster = {
  id: 'ghouls-nest',
  name: "Ghouls' Nest",
  level: 1,
  deckSize: 12,
  baseAbility: {
    name: 'Overwhelming Numbers',
    description: "During the Player's first Fight Turn only, the Monster may only discard up to 2 cards (regardless of the Damage dealt).",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/ghouls-nest/card-front-1.png',
  ],
};
