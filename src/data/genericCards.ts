import type { MonsterCard } from '../types';

/**
 * Generic attack cards shared across all monsters.
 * These are combined with each monster's specificCards when building a deck.
 * Card IDs must use the prefix "generic-" (e.g. "generic-01").
 */
export const GENERIC_CARDS: MonsterCard[] = [
  // Add generic cards here, e.g.:
   { id: 'generic-01', top: { attack: 2 }, bottom: { attack: 1 } },
    { id: 'generic-02', top: { attack: 1, effect: 'Shield 1' }, bottom: { attack: 2 } },
    { id: 'generic-03', top: { attack: 3 }, bottom: { attack: 1, effect: 'Bleed 1' } },
    { id: 'generic-04', top: { attack: 2, effect: 'Shield 1' }, bottom: { attack: 3 } },
    { id: 'generic-05', top: { attack: 1 }, bottom: { attack: 4, effect: 'Bleed 1' } },
    { id: 'generic-06', top: { attack: 4, effect: 'Shield 1' }, bottom: { attack: 2 } },
    { id: 'generic-07', top: { attack: 2, effect: 'Bleed 1' }, bottom: { attack: 2 } },
    { id: 'generic-08', top: { attack: 3, effect: 'Shield 1' }, bottom: { attack: 1 } },
    { id: 'generic-09', top: { attack: 1, effect: 'Shield 2' }, bottom: { attack: 3 } },
    { id: 'generic-10', top: { attack: 4 }, bottom: { attack: 1, effect: 'Shield 1' } },
    { id: 'generic-11', top: { attack: 2, effect: 'Bleed 2' }, bottom: { attack: 3 } },
    { id: 'generic-12', top: { attack: 3 }, bottom: { attack: 2, effect: 'Bleed 2' } },
    { id: 'generic-13', top: { attack: 1, effect: 'Shield 1' }, bottom: { attack: 4, effect: 'Bleed 1' } },
    { id: 'generic-14', top: { attack: 4, effect: 'Bleed 1' }, bottom: { attack: 2, effect: 'Shield 1' } },
    { id: 'generic-15', top: { attack: 2 }, bottom: { attack: 3, effect: 'Shield 1' } },
    { id: 'generic-16', top: { attack: 3, effect: 'Shield 1' }, bottom: { attack: 3, effect: 'Bleed 1' } },
    
];
