import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const brewess: Monster = {
  id: 'brewess',
  name: 'Brewess',
  level: 3,
  deckSize: 17,
  baseAbility: {
    name: 'Coven Magic',
    description: "During the entire Fight: each time the Player's combo includes a Dodge (green) or Defensive Sign (yellow) card, the Player deals 1 Damage less.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Immersion in Blood',
    description: 'During the Monster\'s next Fight Turn, the Monster deals 2 more damage.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/brewess/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Mighty Blows', description: 'The Player takes 2 damage and discards all Dodge (green) and Defensive Sign (yellow) cards from their hands.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Attack from Behind', description: 'The Player discards 3 cards from the bottom of their deck.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Ancient Magic', description: 'The Player takes 4 damage. During the Player\'s next Fight Turn, they ignore all extension effects in their combo.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Master Ancient Magic', description: 'The Player takes 5 damage. During the Player\'s next Fight Turn, ignore all extension effects in the combo.', trigger: 'passive' as const },
    },
  ],
};
