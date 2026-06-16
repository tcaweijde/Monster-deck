import type { StateCreator } from 'zustand';
import type { WildHuntPhase, WildHuntDifficulty, HoundSlot } from '../../types/wildHunt';
import type { ShieldSlice } from './shieldSlice';
import type { HoundSlice } from './houndSlice';
import type { UISlice } from './uiSlice';
import type { BoardSlice } from './boardSlice';
import { getWildHuntCharacterById } from '../../data/wildHunt/characters';
import { MONSTERS } from '../../data/monsters';
import { getSpawnOutcome } from '../../data/wildHunt/spawnTable';
import { shuffle } from '../../engine/shuffle';
import {
  EMPTY_SLOTS,
  countOccupied,
  firstEmptyIndex,
  pickLocation,
} from './boardSlice';

// ─── Slice type ───────────────────────────────────────────────────────────────

export type CampaignSlice = {
  phase: WildHuntPhase;
  round: number;
  stage: 1 | 2 | 3 | 4;
  characterId: string | null;
  difficulty: WildHuntDifficulty;
  /**
   * Enter the Wild Hunt setup flow from the welcome screen.
   * Sets phase to 'setup' so the setup screen renders.
   */
  initiateSetup: () => void;
  /** Begin a new Wild Hunt run. Sets phase to 'setup' and seeds character + difficulty. */
  startWildHunt: (characterId: string, difficulty: WildHuntDifficulty) => void;
  /** Confirm the setup screen and transition to 'playing'. No-op if not in 'setup'. */
  confirmSetup: () => void;
  /**
   * Advance to the next stage. Wraps stage 4 → increments round and resets to stage 1.
   * At stage 4 (except round 8), executes the spawn phase before advancing.
   * Round 8 stage 4 transitions to 'finalBattle'.
   */
  advanceStage: () => void;
  /** Mark the run as won. */
  triggerVictory: () => void;
  /** Mark the run as lost. */
  triggerDefeat: () => void;
  /** Reset all state back to initial values. */
  resetWildHunt: () => void;
};

type AllSlices = CampaignSlice & BoardSlice & ShieldSlice & HoundSlice & UISlice;

// ─── Constants ────────────────────────────────────────────────────────────────

/** Starting shields per difficulty for solo play. */
const SOLO_STARTING_SHIELDS: Record<WildHuntDifficulty, number> = {
  'easy':      5,
  'normal':    7,
  'hard':      9,
  'very-hard': 11,
};

// ─── Initial campaign state ───────────────────────────────────────────────────

export const INITIAL_CAMPAIGN_STATE = {
  phase: 'inactive' as WildHuntPhase,
  round: 1,
  stage: 1 as 1 | 2 | 3 | 4,
  characterId: null as string | null,
  difficulty: 'normal' as WildHuntDifficulty,
};

// ─── Slice factory ────────────────────────────────────────────────────────────

export const createCampaignSlice: StateCreator<AllSlices, [], [], CampaignSlice> = (set, get) => ({
  ...INITIAL_CAMPAIGN_STATE,

  initiateSetup: () => {
    set({
      ...INITIAL_CAMPAIGN_STATE,
      phase: 'setup',
      shieldCount: 0,
      houndSlots: [],
      wildHuntSlots: EMPTY_SLOTS,
      activeWildHuntSlotIndex: null,
      showMonsters: false,
      showProximitySetup: false,
    });
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
    });
  },

  confirmSetup: () => {
    if (get().phase !== 'setup') return;
    set({ phase: 'playing' });
  },

  advanceStage: () => {
    const { stage, round, wildHuntSlots, shieldCount, houndSlots } = get();

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
    const outcome = getSpawnOutcome(round, occupied);

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

  triggerVictory: () => {
    set({ phase: 'victory' });
  },

  triggerDefeat: () => {
    set({ phase: 'defeat' });
  },

  resetWildHunt: () => {
    set({
      ...INITIAL_CAMPAIGN_STATE,
      shieldCount: 0,
      houndSlots: [],
      wildHuntSlots: [...EMPTY_SLOTS] as typeof EMPTY_SLOTS,
      activeWildHuntSlotIndex: null,
      showMonsters: false,
      showProximitySetup: false,
    });
  },
});
