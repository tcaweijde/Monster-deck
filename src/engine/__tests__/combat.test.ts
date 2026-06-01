import { describe, it, expect } from 'vitest';
import { flipCard, applyDamage } from '../combat';
import type { MonsterCard } from '../../types';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeCard(id: string, topAttack = 1, bottomAttack = 2): MonsterCard {
  return {
    id,
    top: { attack: topAttack, effect: `top-effect-${id}` },
    bottom: { attack: bottomAttack, effect: `bottom-effect-${id}` },
  };
}

const CARD_A = makeCard('card-a', 3, 5);
const CARD_B = makeCard('card-b', 2, 4);
const CARD_C = makeCard('card-c', 1, 6);

// ---------------------------------------------------------------------------
// flipCard
// ---------------------------------------------------------------------------

describe('flipCard', () => {
  describe('empty deck', () => {
    it('should return null when the deck is empty', () => {
      const result = flipCard([], () => 0.3);
      expect(result).toBeNull();
    });

    it('should not call the RNG when the deck is empty', () => {
      let called = false;
      flipCard([], () => { called = true; return 0; });
      expect(called).toBe(false);
    });
  });

  describe('card removal', () => {
    it('should remove the first card from the deck', () => {
      const deck = [CARD_A, CARD_B, CARD_C];
      const result = flipCard(deck, () => 0.3);
      expect(result).not.toBeNull();
      expect(result!.remainingDeck).toHaveLength(2);
      expect(result!.remainingDeck[0].id).toBe('card-b');
      expect(result!.remainingDeck[1].id).toBe('card-c');
    });

    it('should always pick the top card of the deck (index 0)', () => {
      const deck = [CARD_A, CARD_B];
      const result = flipCard(deck, () => 0.3);
      expect(result!.revealed.cardId).toBe('card-a');
    });

    it('should not mutate the original deck array', () => {
      const deck = [CARD_A, CARD_B, CARD_C];
      flipCard(deck, () => 0.3);
      expect(deck).toHaveLength(3);
    });

    it('should leave an empty remainingDeck after flipping the only card', () => {
      const result = flipCard([CARD_A], () => 0.3);
      expect(result!.remainingDeck).toHaveLength(0);
    });
  });

  describe('half selection via RNG (rng < 0.5 => top, else => bottom)', () => {
    it('should reveal the top half when rng returns a value < 0.5', () => {
      const result = flipCard([CARD_A], () => 0.3);
      expect(result!.revealed.source).toBe('top');
      expect(result!.revealed.chosenHalf).toEqual(CARD_A.top);
    });

    it('should reveal the bottom half when rng returns exactly 0.5', () => {
      const result = flipCard([CARD_A], () => 0.5);
      expect(result!.revealed.source).toBe('bottom');
      expect(result!.revealed.chosenHalf).toEqual(CARD_A.bottom);
    });

    it('should reveal the bottom half when rng returns a value > 0.5', () => {
      const result = flipCard([CARD_A], () => 0.7);
      expect(result!.revealed.source).toBe('bottom');
      expect(result!.revealed.chosenHalf).toEqual(CARD_A.bottom);
    });

    it('should reveal the top half when rng returns 0', () => {
      const result = flipCard([CARD_A], () => 0);
      expect(result!.revealed.source).toBe('top');
    });

    it('should reveal the bottom half when rng returns 0.9999', () => {
      const result = flipCard([CARD_A], () => 0.9999);
      expect(result!.revealed.source).toBe('bottom');
    });
  });

  describe('revealed card structure', () => {
    it('should set cardId to the flipped card id', () => {
      const result = flipCard([CARD_B], () => 0.1);
      expect(result!.revealed.cardId).toBe('card-b');
    });

    it('should set chosenHalf to the corresponding half of the card', () => {
      const topResult = flipCard([CARD_A], () => 0.1);
      expect(topResult!.revealed.chosenHalf.attack).toBe(CARD_A.top.attack);

      const bottomResult = flipCard([CARD_A], () => 0.9);
      expect(bottomResult!.revealed.chosenHalf.attack).toBe(CARD_A.bottom.attack);
    });

    it('should call the RNG exactly once per flip', () => {
      let callCount = 0;
      flipCard([CARD_A, CARD_B], () => { callCount++; return 0.3; });
      expect(callCount).toBe(1);
    });
  });

  describe('default RNG', () => {
    it('should not throw when called without an explicit RNG', () => {
      expect(() => flipCard([CARD_A])).not.toThrow();
    });
  });
});

