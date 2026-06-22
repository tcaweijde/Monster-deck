import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const graveHag: Monster = {
  id: 'grave-hag',
  name: 'Grave Hag',
  level: 2,
  deckSize: 13,
  baseAbility: {
    name: 'Consume the Dead',
    description: "If the Player takes any Damage during the Monster's first Fight Turn, they first discard cards from their hand. Any exceeding Damage is taken following the standard rules.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Unforeseen Reflex',
    description: 'Before Step 4 of the Player\'s Fight Turn, the Player lowers their Shield level by 2. If their Shield level is 0, they discard 1 random card from their hands instead.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/grave-hag/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Tongue Entanglement', description: 'The Player takes 3 damage. During the Player\'s next Fight Turn, their Combat level is lowered to 1.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Tongue Whipping', description: 'The Player takes damage equal to the number of cards in their hands, or they discard half of the cards from their hands (rounded down).', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Clots', description: 'The Player takes damage equal to the number of cards in their hands, or they discard half of the cards from their hands (rounded up).', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Thirst for Victims', description: 'The Player discards random cards from their hands in a number equal to the number of Potions they possess. (0 Potions: 1 card).', trigger: 'passive' as const },
    },
  ],
};
