import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const graveHag: Monster = {
  id: 'grave-hag',
  name: 'Grave Hag',
  level: 2,
  deckSize: 13,
  baseAbility: {
    name: 'Consume the Dead',
    description: "If the Player takes any Damage during the Monster's first Fight Turn, they first discard cards from their hand. Any exceeding Damage is taken following the standard rules.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/grave-hag/1.jpg',
  ],
};
