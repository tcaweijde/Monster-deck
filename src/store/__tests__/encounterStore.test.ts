import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { Monster, MonsterCard, RevealedCard } from '../../types';

// ---------------------------------------------------------------------------
// Mocks — declared before any store import so Vitest hoists them correctly.
// ---------------------------------------------------------------------------

const MOCK_CARDS: MonsterCard[] = [
  { id: 'c-01', top: { attack: 3, effect: 'Shield 1' }, bottom: { attack: 2 } },
  { id: 'c-02', top: { attack: 2 }, bottom: { attack: 4, effect: 'Bleed 1' } },
  { id: 'c-03', top: { attack: 1 }, bottom: { attack: 3 } },
  { id: 'c-04', top: { attack: 4 }, bottom: { attack: 1 } },
];

const MOCK_MONSTER: Monster = {
  id: 'test-griffin',
  name: 'Test Griffin',
  deckSizes: { 1: 4, 2: 4, 3: 4 },
  baseAbility: { name: 'Aerial Predator', description: 'Attacks from above.', trigger: 'passive' },
  secondaryAbility: { name: 'Screech', description: 'Causes fear.', trigger: 'passive' },
  discardAbility: { name: 'Frenzy', description: 'Retaliates when damaged.', trigger: 'discard' },
  cardPool: MOCK_CARDS,
};

const MOCK_MONSTER_NO_DISCARD: Monster = {
  ...MOCK_MONSTER,
  id: 'test-werewolf',
  name: 'Test Werewolf',
  discardAbility: undefined,
};

// Mutable control variables for engine function behavior
let mockDeck: MonsterCard[] = [...MOCK_CARDS];
let mockIsMonsterFirst = true;
let mockFlipResult: ReturnType<typeof import('../../engine/combat').flipCard> = null;

vi.mock('../../data/monsters', () => ({
  getMonsterById: (id: string) => {
    if (id === 'test-griffin') return MOCK_MONSTER;
    if (id === 'test-werewolf') return MOCK_MONSTER_NO_DISCARD;
    return undefined;
  },
}));

vi.mock('../../engine/deck', () => ({
  generateDeck: () => [...mockDeck],
}));

vi.mock('../../engine/initiative', () => ({
  checkInitiative: () => mockIsMonsterFirst,
}));

vi.mock('../../engine/combat', () => ({
  flipCard: () => mockFlipResult,
  applyDamage: (deck: MonsterCard[], damage: number) => {
    const count = Math.min(damage, deck.length);
    return {
      discardedCards: deck.slice(0, count),
      remainingDeck: deck.slice(count),
    };
  },
}));

// ---------------------------------------------------------------------------
// Store import — must come AFTER vi.mock declarations
// ---------------------------------------------------------------------------

import { useEncounterStore } from '../encounterStore';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRevealedCard(card: MonsterCard, source: 'top' | 'bottom' = 'top'): RevealedCard {
  return { cardId: card.id, chosenHalf: card[source], source };
}

