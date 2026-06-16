import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CampaignSlice } from './slices/campaignSlice';
import type { BoardSlice } from './slices/boardSlice';
import type { ShieldSlice } from './slices/shieldSlice';
import type { HoundSlice } from './slices/houndSlice';
import type { UISlice } from './slices/uiSlice';
import { createCampaignSlice } from './slices/campaignSlice';
import { createBoardSlice } from './slices/boardSlice';
import { createShieldSlice } from './slices/shieldSlice';
import { createHoundSlice } from './slices/houndSlice';
import { createUISlice } from './slices/uiSlice';

// ─── Combined store type ──────────────────────────────────────────────────────

export type WildHuntStoreState = CampaignSlice & BoardSlice & ShieldSlice & HoundSlice & UISlice;

// ─── Store ────────────────────────────────────────────────────────────────────

export const useWildHuntStore = create<WildHuntStoreState>()(
  persist(
    (...a) => ({
      ...createCampaignSlice(...a),
      ...createBoardSlice(...a),
      ...createShieldSlice(...a),
      ...createHoundSlice(...a),
      ...createUISlice(...a),
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
