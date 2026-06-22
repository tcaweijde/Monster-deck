import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const fiend: Monster = {
  id: 'fiend',
  name: 'Fiend',
  level: 2,
  deckSize: 13,
  baseAbility: {
    name: 'Magic Resistance',
    description: "Offensive Sign (purple) cards have no effect in the Fight. The Player may still use them to extend the Combo.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Healing',
    description: 'The Monster adds a random card from the unused Fight cards to the bottom of its Live Pool.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/fiend/1.png',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Hypnosis', description: 'The Player takes 2 damage and places 3 random cards from their hands on top of their deck.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Strong Hypnosis', description: 'The Player takes 3 damage and places all cards from their hands back on top of their deck in random order.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Long Charge', description: 'The Player discards 1 Dodge (green) card from their hands. If they are not able to discard it, they take 4 damage.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Furious Charge', description: 'The Player discards 1 Fast Attack (blue) card from their hands. If they cannot, they lower their Shield level to 0. The Fiend immediately performs its next Fight Turn.', trigger: 'passive' as const },
    },
  ],
};
