import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const ekimmara: Monster = {
  id: 'ekimmara',
  name: 'Ekimmara',
  level: 1,
  deckSize: 12,
  baseAbility: {
    name: 'Blood Drain',
    description: "After the Player creates their Life Pool, if they don't have the Trail Token for Ekimmara, they discard any 1 card from their hand.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Regeneration',
    description: 'The Monster ignores 2 of the further damage in this Player\'s Fight Turn, if any.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/ekimmara/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Incredible Speed', description: 'The Player discards 1 Fast Attack (blue) card from their hands. If they are not able to discard it, they take 3 damage.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Sharp Claws', description: 'The Player discards 3 cards from the top of their deck. (empty deck: any card from their hands).', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Blood Loss', description: 'The Player discards 2 random cards from their hands. (empty hands: from the top of their deck).', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Blow Streak', description: 'The Player rolls a die: 1–2 they take 2 damage, 3–4 they take 3 damage, 5–6 they take 4 damage.', trigger: 'passive' as const },
    },
  ],
};
