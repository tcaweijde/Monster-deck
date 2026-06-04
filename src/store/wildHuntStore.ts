import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  WildHuntState,
  WildHuntPhase,
  WildHuntDifficulty,
  HoundSlot,
  WildHuntBoardSlot,
} from '../types/wildHunt';
import type { LocationType } from '../types';
import { getWildHuntCharacterById } from '../data/wildHunt/characters';
import { MONSTERS } from '../data/monsters';
import { LOCATIONS } from '../data/locations';
import { shuffle } from '../engine/shuffle';
import { getSpawnOutcome } from '../data/wildHunt/spawnTable';

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

  /**
   * Place the starting monster on the board based on the current difficulty.
   * Must be called after `startWildHunt` has set the difficulty.
   */
  initWildHuntBoard: () => void;

  /** Confirm the setup screen and transition to 'playing'. No-op if not in 'setup'. */
  confirmSetup: () => void;

  /**
   * Advance to the next stage. Wraps at stage 4 → increments round and resets stage to 1.
   * At stage 4 (except round 8), executes the spawn phase before advancing.
   * Round 8 stage 4 transitions to 'finalBattle'.
   */
  advanceStage: () => void;

  /**
   * Mark a slot as 'encountering' and record the active slot index.
   * No-op if the slot is empty.
   */
  setActiveWildHuntSlot: (index: 0 | 1 | 2) => void;

  /**
   * Revert the active slot back to 'active' and clear the active index.
   * Used when the player quits an encounter mid-way.
   */
  clearActiveWildHuntSlot: () => void;

  /**
   * Mark the active slot as 'empty' (monster defeated).
   * Called on encounter victory. Does not spawn a replacement.
   */
  defeatWildHuntSlot: (index: 0 | 1 | 2) => void;

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

  /**
   * Resolve hound combat. If declaredDamage >= threshold for the hound's level,
   * the hound is defeated and excess damage is absorbed as shield loss.
   * Returns `{ defeated: boolean; excessDamage: number }`.
   */
  resolveHoundCombat: (houndId: string, declaredDamage: number) => { defeated: boolean; excessDamage: number };

  /** Show or hide the monster board sub-screen within Wild Hunt mode. */
  setShowMonsters: (show: boolean) => void;

  /** Show or hide the proximity bonus setup screen before a monster encounter. */
  setShowProximitySetup: (show: boolean) => void;

  /** Mark the run as won. */
  triggerVictory: () => void;

  /** Mark the run as lost (shields depleted). */
  triggerDefeat: () => void;

  /** Reset all state back to initial values. */
  resetWildHunt: () => void;
}

// ─── Combined store type ──────────────────────────────────────────────────────

export type WildHuntStoreState = WildHuntState & WildHuntActions;

// ─── Constants ────────────────────────────────────────────────────────────────

/** Starting shields per difficulty for solo play. */
const SOLO_STARTING_SHIELDS: Record<WildHuntDifficulty, number> = {
  'easy':      5,
  'normal':    7,
  'hard':      9,
  'very-hard': 11,
};

/** Starting monster level per difficulty for solo play. */
const SOLO_STARTING_LEVEL: Record<WildHuntDifficulty, 1 | 2 | 3> = {
  'easy':      1,
  'normal':    1,
  'hard':      2,
  'very-hard': 3,
};

const EMPTY_SLOT: WildHuntBoardSlot = {
  monsterId: null,
  level: null,
  locationType: null,
  locationId: null,
  status: 'empty',
};

const EMPTY_SLOTS: [WildHuntBoardSlot, WildHuntBoardSlot, WildHuntBoardSlot] = [
  { ...EMPTY_SLOT },
  { ...EMPTY_SLOT },
  { ...EMPTY_SLOT },
];

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
  wildHuntSlots: EMPTY_SLOTS,
  activeWildHuntSlotIndex: null,
  showMonsters: false,
  showProximitySetup: false,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ALL_LOCATION_TYPES: LocationType[] = ['water', 'mountain', 'woods'];

