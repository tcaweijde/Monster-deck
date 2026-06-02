import type { Monster, BoardSlot, BoardState, LocationType } from '../types';
import { LOCATIONS } from '../data/locations';
import { shuffle } from './shuffle';

const LOCATION_TYPES: LocationType[] = ['water', 'mountain', 'woods'];

/**
 * Initialises a new board by:
 * 1. Shuffling [1, 2, 3] to assign one level per slot (always one of each).
 * 2. Shuffling location types [water, mountain, woods] across the 3 slots.
 * 3. For each slot, picking a random monster whose level matches the slot level,
 *    excluding monsters already assigned to earlier slots.
 * 4. Picking a random location within each slot's type.
 *
 * Throws if no monster exists at a required level after excluding already-placed ones.
 */
export function initBoard(
  monsters: Monster[],
  rng: () => number = Math.random,
): BoardState {
  const assignedLevels = shuffle([1, 2, 3] as (1 | 2 | 3)[], rng) as [1 | 2 | 3, 1 | 2 | 3, 1 | 2 | 3];
  const assignedTypes = shuffle([...LOCATION_TYPES], rng) as [LocationType, LocationType, LocationType];

  const usedIds = new Set<string>();

  const slots = ([0, 1, 2] as const).map((i): BoardSlot => {
    const level = assignedLevels[i];
    const locationType = assignedTypes[i];

    const candidates = monsters.filter((m) => m.level === level && !usedIds.has(m.id));
    if (candidates.length === 0) {
      throw new Error(`initBoard: no available monster at level ${level}`);
    }
    const monster = shuffle(candidates, rng)[0];
    usedIds.add(monster.id);

    const locationsOfType = LOCATIONS.filter((l) => l.type === locationType);
    const location = shuffle(locationsOfType, rng)[0];

    return { locationType, locationId: location.id, monsterId: monster.id, level, status: 'active' };
  }) as [BoardSlot, BoardSlot, BoardSlot];

  return { slots };
}

/**
 * Spawns a replacement monster for a defeated slot:
 * - New level = min(defeated level + 1, 3).
 * - New monster = random monster whose level matches the new level,
 *   excluding monsters currently active in the other two slots.
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
  const candidates = monsters.filter(
    (monster) => monster.level === newLevel && !otherActiveIds.has(monster.id),
  );

  if (candidates.length === 0) {
    throw new Error(`spawnReplacement: no available monster at level ${newLevel}`);
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
