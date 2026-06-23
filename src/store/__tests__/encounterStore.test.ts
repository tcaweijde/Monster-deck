import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { Monster, MonsterCard, RevealedCard } from '../../types';

const MOCK_CARDS: MonsterCard[] = [
  { id: 'c-01', top: { name: 'Charge', attack: 3, effect: 'Shield 1' }, bottom: { name: 'Bite', attack: 2 } },
  { id: 'c-02', top: { name: 'Charge', attack: 2 },                     bottom: { name: 'Bite', attack: 4, effect: 'Bleed 1' } },
  { id: 'c-03', top: { name: 'Charge', attack: 1 },                     bottom: { name: 'Bite', attack: 3 } },
  { id: 'c-04', top: { name: 'Charge', attack: 4 },                     bottom: { name: 'Bite', attack: 1 } },
];

const MOCK_MONSTER: Monster = {
  id: 'test-griffin',
  name: 'Test Griffin',
  level: 2,
  deckSize: 4,
  baseAbility: { name: 'Aerial Predator', description: 'Attacks from above.', trigger: 'passive' },
  secondaryAbility: { name: 'Screech', description: 'Causes fear.', trigger: 'passive' },
  discardAbility: { name: 'Frenzy', description: 'Retaliates when damaged.', trigger: 'discard' },
  cardPool: MOCK_CARDS,
  cardFrontImages: ['griffin-1.png', 'griffin-2.png'],
};

const MOCK_MONSTER_NO_DISCARD: Monster = {
  ...MOCK_MONSTER,
  id: 'test-werewolf',
  name: 'Test Werewolf',
  discardAbility: undefined,
};

let mockDeck: MonsterCard[] = [...MOCK_CARDS];
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

import { useEncounterStore } from '../encounterStore';

function makeRevealedCard(card: MonsterCard, source: 'top' | 'bottom' = 'top'): RevealedCard {
  return { cardId: card.id, chosenHalf: card[source]!, source };
}

function resetStore() {
  const { resetToSetup } = useEncounterStore.getState();
  act(() => { resetToSetup(); });
}

