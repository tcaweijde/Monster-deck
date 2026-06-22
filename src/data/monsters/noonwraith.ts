import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const noonwraith: Monster = {
  id: 'noonwraith',
  name: 'Noonwraith',
  level: 2,
  deckSize: 14,
  baseAbility: {
    name: 'Blinding Mirage',
    description: "During each Player's Fight Turn, their Shield level can only be raised by 1 (in total); they ignore additional Shield raises.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Resistance to Signs',
    description: 'The Player discards 1 Offensive Sign (purple) or Defensive Sign (yellow) card from their hands. If they are not able to discard it, they discard 1 card from the top of their deck. (empty deck: any 1 card from their hands).',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/noonwraith/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Duplication', description: 'The Player takes 3 damage. During the Monster\'s next Fight Turn, the Player controlling the Monster picks the attack type after revealing the Monster\'s Fight card. Solo: the Player picks the attack dealing more damage.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Dematerialization', description: 'The Player takes 3 damage. During Step 4 of the Player\'s next Fight Turn, they draw a maximum of 1 card.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Cast the Circle', description: 'The Player takes 2 damage, increased by the number of Potions they possess.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Absorption', description: 'The Player takes 2 damage. During the Player\'s next Fight Turn, each Strong Attack (red) and Fast Attack (blue) card deals 1 damage less.', trigger: 'passive' as const },
    },
  ],
};
