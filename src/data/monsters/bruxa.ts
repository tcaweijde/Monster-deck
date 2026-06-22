import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const bruxa: Monster = {
  id: 'bruxa',
  name: 'Bruxa',
  level: 3,
  deckSize: 17,
  baseAbility: {
    name: 'Death Frenzy',
    description: "During each Monster's Fight Turn that the Monster has only 1 or 2 cards left in their deck, its Attacks deal 2 additional Damage.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Polymorph',
    description: 'Draw a random level 3 Monster Fight card and apply the passive attack of the drawn Monster.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/bruxa/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Blood Hunger', description: 'If the Player\'s Shield level is 0, they take 3 damage. Otherwise, the Player takes 5 damage.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Swarm of Claws', description: 'The Player takes 4 damage. The Player may not play any Strong Attack (red) cards during their next Fight Turn.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Sound Wave', description: 'The Player discards 3 cards from the top of their deck. (empty deck: any card from their hands).', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Mighty Sound Wave', description: 'The Player discards any 3 cards from their hands. (empty hands: from the top of their deck). The Player may not play any Dodge (green) cards during the next Fight Turn.', trigger: 'passive' as const },
    },
  ],
};
