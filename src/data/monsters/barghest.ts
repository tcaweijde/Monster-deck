import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const barghest: Monster = {
  id: 'barghest',
  name: 'Barghest',
  level: 1,
  deckSize: 11,
  baseAbility: {
    name: 'Terrifying Howl',
    description: "Before the Player creates their Life Pool, they reduce their Shield level by 1.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/barghest/card-front-1.png',
  ],
};
