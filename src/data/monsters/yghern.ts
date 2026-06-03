import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const yghern: Monster = {
  id: 'yghern',
  name: 'Yghern',
  level: 3,
  deckSize: 18,
  baseAbility: {
    name: 'Thick Hide',
    description: "During the entire Fight: each time the Player's combo includes a Fast Attack (blue) card, the Player deals 1 Damage less.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/yghern/1.jpg',
  ],
};
