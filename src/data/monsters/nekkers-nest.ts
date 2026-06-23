import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const nekkersNest: Monster = {
  id: 'nekkers-nest',
  name: "Nekkers' Nest",
  level: 1,
  deckSize: 11,
  baseAbility: {
    name: 'Swarming Pack',
    description: "During the entire Fight, in the last step of the Player's Fight Turn, if there is no Dodge (green) card in the combo, the Player draws 1 card less.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Escape Through the Tunnels',
    description: 'During the Monster\'s next Fight Turn, the Player controlling the Monster picks the attack type after the Monster\'s Fight card is revealed. Solo: the Player picks the attack dealing more damage.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/nekkers-nest/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Group Attack', description: 'The Player takes 2 damage. During Step 4 of the Player\'s next Fight Turn, they draw 1 card less.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Attack from Behind', description: 'The Player discards 1 Dodge (green) card from their hands. If they are not able to discard it, they take 2 damage and the Nekkers Nest immediately performs its next Fight Turn.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Synchronized Charge', description: 'The Player discards 3 cards from the top of their deck. (empty deck: random card from their hands).', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Warrior Leadership', description: 'The Player takes 2 damage. During the Player\'s next Fight Turn, they deal 2 damage less.', trigger: 'passive' as const },
    },
  ],
};
