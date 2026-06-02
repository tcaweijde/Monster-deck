import type { Monster, BoardSlot, BoardState, LocationType } from '../types';
import { LOCATIONS } from '../data/locations';
import { shuffle } from './shuffle';

const LOCATION_TYPES: LocationType[] = ['water', 'mountain', 'woods'];

/**
 * Initialises a new board by:
 * 1. Selecting 3 distinct monsters at random from the pool.
 * 2. Shuffling and assigning location types [water, mountain, woods] across the 3 slots.
 * 3. Assigning levels [1, 2, 3] across the 3 slots (shuffled).
 * 4. Picking a random numbered location within each slot's type.
 *
 * Requires monsters.length >= 3.
 */
export function initBoard(
  monsters: Monster[],
  rng: () => number = Math.random,
): BoardState {
  if (monsters.length < 3) {
    throw new Error(`initBoard requires at least 3 monsters, got ${monsters.length}`);
  }

  const selectedMonsters = shuffle(monsters, rng).slice(0, 3);
  const assignedTypes = shuffle([...LOCATION_TYPES], rng) as [LocationType, LocationType, LocationType];
  const assignedLevels = shuffle([1, 2, 3] as (1 | 2 | 3)[], rng) as [1 | 2 | 3, 1 | 2 | 3, 1 | 2 | 3];

  const slots = selectedMonsters.map((monster, i): BoardSlot => {
    const locationType = assignedTypes[i];
    const locationsOfType = LOCATIONS.filter((location) => location.type === locationType);
    const location = shuffle(locationsOfType, rng)[0];

    return {
      locationType,
      locationId: location.id,
      monsterId: monster.id,
      level: assignedLevels[i],
      status: 'active',
    };
  }) as [BoardSlot, BoardSlot, BoardSlot];

  return { slots };
}

/**
 * Spawns a replacement monster for a defeated slot:
 * - New level = min(defeated level + 1, 3).
 * - New monster = any monster NOT currently active in the OTHER two slots.
 *   (The defeated monster's slot is vacated, so it IS a valid candidate — SC-008.)
 * - New location = random location within the same type, distinct from the previous location id.
 *
 * Returns a new BoardState; input is not mutated.
 */
export function spawnReplacement(
  board: BoardState,
  slotIndex: 0 | 1 | 2,
  monsters: Monster[],
  rng: () => number = Math.random,
): BoardState {
  const defeated = board.slots[slotIndex];
  const newLevel = Math.min(defeated.level + 1, 3) as 1 | 2 | 3;

  const otherActiveIds = new Set(
    board.slots.filter((_, i) => i !== slotIndex).map((slot) => slot.monsterId),
  );
  const candidates = monsters.filter((monster) => !otherActiveIds.has(monster.id));

  if (candidates.length === 0) {
    throw new Error('spawnReplacement: no valid replacement monster candidates');
  }

  const newMonster = shuffle(candidates, rng)[0];

  const locationsOfType = LOCATIONS.filter((location) => location.type === defeated.locationType);
  const locationCandidates = locationsOfType.filter((location) => location.id !== defeated.locationId);
  const newLocation = shuffle(locationCandidates, rng)[0];

  const newSlots = board.slots.map((slot, i): BoardSlot =>
    i === slotIndex
      ? {
          locationType: slot.locationType,
          locationId: newLocation.id,
          monsterId: newMonster.id,
          level: newLevel,
          status: 'active',
        }
      : slot,
  ) as [BoardSlot, BoardSlot, BoardSlot];

  return { slots: newSlots };
}
