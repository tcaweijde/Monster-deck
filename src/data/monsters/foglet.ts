import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const foglet: Monster = {
  id: 'foglet',
  name: 'Foglet',
  level: 1,
  deckSize: 10,
  baseAbility: {
    name: 'Disorienting Mist',
    description: "During the Monster's first Fight Turn: pick the Attack Type that makes the Player discard more cards from their deck/hand.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/foglet/1.jpg',
  ],
};
