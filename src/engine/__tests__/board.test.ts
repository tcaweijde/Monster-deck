import { describe, it, expect } from 'vitest';
import { initBoard, spawnReplacement } from '../board';
import { LOCATIONS } from '../../data/locations';
import type { Monster, BoardState, BoardSlot } from '../../types';

// ---------------------------------------------------------------------------
// Helpers & fixtures
// ---------------------------------------------------------------------------

/** Minimal Monster stub — only id/name are required by the engine. */
const makeMonster = (id: string): Monster => ({
  id,
  name: id,
  level: 1,
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

// A pool of 4 monsters used across most tests.
const POOL_4 = ['m1', 'm2', 'm3', 'm4'].map(makeMonster);

// ---------------------------------------------------------------------------
// initBoard
// ---------------------------------------------------------------------------

describe('initBoard', () => {
  describe('monster selection', () => {
    it('should pick exactly 3 distinct monsters from a pool of 4', () => {
      const board = initBoard(POOL_4, () => 0);

      const ids = board.slots.map((s) => s.monsterId);

      expect(ids).toHaveLength(3);
      // All unique
      expect(new Set(ids).size).toBe(3);
      // All drawn from the pool
      const poolIds = new Set(POOL_4.map((m) => m.id));
      expect(ids.every((id) => poolIds.has(id))).toBe(true);
    });
  });

  describe('location type assignment', () => {
    it('should assign one slot of each type: water, mountain, woods', () => {
      const board = initBoard(POOL_4, () => 0);

      const types = new Set(board.slots.map((s) => s.locationType));

      expect(types).toEqual(new Set(['water', 'mountain', 'woods']));
    });

    it("should assign a locationId whose type matches the slot's locationType", () => {
      const board = initBoard(POOL_4, () => 0);

      for (const slot of board.slots) {
        const location = LOCATIONS.find((l) => l.id === slot.locationId);
        expect(location).toBeDefined();
        expect(location!.type).toBe(slot.locationType);
      }
    });
  });

  describe('level assignment', () => {
    it('should assign levels 1, 2, and 3 — exactly one each', () => {
      const board = initBoard(POOL_4, () => 0);

      const levels = new Set(board.slots.map((s) => s.level));

      expect(levels).toEqual(new Set([1, 2, 3]));
    });
  });

  describe('slot status', () => {
    it('should initialise all slot statuses to "active"', () => {
      const board = initBoard(POOL_4, () => 0);

      for (const slot of board.slots) {
        expect(slot.status).toBe('active');
      }
    });
  });

  describe('validation', () => {
    it('should throw when the pool has fewer than 3 monsters (2 monsters)', () => {
      expect(() => initBoard(['a', 'b'].map(makeMonster))).toThrow();
    });

    it('should throw with an empty pool', () => {
      expect(() => initBoard([])).toThrow();
    });

    it('should not throw with exactly 3 monsters', () => {
      expect(() => initBoard(['a', 'b', 'c'].map(makeMonster), () => 0)).not.toThrow();
    });
  });

  describe('determinism', () => {
    it('should produce an identical board when given the same rng sequence', () => {
      // Provide enough values to cover all shuffle calls inside initBoard:
      // 3 (monster shuffle) + 2 (types) + 2 (levels) + 5×3 (3 location shuffles of 6 items) = 22 calls
      const seq = [0.1, 0.5, 0.9, 0.2, 0.8, 0.4, 0.6, 0.3, 0.7, 0.15, 0.55, 0.95, 0.25, 0.85, 0.45, 0.65, 0.35, 0.75, 0.05, 0.88, 0.33, 0.66];

      const board1 = initBoard(POOL_4, makeRng(seq));
      const board2 = initBoard(POOL_4, makeRng(seq));

      expect(board1).toEqual(board2);
    });
  });
});

// ---------------------------------------------------------------------------
// spawnReplacement
// ---------------------------------------------------------------------------

describe('spawnReplacement', () => {
  // A 4-monster pool; slot 0 is the "defeated" slot in most tests.
  // slot1 = m2, slot2 = m3 → valid replacements for slot 0 are m1 or m4.
  const MONSTERS_4 = ['m1', 'm2', 'm3', 'm4'].map(makeMonster);

  describe('level escalation', () => {
    it('should set the replacement level to 2 when the defeated slot was level 1', () => {
      const board = makeBoard(1); // slot0.level = 1
      const newBoard = spawnReplacement(board, 0, MONSTERS_4, () => 0);

      expect(newBoard.slots[0].level).toBe(2);
    });

    it('should set the replacement level to 3 when the defeated slot was level 2', () => {
      const board = makeBoard(2); // slot0.level = 2
      const newBoard = spawnReplacement(board, 0, MONSTERS_4, () => 0);

      expect(newBoard.slots[0].level).toBe(3);
    });

    it('should cap the replacement level at 3 when the defeated slot was already level 3 (SC-006)', () => {
      const board = makeBoard(3); // slot0.level = 3
      const newBoard = spawnReplacement(board, 0, MONSTERS_4, () => 0);

      // Must not escalate beyond 3
      expect(newBoard.slots[0].level).toBe(3);
    });
  });

  describe('location assignment', () => {
    it('should assign a locationId different from the previous one (EC-2)', () => {
      const board = makeBoard(); // slot0.locationId = 1 (water)
      const newBoard = spawnReplacement(board, 0, MONSTERS_4, () => 0);

      expect(newBoard.slots[0].locationId).not.toBe(1);
    });

    it('should preserve the same locationType as the defeated slot', () => {
      const board = makeBoard(); // slot0.locationType = 'water'
      const newBoard = spawnReplacement(board, 0, MONSTERS_4, () => 0);

      expect(newBoard.slots[0].locationType).toBe('water');
    });

    it("should assign a locationId whose type still matches the slot's locationType", () => {
      const board = makeBoard();
      const newBoard = spawnReplacement(board, 0, MONSTERS_4, () => 0);

      const location = LOCATIONS.find((l) => l.id === newBoard.slots[0].locationId);
      expect(location).toBeDefined();
      expect(location!.type).toBe('water');
    });
  });

  describe('monster selection', () => {
    it('should not select a monster already active in the other two slots (SC-007)', () => {
      // slot1 = m2, slot2 = m3 are active; replacement for slot0 must be neither
      const board = makeBoard();
      const newBoard = spawnReplacement(board, 0, MONSTERS_4, () => 0);

      expect(newBoard.slots[0].monsterId).not.toBe('m2');
      expect(newBoard.slots[0].monsterId).not.toBe('m3');
    });

    it('should allow the defeated monster to be re-selected when the pool has exactly 3 monsters (SC-008)', () => {
      // Pool = [m1, m2, m3]; board = slot0:m1, slot1:m2, slot2:m3.
      // Excluding other active monsters {m2, m3} leaves only m1 — it must be chosen.
      const threeMonsters = ['m1', 'm2', 'm3'].map(makeMonster);
      const board = makeBoard(); // slot0=m1, slot1=m2, slot2=m3

      const newBoard = spawnReplacement(board, 0, threeMonsters, () => 0);

      expect(newBoard.slots[0].monsterId).toBe('m1');
    });
  });

  describe('slot isolation', () => {
    it('should leave the other two slots unchanged after replacement', () => {
      const board = makeBoard();
      const newBoard = spawnReplacement(board, 0, MONSTERS_4, () => 0);

      expect(newBoard.slots[1]).toEqual(board.slots[1]);
      expect(newBoard.slots[2]).toEqual(board.slots[2]);
    });
  });

  describe('immutability', () => {
    it('should not mutate the original board', () => {
      const board = makeBoard();
      // Deep-clone so we can detect any in-place mutation
      const snapshot = JSON.parse(JSON.stringify(board.slots)) as BoardSlot[];

      spawnReplacement(board, 0, MONSTERS_4, () => 0);

      expect(board.slots).toEqual(snapshot);
    });
  });
});
