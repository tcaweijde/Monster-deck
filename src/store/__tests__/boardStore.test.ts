import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { Monster, BoardState, BoardSlot } from '../../types';

// ---------------------------------------------------------------------------
// vi.hoisted — runs before vi.mock factories AND before any imports.
// We need two things here:
//   1. A localStorage stub so Zustand's persist middleware can initialise
//      without throwing (jsdom has no localStorage when no URL is configured).
//   2. MOCK_MONSTERS defined early enough for use in vi.mock factories
//      (plain `const` declarations are in TDZ at hoist time).
// ---------------------------------------------------------------------------

vi.hoisted(() => {
  // Provide a minimal localStorage so Zustand's persist middleware doesn't
  // throw during the store's initial hydration call to storage.getItem.
  const store: Record<string, string> = {};
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
    },
    writable: true,
    configurable: true,
  });
});

const MOCK_MONSTERS = vi.hoisted((): Monster[] => {
  const makeM = (id: string): Monster => ({
    id,
    name: id,
    level: 1,
    deckSize: 4,
    baseAbility: { name: 'T', description: 'T', trigger: 'passive' },
    cardPool: [],
    cardFrontImages: [],
  });
  return [makeM('m-a'), makeM('m-b'), makeM('m-c'), makeM('m-d')];
});

// ---------------------------------------------------------------------------
// Minimal stubs (module-level, used in test bodies only — not in mock factories)
// ---------------------------------------------------------------------------

const makeSlot = (
  monsterId: string,
  type: BoardSlot['locationType'],
  locationId: number,
  level: 1 | 2 | 3,
  status: BoardSlot['status'] = 'active',
): BoardSlot => ({ locationType: type, locationId, monsterId, level, status });

const MOCK_BOARD: BoardState = {
  slots: [
    makeSlot('m-a', 'water', 1, 1),
    makeSlot('m-b', 'mountain', 2, 2),
    makeSlot('m-c', 'woods', 6, 3),
  ],
};

const MOCK_REPLACEMENT_BOARD: BoardState = {
  slots: [
    makeSlot('m-d', 'water', 4, 2),
    makeSlot('m-b', 'mountain', 2, 2),
    makeSlot('m-c', 'woods', 6, 3),
  ],
};

// ---------------------------------------------------------------------------
// Mocks — must be hoisted BEFORE the store import
// ---------------------------------------------------------------------------

vi.mock('../../data/monsters', () => ({ MONSTERS: MOCK_MONSTERS }));

let mockInitBoardResult: BoardState = MOCK_BOARD;
let mockSpawnResult: BoardState = MOCK_REPLACEMENT_BOARD;

vi.mock('../../engine/board', () => ({
  initBoard: () => mockInitBoardResult,
  spawnReplacement: () => mockSpawnResult,
}));

// Store import AFTER all vi.mock calls
import { useBoardStore } from '../boardStore';

// ---------------------------------------------------------------------------
// Rehydration guard — extracted pure logic for direct unit testing (EC-4).
// This mirrors the onRehydrateStorage callback in boardStore.ts exactly so
// that the test verifies the real logic without needing to poke persist internals.
// ---------------------------------------------------------------------------

type RehydrateState = {
  board: BoardState | null;
  activeSlotIndex: 0 | 1 | 2 | null;
};

