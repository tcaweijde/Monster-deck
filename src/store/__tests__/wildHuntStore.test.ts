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

vi.mock('../../data/wildHunt/characters', () => ({
  getWildHuntCharacterById: vi.fn((id: string) => {
    if (id === 'wh-eredin') {
      return {
        id: 'wh-eredin',
        name: 'Eredin',
        passiveAbility: { name: 'King of the Wild Hunt', description: 'D', trigger: 'passive' },
        startingShields: 3,
        specialCards: [],
      };
    }
    return undefined;
  }),
}));

// Store import AFTER all vi.mock calls
import { useWildHuntStore } from '../wildHuntStore';
import type { WildHuntState } from '../../types/wildHunt';

// ---------------------------------------------------------------------------
// Initial state reference (mirrors INITIAL_STATE in wildHuntStore.ts)
// ---------------------------------------------------------------------------

const EMPTY_SLOT = {
  monsterId: null,
  level: null,
  locationType: null,
  locationId: null,
  status: 'empty' as const,
};

const INITIAL_STATE: WildHuntState = {
  phase: 'inactive',
  round: 1,
  stage: 1,
  characterId: null,
  difficulty: 'normal',
  shieldCount: 0,
  houndSlots: [],
  wildHuntSlots: [{ ...EMPTY_SLOT }, { ...EMPTY_SLOT }, { ...EMPTY_SLOT }],
  activeWildHuntSlotIndex: null,
  showMonsters: false,
  showProximitySetup: false,
};

// ---------------------------------------------------------------------------
// onRehydrateStorage crash-recovery logic — extracted for direct unit testing
// (mirrors the onRehydrateStorage callback in wildHuntStore.ts exactly)
// ---------------------------------------------------------------------------

type RehydrateState = Pick<WildHuntState, 'phase'>;

