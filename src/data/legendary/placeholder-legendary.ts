import type { LegendaryMonster } from '../../types';

/** A placeholder Legendary monster for development and testing. */
export const PLACEHOLDER_LEGENDARY: LegendaryMonster = {
  id: 'placeholder-legendary',
  name: 'Ancient Archespore',
  level: 4,
  baseFightDeckSize: 22,
  fightDeck: [
    // Standard attack cards — 18 cards
    { id: 'pl-std-01', top: { name: 'Charge', attack: 3 }, bottom: { name: 'Bite', attack: 2 } },
    { id: 'pl-std-02', top: { name: 'Charge', attack: 4 }, bottom: { name: 'Bite', attack: 3 } },
    { id: 'pl-std-03', top: { name: 'Charge', attack: 5 }, bottom: { name: 'Bite', attack: 2 } },
    { id: 'pl-std-04', top: { name: 'Charge', attack: 3 }, bottom: { name: 'Bite', attack: 4 } },
    { id: 'pl-std-05', top: { name: 'Charge', attack: 6 }, bottom: { name: 'Bite', attack: 3 } },
    { id: 'pl-std-06', top: { name: 'Charge', attack: 4 }, bottom: { name: 'Bite', attack: 5 } },
    { id: 'pl-std-07', top: { name: 'Charge', attack: 7 }, bottom: { name: 'Bite', attack: 2 } },
    { id: 'pl-std-08', top: { name: 'Charge', attack: 5 }, bottom: { name: 'Bite', attack: 4 } },
    { id: 'pl-std-09', top: { name: 'Charge', attack: 3 }, bottom: { name: 'Bite', attack: 6 } },
    { id: 'pl-std-10', top: { name: 'Charge', attack: 8 }, bottom: { name: 'Bite', attack: 3 } },
    { id: 'pl-std-11', top: { name: 'Charge', attack: 4 }, bottom: { name: 'Bite', attack: 5 } },
    { id: 'pl-std-12', top: { name: 'Charge', attack: 6 }, bottom: { name: 'Bite', attack: 2 } },
    { id: 'pl-std-13', top: { name: 'Charge', attack: 5 }, bottom: { name: 'Bite', attack: 4 } },
    { id: 'pl-std-14', top: { name: 'Charge', attack: 7 }, bottom: { name: 'Bite', attack: 3 } },
    { id: 'pl-std-15', top: { name: 'Charge', attack: 3 }, bottom: { name: 'Bite', attack: 6 } },
    { id: 'pl-std-16', top: { name: 'Charge', attack: 8 }, bottom: { name: 'Bite', attack: 4 } },
    { id: 'pl-std-17', top: { name: 'Charge', attack: 6 }, bottom: { name: 'Bite', attack: 5 } },
    { id: 'pl-std-18', top: { name: 'Charge', attack: 5 }, bottom: { name: 'Bite', attack: 6 } },

    // Special attack cards — 4 cards
    {
      id: 'pl-special-01',
      top: { name: 'Toxic Spores', attack: 7 },
      bottom: { name: 'Venomous Lash', attack: 6 },
      isSpecial: true,
      discardAbility: {
        name: 'Toxic Spores',
        description: 'When discarded, the player must skip their next action as spores cloud their vision.',
        trigger: 'discard',
      },
    },
    {
      id: 'pl-special-02',
      top: { name: 'Root Lash', attack: 9 },
      bottom: { name: 'Entangle', attack: 8 },
      isSpecial: true,
      discardAbility: {
        name: 'Root Lash',
        description: 'When discarded, roots burst from the ground — the player loses 2 life.',
        trigger: 'discard',
      },
    },
    {
      id: 'pl-special-03',
      top: { name: 'Mycelium Surge', attack: 8 },
      bottom: { name: 'Spore Burst', attack: 7 },
      isSpecial: true,
      discardAbility: {
        name: 'Mycelium Surge',
        description: 'When discarded, underground mycelium erupts — deal 1 damage to all adjacent locations.',
        trigger: 'discard',
      },
    },
    {
      id: 'pl-special-04',
      top: { name: 'Spore Explosion', attack: 10 },
      bottom: { name: 'Acid Spray', attack: 9 },
      isSpecial: true,
      discardAbility: {
        name: 'Spore Explosion',
        description: 'When discarded, a cloud of spores detonates — the player must discard 2 cards from their hand.',
        trigger: 'discard',
      },
    },
  ],
  passiveAbility: {
    name: 'Spore Cloud',
    description: 'At the start of each encounter, the player must discard 1 card from their hand.',
    trigger: 'passive',
  },
  image: 'images/legendary/placeholder/portrait.webp',
  artAssets: [
    'images/legendary/placeholder/card-front-1.webp',
    'images/legendary/placeholder/card-front-2.webp',
  ],
  startingLocationName: 'Velen',
};
