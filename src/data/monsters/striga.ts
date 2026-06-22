import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const striga: Monster = {
  id: 'striga',
  name: 'Striga',
  level: 3,
  deckSize: 18,
  baseAbility: {
    name: 'Cursed Form',
    description: 'Before the player creates their Life Pool, they lower their Shield level by 1 for each card in their hand.',
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Escape into Shadows',
    description: 'The Monster ignores all of the further damage in this Player\'s Fight Turn, if any. If the Player has already played their combo, they take the last card from it and add it to their hands.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/striga/1.jpeg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Sharp Fangs', description: 'The Player takes 4 damage. During the Player\'s next Fight Turn, they may only apply extension effects in the combo.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Bloodied Claws', description: 'The Player lowers their Shield level to 0 and discards 2 random cards from their hands.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Rapid Attack', description: 'The Player takes damage equal to the number of cards in their hands.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Charged from Above', description: 'The Player takes 3 damage and discards 3 Potions.', trigger: 'passive' as const },
    },
  ],
};
