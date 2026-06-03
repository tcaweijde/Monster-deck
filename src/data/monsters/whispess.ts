import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const whispess: Monster = {
  id: 'whispess',
  name: 'Whispess',
  level: 2,
  deckSize: 15,
  baseAbility: {
    name: 'Cursed Whispers',
    description: "During the entire Fight: each time the Player's Combo includes a Defensive Sign (yellow) card, they lower their Shield level by 2.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/whispess/card-front-1.png',
  ],
};
