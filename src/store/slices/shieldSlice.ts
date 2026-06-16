import type { StateCreator } from 'zustand';

// ─── Slice type ───────────────────────────────────────────────────────────────

export type ShieldSlice = {
  shieldCount: number;
  /** Reduce shieldCount by `damage`, clamping to 0. Returns excess damage that broke through. */
  absorbDamage: (damage: number) => number;
  /** Increase shieldCount by `amount`. */
  gainShields: (amount: number) => void;
};

// ─── Slice factory ────────────────────────────────────────────────────────────

export const createShieldSlice: StateCreator<ShieldSlice, [], [], ShieldSlice> = (set, get) => ({
  shieldCount: 0,

  absorbDamage: (damage) => {
    const { shieldCount } = get();
    const excess = Math.max(0, damage - shieldCount);
    set({ shieldCount: Math.max(0, shieldCount - damage) });
    return excess;
  },

  gainShields: (amount) => {
    set((state) => ({ shieldCount: state.shieldCount + amount }));
  },
});
