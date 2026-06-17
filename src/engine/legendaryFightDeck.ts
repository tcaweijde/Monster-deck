import { shuffle } from './shuffle';
import type { LegendaryMonster, LegendaryMonsterCard, TrophyProtectionTable } from '../types';

/**
 * Builds a shuffled fight deck of `actualSize` cards for a Legendary monster.
 *
 * Cards are removed from the front of the monster's fight deck (lowest-index
 * cards) to achieve the desired size. The remaining cards are then shuffled
 * before being returned.
 *
 * @param monster    - The Legendary monster whose fight deck to use.
 * @param actualSize - Desired deck size after destruction-token reductions.
 * @param rng        - Optional random number generator (injectable for tests).
 * @returns A shuffled array of LegendaryMonsterCards of length actualSize.
 */
export function buildLegendaryFightDeck(
  monster: LegendaryMonster,
  actualSize: number,
  rng: () => number = Math.random,
): LegendaryMonsterCard[] {
  const clampedSize = Math.max(0, Math.min(actualSize, monster.baseFightDeckSize));
  const removeCount = monster.baseFightDeckSize - clampedSize;
  const sliced = monster.fightDeck.slice(removeCount);
  return shuffle([...sliced], rng);
}

/**
 * Looks up the protection value for a given side and trophy count.
 *
 * Falls back to the last entry in the table if no matching entry is found,
 * and emits a console warning in that case.
 *
 * @param tables   - All trophy protection tables (one per campaign side).
 * @param side     - Campaign side to look up ('A' or 'B').
 * @param trophies - Number of destruction trophies the player has earned.
 * @returns The protection value (damage negation per player attack).
 * @throws If no table is found for the given side.
 */
export function lookupProtectionValue(
  tables: TrophyProtectionTable[],
  side: 'A' | 'B',
  trophies: number,
): number {
  const table = tables.find(t => t.side === side);
  if (table === undefined) {
    throw new Error(`Trophy protection table not found for side: ${side}`);
  }

  const entry = table.entries.find(
    e => trophies >= e.minTrophies && (e.maxTrophies === null || trophies <= e.maxTrophies),
  );

  if (entry === undefined) {
    const fallback = table.entries[table.entries.length - 1];
    console.warn(
      `lookupProtectionValue: no matching entry for side=${side}, trophies=${trophies}. ` +
        `Falling back to last entry (protectionValue=${fallback.protectionValue}).`,
    );
    return fallback.protectionValue;
  }

  return entry.protectionValue;
}
