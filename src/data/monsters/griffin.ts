import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const griffin: Monster = {
  id: 'griffin',
  name: 'Griffin',
  level: 2,
  deckSize: 15,
  baseAbility: {
    name: 'Windstorm',
    description: "During the entire Fight, in the last step of the Player's Fight Turn, they draw 1 card less (to a minimum of 1).",
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/griffin/card-front-1.png',
  ],
};
