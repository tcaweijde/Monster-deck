import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

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
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/noonwraith/1.jpg',
  ],
};
