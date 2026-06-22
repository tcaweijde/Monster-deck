import type { LegendaryMonster } from '../../types';
import { LEGENDARY_SHARED_DECK } from './legendarySharedDeck';

export const ICE_GIANT: LegendaryMonster = {
  id: 'ice-giant',
  name: 'Ice Giant',
  level: 4,
  baseFightDeckSize: 20,
  fightDeck: LEGENDARY_SHARED_DECK,
  passiveAbility: {
    name: 'Frozen Preparation',
    description:
      "During the Legendary Monster's first fight turn: before revealing the monster fight card, the player discards 4 cards from the top of their deck (empty deck: chosen cards from their hand).",
    trigger: 'passive',
  },
  specialAttacks: [
    {
      name: 'Rock Throw',
      description:
        'The player takes damage equal to the number of Destruction tokens on the game board.',
      trigger: 'reveal',
    },
    {
      name: 'Ice Armor',
      description:
        "The player takes 3 damage. The next Player's combo deals a maximum of 2 damage.",
      trigger: 'reveal',
    },
    {
      name: 'Ice Blast',
      description:
        'The player takes 4 damage. The player may not play any Fast Attack (blue) cards during their next fight turn.',
      trigger: 'reveal',
    },
    {
      name: 'Powerful Hold',
      description:
        "The player takes 5 damage. If the next Player's combo has no Fast Attack (blue) cards, it deals 2 damage less.",
      trigger: 'reveal',
    },
  ],
  image: 'images/legendary/monsters/ice-giant/1.jpg',
  artAssets: ['images/legendary/monsters/ice-giant/1.jpg'],
  startingLocationName: 'Cidaris',
};
