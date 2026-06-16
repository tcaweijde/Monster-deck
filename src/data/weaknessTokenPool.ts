import type { WeaknessToken } from '../types';

/**
 * Full pool of weakness tokens from the Monster Trail expansion.
 * 18 tokens total: 6 per terrain type, numbered 1–6.
 *
 * The number on a drawn token indexes the active monster's printed weakness list.
 * The app shows the number as a reminder — effect text lives on the monster sheet.
 *
 */
export const WEAKNESS_TOKEN_POOL: WeaknessToken[] = [
  // water
  { id: 'wt-water-1', terrainType: 'water',    number: 1 },
  { id: 'wt-water-2', terrainType: 'water',    number: 2 },
  { id: 'wt-water-3', terrainType: 'water',    number: 3 },
  { id: 'wt-water-4', terrainType: 'water',    number: 4 },
  { id: 'wt-water-5', terrainType: 'water',    number: 5 },
  { id: 'wt-water-6', terrainType: 'water',    number: 6 },
  // mountain
  { id: 'wt-mtn-1',   terrainType: 'mountain', number: 1 },
  { id: 'wt-mtn-2',   terrainType: 'mountain', number: 2 },
  { id: 'wt-mtn-3',   terrainType: 'mountain', number: 3 },
  { id: 'wt-mtn-4',   terrainType: 'mountain', number: 4 },
  { id: 'wt-mtn-5',   terrainType: 'mountain', number: 5 },
  { id: 'wt-mtn-6',   terrainType: 'mountain', number: 6 },
  // woods
  { id: 'wt-woods-1', terrainType: 'woods',    number: 1 },
  { id: 'wt-woods-2', terrainType: 'woods',    number: 2 },
  { id: 'wt-woods-3', terrainType: 'woods',    number: 3 },
  { id: 'wt-woods-4', terrainType: 'woods',    number: 4 },
  { id: 'wt-woods-5', terrainType: 'woods',    number: 5 },
  { id: 'wt-woods-6', terrainType: 'woods',    number: 6 },
];
