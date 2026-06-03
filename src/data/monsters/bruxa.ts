import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const bruxa: Monster = {
  id: 'bruxa',
  name: 'Bruxa',
  level: 3,
  deckSize: 17,
  baseAbility: {
    name: 'Death Frenzy',
    description: "During each Monster's Fight Turn that the Monster has only 1 or 2 cards left in their deck, its Attacks deal 2 additional Damage.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/bruxa/1.jpg',
  ],
};
