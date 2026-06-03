import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const drownersNest: Monster = {
  id: 'drowners-nest',
  name: "Drowners' Nest",
  level: 1,
  deckSize: 10,
  baseAbility: {
    name: 'Murky Waters',
    description: "After the Player creates their Life Pool, they discard any 1 card from their deck. Afterwards, they shuffle their deck.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/drowners-nest/card-front-1.png',
  ],
};
