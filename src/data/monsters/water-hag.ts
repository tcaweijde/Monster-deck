import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const waterHag: Monster = {
  id: 'water-hag',
  name: 'Water Hag',
  level: 2,
  deckSize: 15,
  baseAbility: {
    name: 'Fetid Aura',
    description: "During the entire Fight, the Player can only use up to 1 Potion.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/water-hag/1.jpg',
  ],
};
