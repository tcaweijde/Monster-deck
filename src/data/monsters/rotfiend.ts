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
  discardAbility: {
    name: 'High Coagulability',
    description: 'The Player lowers the level of any attribute by 1. The Player places 1 die on the Rotfiend\'s card (if there is no die already).',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/rotfiend/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Explosion', description: 'The Monster takes 1 damage and the Player takes 5 damage. (7 damage if there is a die placed on the Rotfiend\'s card).', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Mighty Blast', description: 'The Monster takes 2 damage and the Player discards 5 cards from their hands. (6 if there is a die placed on the Rotfiend\'s card; empty hands: from the top of their deck).', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Agile Attack', description: 'The Player discards 1 Defensive Sign (yellow) card from their hands. If they are not able to discard it, they discard any 3 cards from their hands. (empty hands: from the top of their deck).', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Flammable Fumes', description: 'During the Player\'s next Fight Turn, they may only play a combo of 1 card. The Player places 1 die on the Rotfiend\'s card (if there is no die already).', trigger: 'passive' as const },
    },
  ],
};
