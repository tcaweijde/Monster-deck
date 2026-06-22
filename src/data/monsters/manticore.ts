import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const manticore: Monster = {
  id: 'manticore',
  name: 'Manticore',
  level: 2,
  deckSize: 14,
  baseAbility: {
    name: 'Venomous Sting',
    description: "Each time the Monster deals any Damage, it is lowered by 1, and the Player discards 1 random card from their hand.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Air Soar',
    description: 'The Monster ignores 1 of the further damage in this Player\'s Fight Turn. The first card in the Player\'s next combo has to be a Fast Attack (blue) card. Otherwise, the Player may only play a combo of 1 card.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/manticore/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Air Strike', description: 'The Player takes 3 damage and loses 2 Gold.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Venomous Sting', description: 'The Player takes 2 damage and discards 1 unused Potion. If they have no Potions, they take 4 additional damage.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Tail Bash', description: 'The Player takes 3 damage. During the Player\'s next Fight Turn, they may only play a combo of 1 or 2 cards.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Claw Cutting', description: 'The Player takes 2 damage. During the entire Fight, the Player\'s Defence level is lowered by 2.', trigger: 'passive' as const },
    },
  ],
};
