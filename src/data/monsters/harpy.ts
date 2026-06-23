import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const harpy: Monster = {
  id: 'harpy',
  name: 'Harpy',
  level: 1,
  deckSize: 12,
  baseAbility: {
    name: 'Swooping Attack',
    description: "During the Player's first Fight Turn only, their Combat level is lowered to 0. They may still play other effects to draw cards this turn.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Acute Beak',
    description: 'Before Step 4 of the Player\'s Fight Turn, the Player takes Damage equal to half of the further damage dealt to the Monster in this Player\'s Fight Turn (rounded down).',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/harpy/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Wing Stun', description: 'The Player takes 2 damage. During Step 4 of the Player\'s next Fight Turn, they draw 2 cards less.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Nosediving', description: 'The Player discards 1 Dodge (green) card from their hands. If they are not able to discard it, they lower their Shield level to 0 and the Harpy immediately attacks again.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Air Charge', description: 'The Player discards 1 Dodge (green) card from their hands. If they are not able to discard it, they lower their Shield level to 0 and take 3 damage.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Sharp Talons', description: 'The Player trashes 1 card from the top of their deck. (empty deck: from their hand).', trigger: 'passive' as const },
    },
  ],
};
