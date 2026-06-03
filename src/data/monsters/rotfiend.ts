import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const rotfiend: Monster = {
  id: 'rotfiend',
  name: 'Rotfiend',
  level: 1,
  deckSize: 11,
  baseAbility: {
    name: 'Death Explosion',
    description: 'When the Rotfiend is defeated, the player draws only 1 card during Phase III. This cannot be modified.',
    trigger: 'passive',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/rotfiend/card-front-1.png',
  ],
};
