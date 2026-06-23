import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const waterHag: Monster = {
  id: 'water-hag',
  name: 'Water Hag',
  level: 2,
  deckSize: 15,
  baseAbility: {
    name: 'Fetid Aura',
    description: "During the entire Fight, the Player can only use up to 1 Potion.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Hiding in the Mud',
    description: 'The Player discards 1 Strong Attack (red) card from their hands. If they are not able to discard it, they place any 2 cards from their hands on the bottom of their deck.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/water-hag/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Mud Throw', description: 'The Player takes 2 damage. During the Player\'s next Fight Turn, they play the first card in their combo randomly.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Claw Attack', description: 'The Player takes 3 damage. During the Player\'s next Fight Turn, ignore Shield symbols in the Player\'s combo.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Flooding', description: 'The Player takes 3 damage. If the Player\'s next combo has no Defensive Sign (yellow) cards, it deals 3 damage less.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Unforeseen Speed', description: 'The Player takes 3 damage. During Step 4 of the Player\'s next Fight Turn, they draw 0 cards.', trigger: 'passive' as const },
    },
  ],
};
