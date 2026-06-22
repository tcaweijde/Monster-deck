import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const werewolf: Monster = {
  id: 'werewolf',
  name: 'Werewolf',
  level: 2,
  deckSize: 14,
  baseAbility: {
    name: 'Cursed Wounds',
    description: 'Before the Player creates their Life Pool, they lower their Shield level by 2.',
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Regeneration',
    description: 'The Monster ignores half of the further damage in this Player\'s Fight Turn, rounded up.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/werewolf/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Monster Strength', description: 'The Player discards 1 Potion, loses 1 Gold and takes 2 damage.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Wild Fury', description: 'The Player takes 3 damage. During the Player\'s next Fight Turn, they deal 2 damage less.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Wolf\'s Speed', description: 'The Player takes 4 damage. The Player may not play any Fast Attack (blue) cards during the next Fight Turn.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Calling the Pack', description: 'The Player takes damage equal to the number of cards in their hands.', trigger: 'passive' as const },
    },
  ],
};