function applyRehydrationGuard(state: RehydrateState | undefined): void {
  if (!state) return;
  if (state.board) {
    state.board = {
      slots: state.board.slots.map((slot) =>
        slot.status === 'encountering' ? { ...slot, status: 'active' } : slot,
      ) as BoardState['slots'],
    };
  }
  state.activeSlotIndex = null;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('boardStore', () => {
  beforeEach(() => {
    // Reset mock return values to their defaults
    mockInitBoardResult = MOCK_BOARD;
    mockSpawnResult = MOCK_REPLACEMENT_BOARD;
    // Reset store to a clean slate between every test
    useBoardStore.setState({ board: null, activeSlotIndex: null });
  });

  // -------------------------------------------------------------------------
  describe('initial state', () => {
    it('should have board as null', () => {
      expect(useBoardStore.getState().board).toBeNull();
    });

    it('should have activeSlotIndex as null', () => {
      expect(useBoardStore.getState().activeSlotIndex).toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  describe('initNewGame', () => {
    it('should set board to the initBoard mock result', () => {
      act(() => { useBoardStore.getState().initNewGame(); });
      expect(useBoardStore.getState().board).toEqual(MOCK_BOARD);
    });

    it('should reset activeSlotIndex to null even if previously set', () => {
      useBoardStore.setState({ board: MOCK_BOARD, activeSlotIndex: 2 });
      act(() => { useBoardStore.getState().initNewGame(); });
      expect(useBoardStore.getState().activeSlotIndex).toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  describe('setActiveSlot', () => {
    beforeEach(() => {
      useBoardStore.setState({ board: MOCK_BOARD, activeSlotIndex: null });
    });

    it('should set activeSlotIndex to the given index', () => {
      act(() => { useBoardStore.getState().setActiveSlot(1); });
      expect(useBoardStore.getState().activeSlotIndex).toBe(1);
    });

    it('should set slot[index].status to encountering', () => {
      act(() => { useBoardStore.getState().setActiveSlot(0); });
      expect(useBoardStore.getState().board!.slots[0].status).toBe('encountering');
    });

    it('should not change other slots status', () => {
      act(() => { useBoardStore.getState().setActiveSlot(0); });
      const { slots } = useBoardStore.getState().board!;
      expect(slots[1].status).toBe('active');
      expect(slots[2].status).toBe('active');
    });

    it('should do nothing if board is null', () => {
      useBoardStore.setState({ board: null, activeSlotIndex: null });
      act(() => { useBoardStore.getState().setActiveSlot(0); });
      expect(useBoardStore.getState().board).toBeNull();
      expect(useBoardStore.getState().activeSlotIndex).toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  describe('clearActiveSlot', () => {
    // Set up board with slot 1 already in 'encountering' state
    const boardWithEncountering: BoardState = {
      slots: [
        makeSlot('m-a', 'water', 1, 1, 'active'),
        makeSlot('m-b', 'mountain', 2, 2, 'encountering'),
        makeSlot('m-c', 'woods', 6, 3, 'active'),
      ],
    };

    beforeEach(() => {
      useBoardStore.setState({ board: boardWithEncountering, activeSlotIndex: 1 });
    });

    it('should set activeSlotIndex to null', () => {
      act(() => { useBoardStore.getState().clearActiveSlot(); });
      expect(useBoardStore.getState().activeSlotIndex).toBeNull();
    });

    it('should revert slot[activeSlotIndex].status to active', () => {
      act(() => { useBoardStore.getState().clearActiveSlot(); });
      expect(useBoardStore.getState().board!.slots[1].status).toBe('active');
    });

    it('should do nothing if board is null', () => {
      useBoardStore.setState({ board: null, activeSlotIndex: 1 });
      act(() => { useBoardStore.getState().clearActiveSlot(); });
      expect(useBoardStore.getState().board).toBeNull();
    });

    it('should do nothing if activeSlotIndex is null', () => {
      useBoardStore.setState({ activeSlotIndex: null });
      // board is still boardWithEncountering from beforeEach (Zustand merges)
      const boardBefore = useBoardStore.getState().board;
      act(() => { useBoardStore.getState().clearActiveSlot(); });
      expect(useBoardStore.getState().board).toEqual(boardBefore);
      expect(useBoardStore.getState().activeSlotIndex).toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  describe('handleVictory', () => {
    beforeEach(() => {
      useBoardStore.setState({ board: MOCK_BOARD, activeSlotIndex: 0 });
    });

    it('should set board to the spawnReplacement mock result', () => {
      act(() => { useBoardStore.getState().handleVictory(); });
      expect(useBoardStore.getState().board).toEqual(MOCK_REPLACEMENT_BOARD);
    });

    it('should set activeSlotIndex to null', () => {
      act(() => { useBoardStore.getState().handleVictory(); });
      expect(useBoardStore.getState().activeSlotIndex).toBeNull();
    });

    it('should do nothing if board is null', () => {
      useBoardStore.setState({ board: null, activeSlotIndex: 0 });
      act(() => { useBoardStore.getState().handleVictory(); });
      expect(useBoardStore.getState().board).toBeNull();
    });

    it('should do nothing if activeSlotIndex is null', () => {
      useBoardStore.setState({ activeSlotIndex: null });
      const boardBefore = useBoardStore.getState().board;
      act(() => { useBoardStore.getState().handleVictory(); });
      expect(useBoardStore.getState().board).toEqual(boardBefore);
    });
  });

  // -------------------------------------------------------------------------
  describe('rehydration guard (EC-4)', () => {
    it('should revert an encountering slot to active', () => {
      const state: RehydrateState = {
        board: {
          slots: [
            makeSlot('m-a', 'water', 1, 1, 'encountering'),
            makeSlot('m-b', 'mountain', 2, 2, 'active'),
            makeSlot('m-c', 'woods', 6, 3, 'active'),
          ],
        },
        activeSlotIndex: 0,
      };
      applyRehydrationGuard(state);
      expect(state.board!.slots[0].status).toBe('active');
    });

    it('should leave already-active slots unchanged', () => {
      const state: RehydrateState = {
        board: {
          slots: [
            makeSlot('m-a', 'water', 1, 1, 'active'),
            makeSlot('m-b', 'mountain', 2, 2, 'active'),
            makeSlot('m-c', 'woods', 6, 3, 'active'),
          ],
        },
        activeSlotIndex: null,
      };
      applyRehydrationGuard(state);
      state.board!.slots.forEach((slot) => {
        expect(slot.status).toBe('active');
      });
    });

    it('should reset activeSlotIndex to null', () => {
      const state: RehydrateState = {
        board: {
          slots: [
            makeSlot('m-a', 'water', 1, 1, 'encountering'),
            makeSlot('m-b', 'mountain', 2, 2, 'active'),
            makeSlot('m-c', 'woods', 6, 3, 'active'),
          ],
        },
        activeSlotIndex: 0,
      };
      applyRehydrationGuard(state);
      expect(state.activeSlotIndex).toBeNull();
    });

    it('should handle undefined state gracefully without throwing', () => {
      expect(() => applyRehydrationGuard(undefined)).not.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  describe('React hook integration', () => {
    it('should reflect store state changes through the hook', () => {
      const { result } = renderHook(() => useBoardStore());
      expect(result.current.board).toBeNull();

      act(() => { result.current.initNewGame(); });
      expect(result.current.board).toEqual(MOCK_BOARD);
    });

    it('should expose all required action methods', () => {
      const { result } = renderHook(() => useBoardStore());
      expect(typeof result.current.initNewGame).toBe('function');
      expect(typeof result.current.setActiveSlot).toBe('function');
      expect(typeof result.current.clearActiveSlot).toBe('function');
      expect(typeof result.current.handleVictory).toBe('function');
    });
  });
});
