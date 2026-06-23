import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const ghoulsNest: Monster = {
  id: 'ghouls-nest',
  name: "Ghouls' Nest",
  level: 1,
  deckSize: 12,
  baseAbility: {
    name: 'Overwhelming Numbers',
    description: "During the Player's first Fight Turn only, the Monster may only discard up to 2 cards (regardless of the Damage dealt).",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Battle Frenzy',
    description: 'The Monster ignores 1 of the further damage in this Player\'s Fight Turn, if any.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/ghouls-nest/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Outnumbered', description: 'The Player takes 2 damage. During the Player\'s next Fight Turn, they can only play a combo of 1 card.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Tearing', description: 'The Player discards 1 Defensive Sign (yellow) card from their hands. If they are not able to discard it, they take 4 damage.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Call of the Night', description: 'The Player takes 3 damage. During the Player\'s next Fight Turn, they deal 2 damage less.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Unrestrained Hunger', description: 'If the Player\'s Shield level is 0, they take 4 damage. Otherwise, the Player takes 2 damage.', trigger: 'passive' as const },
    },
  ],
};
