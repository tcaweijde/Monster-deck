import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const griffin: Monster = {
  id: 'griffin',
  name: 'Griffin',
  level: 2,
  deckSize: 15,
  baseAbility: {
    name: 'Windstorm',
    description: "During the entire Fight, in the last step of the Player's Fight Turn, they draw 1 card less (to a minimum of 1).",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Wing Cover',
    description: 'If this Player\'s Fight Turn combo has no Offensive Sign (purple) or Strong Attack (red) card, the Monster ignores 2 of the further damage in this Player\'s Fight Turn, if any.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/griffin/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Beak Strike', description: 'The Player takes 2 damage and discards 1 Potion.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Precise Beak Strike', description: 'The Player takes 3 damage and discards 2 Potions.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Scratch', description: 'The Player discards 1 Offensive Sign (purple) card from their hands. If they are not able to discard it, they lower their Shield level to 0. The Griffin immediately takes its next Fight Turn.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Air Charge', description: 'The Player takes 3 damage. During the Player\'s next Fight Turn, they may only play a combo of 1 or 2 cards.', trigger: 'passive' as const },
    },
  ],
};
