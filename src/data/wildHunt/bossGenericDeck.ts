import { GENERIC_CARD_POOL } from '../monsters/genericCardPool';
import type { MonsterCard } from '../../types';

/**
 * The 16-card generic base deck used for every Wild Hunt boss encounter.
 * Uses cards 01–16 from the shared generic pool (IDs `generic-01` to `generic-16`).
 */
export const BOSS_GENERIC_DECK: MonsterCard[] = GENERIC_CARD_POOL.filter((card) =>
  ['generic-01','generic-02','generic-03','generic-04',
   'generic-05','generic-06','generic-07','generic-08',
   'generic-09','generic-10','generic-11','generic-12',
   'generic-13','generic-14','generic-15','generic-16',
  ].includes(card.id),
);
