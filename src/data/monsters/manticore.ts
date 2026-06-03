import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const manticore: Monster = {
  id: 'manticore',
  name: 'Manticore',
  level: 2,
  deckSize: 14,
  baseAbility: {
    name: 'Venomous Sting',
    description: "Each time the Monster deals any Damage, it is lowered by 1, and the Player discards 1 random card from their hand.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/manticore/card-front-1.png',
  ],
};
