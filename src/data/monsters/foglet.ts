import type { Monster } from '../../types';

export const foglet: Monster = {
  id: 'foglet',
  name: 'Foglet',
  deckSizes: { 1: 8, 2: 10, 3: 14 },
  baseAbility: {
    name: 'Fog Cloak',
    description: 'The Foglet has Shield 1 on every attack.',
    trigger: 'passive',
  },
  secondaryAbility: {
    name: 'Illusory Copies',
    description: 'When the deck reaches half size, shuffle the discard pile back into the deck once.',
    trigger: 'passive',
  },
  discardAbility: {
    name: 'Mist Retaliation',
    description: 'When cards are discarded, the Foglet deals 1 damage to the player if 3+ cards were discarded at once.',
    trigger: 'discard',
  },
  cardPool: [
    { id: 'foglet-01', top: { attack: 2, effect: 'Shield 1' }, bottom: { attack: 1 } },
    { id: 'foglet-02', top: { attack: 1 }, bottom: { attack: 3, effect: 'Bleed 1' } },
    { id: 'foglet-03', top: { attack: 3, effect: 'Shield 1' }, bottom: { attack: 2 } },
    { id: 'foglet-04', top: { attack: 2 }, bottom: { attack: 2, effect: 'Shield 1' } },
    { id: 'foglet-05', top: { attack: 4, effect: 'Bleed 1' }, bottom: { attack: 1 } },
    { id: 'foglet-06', top: { attack: 1, effect: 'Shield 2' }, bottom: { attack: 3 } },
    { id: 'foglet-07', top: { attack: 3 }, bottom: { attack: 2, effect: 'Bleed 1' } },
    { id: 'foglet-08', top: { attack: 2, effect: 'Bleed 1' }, bottom: { attack: 4 } },
    { id: 'foglet-09', top: { attack: 4 }, bottom: { attack: 1, effect: 'Shield 2' } },
    { id: 'foglet-10', top: { attack: 1 }, bottom: { attack: 3, effect: 'Shield 1' } },
    { id: 'foglet-11', top: { attack: 3, effect: 'Bleed 2' }, bottom: { attack: 2 } },
    { id: 'foglet-12', top: { attack: 2 }, bottom: { attack: 4, effect: 'Bleed 1' } },
    { id: 'foglet-13', top: { attack: 3, effect: 'Shield 1' }, bottom: { attack: 1 } },
    { id: 'foglet-14', top: { attack: 2, effect: 'Bleed 1' }, bottom: { attack: 3, effect: 'Shield 1' } },
  ],
};
