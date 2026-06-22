import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const archespore: Monster = {
  id: 'archespore',
  name: 'Archespore',
  level: 1,
  deckSize: 12,
  baseAbility: {
    name: 'Toxic Spores',
    description: "The Player must discard any 1 of their unused Potions (with no effect) to initiate a Fight with this Monster.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Cover Over',
    description: 'If this Fight Turn\'s Player combo has no Offensive Sign (purple) cards, the Monster ignores 2 of the further damage in this Player\'s Fight Turn, if any.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/archespore/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Poisoned Spikes', description: 'The Player takes 1 damage. During the Player\'s next Fight Turn, they lower their Shield level by 1 for each card in their combo.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Exploding Spores', description: 'The Player takes 2 damage and discards 1 random card from their hands. (empty hands: 1 card from the top of their deck).', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Acid Split', description: 'The Player discards 3 cards from the top of their deck. (empty deck: random card from their hands).', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Overpowering Vines', description: 'The Player takes 3 damage. During Step 4 of the Player\'s next Fight Turn, they draw a maximum of 1 card.', trigger: 'passive' as const },
    },
  ],
};
