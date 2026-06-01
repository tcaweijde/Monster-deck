import { describe, it, expect } from 'vitest';
import { generateDeck } from '../deck';
import type { Monster, MonsterCard } from '../../types';

// RNG that always returns 0: every swap partners with index 0.
// Deterministic and sufficient to exercise the full shuffle code path.
const zeroRng = () => 0;

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

function makeCard(id: string): MonsterCard {
  return { id, top: { attack: 1 }, bottom: { attack: 2 } };
}

// A monster whose pool has exactly enough cards for all three levels.
const POOL_16 = Array.from({ length: 16 }, (_, i) => makeCard(`card-${String(i + 1).padStart(2, '0')}`));

const testMonster: Monster = {
  id: 'test-monster',
  name: 'Test Monster',
  deckSizes: { 1: 8, 2: 12, 3: 16 },
  baseAbility: { name: 'Base', description: 'Base ability', trigger: 'passive' },
  cardPool: POOL_16,
};

// A monster with exactly as many cards as its level-1 deck needs.
const POOL_5 = Array.from({ length: 5 }, (_, i) => makeCard(`tiny-${i}`));
const tightMonster: Monster = {
  id: 'tight-monster',
  name: 'Tight Monster',
  deckSizes: { 1: 5, 2: 5, 3: 5 },
  baseAbility: { name: 'Base', description: 'Base ability', trigger: 'passive' },
  cardPool: POOL_5,
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('generateDeck', () => {
  describe('deck size', () => {
    it('should return a deck of the correct size for level 1', () => {
      const deck = generateDeck(testMonster, 1, zeroRng);
      expect(deck).toHaveLength(8);
    });

    it('should return a deck of the correct size for level 2', () => {
      const deck = generateDeck(testMonster, 2, zeroRng);
      expect(deck).toHaveLength(12);
    });

    it('should return a deck of the correct size for level 3', () => {
      const deck = generateDeck(testMonster, 3, zeroRng);
      expect(deck).toHaveLength(16);
    });

    it('should work when pool size exactly equals required deck size', () => {
      const deck = generateDeck(tightMonster, 1, zeroRng);
      expect(deck).toHaveLength(5);
    });
  });

  describe('card subset validity', () => {
    it('should only include cards that exist in the monster card pool', () => {
      const poolIds = new Set(testMonster.cardPool.map((c) => c.id));
      const deck = generateDeck(testMonster, 1, zeroRng);
      for (const card of deck) {
        expect(poolIds.has(card.id)).toBe(true);
      }
    });

    it('should not include duplicate cards', () => {
      const deck = generateDeck(testMonster, 2, zeroRng);
      const ids = deck.map((c) => c.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });

    it('should include every pool card when deck size equals pool size', () => {
      const deck = generateDeck(tightMonster, 1, zeroRng);
      const poolIds = new Set(POOL_5.map((c) => c.id));
      const deckIds = new Set(deck.map((c) => c.id));
      expect(deckIds).toEqual(poolIds);
    });
  });

  describe('determinism', () => {
    it('should produce the same deck for the same RNG sequence', () => {
      const makeRng = () => {
        const vals = [0.1, 0.9, 0.3, 0.7, 0.2, 0.8, 0.4, 0.6,
                      0.15, 0.85, 0.35, 0.65, 0.05, 0.95, 0.45,
                      0.05, 0.3, 0.7, 0.1, 0.9, 0.5, 0.6];
        let i = 0;
        return () => vals[i++ % vals.length];
      };

      const deck1 = generateDeck(testMonster, 1, makeRng());
      const deck2 = generateDeck(testMonster, 1, makeRng());
      expect(deck1.map((c) => c.id)).toEqual(deck2.map((c) => c.id));
    });

    it('should produce differently-ordered decks for different RNG sequences', () => {
      // Use two very different fixed sequences and confirm they don't collide.
      // (Tiny probability of false failure, practically zero with these sequences.)
      const allZero = () => 0;
      const allHigh = () => 0.999;

      const deck1 = generateDeck(testMonster, 1, allZero);
      const deck2 = generateDeck(testMonster, 1, allHigh);

      // Both are valid subsets of size 8 — but order (or selection) should differ.
      const ids1 = deck1.map((c) => c.id).join(',');
      const ids2 = deck2.map((c) => c.id).join(',');
      expect(ids1).not.toBe(ids2);
    });
  });

  describe('error handling', () => {
    it('should throw when the pool has fewer cards than the deck size requires', () => {
      const smallPool: Monster = {
        id: 'small',
        name: 'Small',
        deckSizes: { 1: 10, 2: 10, 3: 10 },
        baseAbility: { name: 'Base', description: '', trigger: 'passive' },
        cardPool: Array.from({ length: 5 }, (_, i) => makeCard(`s-${i}`)),
      };

      expect(() => generateDeck(smallPool, 1, zeroRng)).toThrow();
    });

    it('should include the monster id in the error message', () => {
      const smallPool: Monster = {
        id: 'tiny-beast',
        name: 'Tiny Beast',
        deckSizes: { 1: 99, 2: 99, 3: 99 },
        baseAbility: { name: 'Base', description: '', trigger: 'passive' },
        cardPool: [makeCard('only-one')],
      };

      expect(() => generateDeck(smallPool, 1, zeroRng)).toThrow('tiny-beast');
    });

    it('should include the required count in the error message', () => {
      const smallPool: Monster = {
        id: 'small-id',
        name: 'Small',
        deckSizes: { 1: 50, 2: 50, 3: 50 },
        baseAbility: { name: 'Base', description: '', trigger: 'passive' },
        cardPool: [makeCard('c')],
      };

      expect(() => generateDeck(smallPool, 1, zeroRng)).toThrow('50');
    });
  });

  describe('real monster data', () => {
    it('should generate a valid level-1 griffin deck from real data', async () => {
      const { griffin } = await import('../../data/monsters/griffin');
      const deck = generateDeck(griffin, 1, zeroRng);
      expect(deck).toHaveLength(8);
      const poolIds = new Set(griffin.cardPool.map((c) => c.id));
      for (const card of deck) {
        expect(poolIds.has(card.id)).toBe(true);
      }
    });

    it('should generate a valid level-3 werewolf deck from real data', async () => {
      const { werewolf } = await import('../../data/monsters/werewolf');
      const deck = generateDeck(werewolf, 3, zeroRng);
      expect(deck).toHaveLength(18);
    });
  });
});
