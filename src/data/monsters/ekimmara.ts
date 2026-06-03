import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const ekimmara: Monster = {
  id: 'ekimmara',
  name: 'Ekimmara',
  level: 1,
  deckSize: 12,
  baseAbility: {
    name: 'Blood Drain',
    description: "After the Player creates their Life Pool, if they don't have the Trail Token for Ekimmara, they discard any 1 card from their hand.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/ekimmara/card-front-1.png',
  ],
};
