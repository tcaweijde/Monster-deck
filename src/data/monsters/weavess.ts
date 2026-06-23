import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const weavess: Monster = {
  id: 'weavess',
  name: 'Weavess',
  level: 2,
  deckSize: 14,
  baseAbility: {
    name: 'Dark Ritual',
    description: "Before the Player creates their Life Pool, their Defence level is lowered by 1. Lower their Shield level if it is above their maximum.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'The All-Seeing Eye',
    description: 'The active Player shows their cards from their hand to the Player controlling the Monster, who discards any 1 card of the lowest cost from the active Player\'s hands. Solo: they discard any 1 card of the lowest cost from their hands.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/weavess/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Gift of Prediction', description: 'The Monster draws 1 random card from the Player\'s hands. (empty hands: from the top of the deck). The Monster deals damage equal to the number of all symbols shown on this card\'s Fight ability section. After this, the card is discarded.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Calling the People', description: 'The Player takes 5 damage, decreased by the number of Weavess weakness tokens they possess.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'The Power of the Tapestry', description: 'The Player takes 1 damage and discards any 1 highest-cost card from their hands.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Mighty Power of the Tapestry', description: 'The Player takes 1 damage. The Player looks at the top 3 cards of their deck and trashes 1 of them. (empty deck: any 1 card from their hands).', trigger: 'passive' as const },
    },
  ],
};
