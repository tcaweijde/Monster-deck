import type { Monster } from '../../types';

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
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'bruxa-01', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'bruxa-02', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'bruxa-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'bruxa-04', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'bruxa-05', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'bruxa-06', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'bruxa-07', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'bruxa-08', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'bruxa-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'bruxa-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'bruxa-11', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'bruxa-12', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'bruxa-13', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'bruxa-14', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'bruxa-15', top: { attack: 3 }, bottom: { attack: 1 } },
    { id: 'bruxa-16', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'bruxa-17', top: { attack: 2 }, bottom: { attack: 3 } },
  ],
  cardFrontImages: [
    '/images/bruxa/card-front-1.png',
  ],
};