// Reset the Zustand singleton state before each test by calling resetToSetup
// then verifying we're back to a blank slate.
function resetStore() {
  const { resetToSetup } = useEncounterStore.getState();
  act(() => { resetToSetup(); });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('encounterStore', () => {
  beforeEach(() => {
    // Reset store state
    resetStore();

    // Reset mock control vars to known defaults
    mockDeck = [...MOCK_CARDS];
    mockIsMonsterFirst = true;
    mockFlipResult = {
      revealed: makeRevealedCard(MOCK_CARDS[0], 'top'),
      remainingDeck: MOCK_CARDS.slice(1),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------

  describe('initial state', () => {
    it('should start in setup phase with all nulls and empty collections', () => {
      const state = useEncounterStore.getState();
      expect(state.phase).toBe('setup');
      expect(state.monster).toBeNull();
      expect(state.level).toBeNull();
      expect(state.deck).toHaveLength(0);
      expect(state.discardPile).toHaveLength(0);
      expect(state.currentCard).toBeNull();
      expect(state.isMonsterFirst).toBe(false);
      expect(state.lastDiscardTriggered).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // startEncounter
  // -------------------------------------------------------------------------

  describe('startEncounter', () => {
    it('should transition phase from setup to playing', () => {
      const { startEncounter } = useEncounterStore.getState();
      act(() => { startEncounter('test-griffin', 1); });
      expect(useEncounterStore.getState().phase).toBe('playing');
    });

    it('should set the monster and level from the lookup', () => {
      const { startEncounter } = useEncounterStore.getState();
      act(() => { startEncounter('test-griffin', 2); });
      const state = useEncounterStore.getState();
      expect(state.monster?.id).toBe('test-griffin');
      expect(state.level).toBe(2);
    });

    it('should populate the deck from generateDeck', () => {
      const { startEncounter } = useEncounterStore.getState();
      act(() => { startEncounter('test-griffin', 1); });
      expect(useEncounterStore.getState().deck).toHaveLength(4);
    });

    it('should set isMonsterFirst from checkInitiative', () => {
      mockIsMonsterFirst = false;
      const { startEncounter } = useEncounterStore.getState();
      act(() => { startEncounter('test-griffin', 1); });
      expect(useEncounterStore.getState().isMonsterFirst).toBe(false);
    });

    it('should clear discardPile and currentCard from any previous encounter', () => {
      // Start once and flip to set currentCard
      const store = useEncounterStore.getState();
      act(() => { store.startEncounter('test-griffin', 1); });
      act(() => { useEncounterStore.getState().flipMonsterCard(); });

      // Start a fresh encounter
      act(() => { useEncounterStore.getState().startEncounter('test-griffin', 1); });
      const state = useEncounterStore.getState();
      expect(state.currentCard).toBeNull();
      expect(state.discardPile).toHaveLength(0);
    });

    it('should reset lastDiscardTriggered to false', () => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin', 1); });
      expect(useEncounterStore.getState().lastDiscardTriggered).toBe(false);
    });

    it('should throw when an unknown monster id is provided', () => {
      const { startEncounter } = useEncounterStore.getState();
      expect(() => {
        act(() => { startEncounter('no-such-monster', 1); });
      }).toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // flipMonsterCard
  // -------------------------------------------------------------------------

  describe('flipMonsterCard', () => {
    beforeEach(() => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin', 1); });
    });

    it('should set currentCard to the revealed card from flipCard', () => {
      act(() => { useEncounterStore.getState().flipMonsterCard(); });
      const state = useEncounterStore.getState();
      expect(state.currentCard).not.toBeNull();
      expect(state.currentCard!.cardId).toBe(MOCK_CARDS[0].id);
    });

    it('should update the deck to the remainingDeck returned by flipCard', () => {
      act(() => { useEncounterStore.getState().flipMonsterCard(); });
      expect(useEncounterStore.getState().deck).toHaveLength(3);
    });

    it('should reset lastDiscardTriggered to false on flip', () => {
      act(() => { useEncounterStore.getState().flipMonsterCard(); });
      expect(useEncounterStore.getState().lastDiscardTriggered).toBe(false);
    });

    it('should do nothing when flipCard returns null (empty deck)', () => {
      // Override mock to simulate empty deck
      mockFlipResult = null;
      const deckBefore = useEncounterStore.getState().deck;

      act(() => { useEncounterStore.getState().flipMonsterCard(); });

      const state = useEncounterStore.getState();
      expect(state.currentCard).toBeNull();
      expect(state.deck).toEqual(deckBefore);
    });

    it('should expose the source half on the revealed card', () => {
      mockFlipResult = {
        revealed: makeRevealedCard(MOCK_CARDS[0], 'bottom'),
        remainingDeck: MOCK_CARDS.slice(1),
      };
      act(() => { useEncounterStore.getState().flipMonsterCard(); });
      expect(useEncounterStore.getState().currentCard!.source).toBe('bottom');
    });
  });

  // -------------------------------------------------------------------------
  // applyPlayerDamage
  // -------------------------------------------------------------------------

  describe('applyPlayerDamage', () => {
    beforeEach(() => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin', 1); });
      // Flip a card first so currentCard is set
      act(() => { useEncounterStore.getState().flipMonsterCard(); });
    });

    it('should move cards from the deck into the discard pile', () => {
      act(() => { useEncounterStore.getState().applyPlayerDamage(2); });
      const state = useEncounterStore.getState();
      // Started with 4 cards; flipMonsterCard consumed 1 (deck now has 3); damage=2 removes 2
      expect(state.deck).toHaveLength(1);
      expect(state.discardPile).toHaveLength(2);
    });

    it('should clear currentCard after damage is applied', () => {
      act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
      expect(useEncounterStore.getState().currentCard).toBeNull();
    });

    it('should not change deck or discard when damage is 0', () => {
      const deckBefore = useEncounterStore.getState().deck.length;
      const discardBefore = useEncounterStore.getState().discardPile.length;

      act(() => { useEncounterStore.getState().applyPlayerDamage(0); });

      expect(useEncounterStore.getState().deck).toHaveLength(deckBefore);
      expect(useEncounterStore.getState().discardPile).toHaveLength(discardBefore);
    });

    it('should not change deck or discard when damage is negative', () => {
      const deckBefore = useEncounterStore.getState().deck.length;
      act(() => { useEncounterStore.getState().applyPlayerDamage(-5); });
      expect(useEncounterStore.getState().deck).toHaveLength(deckBefore);
    });

    it('should transition to victory when all remaining deck cards are discarded', () => {
      // 3 cards remain after flip; apply exactly that much damage
      act(() => { useEncounterStore.getState().applyPlayerDamage(3); });
      expect(useEncounterStore.getState().phase).toBe('victory');
    });

    it('should transition to victory when damage exceeds remaining deck', () => {
      act(() => { useEncounterStore.getState().applyPlayerDamage(999); });
      expect(useEncounterStore.getState().phase).toBe('victory');
    });

    it('should stay in playing phase when cards remain after damage', () => {
      act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
      expect(useEncounterStore.getState().phase).toBe('playing');
    });

    describe('discard trigger', () => {
      it('should set lastDiscardTriggered true when monster has discardAbility and cards are discarded', () => {
        // test-griffin has a discardAbility
        act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
        expect(useEncounterStore.getState().lastDiscardTriggered).toBe(true);
      });

      it('should set lastDiscardTriggered false when monster has no discardAbility', () => {
        // Reset and start with test-werewolf (no discardAbility)
        resetStore();
        act(() => { useEncounterStore.getState().startEncounter('test-werewolf', 1); });
        act(() => { useEncounterStore.getState().flipMonsterCard(); });
        act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
        expect(useEncounterStore.getState().lastDiscardTriggered).toBe(false);
      });
    });

    it('should accumulate discarded cards across multiple damage applications', () => {
      act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
      act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
      // 1 discarded from first damage, 1 from second
      expect(useEncounterStore.getState().discardPile).toHaveLength(2);
    });
  });

  // -------------------------------------------------------------------------
  // Full lifecycle: start -> flip -> damage -> victory
  // -------------------------------------------------------------------------

  describe('full encounter lifecycle', () => {
    it('should complete a full encounter from start to victory', () => {
      // Start
      act(() => { useEncounterStore.getState().startEncounter('test-griffin', 1); });
      expect(useEncounterStore.getState().phase).toBe('playing');

      // Flip
      act(() => { useEncounterStore.getState().flipMonsterCard(); });
      expect(useEncounterStore.getState().currentCard).not.toBeNull();

      // Damage — wipe the remaining deck (3 cards after flip)
      act(() => { useEncounterStore.getState().applyPlayerDamage(3); });
      const finalState = useEncounterStore.getState();

      expect(finalState.phase).toBe('victory');
      expect(finalState.deck).toHaveLength(0);
      expect(finalState.discardPile).toHaveLength(3);
      expect(finalState.currentCard).toBeNull();
    });

    it('should allow multiple flip-damage rounds before victory', () => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin', 1); });

      // Round 1: flip and deal 1 damage
      act(() => { useEncounterStore.getState().flipMonsterCard(); });
      act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
      expect(useEncounterStore.getState().phase).toBe('playing');

      // Round 2: flip and deal 1 damage
      mockFlipResult = {
        revealed: makeRevealedCard(MOCK_CARDS[1], 'top'),
        remainingDeck: MOCK_CARDS.slice(2),
      };
      act(() => { useEncounterStore.getState().flipMonsterCard(); });
      act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
      expect(useEncounterStore.getState().phase).toBe('playing');

      // Final blow: kill the rest
      act(() => { useEncounterStore.getState().applyPlayerDamage(999); });
      expect(useEncounterStore.getState().phase).toBe('victory');
    });
  });

  // -------------------------------------------------------------------------
  // rollInitiative
  // -------------------------------------------------------------------------

  describe('rollInitiative', () => {
    it('should update isMonsterFirst based on checkInitiative result', () => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin', 1); });

      mockIsMonsterFirst = false;
      act(() => { useEncounterStore.getState().rollInitiative(); });
      expect(useEncounterStore.getState().isMonsterFirst).toBe(false);

      mockIsMonsterFirst = true;
      act(() => { useEncounterStore.getState().rollInitiative(); });
      expect(useEncounterStore.getState().isMonsterFirst).toBe(true);
    });

    it('should not change phase, deck, or discard pile', () => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin', 1); });
      const before = useEncounterStore.getState();

      act(() => { useEncounterStore.getState().rollInitiative(); });
      const after = useEncounterStore.getState();

      expect(after.phase).toBe(before.phase);
      expect(after.deck).toHaveLength(before.deck.length);
      expect(after.discardPile).toHaveLength(before.discardPile.length);
    });
  });

  // -------------------------------------------------------------------------
  // nextRound
  // -------------------------------------------------------------------------

  describe('nextRound', () => {
    beforeEach(() => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin', 1); });
      act(() => { useEncounterStore.getState().flipMonsterCard(); });
    });

    it('should clear currentCard', () => {
      act(() => { useEncounterStore.getState().nextRound(); });
      expect(useEncounterStore.getState().currentCard).toBeNull();
    });

    it('should re-roll initiative', () => {
      mockIsMonsterFirst = false;
      act(() => { useEncounterStore.getState().nextRound(); });
      expect(useEncounterStore.getState().isMonsterFirst).toBe(false);
    });

    it('should reset lastDiscardTriggered', () => {
      // Trigger a discard first
      act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
      expect(useEncounterStore.getState().lastDiscardTriggered).toBe(true);

      act(() => { useEncounterStore.getState().nextRound(); });
      expect(useEncounterStore.getState().lastDiscardTriggered).toBe(false);
    });

    it('should not change the deck or discard pile', () => {
      const deckBefore = useEncounterStore.getState().deck.length;
      const discardBefore = useEncounterStore.getState().discardPile.length;

      act(() => { useEncounterStore.getState().nextRound(); });

      expect(useEncounterStore.getState().deck).toHaveLength(deckBefore);
      expect(useEncounterStore.getState().discardPile).toHaveLength(discardBefore);
    });
  });

  // -------------------------------------------------------------------------
  // resetToSetup
  // -------------------------------------------------------------------------

  describe('resetToSetup', () => {
    it('should return all state to its initial values', () => {
      // First, run an encounter to dirty all the state
      act(() => { useEncounterStore.getState().startEncounter('test-griffin', 1); });
      act(() => { useEncounterStore.getState().flipMonsterCard(); });
      act(() => { useEncounterStore.getState().applyPlayerDamage(1); });

      act(() => { useEncounterStore.getState().resetToSetup(); });

      const state = useEncounterStore.getState();
      expect(state.phase).toBe('setup');
      expect(state.monster).toBeNull();
      expect(state.level).toBeNull();
      expect(state.deck).toHaveLength(0);
      expect(state.discardPile).toHaveLength(0);
      expect(state.currentCard).toBeNull();
      expect(state.isMonsterFirst).toBe(false);
      expect(state.lastDiscardTriggered).toBe(false);
    });

    it('should allow a new encounter to be started after reset', () => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin', 1); });
      act(() => { useEncounterStore.getState().resetToSetup(); });
      act(() => { useEncounterStore.getState().startEncounter('test-griffin', 1); });

      expect(useEncounterStore.getState().phase).toBe('playing');
    });

    it('should be idempotent — calling reset twice leaves state the same', () => {
      act(() => { useEncounterStore.getState().resetToSetup(); });
      const stateAfterFirst = useEncounterStore.getState();
      act(() => { useEncounterStore.getState().resetToSetup(); });
      const stateAfterSecond = useEncounterStore.getState();

      expect(stateAfterSecond.phase).toBe(stateAfterFirst.phase);
      expect(stateAfterSecond.monster).toBe(stateAfterFirst.monster);
      expect(stateAfterSecond.deck).toHaveLength(stateAfterFirst.deck.length);
    });
  });

  // -------------------------------------------------------------------------
  // React hook integration
  // -------------------------------------------------------------------------

  describe('React hook integration', () => {
    it('should reflect store state changes through the hook', () => {
      const { result } = renderHook(() => useEncounterStore());

      expect(result.current.phase).toBe('setup');

      act(() => { result.current.startEncounter('test-griffin', 1); });
      expect(result.current.phase).toBe('playing');

      act(() => { result.current.resetToSetup(); });
      expect(result.current.phase).toBe('setup');
    });

    it('should expose all required action methods', () => {
      const { result } = renderHook(() => useEncounterStore());
      expect(typeof result.current.startEncounter).toBe('function');
      expect(typeof result.current.flipMonsterCard).toBe('function');
      expect(typeof result.current.applyPlayerDamage).toBe('function');
      expect(typeof result.current.rollInitiative).toBe('function');
      expect(typeof result.current.nextRound).toBe('function');
      expect(typeof result.current.resetToSetup).toBe('function');
    });
  });
});
