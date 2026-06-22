import type { Monster } from '../../types';
import { GENERIC_CARD_POOL } from './genericCardPool';

export const foglet: Monster = {
  id: 'foglet',
  name: 'Foglet',
  level: 1,
  deckSize: 10,
  baseAbility: {
    name: 'Disorienting Mist',
    description: "During the Monster's first Fight Turn: pick the Attack Type that makes the Player discard more cards from their deck/hand.",
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Dematerialization',
    description: "If this Fight Turn's Player combo has no Offensive Sign (purple) cards, after resolving the combo the Monster adds a random card from their unused Monster Fight cards to the top of their Live Pool.",
    trigger: 'discard',
  },
  cardPool: GENERIC_CARD_POOL,
  cardFrontImages: [
    '/images/monsters/foglet/1.jpg',
  ],
  trailCards: [
    {
      number: 1 as const,
      drawAbility: {
        name: 'Sharp Claws',
        description: 'The Player discards 3 cards from the top of their deck. (empty deck: any card from their hand).',
        trigger: 'passive' as const,
      },
    },
    {
      number: 2 as const,
      drawAbility: {
        name: 'Illusion',
        description: "The Player takes 2 damage during the Player's next Fight Turn. Ignore Shield symbols in the Player's combo that turn.",
        trigger: 'passive' as const,
      },
    },
    {
      number: 3 as const,
      drawAbility: {
        name: 'Master Illusion',
        description: "The Player takes 3 damage during the Player's next Fight Turn. Ignore Shield symbols in the Player's next combo.",
        trigger: 'passive' as const,
      },
    },
    {
      number: 4 as const,
      drawAbility: {
        name: 'Attack in the Fog',
        description: "The Player takes 2 damage and the Foglet immediately performs their next Fight Turn.",
        trigger: 'passive' as const,
      },
    },
  ],
};

