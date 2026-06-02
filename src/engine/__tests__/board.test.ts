import { describe, it, expect } from 'vitest';
import { initBoard, spawnReplacement } from '../board';
import { LOCATIONS } from '../../data/locations';
import type { Monster, BoardState, BoardSlot } from '../../types';

// ---------------------------------------------------------------------------
// Helpers & fixtures
// ---------------------------------------------------------------------------

/** Minimal Monster stub with configurable level. */
const makeMonster = (id: string, level: 1 | 2 | 3 = 1): Monster => ({
  id,
  name: id,
  level,
  deckSize: 4,
  baseAbility: { name: 'Test', description: 'Test', trigger: 'passive' },
  cardPool: [],
  cardFrontImages: [],
});

/**
 * RNG that exhausts a fixed sequence then cycles.
 * Cycling avoids "queue exhausted" failures in tests that only need invariant
 * checks (e.g. set equality) without caring about exact order.
 */
const makeRng = (values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

/**
 * Builds a minimal valid BoardState.
 * Slot 0 uses the provided level (default 1); slots 1 and 2 are fixed.
 * Location ids are chosen to be valid for their respective types:
 *   slot0 = water  / id 1   (water ids: 1,4,5,12,14,15)
 *   slot1 = mountain / id 2 (mountain ids: 2,3,9,11,13,18)
 *   slot2 = woods   / id 6  (woods ids: 6,7,8,10,16,17)
 */
const makeBoard = (level0: 1 | 2 | 3 = 1): BoardState => ({
  slots: [
    { locationType: 'water', locationId: 1, monsterId: 'm1', level: level0, status: 'active' },
    { locationType: 'mountain', locationId: 2, monsterId: 'm2', level: 2, status: 'active' },
    { locationType: 'woods', locationId: 6, monsterId: 'm3', level: 3, status: 'active' },
  ] as [BoardSlot, BoardSlot, BoardSlot],
});

// A pool with one monster per level (minimum viable for initBoard).
const POOL_3 = [makeMonster('m1', 1), makeMonster('m2', 2), makeMonster('m3', 3)];
// A larger pool with multiple monsters per level.
const POOL_6 = [
  makeMonster('m1', 1), makeMonster('m2', 1),
  makeMonster('m3', 2), makeMonster('m4', 2),
  makeMonster('m5', 3), makeMonster('m6', 3),
];

// ---------------------------------------------------------------------------
// initBoard
// ---------------------------------------------------------------------------

describe('initBoard', () => {
  describe('monster selection', () => {
    it('should pick exactly 3 distinct monsters — one per level', () => {
      const board = initBoard(POOL_6, () => 0);
      const ids = board.slots.map((s) => s.monsterId);
      expect(ids).toHaveLength(3);
      expect(new Set(ids).size).toBe(3);
    });

    it('should select a monster whose level matches the slot level', () => {
      const board = initBoard(POOL_6, () => 0);
      for (const slot of board.slots) {
        const monster = POOL_6.find((m) => m.id === slot.monsterId)!;
        expect(monster.level).toBe(slot.level);
      }
    });

    it('should throw when no monster exists at a required level', () => {
      // Pool has two level-1 monsters but no level-2 or level-3
      const badPool = [makeMonster('a', 1), makeMonster('b', 1)];
      expect(() => initBoard(badPool, () => 0)).toThrow();
    });
  });

  describe('location type assignment', () => {
    it('should assign one slot of each type: water, mountain, woods', () => {
      const board = initBoard(POOL_3, () => 0);
      const types = new Set(board.slots.map((s) => s.locationType));
      expect(types).toEqual(new Set(['water', 'mountain', 'woods']));
    });

    it("should assign a locationId whose type matches the slot's locationType", () => {
      const board = initBoard(POOL_3, () => 0);
      for (const slot of board.slots) {
        const location = LOCATIONS.find((l) => l.id === slot.locationId);
        expect(location).toBeDefined();
        expect(location!.type).toBe(slot.locationType);
      }
    });
  });

  describe('level assignment', () => {
    it('should assign levels 1, 2, and 3 — exactly one each', () => {
      const board = initBoard(POOL_3, () => 0);
      const levels = new Set(board.slots.map((s) => s.level));
      expect(levels).toEqual(new Set([1, 2, 3]));
    });

    it('should select a monster whose level matches the assigned slot level', () => {
      const board = initBoard(POOL_6, () => 0);
      for (const slot of board.slots) {
        const monster = POOL_6.find((m) => m.id === slot.monsterId)!;
        expect(monster.level).toBe(slot.level);
      }
    });
  });

  describe('slot status', () => {
    it('should initialise all slot statuses to "active"', () => {
      const board = initBoard(POOL_3, () => 0);
      for (const slot of board.slots) {
        expect(slot.status).toBe('active');
      }
    });
  });

  describe('validation', () => {
    it('should throw when no monster exists at a required level', () => {
      const noLevel2 = [makeMonster('a', 1), makeMonster('b', 1), makeMonster('c', 3)];
      expect(() => initBoard(noLevel2, () => 0)).toThrow(/level 2/);
    });

    it('should not throw with exactly one monster per level', () => {
      expect(() => initBoard(POOL_3, () => 0)).not.toThrow();
    });
  });

  describe('determinism', () => {
    it('should produce an identical board when given the same rng sequence', () => {
      // Shuffle calls: 2 (levels) + 2 (types) + up to 1 per level per slot + 5×3 (locations) ≈ 20
      const seq = [0.1, 0.5, 0.9, 0.2, 0.8, 0.4, 0.6, 0.3, 0.7, 0.15, 0.55, 0.95, 0.25, 0.85, 0.45, 0.65, 0.35, 0.75, 0.05, 0.88];
      const board1 = initBoard(POOL_6, makeRng(seq));
      const board2 = initBoard(POOL_6, makeRng(seq));
      expect(board1).toEqual(board2);
    });
  });
});

// ---------------------------------------------------------------------------
// spawnReplacement
// ---------------------------------------------------------------------------

describe('spawnReplacement', () => {
  // Pool: two per level. Slot 0 (level 1, m1) is defeated.
  // Other active: slot1=m3 (level 2), slot2=m5 (level 3).
  // Replacement for slot 0: new level = 2, candidates = level-2 monsters not in {m3,m5} = [m4].
  const MONSTERS_6 = [
    makeMonster('m1', 1), makeMonster('m2', 1),
    makeMonster('m3', 2), makeMonster('m4', 2),
    makeMonster('m5', 3), makeMonster('m6', 3),
  ];

  describe('level escalation', () => {
    it('should set the replacement level to 2 when the defeated slot was level 1', () => {
      const board = makeBoard(1);
      const newBoard = spawnReplacement(board, 0, MONSTERS_6, () => 0);
      expect(newBoard.slots[0].level).toBe(2);
    });

    it('should set the replacement level to 3 when the defeated slot was level 2', () => {
      const board = makeBoard(2);
      const newBoard = spawnReplacement(board, 0, MONSTERS_6, () => 0);
      expect(newBoard.slots[0].level).toBe(3);
    });

    it('should cap the replacement level at 3 when the defeated slot was already level 3 (SC-006)', () => {
      const board = makeBoard(3);
      const newBoard = spawnReplacement(board, 0, MONSTERS_6, () => 0);
      expect(newBoard.slots[0].level).toBe(3);
    });
  });

  describe('location assignment', () => {
    it('should assign a locationId different from the previous one (EC-2)', () => {
      const board = makeBoard(); // slot0.locationId = 1 (water)
      const newBoard = spawnReplacement(board, 0, MONSTERS_6, () => 0);
      expect(newBoard.slots[0].locationId).not.toBe(1);
    });

    it('should preserve the same locationType as the defeated slot', () => {
      const board = makeBoard(); // slot0.locationType = 'water'
      const newBoard = spawnReplacement(board, 0, MONSTERS_6, () => 0);
      expect(newBoard.slots[0].locationType).toBe('water');
    });

    it("should assign a locationId whose type still matches the slot's locationType", () => {
      const board = makeBoard();
      const newBoard = spawnReplacement(board, 0, MONSTERS_6, () => 0);
      const location = LOCATIONS.find((l) => l.id === newBoard.slots[0].locationId);
      expect(location).toBeDefined();
      expect(location!.type).toBe('water');
    });
  });

  describe('monster selection', () => {
    it('should select a monster whose level matches the new (escalated) level', () => {
      const board = makeBoard(1); // slot0 level 1 → replacement level 2
      const newBoard = spawnReplacement(board, 0, MONSTERS_6, () => 0);
      const monster = MONSTERS_6.find((m) => m.id === newBoard.slots[0].monsterId)!;
      expect(monster.level).toBe(2);
    });

    it('should not select a monster already active in the other two slots', () => {
      // makeBoard: slot1=m2, slot2=m3 are active; replacement for slot0 must exclude both
      const board = makeBoard(1);
      const newBoard = spawnReplacement(board, 0, MONSTERS_6, () => 0);
      expect(newBoard.slots[0].monsterId).not.toBe('m2');
      expect(newBoard.slots[0].monsterId).not.toBe('m3');
    });

    it('should throw when no monster at the required level is available', () => {
      // Pool has no level-2 monsters; defeated slot level 1 → needs level 2
      const noLevel2 = [makeMonster('a', 1), makeMonster('b', 3)];
      expect(() => spawnReplacement(makeBoard(1), 0, noLevel2, () => 0)).toThrow(/level 2/);
    });
  });

  describe('slot isolation', () => {
    it('should leave the other two slots unchanged after replacement', () => {
      const board = makeBoard();
      const newBoard = spawnReplacement(board, 0, MONSTERS_6, () => 0);
      expect(newBoard.slots[1]).toEqual(board.slots[1]);
      expect(newBoard.slots[2]).toEqual(board.slots[2]);
    });
  });

  describe('immutability', () => {
    it('should not mutate the original board', () => {
      const board = makeBoard();
      const snapshot = JSON.parse(JSON.stringify(board.slots)) as BoardSlot[];
      spawnReplacement(board, 0, MONSTERS_6, () => 0);
      expect(board.slots).toEqual(snapshot);
    });
  });
});
