import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const wyvern: Monster = {
  id: 'wyvern',
  name: 'Wyvern',
  level: 2,
  deckSize: 15,
  baseAbility: {
    name: 'Venom Strike',
    description: "At the end of the Monster's first Fight Turn, the Player discards 1 random card from their hand.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/wyvern/card-front-1.png',
  ],
};
