import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const penitent: Monster = {
  id: 'penitent',
  name: 'Penitent',
  level: 2,
  deckSize: 14,
  baseAbility: {
    name: 'Overwhelming Presence',
    description: "If the Player does not have the Trail Token, they cannot deal any Damage during their first Fight Turn.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/penitent/1.jpg',
  ],
};
