import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const archespore: Monster = {
  id: 'archespore',
  name: 'Archespore',
  level: 1,
  deckSize: 12,
  baseAbility: {
    name: 'Toxic Spores',
    description: "The Player must discard any 1 of their unused Potions (with no effect) to initiate a Fight with this Monster.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'TODO',
    description: 'TODO',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/archespore/1.jpg',
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
