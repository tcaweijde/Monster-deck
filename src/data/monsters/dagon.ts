import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const dagon: Monster = {
  id: 'dagon',
  name: 'Dagon',
  level: 2,
  deckSize: 15,
  baseAbility: {
    name: 'Ancient Dominion',
    description: 'The Player may not inflict more than 5 damage in one Fight Turn.',
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Summon Vodyanoi',
    description:
      'The Player discards 1 Water Terrain card from their hand. If they cannot, they discard 2 cards from the top of their deck instead.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: ['/images/monsters/dagon/1.jpg'],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: {
        name: 'Power of an Ancient God',
        description:
          'The Player takes 4 damage, reduced by 1 for each Water Terrain card in their hand.',
        trigger: 'passive' as const,
      },
    },
    {
      number: 2 as const,
      drawAbility: {
        name: 'Mighty Power of an Ancient God',
        description: 'The Player takes 5 damage.',
        trigger: 'passive' as const,
      },
    },
    {
      number: 3 as const,
      drawAbility: {
        name: 'Magic Storm',
        description:
          'If the Player has a Water Terrain card in their hand, they discard 2 cards from the top of their deck. Otherwise, they discard 2 random cards from their hand.',
        trigger: 'passive' as const,
      },
    },
    {
      number: 4 as const,
      drawAbility: {
        name: 'Magic Flood',
        description:
          'The Player discards 3 cards from the top of their deck. If their deck is empty, they discard 3 random cards from their hand instead.',
        trigger: 'passive' as const,
      },
    },
  ],
};
