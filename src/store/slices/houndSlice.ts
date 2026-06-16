import type { StateCreator } from 'zustand';
import type { HoundSlot } from '../../types/wildHunt';
import type { ShieldSlice } from './shieldSlice';

// ─── Slice type ───────────────────────────────────────────────────────────────

export type HoundSlice = {
  houndSlots: HoundSlot[];
  /** Spawn a hound token with the given level. */
  spawnHound: (level: 1 | 2 | 3) => void;
  /** Remove a hound token by its unique id. */
  removeHound: (houndId: string) => void;
  /**
   * Resolve hound combat. If declaredDamage >= threshold for the hound's level,
   * the hound is defeated and excess damage is absorbed as shield loss.
   * Returns `{ defeated: boolean; excessDamage: number }`.
   */
  resolveHoundCombat: (
    houndId: string,
    declaredDamage: number,
  ) => { defeated: boolean; excessDamage: number };
};

type AllSlices = HoundSlice & ShieldSlice;

const HOUND_THRESHOLD: Record<1 | 2 | 3, number> = { 1: 2, 2: 3, 3: 4 };

// ─── Slice factory ────────────────────────────────────────────────────────────

export const createHoundSlice: StateCreator<AllSlices, [], [], HoundSlice> = (set, get) => ({
  houndSlots: [],

  spawnHound: (level) => {
    const newHound: HoundSlot = { id: `hound-${Date.now()}`, level };
    set((state) => ({ houndSlots: [...state.houndSlots, newHound] }));
  },

  removeHound: (houndId) => {
    set((state) => ({
      houndSlots: state.houndSlots.filter((h) => h.id !== houndId),
    }));
  },

  resolveHoundCombat: (houndId, declaredDamage) => {
    const { houndSlots, shieldCount } = get();
    const hound = houndSlots.find((h) => h.id === houndId);
    if (!hound) return { defeated: false, excessDamage: 0 };

    const threshold = HOUND_THRESHOLD[hound.level];
    if (declaredDamage < threshold) return { defeated: false, excessDamage: 0 };

    const excessDamage = declaredDamage - threshold;
    set({
      houndSlots: houndSlots.filter((h) => h.id !== houndId),
      shieldCount: Math.max(0, shieldCount - excessDamage),
    });
    return { defeated: true, excessDamage };
  },
});
