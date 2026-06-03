import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const glustyworp: Monster = {
  id: 'glustyworp',
  name: 'Glustyworp',
  level: 3,
  deckSize: 18,
  baseAbility: {
    name: 'Paralyzing Grip',
    description: "During the Player's first Fight Turn only, they can deal a maximum of 1 Damage.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/glustyworp/1.jpg',
  ],
};
