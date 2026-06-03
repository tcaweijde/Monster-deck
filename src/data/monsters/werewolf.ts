import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const werewolf: Monster = {
  id: 'werewolf',
  name: 'Werewolf',
  level: 2,
  deckSize: 14,
  baseAbility: {
    name: 'Cursed Wounds',
    description: 'Before the Player creates their Life Pool, they lower their Shield level by 2.',
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/werewolf/1.jpg',
  ],
};
