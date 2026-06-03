import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const nekkersNest: Monster = {
  id: 'nekkers-nest',
  name: "Nekkers' Nest",
  level: 1,
  deckSize: 11,
  baseAbility: {
    name: 'Swarming Pack',
    description: "During the entire Fight, in the last step of the Player's Fight Turn, if there is no Dodge (green) card in the combo, the Player draws 1 card less.",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/nekkers-nest/1.jpg',
  ],
};
