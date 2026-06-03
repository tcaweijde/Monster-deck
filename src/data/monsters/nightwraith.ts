import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

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
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/nightwraith/card-front-1.png',
  ],
};
