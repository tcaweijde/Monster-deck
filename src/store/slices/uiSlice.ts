import type { StateCreator } from 'zustand';

// ─── Slice type ───────────────────────────────────────────────────────────────

export type UISlice = {
  showMonsters: boolean;
  showProximitySetup: boolean;
  setShowMonsters: (show: boolean) => void;
  setShowProximitySetup: (show: boolean) => void;
};

// ─── Slice factory ────────────────────────────────────────────────────────────

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  showMonsters: false,
  showProximitySetup: false,
  setShowMonsters: (show) => set({ showMonsters: show }),
  setShowProximitySetup: (show) => set({ showProximitySetup: show }),
});
