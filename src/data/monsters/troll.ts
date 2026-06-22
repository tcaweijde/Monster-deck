import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const troll: Monster = {
  id: 'troll',
  name: 'Troll',
  level: 3,
  deckSize: 19,
  baseAbility: {
    name: 'Mighty Slam',
    description: "During the Monster's first Fight Turn only, the Monster deals 3 additional Damage.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Stone Shell',
    description: 'The Player controlling the Monster picks 1 card from the Monster Fight card Discard Pile and places it back on top of the Monster\'s Live Pool. Solo: draw 1 random discarded Monster Fight card and place it back on top of the Monster\'s Live Pool.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/troll/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Club Strike', description: 'The Player takes 2 damage. During the Player\'s next Fight Turn, ignore Shield symbols in the Player\'s combo.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Whirl', description: 'The Player takes 2 damage. During the Player\'s next Fight Turn, they reveal 1 card from the top of their deck as the first card in their combo. (empty deck: they play the first card in their combo randomly).', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Mighty Fists', description: 'The Player takes 4 damage. During Step 4 of the Player\'s next Fight Turn, they draw a maximum of 1 card.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Boulder Throw', description: 'The Player lowers their Shield level to 0 and discards 2 random cards from their hands. (empty hands: from the top of their deck).', trigger: 'passive' as const },
    },
  ],
};
