import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const wyvern: Monster = {
  id: 'wyvern',
  name: 'Wyvern',
  level: 2,
  deckSize: 15,
  baseAbility: {
    name: 'Venom Strike',
    description: "At the end of the Monster's first Fight Turn, the Player discards 1 random card from their hand.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Tail Stun',
    description: 'The Player discards 1 card with the most extensions from their hands.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/wyvern/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Charge from the Air', description: 'The Player discards 1 Fast Attack (blue) card from their hands. If they are not able to discard it, they take 4 damage.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Murderous Claws', description: 'The Player takes 2 damage and trashes any 1 card from their hands.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Poison Spike', description: 'The Player takes 2 damage. During the Player\'s next Fight Turn, they ignore drawing modifiers in their combo.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Poisonous Saliva', description: 'The Player takes 3 damage. During the Player\'s next Fight Turn, they ignore all extension effects in their combo.', trigger: 'passive' as const },
    },
  ],
};
