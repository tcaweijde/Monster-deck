import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const drownersNest: Monster = {
  id: 'drowners-nest',
  name: "Drowners' Nest",
  level: 1,
  deckSize: 10,
  baseAbility: {
    name: 'Murky Waters',
    description: "After the Player creates their Life Pool, they discard any 1 card from their deck. Afterwards, they shuffle their deck.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Leap into Depths',
    description: 'The Player discards 1 Potion.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/drowners-nest/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Flooding', description: 'The Player discards 1 random card from their hands (empty hands: from the top of the deck) and places any 2 cards from their hands on top of their deck.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Group Attack', description: 'The Player takes 2 damage. The Drowners Nest immediately performs its next Fight Turn.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Claw Attack', description: 'The Player discards 3 cards from the top of their deck. (empty deck: any card from their hands).', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Leap Attack', description: 'The Player takes 4 damage. During the Player\'s next Fight Turn, the first card in their combo has to be a Fast Attack (blue) or Offensive Sign (purple) card. Otherwise, the Player may only play a combo of 1 card.', trigger: 'passive' as const },
    },
  ],
};
