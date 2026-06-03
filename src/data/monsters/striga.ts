import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const striga: Monster = {
  id: 'striga',
  name: 'Striga',
  level: 3,
  deckSize: 18,
  baseAbility: {
    name: 'Cursed Form',
    description: 'Before the player creates their Life Pool, they lower their Shield level by 1 for each card in their hand.',
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/striga/card-front-1.png',
  ],
};
