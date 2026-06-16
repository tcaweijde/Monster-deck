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
    name: 'TODO',
    description: 'TODO',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/wyvern/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Special Attack #1', description: 'TODO', trigger: 'passive' as const },
      discardAbility: { name: 'TODO', description: 'TODO', trigger: 'discard' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Special Attack #2', description: 'TODO', trigger: 'passive' as const },
      discardAbility: { name: 'TODO', description: 'TODO', trigger: 'discard' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Special Attack #3', description: 'TODO', trigger: 'passive' as const },
      discardAbility: { name: 'TODO', description: 'TODO', trigger: 'discard' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Special Attack #4', description: 'TODO', trigger: 'passive' as const },
      discardAbility: { name: 'TODO', description: 'TODO', trigger: 'discard' as const },
    },
  ],
};