/** Count occupied (non-empty) slots in a Wild Hunt board. */
function countOccupied(slots: [WildHuntBoardSlot, WildHuntBoardSlot, WildHuntBoardSlot]): number {
  return slots.filter((s) => s.status !== 'empty').length;
}

/** Find the first empty slot index (0|1|2), or null if board is full. */
function firstEmptyIndex(
  slots: [WildHuntBoardSlot, WildHuntBoardSlot, WildHuntBoardSlot],
): 0 | 1 | 2 | null {
  const idx = slots.findIndex((s) => s.status === 'empty');
  return idx === -1 ? null : (idx as 0 | 1 | 2);
}

/**
 * Pick an unused terrain type and a random location of that type.
 * "Unused" means no non-empty slot already has that locationType.
 * Falls back to any type if all three are taken (shouldn't happen with 3 slots max).
 */
function pickLocation(
  slots: [WildHuntBoardSlot, WildHuntBoardSlot, WildHuntBoardSlot],
): { locationType: LocationType; locationId: number } {
  const usedTypes = new Set(
    slots.filter((s) => s.status !== 'empty' && s.locationType !== null).map((s) => s.locationType!),
  );
  const available = ALL_LOCATION_TYPES.filter((t) => !usedTypes.has(t));
  const typePool = available.length > 0 ? available : ALL_LOCATION_TYPES;
  const locationType = shuffle(typePool)[0];
  const candidates = LOCATIONS.filter((l) => l.type === locationType);
  const location = shuffle(candidates)[0];
  return { locationType, locationId: location.id };
}

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
          shieldCount: SOLO_STARTING_SHIELDS[difficulty],
          round: 1,
          stage: 1,
          houndSlots: [],
          wildHuntSlots: EMPTY_SLOTS,
          activeWildHuntSlotIndex: null,
          wildHuntLocationId: null,
          playerLocationId: null,
        });
      },

      initWildHuntBoard: () => {
        const { difficulty } = get();
        const level = SOLO_STARTING_LEVEL[difficulty];
        const candidates = MONSTERS.filter((m) => m.level === level);
        if (candidates.length === 0) return;

        const monster = shuffle(candidates)[0];
        const { locationType, locationId } = pickLocation(EMPTY_SLOTS);
        const newSlots: [WildHuntBoardSlot, WildHuntBoardSlot, WildHuntBoardSlot] = [
          { monsterId: monster.id, level, locationType, locationId, status: 'active' },
          { ...EMPTY_SLOT },
          { ...EMPTY_SLOT },
        ];
        set({ wildHuntSlots: newSlots });
      },

      confirmSetup: () => {
        if (get().phase !== 'setup') return;
        set({ phase: 'playing' });
      },

      advanceStage: () => {
        const { stage, round, wildHuntSlots, wildHuntLocationId, shieldCount, houndSlots } = get();

        if (stage < 4) {
          set({ stage: (stage + 1) as 1 | 2 | 3 | 4 });
          return;
        }

        // Stage 4 — trigger Final Battle on round 8, otherwise spawn + advance
        if (round >= 8) {
          set({ phase: 'finalBattle' });
          return;
        }

        const occupied = countOccupied(wildHuntSlots);
        const outcome = getSpawnOutcome(round, occupied, wildHuntLocationId);

        const newSlots = wildHuntSlots.map((s) => ({ ...s })) as typeof wildHuntSlots;
        let newShieldCount = shieldCount;
        let newHoundSlots = [...houndSlots];

        // Monster spawn
        if (outcome.monsterLevel !== null) {
          if (outcome.monsterBlocked) {
            newShieldCount += 1;
          } else {
            const emptyIdx = firstEmptyIndex(newSlots);
            if (emptyIdx !== null) {
              const usedIds = new Set(
                newSlots
                  .filter((s) => s.monsterId !== null)
                  .map((s) => s.monsterId as string),
              );
              const candidates = MONSTERS.filter(
                (m) => m.level === outcome.monsterLevel && !usedIds.has(m.id),
              );
              if (candidates.length > 0) {
                const monster = shuffle(candidates)[0];
                const { locationType, locationId } = pickLocation(newSlots);
                newSlots[emptyIdx] = {
                  monsterId: monster.id,
                  level: outcome.monsterLevel,
                  locationType,
                  locationId,
                  status: 'active',
                };
              }
            }
          }
        }

        // Hound spawn
        if (outcome.houndLevel !== null) {
          const newHound: HoundSlot = {
            id: `hound-${Date.now()}`,
            level: outcome.houndLevel,
            locationId: outcome.houndLocationId,
          };
          newHoundSlots = [...newHoundSlots, newHound];
        }

        set({
          wildHuntSlots: newSlots,
          shieldCount: newShieldCount,
          houndSlots: newHoundSlots,
          round: round + 1,
          stage: 1,
        });
      },

      setActiveWildHuntSlot: (index) => {
        const { wildHuntSlots } = get();
        if (wildHuntSlots[index].status === 'empty') return;

        const newSlots = wildHuntSlots.map((slot, i) =>
          i === index ? { ...slot, status: 'encountering' as const } : slot,
        ) as typeof wildHuntSlots;

        set({ wildHuntSlots: newSlots, activeWildHuntSlotIndex: index });
      },

      clearActiveWildHuntSlot: () => {
        const { activeWildHuntSlotIndex, wildHuntSlots } = get();
        if (activeWildHuntSlotIndex === null) return;

        const newSlots = wildHuntSlots.map((slot, i) =>
          i === activeWildHuntSlotIndex ? { ...slot, status: 'active' as const } : slot,
        ) as typeof wildHuntSlots;

        set({ wildHuntSlots: newSlots, activeWildHuntSlotIndex: null });
      },

      defeatWildHuntSlot: (index) => {
        const { wildHuntSlots } = get();
        const newSlots = wildHuntSlots.map((slot, i) =>
          i === index ? { ...EMPTY_SLOT } : slot,
        ) as typeof wildHuntSlots;

        set({ wildHuntSlots: newSlots, activeWildHuntSlotIndex: null });
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

      resolveHoundCombat: (houndId, declaredDamage) => {
        const THRESHOLD: Record<1 | 2 | 3, number> = { 1: 2, 2: 3, 3: 4 };
        const { houndSlots, shieldCount } = get();
        const hound = houndSlots.find((h) => h.id === houndId);
        if (!hound) return { defeated: false, excessDamage: 0 };
        const threshold = THRESHOLD[hound.level];
        if (declaredDamage < threshold) return { defeated: false, excessDamage: 0 };
        const excessDamage = declaredDamage - threshold;
        const newShields = Math.max(0, shieldCount - excessDamage);
        set({
          houndSlots: houndSlots.filter((h) => h.id !== houndId),
          shieldCount: newShields,
        });
        return { defeated: true, excessDamage };
      },

      setShowMonsters: (show) => {
        set({ showMonsters: show });
      },

      setShowProximitySetup: (show) => {
        set({ showProximitySetup: show });
      },

      triggerVictory: () => {
        set({ phase: 'victory' });
      },

      triggerDefeat: () => {
        set({ phase: 'defeat' });
      },

      resetWildHunt: () => {
        set({ ...INITIAL_STATE });
      },
    }),
    {
      name: 'monster-deck-wh-v2',
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // If app closed mid-encounter, revert encountering slot to active
        if (state.wildHuntSlots) {
          state.wildHuntSlots = state.wildHuntSlots.map((slot) =>
            slot.status === 'encountering' ? { ...slot, status: 'active' } : slot,
          ) as typeof state.wildHuntSlots;
        }
        state.activeWildHuntSlotIndex = null;
        state.showProximitySetup = false;
      },
    },
  ),
);
