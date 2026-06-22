import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  LegendaryCampaignState,
  LegendaryDifficulty,
  LegendaryPhase,
  MovementCard,
} from '../types';
import type { WildHuntPhase } from '../types';
import { drawMovementCard as drawMovementCardEngine } from '../engine/movementDeck';
import { lookupProtectionValue } from '../engine/legendaryFightDeck';
import { LEGENDARY_MOVEMENT_DECK, LEGENDARY_MONSTERS, TROPHY_PROTECTION_TABLES } from '../data/legendary';
import { shuffle } from '../engine/shuffle';

// ─── Constants ────────────────────────────────────────────────────────────────

const ROUND_LIMITS: Record<LegendaryDifficulty, number> = {
  easy: 9,
  normal: 8,
  hard: 7,
};

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL_STATE = {
  phase: 'inactive' as LegendaryPhase,
  difficulty: 'normal' as LegendaryDifficulty,
  campaignSide: 'A' as 'A' | 'B',
  roundLimit: 8,
  round: 1,
  stage: 1 as 1 | 2 | 3 | 4,
  legendaryMonsterId: '',
  destructionTokenCount: 0,
  movementDeckDrawn: [] as string[],
  movementDeckRemaining: [] as string[],
  protectionValue: 0,
  bossFightDeckSize: null as number | null,
  playerGoesFirst: null as boolean | null,
  currentMovementCard: null as MovementCard | null,
};

// ─── Store type ───────────────────────────────────────────────────────────────

type LegendaryHuntState = LegendaryCampaignState & {
  currentMovementCard: MovementCard | null;
  initiateSetup: () => void;
  startCampaign: (
    monsterId: string,
    difficulty: LegendaryDifficulty,
    side: 'A' | 'B',
    whPhase: WildHuntPhase,
  ) => void;
  advanceStage: () => void;
  goToBossPrep: () => void;
  abandonBossFight: () => void;
  claimTokens: (amount: number) => void;
  drawMovementCard: () => void;
  confirmBossPrep: (trophyCount: number) => void;
  beginBossFight: () => void;
  triggerVictory: () => void;
  triggerDefeat: () => void;
  resetCampaign: () => void;
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useLegendaryHuntStore = create<LegendaryHuntState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      initiateSetup(): void {
        set({ phase: 'setup' });
      },

      startCampaign(
        monsterId: string,
        difficulty: LegendaryDifficulty,
        side: 'A' | 'B',
        whPhase: WildHuntPhase,
      ): void {
        if (whPhase !== 'inactive') return;

        const shuffledIds = shuffle(LEGENDARY_MOVEMENT_DECK.map((c) => c.id));

        set({
          phase: 'playing',
          roundLimit: ROUND_LIMITS[difficulty],
          round: 1,
          stage: 1,
          legendaryMonsterId: monsterId,
          campaignSide: side,
          difficulty,
          destructionTokenCount: 0,
          movementDeckRemaining: shuffledIds,
          movementDeckDrawn: [],
          protectionValue: 0,
          bossFightDeckSize: null,
          playerGoesFirst: null,
          currentMovementCard: null,
        });
      },

      advanceStage(): void {
        const { phase, stage, round } = get();
        if (phase !== 'playing') return;

        if (stage < 4) {
          set({ stage: (stage + 1) as 1 | 2 | 3 | 4 });
          return;
        }

        // stage === 4: always continue to next round
        set({ round: round + 1, stage: 1 });
      },

      goToBossPrep(): void {
        const { phase } = get();
        if (phase !== 'playing') return;
        set({ phase: 'bossPrep' });
      },

      abandonBossFight(): void {
        set({ phase: 'playing' });
      },

      claimTokens(amount: number): void {
        if (amount <= 0) return;
        const { destructionTokenCount } = get();
        set({ destructionTokenCount: destructionTokenCount + amount });
      },

      drawMovementCard(): void {
        const { movementDeckRemaining, movementDeckDrawn } = get();
        const { card, newRemaining, newDrawn } = drawMovementCardEngine(
          movementDeckRemaining,
          movementDeckDrawn,
          LEGENDARY_MOVEMENT_DECK,
        );
        set({
          currentMovementCard: card,
          movementDeckRemaining: newRemaining,
          movementDeckDrawn: newDrawn,
        });
      },

      confirmBossPrep(trophyCount: number): void {
        const { campaignSide, destructionTokenCount, legendaryMonsterId } = get();

        const protectionValue = lookupProtectionValue(
          TROPHY_PROTECTION_TABLES,
          campaignSide,
          trophyCount,
        );

        const monster =
          LEGENDARY_MONSTERS.find((m) => m.id === legendaryMonsterId);

        const actualFightDeckSize = Math.max(
          0,
          monster!.baseFightDeckSize - destructionTokenCount,
        );

        const playerGoesFirst = destructionTokenCount > 0;

        set({
          protectionValue,
          bossFightDeckSize: actualFightDeckSize,
          playerGoesFirst,
        });
      },

      beginBossFight(): void {
        const { bossFightDeckSize } = get();
        if (bossFightDeckSize === 0) {
          get().triggerVictory();
        } else {
          set({ phase: 'bossFight', destructionTokenCount: 0 });
        }
      },

      triggerVictory(): void {
        set({ phase: 'victory' });
      },

      triggerDefeat(): void {
        set({ phase: 'defeat' });
      },

      resetCampaign(): void {
        set(INITIAL_STATE);
      },
    }),
    {
      name: 'monster-deck-lh-v1',
      partialize: (state) => {
        const { currentMovementCard: _, ...rest } = state;
        return rest;
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.currentMovementCard = null;
        // If app closed mid-boss fight, leave phase as 'bossFight'.
        // The component will re-launch the encounter on mount.
      },
    },
  ),
);
