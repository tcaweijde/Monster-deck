import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const weavess: Monster = {
  id: 'weavess',
  name: 'Weavess',
  level: 2,
  deckSize: 14,
  baseAbility: {
    name: 'Dark Ritual',
    description: "Before the Player creates their Life Pool, their Defence level is lowered by 1. Lower their Shield level if it is above their maximum.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/weavess/1.jpg',
  ],
};
