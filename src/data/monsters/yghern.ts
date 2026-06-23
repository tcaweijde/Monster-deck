import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const yghern: Monster = {
  id: 'yghern',
  name: 'Yghern',
  level: 3,
  deckSize: 18,
  baseAbility: {
    name: 'Thick Hide',
    description: "During the entire Fight: each time the Player's combo includes a Fast Attack (blue) card, the Player deals 1 Damage less.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Chitin Armor',
    description: 'If this Fight Turn\'s Player combo has no Strong Attack (red) cards, the Monster ignores 2 of the further damage in this Player\'s Fight Turn, if any.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/yghern/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Venomous Pincers', description: 'The Player takes 7 damage. The Player may discard any 1 unused Potion to decrease the damage by 1, or discard 2 unused Potions to decrease the damage by 3.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Spitting Acid', description: 'The Player discards 4 cards from the top of their deck. (empty deck: any card from their hands).', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Paralyzing Grip', description: 'The Player takes 3 damage. During the Player\'s next Fight Turn, they may only play a combo of 1 card.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Attack from Underground', description: 'The Player discards 1 Dodge (green) card from their hands. If they are not able to discard it, they take 4 damage. The Yghern immediately performs its next Fight Turn.', trigger: 'passive' as const },
    },
  ],
};
