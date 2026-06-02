import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BoardState } from '../types';
import { MONSTERS } from '../data/monsters';
import { initBoard, spawnReplacement } from '../engine/board';

interface BoardStore {
  board: BoardState | null;
  activeSlotIndex: 0 | 1 | 2 | null;

  /** Initialises a new game board with random placement. Overwrites any existing board. */
  initNewGame: () => void;

  /**
   * Marks the slot as 'encountering' and records the active slot index.
   * Call this before launching the encounter in encounterStore.
   */
  setActiveSlot: (index: 0 | 1 | 2) => void;

  /**
   * Reverts the active slot to 'active' and clears activeSlotIndex.
   * Used for EC-1: player navigates back mid-encounter (quit).
   */
  clearActiveSlot: () => void;

  /**
   * Called on encounter victory. Spawns a replacement monster for the active slot,
   * then clears activeSlotIndex.
   */
  handleVictory: () => void;
}

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      board: null,
      activeSlotIndex: null,

      initNewGame: () => {
        set({ board: initBoard(MONSTERS), activeSlotIndex: null });
      },

      setActiveSlot: (index) => {
        const { board } = get();
        if (!board) return;

        const newSlots = board.slots.map((slot, i) =>
          i === index ? { ...slot, status: 'encountering' as const } : slot,
        ) as BoardState['slots'];

        set({ board: { slots: newSlots }, activeSlotIndex: index });
      },

      clearActiveSlot: () => {
        const { board, activeSlotIndex } = get();
        if (!board || activeSlotIndex === null) return;

        const newSlots = board.slots.map((slot, i) =>
          i === activeSlotIndex ? { ...slot, status: 'active' as const } : slot,
        ) as BoardState['slots'];

        set({ board: { slots: newSlots }, activeSlotIndex: null });
      },

      handleVictory: () => {
        const { board, activeSlotIndex } = get();
        if (!board || activeSlotIndex === null) return;

        const newBoard = spawnReplacement(board, activeSlotIndex, MONSTERS);
        set({ board: newBoard, activeSlotIndex: null });
      },
    }),
    {
      name: 'monster-deck-board-v1',
      onRehydrateStorage: () => (state) => {
        // EC-4: if the app was closed mid-encounter, revert all 'encountering' slots to 'active'.
        if (!state) return;
        if (state.board) {
          state.board = {
            slots: state.board.slots.map((slot) =>
              slot.status === 'encountering' ? { ...slot, status: 'active' } : slot,
            ) as BoardState['slots'],
          };
        }
        state.activeSlotIndex = null;
      },
    },
  ),
);