describe('encounterStore', () => {
  beforeEach(() => {
    resetStore();
    mockDeck = [...MOCK_CARDS];
    mockFlipResult = {
      revealed: makeRevealedCard(MOCK_CARDS[0], 'top'),
      remainingDeck: MOCK_CARDS.slice(1),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start in setup phase with all nulls and empty collections', () => {
      const state = useEncounterStore.getState();
      expect(state.phase).toBe('setup');
      expect(state.monster).toBeNull();
      expect(state.deck).toHaveLength(0);
      expect(state.discardPile).toHaveLength(0);
      expect(state.currentCard).toBeNull();
      expect(state.turn).toBe('monster');
      expect(state.lastDiscardTriggered).toBe(false);
    });
  });

  describe('startEncounter', () => {
    it('should transition phase from setup to playing', () => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin'); });
      expect(useEncounterStore.getState().phase).toBe('playing');
    });

    it('should set the monster from the lookup', () => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin'); });
      expect(useEncounterStore.getState().monster?.id).toBe('test-griffin');
    });

    it('should populate the deck from generateDeck', () => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin'); });
      expect(useEncounterStore.getState().deck).toHaveLength(4);
    });

    it('should start on monster turn', () => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin'); });
      expect(useEncounterStore.getState().turn).toBe('monster');
    });

    it('should clear state from any previous encounter', () => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin'); });
      act(() => { useEncounterStore.getState().flipMonsterCard(); });
      act(() => { useEncounterStore.getState().startEncounter('test-griffin'); });
      const state = useEncounterStore.getState();
      expect(state.currentCard).toBeNull();
      expect(state.discardPile).toHaveLength(0);
    });

    it('should throw when an unknown monster id is provided', () => {
      expect(() => {
        act(() => { useEncounterStore.getState().startEncounter('no-such-monster'); });
      }).toThrow();
    });
  });

  describe('flipMonsterCard', () => {
    beforeEach(() => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin'); });
    });

    it('should set currentCard to the revealed card', () => {
      act(() => { useEncounterStore.getState().flipMonsterCard(); });
      expect(useEncounterStore.getState().currentCard).not.toBeNull();
      expect(useEncounterStore.getState().currentCard!.cardId).toBe(MOCK_CARDS[0].id);
    });

    it('should update the deck to the remaining cards', () => {
      act(() => { useEncounterStore.getState().flipMonsterCard(); });
      expect(useEncounterStore.getState().deck).toHaveLength(3);
    });

    it('should keep turn on monster after reveal', () => {
      act(() => { useEncounterStore.getState().flipMonsterCard(); });
      expect(useEncounterStore.getState().turn).toBe('monster');
    });

    it('should do nothing when flipCard returns null (empty deck)', () => {
      mockFlipResult = null;
      const deckBefore = useEncounterStore.getState().deck;
      act(() => { useEncounterStore.getState().flipMonsterCard(); });
      expect(useEncounterStore.getState().currentCard).toBeNull();
      expect(useEncounterStore.getState().deck).toEqual(deckBefore);
    });
  });

  describe('applyPlayerDamage', () => {
    beforeEach(() => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin'); });
      act(() => { useEncounterStore.getState().flipMonsterCard(); });
    });

    it('should move cards from deck to discard pile', () => {
      act(() => { useEncounterStore.getState().applyPlayerDamage(2); });
      const state = useEncounterStore.getState();
      expect(state.deck).toHaveLength(1);
      expect(state.discardPile).toHaveLength(2);
    });

    it('should switch turn back to monster', () => {
      act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
      expect(useEncounterStore.getState().turn).toBe('monster');
    });

    it('should clear currentCard after damage', () => {
      act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
      expect(useEncounterStore.getState().currentCard).toBeNull();
    });

    it('should handle 0 damage as a skip (no cards discarded, turn switches)', () => {
      const deckBefore = useEncounterStore.getState().deck.length;
      act(() => { useEncounterStore.getState().applyPlayerDamage(0); });
      expect(useEncounterStore.getState().deck).toHaveLength(deckBefore);
      expect(useEncounterStore.getState().turn).toBe('monster');
    });

    it('should not change state when damage is negative', () => {
      const deckBefore = useEncounterStore.getState().deck.length;
      act(() => { useEncounterStore.getState().applyPlayerDamage(-5); });
      expect(useEncounterStore.getState().deck).toHaveLength(deckBefore);
    });

    it('should transition to victory when deck is emptied', () => {
      act(() => { useEncounterStore.getState().applyPlayerDamage(3); });
      expect(useEncounterStore.getState().phase).toBe('victory');
    });

    it('should transition to victory when damage exceeds remaining deck', () => {
      act(() => { useEncounterStore.getState().applyPlayerDamage(999); });
      expect(useEncounterStore.getState().phase).toBe('victory');
    });

    it('should stay in playing phase when cards remain', () => {
      act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
      expect(useEncounterStore.getState().phase).toBe('playing');
    });

    describe('discard trigger', () => {
      it('should set lastDiscardTriggered true when monster has discardAbility and trail is active', () => {
        resetStore();
        act(() => {
          useEncounterStore.getState().startEncounter(
            'test-griffin',
            false,
            0,
            undefined,
            [
              { number: 1, drawAbility: { name: 'A', description: 'B', trigger: 'passive' } },
              { number: 2, drawAbility: { name: 'C', description: 'D', trigger: 'passive' } },
              { number: 3, drawAbility: { name: 'E', description: 'F', trigger: 'passive' } },
              { number: 4, drawAbility: { name: 'G', description: 'H', trigger: 'passive' } },
            ],
          );
        });
        act(() => { useEncounterStore.getState().flipMonsterCard(); });
        act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
        expect(useEncounterStore.getState().lastDiscardTriggered).toBe(true);
      });

      it('should set lastDiscardTriggered false when monster has discardAbility but trail is not active', () => {
        act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
        expect(useEncounterStore.getState().lastDiscardTriggered).toBe(false);
      });

      it('should set lastDiscardTriggered false when monster has no discardAbility', () => {
        resetStore();
        act(() => { useEncounterStore.getState().startEncounter('test-werewolf'); });
        act(() => { useEncounterStore.getState().flipMonsterCard(); });
        act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
        expect(useEncounterStore.getState().lastDiscardTriggered).toBe(false);
      });
    });

    it('should accumulate discarded cards across multiple damage applications', () => {
      act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
      act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
      expect(useEncounterStore.getState().discardPile).toHaveLength(2);
    });
  });

  describe('full encounter lifecycle', () => {
    it('should complete a full encounter from start to victory', () => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin'); });
      expect(useEncounterStore.getState().turn).toBe('monster');

      act(() => { useEncounterStore.getState().flipMonsterCard(); });
      expect(useEncounterStore.getState().turn).toBe('monster');

      act(() => { useEncounterStore.getState().passTurn(); });
      expect(useEncounterStore.getState().turn).toBe('player');
      expect(useEncounterStore.getState().discardPile).toHaveLength(1);

      act(() => { useEncounterStore.getState().applyPlayerDamage(3); });
      expect(useEncounterStore.getState().phase).toBe('victory');
      expect(useEncounterStore.getState().deck).toHaveLength(0);
      expect(useEncounterStore.getState().discardPile).toHaveLength(4);
    });

    it('should alternate turns across multiple flip-damage cycles', () => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin'); });
      expect(useEncounterStore.getState().turn).toBe('monster');

      act(() => { useEncounterStore.getState().flipMonsterCard(); });
      expect(useEncounterStore.getState().turn).toBe('monster');

      act(() => { useEncounterStore.getState().passTurn(); });
      expect(useEncounterStore.getState().turn).toBe('player');
      expect(useEncounterStore.getState().discardPile).toHaveLength(1);

      act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
      expect(useEncounterStore.getState().turn).toBe('monster');
      expect(useEncounterStore.getState().phase).toBe('playing');
      expect(useEncounterStore.getState().discardPile).toHaveLength(2);
    });
  });

  describe('passTurn', () => {
    it('should toggle turn from monster to player, clear currentCard, and discard the revealed attack card', () => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin'); });
      act(() => { useEncounterStore.getState().flipMonsterCard(); });

      expect(useEncounterStore.getState().currentCard).not.toBeNull();
      act(() => { useEncounterStore.getState().passTurn(); });

      const state = useEncounterStore.getState();
      expect(state.turn).toBe('player');
      expect(state.currentCard).toBeNull();
      expect(state.discardPile).toHaveLength(1);
      expect(state.discardPile[0].id).toBe(MOCK_CARDS[0].id);
    });

    it('should toggle turn from player to monster', () => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin'); });
      act(() => { useEncounterStore.getState().flipMonsterCard(); });
      act(() => { useEncounterStore.getState().passTurn(); });

      expect(useEncounterStore.getState().turn).toBe('player');
      act(() => { useEncounterStore.getState().passTurn(); });
      expect(useEncounterStore.getState().turn).toBe('monster');
    });
  });

  describe('resetToSetup', () => {
    it('should return all state to initial values', () => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin'); });
      act(() => { useEncounterStore.getState().flipMonsterCard(); });
      act(() => { useEncounterStore.getState().applyPlayerDamage(1); });
      act(() => { useEncounterStore.getState().resetToSetup(); });

      const state = useEncounterStore.getState();
      expect(state.phase).toBe('setup');
      expect(state.monster).toBeNull();
      expect(state.deck).toHaveLength(0);
      expect(state.discardPile).toHaveLength(0);
      expect(state.currentCard).toBeNull();
      expect(state.turn).toBe('monster');
      expect(state.lastDiscardTriggered).toBe(false);
    });

    it('should allow a new encounter after reset', () => {
      act(() => { useEncounterStore.getState().startEncounter('test-griffin'); });
      act(() => { useEncounterStore.getState().resetToSetup(); });
      act(() => { useEncounterStore.getState().startEncounter('test-griffin'); });
      expect(useEncounterStore.getState().phase).toBe('playing');
    });

    it('should be idempotent', () => {
      act(() => { useEncounterStore.getState().resetToSetup(); });
      const first = useEncounterStore.getState();
      act(() => { useEncounterStore.getState().resetToSetup(); });
      const second = useEncounterStore.getState();
      expect(second.phase).toBe(first.phase);
      expect(second.monster).toBe(first.monster);
    });
  });

  describe('React hook integration', () => {
    it('should reflect store state changes through the hook', () => {
      const { result } = renderHook(() => useEncounterStore());
      expect(result.current.phase).toBe('setup');

      act(() => { result.current.startEncounter('test-griffin'); });
      expect(result.current.phase).toBe('playing');

      act(() => { result.current.resetToSetup(); });
      expect(result.current.phase).toBe('setup');
    });

    it('should expose all required action methods', () => {
      const { result } = renderHook(() => useEncounterStore());
      expect(typeof result.current.startEncounter).toBe('function');
      expect(typeof result.current.flipMonsterCard).toBe('function');
      expect(typeof result.current.applyPlayerDamage).toBe('function');
      expect(typeof result.current.resetToSetup).toBe('function');
    });
  });
});
