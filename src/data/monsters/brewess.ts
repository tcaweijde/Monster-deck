import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const brewess: Monster = {
  id: 'brewess',
  name: 'Brewess',
  level: 3,
  deckSize: 17,
  baseAbility: {
    name: 'Coven Magic',
    description: "During the entire Fight: each time the Player's combo includes a Dodge (green) or Defensive Sign (yellow) card, the Player deals 1 Damage less.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/brewess/1.jpg',
  ],
};
