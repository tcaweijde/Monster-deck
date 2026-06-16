import type { StateCreator } from 'zustand';
import type { WildHuntBoardSlot } from '../../types/wildHunt';
import type { LocationType } from '../../types';
import type { CampaignSlice } from './campaignSlice';
import { MONSTERS } from '../../data/monsters';
import { LOCATIONS } from '../../data/locations';
import { shuffle } from '../../engine/shuffle';

// ─── Slice type ───────────────────────────────────────────────────────────────

export type BoardSlice = {
  wildHuntSlots: [WildHuntBoardSlot, WildHuntBoardSlot, WildHuntBoardSlot];
  activeWildHuntSlotIndex: 0 | 1 | 2 | null;
  /**
   * Place the starting monster on the board based on the current difficulty.
   * Must be called after `startWildHunt` has set the difficulty.
   */
  initWildHuntBoard: () => void;
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
   * Mark a slot as 'empty' (monster defeated).
   * Called on encounter victory. Does not spawn a replacement.
   */
  defeatWildHuntSlot: (index: 0 | 1 | 2) => void;
};

type AllSlices = BoardSlice & CampaignSlice;

// ─── Constants ────────────────────────────────────────────────────────────────

export const EMPTY_SLOT: WildHuntBoardSlot = {
  monsterId: null,
  level: null,
  locationType: null,
  locationId: null,
  status: 'empty',
};

export const EMPTY_SLOTS: [WildHuntBoardSlot, WildHuntBoardSlot, WildHuntBoardSlot] = [
  { ...EMPTY_SLOT },
  { ...EMPTY_SLOT },
  { ...EMPTY_SLOT },
];

/** Starting monster level per difficulty for solo play. */
export const SOLO_STARTING_LEVEL: Record<string, 1 | 2 | 3> = {
  'easy':      1,
  'normal':    1,
  'hard':      2,
  'very-hard': 3,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ALL_LOCATION_TYPES: LocationType[] = ['water', 'mountain', 'woods'];

/** Count occupied (non-empty) slots in a Wild Hunt board. */
export function countOccupied(
  slots: [WildHuntBoardSlot, WildHuntBoardSlot, WildHuntBoardSlot],
): number {
  return slots.filter((s) => s.status !== 'empty').length;
}

/** Find the first empty slot index (0|1|2), or null if board is full. */
export function firstEmptyIndex(
  slots: [WildHuntBoardSlot, WildHuntBoardSlot, WildHuntBoardSlot],
): 0 | 1 | 2 | null {
  const idx = slots.findIndex((s) => s.status === 'empty');
  return idx === -1 ? null : (idx as 0 | 1 | 2);
}

/**
 * Pick an unused terrain type and a random location of that type.
 * "Unused" means no non-empty slot already has that locationType.
 * Falls back to any type if all three are taken.
 */
export function pickLocation(
  slots: [WildHuntBoardSlot, WildHuntBoardSlot, WildHuntBoardSlot],
): { locationType: LocationType; locationId: number } {
  const usedTypes = new Set(
    slots
      .filter((s) => s.status !== 'empty' && s.locationType !== null)
      .map((s) => s.locationType!),
  );
  const available = ALL_LOCATION_TYPES.filter((t) => !usedTypes.has(t));
  const typePool = available.length > 0 ? available : ALL_LOCATION_TYPES;
  const locationType = shuffle(typePool)[0];
  const candidates = LOCATIONS.filter((l) => l.type === locationType);
  const location = shuffle(candidates)[0];
  return { locationType, locationId: location.id };
}

// ─── Slice factory ────────────────────────────────────────────────────────────

export const createBoardSlice: StateCreator<AllSlices, [], [], BoardSlice> = (set, get) => ({
  wildHuntSlots: EMPTY_SLOTS,
  activeWildHuntSlotIndex: null,

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
});
