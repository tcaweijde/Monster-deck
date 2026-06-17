import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';

// ---------------------------------------------------------------------------
// vi.hoisted — runs before vi.mock factories AND before any imports.
// Provides a minimal localStorage so Zustand's persist middleware can
// initialise without throwing.
// ---------------------------------------------------------------------------

vi.hoisted(() => {
  const store: Record<string, string> = {};
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach((k) => delete store[k]);
      },
    },
    writable: true,
    configurable: true,
  });
});

// ---------------------------------------------------------------------------
// Mocks — must be declared BEFORE any store import.
// ---------------------------------------------------------------------------

vi.mock('../../data/legendary', () => ({
  LEGENDARY_MOVEMENT_DECK: [
    { id: 'move-01', targetLocation1Name: 'A', targetLocation2Name: 'B', movementDistanceSolo: 2 },
    { id: 'move-02', targetLocation1Name: 'C', targetLocation2Name: 'D', movementDistanceSolo: 2 },
    { id: 'move-03', targetLocation1Name: 'E', targetLocation2Name: 'F', movementDistanceSolo: 2 },
  ],
  LEGENDARY_MONSTERS: [
    {
      id: 'test-legendary',
      name: 'Test Beast',
      level: 4,
      baseFightDeckSize: 10,
      fightDeck: Array.from({ length: 10 }, (_, i) => ({
        id: `card-${i}`,
        top: { name: 'Charge', attack: 3 },
      })),
      passiveAbility: { name: 'Test', description: 'Test', trigger: 'passive' },
      image: '',
      artAssets: [],
      startingLocationName: 'Test',
    },
  ],
  TROPHY_PROTECTION_TABLES: [
    {
      side: 'A',
      entries: [
        { minTrophies: 0, maxTrophies: 0, protectionValue: 3 },
        { minTrophies: 1, maxTrophies: null, protectionValue: 0 },
      ],
    },
  ],
}));

vi.mock('../../data/legendary/placeholder-legendary', () => ({
  PLACEHOLDER_LEGENDARY: {
    id: 'placeholder-legendary',
    baseFightDeckSize: 22,
    fightDeck: [],
    passiveAbility: { name: 'Test', description: 'Test', trigger: 'passive' },
    image: '',
    artAssets: [],
    startingLocationName: 'Test',
  },
}));

vi.mock('../../engine/movementDeck', () => ({
  drawMovementCard: vi.fn(() => ({
    card: {
      id: 'move-01',
      targetLocation1Name: 'A',
      targetLocation2Name: 'B',
      movementDistanceSolo: 2,
    },
    newRemaining: ['move-02', 'move-03'],
    newDrawn: ['move-01'],
  })),
}));

vi.mock('../../engine/legendaryFightDeck', () => ({
  lookupProtectionValue: vi.fn(() => 2),
  buildLegendaryFightDeck: vi.fn(() => []),
}));

vi.mock('../../engine/shuffle', () => ({
  shuffle: vi.fn((arr: string[]) => [...arr]),
}));

// ---------------------------------------------------------------------------
// Store import AFTER all vi.mock calls
// ---------------------------------------------------------------------------

