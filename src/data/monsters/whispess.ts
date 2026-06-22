import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const whispess: Monster = {
  id: 'whispess',
  name: 'Whispess',
  level: 2,
  deckSize: 15,
  baseAbility: {
    name: 'Cursed Whispers',
    description: "During the entire Fight: each time the Player's Combo includes a Defensive Sign (yellow) card, they lower their Shield level by 2.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Transformation into Ravens',
    description: 'During the Monster\'s next Fight Turn, the Player controlling the Monster picks the attack type after revealing the Monster\'s Fight card. Solo: the Player picks the attack dealing more damage.',
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/whispess/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: { name: 'Manipulated Villagers', description: 'The Player takes 1 damage and loses 4 Gold.', trigger: 'passive' as const },
    },
    {
      number: 2 as const,
      drawAbility: { name: 'Tantalizing Whispers', description: 'The Player immediately plays a combo of 3 cards, ignoring Damage symbols. If they cannot, they take 4 damage.', trigger: 'passive' as const },
    },
    {
      number: 3 as const,
      drawAbility: { name: 'Magical Explosion', description: 'The Player takes 3 damage and places 2 randomly chosen cards from their hands back on top of their deck.', trigger: 'passive' as const },
    },
    {
      number: 4 as const,
      drawAbility: { name: 'Mighty Magical Explosion', description: 'The Player takes 3 damage and places 4 randomly chosen cards from their hands back on top of their deck. The Player may not play any Dodge (green) cards during the next Fight Turn.', trigger: 'passive' as const },
    },
  ],
};
