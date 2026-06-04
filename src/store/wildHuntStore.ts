import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WildHuntState, WildHuntPhase, WildHuntDifficulty, HoundSlot } from '../types/wildHunt';
import { getWildHuntCharacterById } from '../data/wildHunt/characters';

// ─── Actions ─────────────────────────────────────────────────────────────────

export interface WildHuntActions {
  /**
   * Enter the Wild Hunt setup flow from the welcome screen.
   * Sets phase to 'setup' so the setup screen renders; character/difficulty are
   * chosen and committed by `startWildHunt` from within the setup screen.
   */
  initiateSetup: () => void;

  /** Begin a new Wild Hunt run. Sets phase to 'setup' and seeds character data. */
  startWildHunt: (characterId: string, difficulty: WildHuntDifficulty) => void;

  /** Confirm the setup screen and transition to 'playing'. No-op if not in 'setup'. */
  confirmSetup: () => void;

  /**
   * Advance to the next stage. Wraps at stage 4 → increments round and resets stage to 1.
   * If round would exceed 8 after wrapping, transitions to 'finalBattle'.
   */
  advanceStage: () => void;

  /**
   * Reduce shieldCount by `damage`, clamping to 0.
   * Returns the excess damage that broke through shields.
   */
  absorbDamage: (damage: number) => number;

  /** Increase shieldCount by `amount`. */
  gainShields: (amount: number) => void;

  /** Place the Wild Hunt unit on a location. */
  setWildHuntLocation: (locationId: number) => void;

  /** Place the player on a location. */
  setPlayerLocation: (locationId: number) => void;

  /** Spawn a hound token at the given location with the given level. */
  spawnHound: (locationId: number, level: 1 | 2 | 3) => void;

  /** Remove a hound token by its unique id. */
  removeHound: (houndId: string) => void;

  /** Mark the run as won. */
  triggerVictory: () => void;

  /** Reset all state back to initial values. */
  resetWildHunt: () => void;
}

// ─── Combined store type ──────────────────────────────────────────────────────

export type WildHuntStoreState = WildHuntState & WildHuntActions;

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL_STATE: WildHuntState = {
  phase: 'inactive' as WildHuntPhase,
  round: 1,
  stage: 1 as 1 | 2 | 3 | 4,
  characterId: null,
  difficulty: 'normal' as WildHuntDifficulty,
  shieldCount: 0,
  wildHuntLocationId: null,
  playerLocationId: null,
  houndSlots: [],
  occupiedBoardSlots: 0,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useWildHuntStore = create<WildHuntStoreState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      initiateSetup: () => {
        set({ ...INITIAL_STATE, phase: 'setup' });
      },

      startWildHunt: (characterId, difficulty) => {
        const character = getWildHuntCharacterById(characterId);
        if (!character) return;

        set({
          phase: 'setup',
          characterId,
          difficulty,
          shieldCount: character.startingShields,
          round: 1,
          stage: 1,
          houndSlots: [],
          wildHuntLocationId: null,
          playerLocationId: null,
        });
      },

      confirmSetup: () => {
        if (get().phase !== 'setup') return;
        set({ phase: 'playing' });
      },

      advanceStage: () => {
        const { stage, round } = get();

        if (stage < 4) {
          set({ stage: (stage + 1) as 1 | 2 | 3 | 4 });
          return;
        }

        // stage was 4 — wrap to next round
        const nextRound = round + 1;
        if (nextRound > 8) {
          set({ phase: 'finalBattle' });
        } else {
          set({ round: nextRound, stage: 1 });
        }
      },

      absorbDamage: (damage) => {
        const { shieldCount } = get();
        const excess = Math.max(0, damage - shieldCount);
        set({ shieldCount: Math.max(0, shieldCount - damage) });
        return excess;
      },

      gainShields: (amount) => {
        set((state) => ({ shieldCount: state.shieldCount + amount }));
      },

      setWildHuntLocation: (locationId) => {
        set({ wildHuntLocationId: locationId });
      },

      setPlayerLocation: (locationId) => {
        set({ playerLocationId: locationId });
      },

      spawnHound: (locationId, level) => {
        const newHound: HoundSlot = {
          id: `hound-${Date.now()}`,
          level,
          locationId,
        };
        set((state) => ({ houndSlots: [...state.houndSlots, newHound] }));
      },

      removeHound: (houndId) => {
        set((state) => ({
          houndSlots: state.houndSlots.filter((h) => h.id !== houndId),
        }));
      },

      triggerVictory: () => {
        set({ phase: 'victory' });
      },

      resetWildHunt: () => {
        set({ ...INITIAL_STATE });
      },
    }),
    {
      name: 'monster-deck-wh-v1',
      onRehydrateStorage: () => (state) => {
        // EC-4: if the app was closed mid-finalBattle, revert to 'playing'
        // so the player can resume rather than being stuck in the boss phase.
        if (!state) return;
        if (state.phase === 'finalBattle') {
          state.phase = 'playing';
        }
      },
    },
  ),
);
