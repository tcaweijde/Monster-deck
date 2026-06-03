import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const harpy: Monster = {
  id: 'harpy',
  name: 'Harpy',
  level: 1,
  deckSize: 12,
  baseAbility: {
    name: 'Swooping Attack',
    description: "During the Player's first Fight Turn only, their Combat level is lowered to 0. They may still play other effects to draw cards this turn.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/harpy/1.jpg',
  ],
};
