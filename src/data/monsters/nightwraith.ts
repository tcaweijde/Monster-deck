import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const nightwraith: Monster = {
  id: 'nightwraith',
  name: 'Nightwraith',
  level: 2,
  deckSize: 14,
  baseAbility: {
    name: 'Haunting Dread',
    description: "During the Player's first Fight Turn, they play the first card in a Combo randomly; then, they may extend this Combo.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Dematerialisation',
    description: 'If this Fight Turn\'s Player combo has no Offensive Sign (purple) cards, the Monster ignores all further damage in this Player\'s Fight Turn, if any. If the Player has already played their combo, they take the last card from it and add it to their hands.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/nightwraith/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Levitation', description: 'The Player takes 2 damage. The Player\'s next combo deals a maximum of 1 damage.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Energy Drain', description: 'The Monster puts 2 randomly chosen cards from its Discard Pile on top of its Live Pool. The Player lowers their Shield level by 2.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Master Energy Drain', description: 'The Monster puts randomly chosen cards from its Discard Pile on top of its Live Pool in a number equal to the Player\'s Shield level. The Player lowers their Shield level to 0.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Creating Illusions', description: 'The Player takes 3 damage. The Monster adds 2 random cards from the unused Monster Fight cards on top of its Live Pool.', trigger: 'passive' as const },
    },
  ],
};
