import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WeaknessToken, PlacedWeaknessToken } from '../types';
import { WEAKNESS_TOKEN_POOL } from '../data/weaknessTokenPool';
import { initWeaknessTokenBoard, drawPlacedToken, redrawPlacedTokenLocation } from '../engine/trail';

interface TrailStore {
  trailModeEnabled: boolean;
  /** Tokens not yet drawn onto the board. */
  tokenPool: WeaknessToken[];
  /** The tokens currently placed on the physical board — each carries its assigned location. */
  weaknessTokenBoard: PlacedWeaknessToken[];
  /** Token IDs the player has confirmed placing on the table. Drives the placement checklist. */
  placementConfirmed: string[];
  /** Tokens in the player's hand (claimed but not yet applied to a fight). */
  weaknessTokensHeld: PlacedWeaknessToken[];
  /** Token declared before the current fight; consumed once encounter starts. */
  pendingWeaknessEffect: PlacedWeaknessToken | null;

  /** Call at new game start. Resets all trail state to defaults. */
  resetTrailSession: () => void;
  /** Enable trail mode and draw the initial token board. Call after resetTrailSession. */
  startTrailSession: (rng?: () => number) => void;
  /** Player confirms a board token has been physically placed on the table. */
  confirmTokenPlaced: (tokenId: string) => void;
  /**
   * Reassigns a new location to a board token — used when a player is present on the
   * current location and needs a different one. The token itself (effect) is unchanged.
   */
  redrawTokenLocation: (tokenId: string, rng?: () => number) => void;
  /** Player claims a board token; a replacement is immediately drawn for the same terrain slot. */
  claimToken: (tokenId: string, rng?: () => number) => void;
  /** Move a held token to pendingWeaknessEffect (pre-fight declaration). */
  setPendingEffect: (token: PlacedWeaknessToken) => void;
  /** Consume pendingWeaknessEffect. Call after encounterStore.startEncounter. */
  clearPendingEffect: () => void;
  /** Post-defeat reset: discard board tokens back to pool, re-draw fresh board. Held tokens are NOT cleared. */
  handleVictoryReset: (rng?: () => number) => void;
}

const INITIAL_STATE = {
  trailModeEnabled: false,
  tokenPool: [...WEAKNESS_TOKEN_POOL],
  weaknessTokenBoard: [] as PlacedWeaknessToken[],
  placementConfirmed: [] as string[],
  weaknessTokensHeld: [] as PlacedWeaknessToken[],
  pendingWeaknessEffect: null as PlacedWeaknessToken | null,
};

export const useTrailStore = create<TrailStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      resetTrailSession: () =>
        set({ ...INITIAL_STATE, tokenPool: [...WEAKNESS_TOKEN_POOL] }),

      startTrailSession: (rng = Math.random) => {
        const { tokenPool } = get();
        const { board, remainingPool } = initWeaknessTokenBoard(tokenPool, rng);
        set({
          trailModeEnabled: true,
          tokenPool: remainingPool,
          weaknessTokenBoard: board,
          placementConfirmed: [],
        });
      },

      confirmTokenPlaced: (tokenId) => {
        const { placementConfirmed } = get();
        if (placementConfirmed.includes(tokenId)) return; // idempotent
        set({ placementConfirmed: [...placementConfirmed, tokenId] });
      },

      redrawTokenLocation: (tokenId, rng = Math.random) => {
        const { weaknessTokenBoard, placementConfirmed } = get();
        const token = weaknessTokenBoard.find((t) => t.id === tokenId);
        if (!token) return;
        const redrawn = redrawPlacedTokenLocation(token, rng);
        set({
          weaknessTokenBoard: weaknessTokenBoard.map((t) => (t.id === tokenId ? redrawn : t)),
          // Reset confirmation so the player must re-confirm the new location.
          placementConfirmed: placementConfirmed.filter((id) => id !== tokenId),
        });
      },

      claimToken: (tokenId, rng = Math.random) => {
        const { weaknessTokenBoard, weaknessTokensHeld, tokenPool, placementConfirmed } = get();
        const token = weaknessTokenBoard.find((t) => t.id === tokenId);
        if (!token) return;

        const { token: replacement, remainingPool } = drawPlacedToken(
          tokenPool,
          token.terrainType,
          rng,
        );
        if (!replacement) {
          console.warn(
            `[Trail] Token pool exhausted for terrain "${token.terrainType}" — slot empty.`,
          );
        }

        const newBoard = weaknessTokenBoard
          .filter((t) => t.id !== tokenId)
          .concat(replacement ? [replacement] : []);

        set({
          weaknessTokenBoard: newBoard,
          tokenPool: remainingPool,
          weaknessTokensHeld: [...weaknessTokensHeld, token],
          // Replacement needs fresh confirmation — remove old confirmed entry
          placementConfirmed: placementConfirmed.filter((id) => id !== tokenId),
        });
      },

      setPendingEffect: (token) => {
        const { weaknessTokensHeld } = get();
        set({
          pendingWeaknessEffect: token,
          weaknessTokensHeld: weaknessTokensHeld.filter((t) => t.id !== token.id),
        });
      },

      clearPendingEffect: () => set({ pendingWeaknessEffect: null }),

      handleVictoryReset: (rng = Math.random) => {
        const { tokenPool, weaknessTokenBoard } = get();
        // Strip locationId before returning board tokens to the plain WeaknessToken pool
        const returned = weaknessTokenBoard.map(({ locationId: _loc, ...t }) => t);
        const returnedPool = [...tokenPool, ...returned];
        const { board, remainingPool } = initWeaknessTokenBoard(returnedPool, rng);
        set({
          tokenPool: remainingPool,
          weaknessTokenBoard: board,
          placementConfirmed: [],
          pendingWeaknessEffect: null,
          // weaknessTokensHeld intentionally NOT cleared — player keeps held tokens
        });
      },
    }),
    {
      name: 'monster-deck-trail-v1',
    },
  ),
);
