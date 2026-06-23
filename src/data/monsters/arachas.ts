import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const arachas: Monster = {
  id: 'arachas',
  name: 'Arachas',
  level: 1,
  deckSize: 10,
  baseAbility: {
    name: 'Venomous Bite',
    description: "Before the Player creates their Life Pool, they discard 1 card from their hand.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Thick Armor',
    description: 'The Fight ability of the first card in the Player\'s next combo has to deal at least 2 damage. Otherwise the Player cannot play a combo. Ignore any further passive attacks during this Fight Turn.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/arachas/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Binding Web', description: 'The Player discards 2 random cards from their hands. (empty hands: from the top of their deck).', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Poisoning', description: 'The Player takes 4 damage. During the entire Fight, the Player may raise their Shield level by a maximum of 1 during each Fight Turn.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: '6-Legged Charge', description: 'The Player discards 1 Dodge (green) card from their hands. If they cannot, the Player takes 2 damage and the Arachas immediately performs its next Fight Turn.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Tong Attack', description: 'The Player takes 3 damage. During the Player\'s next Fight Turn, they may only play a combo of 1 or 2 cards.', trigger: 'passive' as const },
    },
  ],
};
