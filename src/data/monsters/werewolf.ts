import type { Monster } from '../../types';

export const werewolf: Monster = {
  id: 'werewolf',
  name: 'Werewolf',
  deckSizes: { 1: 10, 2: 14, 3: 18 },
  baseAbility: {
    name: 'Regeneration',
    description: 'At the start of each round, return the top card from the discard pile to the bottom of the deck.',
    trigger: 'passive',
  },
  secondaryAbility: {
    name: 'Feral Rage',
    description: '+1 attack when the deck has 5 or fewer cards remaining.',
    trigger: 'passive',
  },
  cardPool: [
    { id: 'werewolf-01', top: { attack: 3 }, bottom: { attack: 2, effect: 'Bleed 1' } },
    { id: 'werewolf-02', top: { attack: 2, effect: 'Shield 1' }, bottom: { attack: 4 } },
    { id: 'werewolf-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'werewolf-04', top: { attack: 1, effect: 'Bleed 2' }, bottom: { attack: 3 } },
    { id: 'werewolf-05', top: { attack: 3, effect: 'Shield 1' }, bottom: { attack: 2 } },
    { id: 'werewolf-06', top: { attack: 5 }, bottom: { attack: 3, effect: 'Bleed 1' } },
    { id: 'werewolf-07', top: { attack: 2 }, bottom: { attack: 4, effect: 'Shield 1' } },
    { id: 'werewolf-08', top: { attack: 3, effect: 'Bleed 1' }, bottom: { attack: 2 } },
    { id: 'werewolf-09', top: { attack: 4, effect: 'Shield 2' }, bottom: { attack: 1 } },
    { id: 'werewolf-10', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'werewolf-11', top: { attack: 3 }, bottom: { attack: 5, effect: 'Bleed 2' } },
    { id: 'werewolf-12', top: { attack: 1, effect: 'Shield 1' }, bottom: { attack: 4 } },
    { id: 'werewolf-13', top: { attack: 4, effect: 'Bleed 1' }, bottom: { attack: 2 } },
    { id: 'werewolf-14', top: { attack: 2, effect: 'Shield 2' }, bottom: { attack: 3 } },
    { id: 'werewolf-15', top: { attack: 3 }, bottom: { attack: 2, effect: 'Bleed 1' } },
    { id: 'werewolf-16', top: { attack: 5, effect: 'Shield 1' }, bottom: { attack: 3 } },
    { id: 'werewolf-17', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'werewolf-18', top: { attack: 3, effect: 'Bleed 1' }, bottom: { attack: 2, effect: 'Shield 1' } },
  ],
};
