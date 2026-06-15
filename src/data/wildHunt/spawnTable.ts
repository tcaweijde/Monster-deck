export interface SpawnInstruction {
  monsterLevel?: 1 | 2 | 3;
  houndLevel?: 1 | 2 | 3;
}

/** What spawns at Stage 4 of each round for solo play. Round 8 is the Final Battle — no spawn. */
export const SOLO_SPAWN_TABLE: Readonly<Record<number, SpawnInstruction>> = {
  1: { houndLevel: 1 },
  2: { monsterLevel: 1 },
  3: { houndLevel: 2 },
  4: { monsterLevel: 2 },
  5: { houndLevel: 3 },
  6: { monsterLevel: 3 },
  7: {},
  8: {},
};

export interface SpawnOutcome {
  /** Level of monster to spawn, or `null` if no monster this round. */
  monsterLevel: (1 | 2 | 3) | null;
  /** True when a monster would spawn but all 3 slots are occupied → Wild Hunt gains +1 shield. */
  monsterBlocked: boolean;
  /** Level of hound to spawn, or `null` if no hound this round. */
  houndLevel: (1 | 2 | 3) | null;
}

/**
 * Pure helper — computes what will happen during Stage 4 of a given round.
 * Used both for UI preview and store mutation so the two never drift.
 *
 * @param round - Current round number (1–8).
 * @param occupiedSlots - Number of non-empty board slots (0–3).
 */
export function getSpawnOutcome(
  round: number,
  occupiedSlots: number,
): SpawnOutcome {
  const instruction = SOLO_SPAWN_TABLE[round] ?? {};
  const monsterLevel = instruction.monsterLevel ?? null;
  const houndLevel = instruction.houndLevel ?? null;
  return {
    monsterLevel,
    monsterBlocked: monsterLevel !== null && occupiedSlots >= 3,
    houndLevel,
  };
}
