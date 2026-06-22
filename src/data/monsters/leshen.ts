import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const leshen: Monster = {
  id: 'leshen',
  name: 'Leshen',
  level: 3,
  deckSize: 19,
  baseAbility: {
    name: 'Ancient Curse',
    description: "Temporarily, during this Fight only, the player's Defence level is lowered by 1. Lower their Shield level if it is above their maximum.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Teleportation',
    description: 'The Player takes damage equal to the number of dice placed on the Leshen card. (0 dice: the Player takes 1 damage).',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/leshen/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Wildlife Call', description: 'The Player takes 2 damage and places 2 dice on the Leshen card.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Binding Vines', description: 'During the Player\'s next Fight Turn, they ignore Damage symbols in the Player\'s combo. Place 1 die on the Leshen card.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Bear Form', description: 'The Player takes damage equal to the number of dice placed on the Leshen card. During the Player\'s next Fight Turn, the Fight ability of the first card in the combo has to deal at least 2 damage. Otherwise, the Player cannot play their combo.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Wolf Form', description: 'If the Player has the Trail token for Leshen and at least 1 Trail token more, they take 1 damage. Otherwise, they take 4 damage. During Step 4 of the Player\'s next Fight Turn, they draw 1 card less.', trigger: 'passive' as const },
    },
  ],
};
