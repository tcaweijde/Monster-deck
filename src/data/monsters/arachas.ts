import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const arachas: Monster = {
  id: 'arachas',
  name: 'Arachas',
  level: 1,
  deckSize: 10,
  baseAbility: {
    name: 'Venomous Bite',
    description: "Before the Player creates their Life Pool, they discard 1 card from their hand.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/arachas/card-front-1.png',
  ],
};
