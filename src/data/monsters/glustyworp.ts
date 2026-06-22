import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const glustyworp: Monster = {
  id: 'glustyworp',
  name: 'Glustyworp',
  level: 3,
  deckSize: 18,
  baseAbility: {
    name: 'Paralyzing Grip',
    description: "During the Player's first Fight Turn only, they can deal a maximum of 1 Damage.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Hard Armor',
    description: 'The Monster ignores all of the further damage in this Player\'s Fight Turn, if any. The Player draws 2 Potions and resets their Potion limits.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/glustyworp/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Pulling Underwater', description: 'The Player discards 1 Defensive Sign (yellow) card from their hands. If they are not able to discard it, they take 5 damage. The Glustyworp immediately performs its next Fight Turn.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Tongue Attack', description: 'The Player takes 4 damage. During the Player\'s next Fight Turn, ignore Shield symbols in the Player\'s combo.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Sharp Teeth', description: 'The Player lowers their Shield level to 0 and discards any 2 cards from their hands. (empty hands: from the top of the deck).', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Tail Bash', description: 'The Player takes 5 damage. During Step 4 of the Player\'s next Fight Turn, they draw 2 cards less.', trigger: 'passive' as const },
    },
  ],
};
