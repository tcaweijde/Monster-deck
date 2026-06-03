import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const fiend: Monster = {
  id: 'fiend',
  name: 'Fiend',
  level: 2,
  deckSize: 13,
  baseAbility: {
    name: 'Magic Resistance',
    description: "Offensive Sign (purple) cards have no effect in the Fight. The Player may still use them to extend the Combo.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/fiend/1.png',
  ],
};
