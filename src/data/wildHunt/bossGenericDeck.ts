import { GENERIC_CARD_POOL } from '../monsters/genericCardPool';
import type { MonsterCard } from '../../types';

/**
 * The 16-card generic base deck used for every Wild Hunt boss encounter.
 * Uses 16 random cards from the shared generic pool.
 */
export const BOSS_GENERIC_DECK: MonsterCard[] = GENERIC_CARD_POOL.sort(() => Math.random() - 0.5).slice(0, 16);
