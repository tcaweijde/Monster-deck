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
    name: 'TODO',
    description: 'TODO',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/werewolf/1.jpg',
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