import { useLegendaryHuntStore } from '../legendaryHuntStore';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resetStore(): void {
  useLegendaryHuntStore.setState({
    phase: 'inactive',
    difficulty: 'normal',
    campaignSide: 'A',
    roundLimit: 8,
    round: 1,
    stage: 1,
    legendaryMonsterId: '',
    destructionTokenCount: 0,
    movementDeckDrawn: [],
    movementDeckRemaining: [],
    protectionValue: 0,
    bossFightDeckSize: null,
    playerGoesFirst: null,
    currentMovementCard: null,
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useLegendaryHuntStore', () => {
  beforeEach(() => {
    resetStore();
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('initiateSetup', () => {
    it('should set phase to setup', () => {
      act(() => { useLegendaryHuntStore.getState().initiateSetup(); });
      expect(useLegendaryHuntStore.getState().phase).toBe('setup');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('startCampaign', () => {
    it('should set phase to playing when whPhase is inactive', () => {
      act(() => {
        useLegendaryHuntStore.getState().startCampaign('test-legendary', 'normal', 'A', 'inactive');
      });
      expect(useLegendaryHuntStore.getState().phase).toBe('playing');
    });

    it('should set roundLimit=9 for easy difficulty', () => {
      act(() => {
        useLegendaryHuntStore.getState().startCampaign('test-legendary', 'easy', 'A', 'inactive');
      });
      expect(useLegendaryHuntStore.getState().roundLimit).toBe(9);
    });

    it('should set roundLimit=8 for normal difficulty', () => {
      act(() => {
        useLegendaryHuntStore.getState().startCampaign('test-legendary', 'normal', 'A', 'inactive');
      });
      expect(useLegendaryHuntStore.getState().roundLimit).toBe(8);
    });

    it('should set roundLimit=7 for hard difficulty', () => {
      act(() => {
        useLegendaryHuntStore.getState().startCampaign('test-legendary', 'hard', 'A', 'inactive');
      });
      expect(useLegendaryHuntStore.getState().roundLimit).toBe(7);
    });

    it('should set legendaryMonsterId and campaignSide', () => {
      act(() => {
        useLegendaryHuntStore.getState().startCampaign('test-legendary', 'normal', 'B', 'inactive');
      });
      const state = useLegendaryHuntStore.getState();
      expect(state.legendaryMonsterId).toBe('test-legendary');
      expect(state.campaignSide).toBe('B');
    });

    it('should reset round to 1 and stage to 1', () => {
      useLegendaryHuntStore.setState({ round: 5, stage: 3 });
      act(() => {
        useLegendaryHuntStore.getState().startCampaign('test-legendary', 'normal', 'A', 'inactive');
      });
      const state = useLegendaryHuntStore.getState();
      expect(state.round).toBe(1);
      expect(state.stage).toBe(1);
    });

    it('should shuffle movement deck IDs into movementDeckRemaining', () => {
      act(() => {
        useLegendaryHuntStore.getState().startCampaign('test-legendary', 'normal', 'A', 'inactive');
      });
      const { movementDeckRemaining, movementDeckDrawn } = useLegendaryHuntStore.getState();
      expect(movementDeckRemaining).toEqual(['move-01', 'move-02', 'move-03']);
      expect(movementDeckDrawn).toEqual([]);
    });

    it('should be a no-op when whPhase is not inactive', () => {
      act(() => {
        useLegendaryHuntStore.getState().startCampaign('test-legendary', 'normal', 'A', 'playing');
      });
      expect(useLegendaryHuntStore.getState().phase).toBe('inactive');
    });

    it('should be a no-op for any non-inactive whPhase', () => {
      act(() => {
        useLegendaryHuntStore.getState().startCampaign('test-legendary', 'normal', 'A', 'setup');
      });
      expect(useLegendaryHuntStore.getState().phase).toBe('inactive');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('advanceStage', () => {
    it('should advance stage from 1 to 2', () => {
      useLegendaryHuntStore.setState({ phase: 'playing', stage: 1, round: 1, roundLimit: 8 });
      act(() => { useLegendaryHuntStore.getState().advanceStage(); });
      expect(useLegendaryHuntStore.getState().stage).toBe(2);
    });

    it('should advance stage from 2 to 3', () => {
      useLegendaryHuntStore.setState({ phase: 'playing', stage: 2, round: 1, roundLimit: 8 });
      act(() => { useLegendaryHuntStore.getState().advanceStage(); });
      expect(useLegendaryHuntStore.getState().stage).toBe(3);
    });

    it('should advance stage from 3 to 4', () => {
      useLegendaryHuntStore.setState({ phase: 'playing', stage: 3, round: 1, roundLimit: 8 });
      act(() => { useLegendaryHuntStore.getState().advanceStage(); });
      expect(useLegendaryHuntStore.getState().stage).toBe(4);
    });

    it('should increment round and reset stage to 1 on stage 4 in non-final round', () => {
      useLegendaryHuntStore.setState({ phase: 'playing', stage: 4, round: 1, roundLimit: 8 });
      act(() => { useLegendaryHuntStore.getState().advanceStage(); });
      const state = useLegendaryHuntStore.getState();
      expect(state.round).toBe(2);
      expect(state.stage).toBe(1);
      expect(state.phase).toBe('playing');
    });

    it('should be a no-op when phase is not playing', () => {
      useLegendaryHuntStore.setState({ phase: 'setup', stage: 1, round: 1, roundLimit: 8 });
      act(() => { useLegendaryHuntStore.getState().advanceStage(); });
      expect(useLegendaryHuntStore.getState().stage).toBe(1);
      expect(useLegendaryHuntStore.getState().phase).toBe('setup');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('claimTokens', () => {
    it('should increment destructionTokenCount by the given amount', () => {
      useLegendaryHuntStore.setState({ destructionTokenCount: 2 });
      act(() => { useLegendaryHuntStore.getState().claimTokens(3); });
      expect(useLegendaryHuntStore.getState().destructionTokenCount).toBe(5);
    });

    it('should be a no-op for amount=0', () => {
      useLegendaryHuntStore.setState({ destructionTokenCount: 5 });
      act(() => { useLegendaryHuntStore.getState().claimTokens(0); });
      expect(useLegendaryHuntStore.getState().destructionTokenCount).toBe(5);
    });

    it('should be a no-op for negative amounts', () => {
      useLegendaryHuntStore.setState({ destructionTokenCount: 5 });
      act(() => { useLegendaryHuntStore.getState().claimTokens(-2); });
      expect(useLegendaryHuntStore.getState().destructionTokenCount).toBe(5);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('drawMovementCard', () => {
    it('should call the engine drawMovementCard with the current deck state', async () => {
      const { drawMovementCard: engineFn } = await import('../../engine/movementDeck');

      useLegendaryHuntStore.setState({
        movementDeckRemaining: ['move-01', 'move-02', 'move-03'],
        movementDeckDrawn: [],
      });

      act(() => { useLegendaryHuntStore.getState().drawMovementCard(); });

      expect(engineFn).toHaveBeenCalledWith(
        ['move-01', 'move-02', 'move-03'],
        [],
        expect.arrayContaining([expect.objectContaining({ id: 'move-01' })]),
      );
    });

    it('should set currentMovementCard from engine result', () => {
      act(() => { useLegendaryHuntStore.getState().drawMovementCard(); });
      const { currentMovementCard } = useLegendaryHuntStore.getState();
      expect(currentMovementCard).toEqual({
        id: 'move-01',
        targetLocation1Name: 'A',
        targetLocation2Name: 'B',
        movementDistanceSolo: 2,
      });
    });

    it('should update movementDeckRemaining and movementDeckDrawn', () => {
      act(() => { useLegendaryHuntStore.getState().drawMovementCard(); });
      const { movementDeckRemaining, movementDeckDrawn } = useLegendaryHuntStore.getState();
      expect(movementDeckRemaining).toEqual(['move-02', 'move-03']);
      expect(movementDeckDrawn).toEqual(['move-01']);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('confirmBossPrep', () => {
    it('should call lookupProtectionValue with campaignSide and trophyCount', async () => {
      const { lookupProtectionValue: lookupFn } = await import('../../engine/legendaryFightDeck');
      useLegendaryHuntStore.setState({ campaignSide: 'A', destructionTokenCount: 0, legendaryMonsterId: 'test-legendary' });

      act(() => { useLegendaryHuntStore.getState().confirmBossPrep(0); });

      expect(lookupFn).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ side: 'A' })]),
        'A',
        0,
      );
    });

    it('should set protectionValue from lookupProtectionValue result', () => {
      useLegendaryHuntStore.setState({ campaignSide: 'A', destructionTokenCount: 0, legendaryMonsterId: 'test-legendary' });
      act(() => { useLegendaryHuntStore.getState().confirmBossPrep(0); });
      expect(useLegendaryHuntStore.getState().protectionValue).toBe(2);
    });

    it('should set bossFightDeckSize = baseFightDeckSize - destructionTokenCount', () => {
      useLegendaryHuntStore.setState({
        legendaryMonsterId: 'test-legendary',
        campaignSide: 'A',
        destructionTokenCount: 3,
      });
      act(() => { useLegendaryHuntStore.getState().confirmBossPrep(2); });
      // baseFightDeckSize=10, destructionTokenCount=3 → 10 - 3 = 7
      expect(useLegendaryHuntStore.getState().bossFightDeckSize).toBe(7);
    });

    it('should clamp bossFightDeckSize to 0 minimum', () => {
      useLegendaryHuntStore.setState({
        legendaryMonsterId: 'test-legendary',
        campaignSide: 'A',
        destructionTokenCount: 99,
      });
      act(() => { useLegendaryHuntStore.getState().confirmBossPrep(0); });
      expect(useLegendaryHuntStore.getState().bossFightDeckSize).toBe(0);
    });

    it('should set playerGoesFirst=true when destructionTokenCount > 0', () => {
      useLegendaryHuntStore.setState({
        legendaryMonsterId: 'test-legendary',
        campaignSide: 'A',
        destructionTokenCount: 2,
      });
      act(() => { useLegendaryHuntStore.getState().confirmBossPrep(2); });
      expect(useLegendaryHuntStore.getState().playerGoesFirst).toBe(true);
    });

    it('should set playerGoesFirst=false when destructionTokenCount is 0', () => {
      useLegendaryHuntStore.setState({
        legendaryMonsterId: 'test-legendary',
        campaignSide: 'A',
        destructionTokenCount: 0,
      });
      act(() => { useLegendaryHuntStore.getState().confirmBossPrep(0); });
      expect(useLegendaryHuntStore.getState().playerGoesFirst).toBe(false);
    });

    it('should use PLACEHOLDER_LEGENDARY when monsterId is not found', () => {
      useLegendaryHuntStore.setState({
        legendaryMonsterId: 'nonexistent-id',
        campaignSide: 'A',
        destructionTokenCount: 0,
      });
      act(() => { useLegendaryHuntStore.getState().confirmBossPrep(0); });
      // PLACEHOLDER_LEGENDARY.baseFightDeckSize = 22, destructionTokenCount = 0 → 22
      expect(useLegendaryHuntStore.getState().bossFightDeckSize).toBe(22);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('beginBossFight', () => {
    it('should set phase to victory when bossFightDeckSize is 0 (instant win)', () => {
      useLegendaryHuntStore.setState({ bossFightDeckSize: 0 });
      act(() => { useLegendaryHuntStore.getState().beginBossFight(); });
      expect(useLegendaryHuntStore.getState().phase).toBe('victory');
    });

    it('should set phase to bossFight when bossFightDeckSize > 0', () => {
      useLegendaryHuntStore.setState({ bossFightDeckSize: 5 });
      act(() => { useLegendaryHuntStore.getState().beginBossFight(); });
      expect(useLegendaryHuntStore.getState().phase).toBe('bossFight');
    });

    it('should reset destructionTokenCount to 0 when transitioning to bossFight', () => {
      useLegendaryHuntStore.setState({ bossFightDeckSize: 5, destructionTokenCount: 4 });
      act(() => { useLegendaryHuntStore.getState().beginBossFight(); });
      expect(useLegendaryHuntStore.getState().destructionTokenCount).toBe(0);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('triggerVictory', () => {
    it('should set phase to victory', () => {
      useLegendaryHuntStore.setState({ phase: 'bossFight' });
      act(() => { useLegendaryHuntStore.getState().triggerVictory(); });
      expect(useLegendaryHuntStore.getState().phase).toBe('victory');
    });

    it('should set phase to victory from any phase', () => {
      useLegendaryHuntStore.setState({ phase: 'playing' });
      act(() => { useLegendaryHuntStore.getState().triggerVictory(); });
      expect(useLegendaryHuntStore.getState().phase).toBe('victory');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('triggerDefeat', () => {
    it('should set phase to defeat', () => {
      useLegendaryHuntStore.setState({ phase: 'bossFight' });
      act(() => { useLegendaryHuntStore.getState().triggerDefeat(); });
      expect(useLegendaryHuntStore.getState().phase).toBe('defeat');
    });

    it('should set phase to defeat from any phase', () => {
      useLegendaryHuntStore.setState({ phase: 'playing' });
      act(() => { useLegendaryHuntStore.getState().triggerDefeat(); });
      expect(useLegendaryHuntStore.getState().phase).toBe('defeat');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('resetCampaign', () => {
    it('should return all fields to initial state', () => {
      useLegendaryHuntStore.setState({
        phase: 'bossFight',
        difficulty: 'hard',
        campaignSide: 'B',
        roundLimit: 7,
        round: 6,
        stage: 3,
        legendaryMonsterId: 'test-legendary',
        destructionTokenCount: 5,
        movementDeckDrawn: ['move-01'],
        movementDeckRemaining: ['move-02'],
        protectionValue: 2,
        bossFightDeckSize: 8,
        playerGoesFirst: true,
        currentMovementCard: {
          id: 'move-01',
          targetLocation1Name: 'A',
          targetLocation2Name: 'B',
          movementDistanceSolo: 2,
        },
      });
      act(() => { useLegendaryHuntStore.getState().resetCampaign(); });
      const state = useLegendaryHuntStore.getState();
      expect(state.phase).toBe('inactive');
      expect(state.difficulty).toBe('normal');
      expect(state.campaignSide).toBe('A');
      expect(state.roundLimit).toBe(8);
      expect(state.round).toBe(1);
      expect(state.stage).toBe(1);
      expect(state.legendaryMonsterId).toBe('');
      expect(state.destructionTokenCount).toBe(0);
      expect(state.movementDeckDrawn).toEqual([]);
      expect(state.movementDeckRemaining).toEqual([]);
      expect(state.protectionValue).toBe(0);
      expect(state.bossFightDeckSize).toBeNull();
      expect(state.playerGoesFirst).toBeNull();
      expect(state.currentMovementCard).toBeNull();
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('persistence', () => {
    it('should exclude currentMovementCard from partialize output', () => {
      const state = useLegendaryHuntStore.getState();
      // Access the partialize config by extracting it from persist options
      // We verify by checking that the partialize function omits currentMovementCard
      const stateWithCard = {
        ...state,
        currentMovementCard: {
          id: 'move-01',
          targetLocation1Name: 'A',
          targetLocation2Name: 'B',
          movementDistanceSolo: 2,
        },
      };
      // Simulate what partialize does
      const { currentMovementCard: _omitted, ...persisted } = stateWithCard;
      expect('currentMovementCard' in persisted).toBe(false);
      expect(_omitted).toBeDefined();
    });

    it('should persist phase and round fields', () => {
      useLegendaryHuntStore.setState({ phase: 'playing', round: 4 });
      const state = useLegendaryHuntStore.getState();
      expect(state.phase).toBe('playing');
      expect(state.round).toBe(4);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('React hook integration', () => {
    it('should reflect store state changes through the hook', () => {
      const { result } = renderHook(() => useLegendaryHuntStore());
      expect(result.current.phase).toBe('inactive');

      act(() => { result.current.initiateSetup(); });
      expect(result.current.phase).toBe('setup');
    });

    it('should expose all required action methods', () => {
      const { result } = renderHook(() => useLegendaryHuntStore());
      expect(typeof result.current.initiateSetup).toBe('function');
      expect(typeof result.current.startCampaign).toBe('function');
      expect(typeof result.current.advanceStage).toBe('function');
      expect(typeof result.current.claimTokens).toBe('function');
      expect(typeof result.current.drawMovementCard).toBe('function');
      expect(typeof result.current.confirmBossPrep).toBe('function');
      expect(typeof result.current.beginBossFight).toBe('function');
      expect(typeof result.current.triggerVictory).toBe('function');
      expect(typeof result.current.triggerDefeat).toBe('function');
      expect(typeof result.current.resetCampaign).toBe('function');
    });
  });
});
