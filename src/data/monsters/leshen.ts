import type { Monster } from '../../types';

export const leshen: Monster = {
  id: 'leshen',
  name: 'Leshen',
  level: 3,
  deckSize: 19,
  baseAbility: {
    name: 'Ancient Curse',
    description: "Temporarily, during this Fight only, the player's Defence level is lowered by 1. Lower their Shield level if it is above their maximum.",
    trigger: 'passive',
  },
  // TODO: fill in real card values from physical game (see GitHub issue #25)
  cardPool: [
    { id: 'leshen-01', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'leshen-02', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'leshen-03', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'leshen-04', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'leshen-05', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'leshen-06', top: { attack: 2 }, bottom: { attack: 2 } },
    { id: 'leshen-07', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'leshen-08', top: { attack: 3 }, bottom: { attack: 4 } },
    { id: 'leshen-09', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'leshen-10', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'leshen-11', top: { attack: 4 }, bottom: { attack: 2 } },
    { id: 'leshen-12', top: { attack: 2 }, bottom: { attack: 4 } },
    { id: 'leshen-13', top: { attack: 3 }, bottom: { attack: 3 } },
    { id: 'leshen-14', top: { attack: 1 }, bottom: { attack: 3 } },
    { id: 'leshen-15', top: { attack: 3 }, bottom: { attack: 1 } },
    { id: 'leshen-16', top: { attack: 4 }, bottom: { attack: 3 } },
    { id: 'leshen-17', top: { attack: 2 }, bottom: { attack: 3 } },
    { id: 'leshen-18', top: { attack: 3 }, bottom: { attack: 2 } },
    { id: 'leshen-19', top: { attack: 2 }, bottom: { attack: 3 } },
  ],
  cardFrontImages: [
    '/images/leshen/card-front-1.png',
  ],
};
