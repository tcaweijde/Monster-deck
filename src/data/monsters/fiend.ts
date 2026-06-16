import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const fiend: Monster = {
  id: 'fiend',
  name: 'Fiend',
  level: 2,
  deckSize: 13,
  baseAbility: {
    name: 'Magic Resistance',
    description: "Offensive Sign (purple) cards have no effect in the Fight. The Player may still use them to extend the Combo.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'TODO',
    description: 'TODO',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/fiend/1.png',
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
