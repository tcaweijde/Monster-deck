import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const leshen: Monster = {
  id: 'leshen',
  name: 'Leshen',
  level: 3,
  deckSize: 19,
  baseAbility: {
    name: 'Ancient Curse',
    description: "Temporarily, during this Fight only, the player's Defence level is lowered by 1. Lower their Shield level if it is above their maximum.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/leshen/1.jpg',
  ],
};
