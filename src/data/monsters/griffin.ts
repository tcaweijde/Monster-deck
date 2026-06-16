import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const griffin: Monster = {
  id: 'griffin',
  name: 'Griffin',
  level: 2,
  deckSize: 15,
  baseAbility: {
    name: 'Windstorm',
    description: "During the entire Fight, in the last step of the Player's Fight Turn, they draw 1 card less (to a minimum of 1).",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'TODO',
    description: 'TODO',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/griffin/1.jpg',
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
