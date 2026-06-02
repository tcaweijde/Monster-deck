import type { Monster } from '../../types';

export const striga: Monster = {
  id: 'striga',
  name: 'Striga',
  level: 3,
  deckSize: 18,
  baseAbility: {
    name: 'Cursed Form',
    description: 'Before the player creates their Life Pool, they lower their Shield level by 1 for each card in their hand.',
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'striga-01', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'striga-02', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'striga-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'striga-04', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'striga-05', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'striga-06', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'striga-07', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'striga-08', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'striga-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'striga-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'striga-11', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'striga-12', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'striga-13', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'striga-14', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'striga-15', top: { attack: 3 }, bottom: { attack: 1 } },
    { id: 'striga-16', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'striga-17', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'striga-18', top: { attack: 3 }, bottom: { attack: 2 } },
  ],
  cardFrontImages: [
    '/images/striga/card-front-1.png',
  ],
};