// ---------------------------------------------------------------------------
// applyDamage
// ---------------------------------------------------------------------------

describe('applyDamage', () => {
  describe('normal damage (less than deck size)', () => {
    it('should discard the correct number of cards from the front of the deck', () => {
      const deck = [CARD_A, CARD_B, CARD_C];
      const { discardedCards } = applyDamage(deck, 2);
      expect(discardedCards).toHaveLength(2);
      expect(discardedCards[0].id).toBe('card-a');
      expect(discardedCards[1].id).toBe('card-b');
    });

    it('should leave the correct cards in the remaining deck', () => {
      const deck = [CARD_A, CARD_B, CARD_C];
      const { remainingDeck } = applyDamage(deck, 2);
      expect(remainingDeck).toHaveLength(1);
      expect(remainingDeck[0].id).toBe('card-c');
    });

    it('should discard exactly 1 card when damage is 1', () => {
      const deck = [CARD_A, CARD_B, CARD_C];
      const { discardedCards, remainingDeck } = applyDamage(deck, 1);
      expect(discardedCards).toHaveLength(1);
      expect(remainingDeck).toHaveLength(2);
    });
  });

  describe('damage clamping (damage >= deck size)', () => {
    it('should discard all cards when damage equals deck length', () => {
      const deck = [CARD_A, CARD_B, CARD_C];
      const { discardedCards, remainingDeck } = applyDamage(deck, 3);
      expect(discardedCards).toHaveLength(3);
      expect(remainingDeck).toHaveLength(0);
    });

    it('should discard all cards when damage exceeds deck length', () => {
      const deck = [CARD_A, CARD_B];
      const { discardedCards, remainingDeck } = applyDamage(deck, 99);
      expect(discardedCards).toHaveLength(2);
      expect(remainingDeck).toHaveLength(0);
    });

    it('should not throw when damage far exceeds deck size', () => {
      expect(() => applyDamage([CARD_A], 1000)).not.toThrow();
    });
  });

  describe('empty deck', () => {
    it('should return empty discardedCards when the deck is empty', () => {
      const { discardedCards } = applyDamage([], 3);
      expect(discardedCards).toHaveLength(0);
    });

    it('should return empty remainingDeck when the deck is empty', () => {
      const { remainingDeck } = applyDamage([], 3);
      expect(remainingDeck).toHaveLength(0);
    });
  });

  describe('zero damage', () => {
    it('should discard no cards when damage is 0', () => {
      const deck = [CARD_A, CARD_B, CARD_C];
      const { discardedCards, remainingDeck } = applyDamage(deck, 0);
      expect(discardedCards).toHaveLength(0);
      expect(remainingDeck).toHaveLength(3);
    });
  });

  describe('immutability', () => {
    it('should not mutate the original deck array', () => {
      const deck = [CARD_A, CARD_B, CARD_C];
      applyDamage(deck, 2);
      expect(deck).toHaveLength(3);
    });

    it('should preserve card object references in both output arrays', () => {
      const deck = [CARD_A, CARD_B, CARD_C];
      const { discardedCards, remainingDeck } = applyDamage(deck, 1);
      expect(discardedCards[0]).toBe(CARD_A);
      expect(remainingDeck[0]).toBe(CARD_B);
    });
  });

  describe('card identity preservation', () => {
    it('should keep discarded and remaining cards mutually exclusive', () => {
      const deck = [CARD_A, CARD_B, CARD_C];
      const { discardedCards, remainingDeck } = applyDamage(deck, 2);
      const discardedIds = new Set(discardedCards.map((c) => c.id));
      for (const card of remainingDeck) {
        expect(discardedIds.has(card.id)).toBe(false);
      }
    });

    it('should together account for all original cards', () => {
      const deck = [CARD_A, CARD_B, CARD_C];
      const { discardedCards, remainingDeck } = applyDamage(deck, 2);
      const allIds = [...discardedCards, ...remainingDeck].map((c) => c.id);
      expect(allIds.sort()).toEqual(['card-a', 'card-b', 'card-c']);
    });
  });
});
