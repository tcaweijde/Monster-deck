import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const penitent: Monster = {
  id: 'penitent',
  name: 'Penitent',
  level: 2,
  deckSize: 14,
  baseAbility: {
    name: 'Overwhelming Presence',
    description: "If the Player does not have the Trail Token, they cannot deal any Damage during their first Fight Turn.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Disappearance',
    description: 'During this Player\'s Fight Turn, they ignore drawing modifiers in the combo.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/penitent/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Summoning Waves', description: 'The Player takes 1 damage, increased by the number of Penitent weakness tokens they possess.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Lantern Strike', description: 'The Monster draws 1 random card from the Player\'s hands. (empty hands: from the top of their deck). The Monster deals damage equal to the number of Damage symbols shown on that card\'s Fight ability section. After that, the card is discarded.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Spinning', description: 'The Player takes 3 damage and discards 1 random card from their hands.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Swarm of Blows', description: 'The Player takes 3 damage. During the Player\'s next Fight Turn, they may only play Fast Attack (blue) and Defensive Sign (yellow) cards in their combo.', trigger: 'passive' as const },
    },
  ],
};