function applyWildHuntRehydrationGuard(state: RehydrateState | undefined): void {
  if (!state) return;
  if (state.phase === 'finalBattle') {
    state.phase = 'playing';
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('wildHuntStore', () => {
  beforeEach(() => {
    useWildHuntStore.setState({ ...INITIAL_STATE });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('initial state', () => {
    it('should have phase as inactive', () => {
      expect(useWildHuntStore.getState().phase).toBe('inactive');
    });

    it('should have round 1 and stage 1', () => {
      const { round, stage } = useWildHuntStore.getState();
      expect(round).toBe(1);
      expect(stage).toBe(1);
    });

    it('should have empty houndSlots and zero shieldCount', () => {
      const { houndSlots, shieldCount } = useWildHuntStore.getState();
      expect(houndSlots).toEqual([]);
      expect(shieldCount).toBe(0);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('startWildHunt', () => {
    it('should set phase to setup with a valid characterId', () => {
      act(() => { useWildHuntStore.getState().startWildHunt('wh-eredin', 'normal'); });
      expect(useWildHuntStore.getState().phase).toBe('setup');
    });

    it('should set characterId and difficulty', () => {
      act(() => { useWildHuntStore.getState().startWildHunt('wh-eredin', 'hard'); });
      const { characterId, difficulty } = useWildHuntStore.getState();
      expect(characterId).toBe('wh-eredin');
      expect(difficulty).toBe('hard');
    });

    it('should set shieldCount from character.startingShields', () => {
      act(() => { useWildHuntStore.getState().startWildHunt('wh-eredin', 'normal'); });
      // Mock returns startingShields: 3
      expect(useWildHuntStore.getState().shieldCount).toBe(7);
    });

    it('should reset round to 1 and stage to 1', () => {
      useWildHuntStore.setState({ round: 5, stage: 3 });
      act(() => { useWildHuntStore.getState().startWildHunt('wh-eredin', 'normal'); });
      expect(useWildHuntStore.getState().round).toBe(1);
      expect(useWildHuntStore.getState().stage).toBe(1);
    });

    it('should clear houndSlots', () => {
      useWildHuntStore.setState({
        houndSlots: [{ id: 'hound-1', level: 1, locationId: 5 }],
        playerLocationId: 7,
      });
      act(() => { useWildHuntStore.getState().startWildHunt('wh-eredin', 'normal'); });
      const { houndSlots } = useWildHuntStore.getState();
      expect(houndSlots).toEqual([]);
    });

    it('should be a no-op with an unknown characterId', () => {
      const stateBefore = useWildHuntStore.getState();
      act(() => { useWildHuntStore.getState().startWildHunt('wh-unknown', 'normal'); });
      expect(useWildHuntStore.getState().phase).toBe(stateBefore.phase);
      expect(useWildHuntStore.getState().characterId).toBe(stateBefore.characterId);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('confirmSetup', () => {
    it('should transition phase from setup to playing', () => {
      useWildHuntStore.setState({ phase: 'setup' });
      act(() => { useWildHuntStore.getState().confirmSetup(); });
      expect(useWildHuntStore.getState().phase).toBe('playing');
    });

    it('should be a no-op when phase is not setup', () => {
      useWildHuntStore.setState({ phase: 'playing' });
      act(() => { useWildHuntStore.getState().confirmSetup(); });
      expect(useWildHuntStore.getState().phase).toBe('playing');
    });

    it('should be a no-op when phase is inactive', () => {
      useWildHuntStore.setState({ phase: 'inactive' });
      act(() => { useWildHuntStore.getState().confirmSetup(); });
      expect(useWildHuntStore.getState().phase).toBe('inactive');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('advanceStage', () => {
    it('should increment stage from 1 to 2', () => {
      useWildHuntStore.setState({ stage: 1, round: 1, phase: 'playing' });
      act(() => { useWildHuntStore.getState().advanceStage(); });
      expect(useWildHuntStore.getState().stage).toBe(2);
    });

    it('should increment stage from 2 to 3', () => {
      useWildHuntStore.setState({ stage: 2, round: 1, phase: 'playing' });
      act(() => { useWildHuntStore.getState().advanceStage(); });
      expect(useWildHuntStore.getState().stage).toBe(3);
    });

    it('should increment stage from 3 to 4', () => {
      useWildHuntStore.setState({ stage: 3, round: 1, phase: 'playing' });
      act(() => { useWildHuntStore.getState().advanceStage(); });
      expect(useWildHuntStore.getState().stage).toBe(4);
    });

    it('should wrap stage 4 to 1 and increment round', () => {
      useWildHuntStore.setState({ stage: 4, round: 3, phase: 'playing' });
      act(() => { useWildHuntStore.getState().advanceStage(); });
      expect(useWildHuntStore.getState().stage).toBe(1);
      expect(useWildHuntStore.getState().round).toBe(4);
    });

    it('should set phase to finalBattle when round would exceed 8', () => {
      useWildHuntStore.setState({ stage: 4, round: 8, phase: 'playing' });
      act(() => { useWildHuntStore.getState().advanceStage(); });
      expect(useWildHuntStore.getState().phase).toBe('finalBattle');
    });

    it('should not increment round when transitioning to finalBattle', () => {
      useWildHuntStore.setState({ stage: 4, round: 8, phase: 'playing' });
      act(() => { useWildHuntStore.getState().advanceStage(); });
      // round stays at 8; phase changes to finalBattle
      expect(useWildHuntStore.getState().round).toBe(8);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('absorbDamage', () => {
    it('should return 0 excess when damage is less than shieldCount', () => {
      useWildHuntStore.setState({ shieldCount: 5 });
      let excess = 0;
      act(() => { excess = useWildHuntStore.getState().absorbDamage(3); });
      expect(excess).toBe(0);
    });

    it('should return 0 excess when damage equals shieldCount', () => {
      useWildHuntStore.setState({ shieldCount: 4 });
      let excess = 0;
      act(() => { excess = useWildHuntStore.getState().absorbDamage(4); });
      expect(excess).toBe(0);
    });

    it('should return correct excess when damage exceeds shieldCount', () => {
      useWildHuntStore.setState({ shieldCount: 2 });
      let excess = 0;
      act(() => { excess = useWildHuntStore.getState().absorbDamage(5); });
      expect(excess).toBe(3);
    });

    it('should clamp shieldCount to 0 (never negative)', () => {
      useWildHuntStore.setState({ shieldCount: 2 });
      act(() => { useWildHuntStore.getState().absorbDamage(10); });
      expect(useWildHuntStore.getState().shieldCount).toBe(0);
    });

    it('should reduce shieldCount correctly when damage is less than shields', () => {
      useWildHuntStore.setState({ shieldCount: 5 });
      act(() => { useWildHuntStore.getState().absorbDamage(3); });
      expect(useWildHuntStore.getState().shieldCount).toBe(2);
    });

    it('should return full damage as excess when shieldCount is 0', () => {
      useWildHuntStore.setState({ shieldCount: 0 });
      let excess = 0;
      act(() => { excess = useWildHuntStore.getState().absorbDamage(7); });
      expect(excess).toBe(7);
      expect(useWildHuntStore.getState().shieldCount).toBe(0);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('gainShields', () => {
    it('should increase shieldCount by the given amount', () => {
      useWildHuntStore.setState({ shieldCount: 2 });
      act(() => { useWildHuntStore.getState().gainShields(3); });
      expect(useWildHuntStore.getState().shieldCount).toBe(5);
    });

    it('should increase from zero', () => {
      useWildHuntStore.setState({ shieldCount: 0 });
      act(() => { useWildHuntStore.getState().gainShields(4); });
      expect(useWildHuntStore.getState().shieldCount).toBe(4);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('spawnHound', () => {
    it('should add a hound and increase houndSlots.length', () => {
      act(() => { useWildHuntStore.getState().spawnHound(4, 1); });
      expect(useWildHuntStore.getState().houndSlots).toHaveLength(1);
    });

    it('should store correct level and locationId', () => {
      act(() => { useWildHuntStore.getState().spawnHound(9, 3); });
      const hound = useWildHuntStore.getState().houndSlots[0];
      expect(hound.level).toBe(3);
      expect(hound.locationId).toBe(9);
    });

    it('should assign a string id starting with "hound-"', () => {
      act(() => { useWildHuntStore.getState().spawnHound(1, 2); });
      expect(useWildHuntStore.getState().houndSlots[0].id).toMatch(/^hound-/);
    });

    it('should append multiple hounds', () => {
      act(() => {
        useWildHuntStore.getState().spawnHound(1, 1);
        useWildHuntStore.getState().spawnHound(2, 2);
        useWildHuntStore.getState().spawnHound(3, 3);
      });
      expect(useWildHuntStore.getState().houndSlots).toHaveLength(3);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('removeHound', () => {
    it('should remove the hound with the given id', () => {
      useWildHuntStore.setState({
        houndSlots: [
          { id: 'hound-1', level: 1, locationId: 5 },
          { id: 'hound-2', level: 2, locationId: 8 },
        ],
      });
      act(() => { useWildHuntStore.getState().removeHound('hound-1'); });
      const { houndSlots } = useWildHuntStore.getState();
      expect(houndSlots).toHaveLength(1);
      expect(houndSlots[0].id).toBe('hound-2');
    });

    it('should be a no-op when the id does not exist', () => {
      useWildHuntStore.setState({
        houndSlots: [{ id: 'hound-1', level: 1, locationId: 5 }],
      });
      act(() => { useWildHuntStore.getState().removeHound('hound-nonexistent'); });
      expect(useWildHuntStore.getState().houndSlots).toHaveLength(1);
    });

    it('should be a no-op on empty houndSlots', () => {
      act(() => { useWildHuntStore.getState().removeHound('hound-1'); });
      expect(useWildHuntStore.getState().houndSlots).toEqual([]);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('triggerVictory', () => {
    it('should set phase to victory', () => {
      useWildHuntStore.setState({ phase: 'finalBattle' });
      act(() => { useWildHuntStore.getState().triggerVictory(); });
      expect(useWildHuntStore.getState().phase).toBe('victory');
    });

    it('should set phase to victory from any phase', () => {
      useWildHuntStore.setState({ phase: 'playing' });
      act(() => { useWildHuntStore.getState().triggerVictory(); });
      expect(useWildHuntStore.getState().phase).toBe('victory');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('resetWildHunt', () => {
    it('should reset all fields back to initial state', () => {
      useWildHuntStore.setState({
        phase: 'playing',
        round: 5,
        stage: 3,
        characterId: 'wh-eredin',
        difficulty: 'hard',
        shieldCount: 4,
        houndSlots: [{ id: 'hound-1', level: 2, locationId: 3 }],
      });
      act(() => { useWildHuntStore.getState().resetWildHunt(); });
      const state = useWildHuntStore.getState();
      expect(state.phase).toBe('inactive');
      expect(state.round).toBe(1);
      expect(state.stage).toBe(1);
      expect(state.characterId).toBeNull();
      expect(state.difficulty).toBe('normal');
      expect(state.shieldCount).toBe(0);
      expect(state.houndSlots).toEqual([]);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('onRehydrateStorage crash recovery (EC-4)', () => {
    it('should reset phase from finalBattle to playing on rehydration', () => {
      const state: RehydrateState = { phase: 'finalBattle' };
      applyWildHuntRehydrationGuard(state);
      expect(state.phase).toBe('playing');
    });

    it('should leave phase unchanged when it is playing', () => {
      const state: RehydrateState = { phase: 'playing' };
      applyWildHuntRehydrationGuard(state);
      expect(state.phase).toBe('playing');
    });

    it('should leave phase unchanged when it is inactive', () => {
      const state: RehydrateState = { phase: 'inactive' };
      applyWildHuntRehydrationGuard(state);
      expect(state.phase).toBe('inactive');
    });

    it('should leave phase unchanged when it is victory', () => {
      const state: RehydrateState = { phase: 'victory' };
      applyWildHuntRehydrationGuard(state);
      expect(state.phase).toBe('victory');
    });

    it('should handle undefined state gracefully without throwing', () => {
      expect(() => applyWildHuntRehydrationGuard(undefined)).not.toThrow();
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('React hook integration', () => {
    it('should reflect store state changes through the hook', () => {
      const { result } = renderHook(() => useWildHuntStore());
      expect(result.current.phase).toBe('inactive');

      act(() => { result.current.startWildHunt('wh-eredin', 'normal'); });
      expect(result.current.phase).toBe('setup');
    });

    it('should expose all required action methods', () => {
      const { result } = renderHook(() => useWildHuntStore());
      expect(typeof result.current.startWildHunt).toBe('function');
      expect(typeof result.current.confirmSetup).toBe('function');
      expect(typeof result.current.advanceStage).toBe('function');
      expect(typeof result.current.absorbDamage).toBe('function');
      expect(typeof result.current.gainShields).toBe('function');
      expect(typeof result.current.setWildHuntLocation).toBe('function');
      expect(typeof result.current.setPlayerLocation).toBe('function');
      expect(typeof result.current.spawnHound).toBe('function');
      expect(typeof result.current.removeHound).toBe('function');
      expect(typeof result.current.triggerVictory).toBe('function');
      expect(typeof result.current.resetWildHunt).toBe('function');
    });
  });
});
