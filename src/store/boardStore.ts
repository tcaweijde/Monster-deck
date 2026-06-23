import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BoardState, BoardSlot } from '../types';
import { MONSTERS, dagon } from '../data/monsters';
import { DAGONS_LAIR_LOCATION, getLocations } from '../data/locations';
import { initBoard, spawnReplacement } from '../engine/board';

const DAGONS_LAIR_SLOT: BoardSlot = {
  locationType: 'water',
  locationId: DAGONS_LAIR_LOCATION.id,
  monsterId: dagon.id,
  level: 3,
  status: 'active',
};

interface BoardStore {
  board: BoardState | null;
  activeSlotIndex: 0 | 1 | 2 | null;
  /** Whether the Skellige expansion's Dagon's Lair is enabled for this game. */
  dagonsLairEnabled: boolean;
  /** True while the player is in an encounter against Dagon (permanent slot). */
  activePermanentSlot: boolean;

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

  /** Marks Dagon's Lair as 'encountering' and sets activePermanentSlot. */
  setActivePermanentSlot: () => void;

  /** Reverts Dagon's Lair to 'active' and clears activePermanentSlot (quit). */
  clearActivePermanentSlot: () => void;

  /**
   * Called on victory against Dagon. Resets his slot to 'active' — he is never
   * replaced, only re-activated at the same level.
   */
  handlePermanentVictory: () => void;

  /** Enables Dagon's Lair for the current game session. */
  enableDagonsLair: () => void;

  /** Disables Dagon's Lair and removes the permanent slot from the board. */
  disableDagonsLair: () => void;

  /**
   * True while the player is in a one-off random encounter (FEAT-SKELLIGE-004).
   * The board is never modified when this is true — no monster is replaced on victory.
   */
  randomEncounterActive: boolean;

  /** Marks the start of a random encounter. Call before launching encounterStore. */
  setRandomEncounterActive: () => void;

  /** Clears the random encounter flag. Call on quit or victory. */
  clearRandomEncounter: () => void;

  /** Clears the board and returns to the welcome screen. */
  endGame: () => void;
}

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      board: null,
      activeSlotIndex: null,
      dagonsLairEnabled: false,
      activePermanentSlot: false,
      randomEncounterActive: false,

      initNewGame: () => {
        const { dagonsLairEnabled } = get();
        const newBoard = initBoard(MONSTERS, Math.random, getLocations(dagonsLairEnabled));
        set({
          board: {
            ...newBoard,
            permanentSlot: dagonsLairEnabled ? { ...DAGONS_LAIR_SLOT } : undefined,
          },
          activeSlotIndex: null,
          activePermanentSlot: false,
          randomEncounterActive: false,
        });
      },

      setActiveSlot: (index) => {
        const { board } = get();
        if (!board) return;

        const newSlots = board.slots.map((slot, i) =>
          i === index ? { ...slot, status: 'encountering' as const } : slot,
        ) as BoardState['slots'];

        set({ board: { ...board, slots: newSlots }, activeSlotIndex: index });
      },

      clearActiveSlot: () => {
        const { board, activeSlotIndex } = get();
        if (!board || activeSlotIndex === null) return;

        const newSlots = board.slots.map((slot, i) =>
          i === activeSlotIndex ? { ...slot, status: 'active' as const } : slot,
        ) as BoardState['slots'];

        set({ board: { ...board, slots: newSlots }, activeSlotIndex: null });
      },

      handleVictory: () => {
        const { board, activeSlotIndex, dagonsLairEnabled } = get();
        if (!board || activeSlotIndex === null) return;

        const newBoard = spawnReplacement(board, activeSlotIndex, MONSTERS, Math.random, getLocations(dagonsLairEnabled));
        set({ board: { ...newBoard, permanentSlot: board.permanentSlot }, activeSlotIndex: null });
      },

      setActivePermanentSlot: () => {
        const { board } = get();
        if (!board?.permanentSlot) return;
        set({
          board: { ...board, permanentSlot: { ...board.permanentSlot, status: 'encountering' } },
          activePermanentSlot: true,
        });
      },

      clearActivePermanentSlot: () => {
        const { board } = get();
        if (!board?.permanentSlot) return;
        set({
          board: { ...board, permanentSlot: { ...board.permanentSlot, status: 'active' } },
          activePermanentSlot: false,
        });
      },

      handlePermanentVictory: () => {
        const { board } = get();
        if (!board?.permanentSlot) return;
        set({
          board: { ...board, permanentSlot: { ...board.permanentSlot, status: 'active' } },
          activePermanentSlot: false,
        });
      },

      enableDagonsLair: () => {
        const { board } = get();
        set({
          dagonsLairEnabled: true,
          board: board ? { ...board, permanentSlot: { ...DAGONS_LAIR_SLOT } } : board,
        });
      },

      disableDagonsLair: () => {
        const { board } = get();
        set({
          dagonsLairEnabled: false,
          board: board ? { ...board, permanentSlot: undefined } : board,
          activePermanentSlot: false,
        });
      },

      setRandomEncounterActive: () => {
        set({ randomEncounterActive: true });
      },

      clearRandomEncounter: () => {
        set({ randomEncounterActive: false });
      },

      endGame: () => {
        set({ board: null, activeSlotIndex: null, activePermanentSlot: false, randomEncounterActive: false });
      },
    }),
    {
      name: 'monster-deck-board-v1',
      onRehydrateStorage: () => (state) => {
        // EC-4: if the app was closed mid-encounter, revert all 'encountering' slots to 'active'.
        if (!state) return;
        if (state.board) {
          const slots = state.board.slots.map((slot) =>
            slot.status === 'encountering' ? { ...slot, status: 'active' as const } : slot,
          ) as BoardState['slots'];
          const permanentSlot = state.board.permanentSlot?.status === 'encountering'
            ? { ...state.board.permanentSlot, status: 'active' as const }
            : state.board.permanentSlot;
          state.board = { slots, permanentSlot };
        }
        state.activeSlotIndex = null;
        state.activePermanentSlot = false;
        state.randomEncounterActive = false;
      },
    },
  ),
);
