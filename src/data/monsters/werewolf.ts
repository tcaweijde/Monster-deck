import type { Monster } from '../../types';

export const werewolf: Monster = {
  id: 'werewolf',
  name: 'Werewolf',
  level: 2,
  deckSize: 14,
  baseAbility: {
    name: 'Cursed Wounds',
    description: 'Before the Player creates their Life Pool, they lower their Shield level by 2.',
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'werewolf-01', top: { attack: 3 }, bottom: { attack: 2, effect: 'Bleed 1' } },
    { id: 'werewolf-02', top: { attack: 2, effect: 'Shield 1' }, bottom: { attack: 4 } },
    { id: 'werewolf-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'werewolf-04', top: { attack: 1, effect: 'Bleed 2' }, bottom: { attack: 3 } },
    { id: 'werewolf-05', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'werewolf-06', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'werewolf-07', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'werewolf-08', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'werewolf-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'werewolf-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'werewolf-11', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'werewolf-12', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'werewolf-13', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'werewolf-14', top: { attack: 2 }, bottom: { attack: 3 } },
  ],
  cardFrontImages: [
    '/images/werewolf/card-front-1.png',
  ],
};
