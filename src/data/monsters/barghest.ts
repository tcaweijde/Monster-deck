import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const barghest: Monster = {
  id: 'barghest',
  name: 'Barghest',
  level: 1,
  deckSize: 11,
  baseAbility: {
    name: 'Terrifying Howl',
    description: "Before the Player creates their Life Pool, they reduce their Shield level by 1.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Summoning the Pack',
    description: 'During Step 2 of this Fight Turn, the Player draws 2 cards less.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/barghest/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Claws and Fangs', description: 'The Player takes 2 damage and discards 1 Potion.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Call of the Pack', description: 'The Player discards all Defensive Sign (yellow) and Offensive Sign (purple) cards from their hands. If they are not able to discard at least 1, they take 2 damage.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Ghastly Charge', description: 'The Player takes 4 damage and discards 1 Potion.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Knockdown', description: 'The Player takes 1 damage. During Step 4 of the Player\'s next Fight Turn, they draw 0 cards.', trigger: 'passive' as const },
    },
  ],
};
