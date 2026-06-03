import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const troll: Monster = {
  id: 'troll',
  name: 'Troll',
  level: 3,
  deckSize: 19,
  baseAbility: {
    name: 'Mighty Slam',
    description: "During the Monster's first Fight Turn only, the Monster deals 3 additional Damage.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/troll/1.jpg',
  ],
};
