import { describe, it, expect } from 'vitest';
import { generateDeck } from '../deck';
import type { Monster, MonsterCard, TrailCard } from '../../types';

const zeroRng = () => 0;

function makeCard(id: string): MonsterCard {
  return { id, top: { name: 'Charge', attack: 1 }, bottom: { name: 'Bite', attack: 2 } };
}

const POOL_16 = Array.from({ length: 16 }, (_, i) => makeCard(`card-${String(i + 1).padStart(2, '0')}`));

const testMonster: Monster = {
  id: 'test-monster',
  name: 'Test Monster',
  level: 2,
  deckSize: 8,
  baseAbility: { name: 'Base', description: 'Base ability', trigger: 'passive' },
  cardPool: POOL_16,
  cardFrontImages: []
};

const tightMonster: Monster = {
  ...testMonster,
  id: 'tight-monster',
  name: 'Tight Monster',
  deckSize: 16,
};

describe('generateDeck', () => {
  describe('deck size', () => {
    it('should return a deck of the correct size', () => {
      const deck = generateDeck(testMonster, zeroRng);
      expect(deck).toHaveLength(8);
    });

    it('should work when pool size exactly equals deck size', () => {
      const deck = generateDeck(tightMonster, zeroRng);
      expect(deck).toHaveLength(16);
    });
  });

  describe('card subset validity', () => {
    it('should only include cards that exist in the monster card pool', () => {
      const poolIds = new Set(testMonster.cardPool.map((c) => c.id));
      const deck = generateDeck(testMonster, zeroRng);
      for (const card of deck) {
        expect(poolIds.has(card.id)).toBe(true);
      }
    });

    it('should not include duplicate cards', () => {
      const deck = generateDeck(testMonster, zeroRng);
      const ids = deck.map((c) => c.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });

    it('should include every pool card when deck size equals pool size', () => {
      const deck = generateDeck(tightMonster, zeroRng);
      const poolIds = new Set(POOL_16.map((c) => c.id));
      const deckIds = new Set(deck.map((c) => c.id));
      expect(deckIds).toEqual(poolIds);
    });
  });

  describe('determinism', () => {
    it('should produce the same deck for the same RNG sequence', () => {
      const makeRng = () => {
        const vals = [0.1, 0.9, 0.3, 0.7, 0.2, 0.8, 0.4, 0.6, 0.15, 0.85, 0.35, 0.65, 0.05, 0.95, 0.45, 0.05, 0.3, 0.7, 0.1, 0.9, 0.5, 0.6];
        let i = 0;
        return () => vals[i++ % vals.length];
      };

      const deck1 = generateDeck(testMonster, makeRng());
      const deck2 = generateDeck(testMonster, makeRng());
      expect(deck1.map((c) => c.id)).toEqual(deck2.map((c) => c.id));
    });

    it('should produce differently-ordered decks for different RNG sequences', () => {
      const allZero = () => 0;
      const allHigh = () => 0.999;

      const deck1 = generateDeck(testMonster, allZero);
      const deck2 = generateDeck(testMonster, allHigh);

      const ids1 = deck1.map((c) => c.id).join(',');
      const ids2 = deck2.map((c) => c.id).join(',');
      expect(ids1).not.toBe(ids2);
    });
  });

  describe('error handling', () => {
    it('should throw when the pool has fewer cards than the deck size requires', () => {
      const smallPool: Monster = {
        ...testMonster,
        id: 'small',
        deckSize: 10,
        cardPool: Array.from({ length: 5 }, (_, i) => makeCard(`s-${i}`)),
      };
      expect(() => generateDeck(smallPool, zeroRng)).toThrow();
    });

    it('should include the monster id in the error message', () => {
      const smallPool: Monster = {
        ...testMonster,
        id: 'tiny-beast',
        deckSize: 99,
        cardPool: [makeCard('only-one')],
      };
      expect(() => generateDeck(smallPool, zeroRng)).toThrow('tiny-beast');
    });

    it('should include the required count in the error message', () => {
      const smallPool: Monster = {
        ...testMonster,
        id: 'small-id',
        deckSize: 50,
        cardPool: [makeCard('c')],
      };
      expect(() => generateDeck(smallPool, zeroRng)).toThrow('50');
    });
  });

  describe('real monster data', () => {
    it('should generate a valid griffin deck from real data', async () => {
      const { griffin } = await import('../../data/monsters/griffin');
      const monster = { ...griffin, deckSize: griffin.cardPool.length };
      const deck = generateDeck(monster, zeroRng);
      expect(deck).toHaveLength(monster.deckSize);
      const poolIds = new Set(griffin.cardPool.map((c) => c.id));
      for (const card of deck) {
        expect(poolIds.has(card.id)).toBe(true);
      }
    });

    it('should generate a valid werewolf deck from real data', async () => {
      const { werewolf } = await import('../../data/monsters/werewolf');
      const monster = { ...werewolf, deckSize: werewolf.cardPool.length };
      const deck = generateDeck(monster, zeroRng);
      expect(deck).toHaveLength(monster.deckSize);
    });
  });
});

// ─── Trail options ────────────────────────────────────────────────────────────

function makeTrailCard(number: 1 | 2 | 3 | 4): TrailCard {
  return {
    number,
    drawAbility: { name: `Draw ${number}`, description: `d${number}`, trigger: 'passive' },
    discardAbility: { name: `Discard ${number}`, description: `x${number}`, trigger: 'discard' },
  };
}

const trailCards: [TrailCard, TrailCard, TrailCard, TrailCard] = [
  makeTrailCard(1), makeTrailCard(2), makeTrailCard(3), makeTrailCard(4),
];

describe('generateDeck with trailOptions', () => {
  it('includes 4 trail special cards when trailCards provided', () => {
    const deck = generateDeck(testMonster, zeroRng, [], 0, { trailCards });
    const trailIds = deck.filter((c) => c.id.startsWith('trail-special-'));
    expect(trailIds).toHaveLength(4);
  });

  it('standard deck without trailOptions has no trail card IDs', () => {
    const deck = generateDeck(testMonster, zeroRng);
    const trailIds = deck.filter((c) => c.id.startsWith('trail-special-'));
    expect(trailIds).toHaveLength(0);
  });

  it('trailCards are appended and all 4 are present', () => {
    const deck = generateDeck(testMonster, zeroRng, [], 0, { trailCards });
    const trailCount = deck.filter((c) => c.id.startsWith('trail-special-')).length;
    const standardCount = deck.filter((c) => !c.id.startsWith('trail-special-')).length;
    expect(trailCount).toBe(4);
    expect(standardCount).toBe(testMonster.deckSize);
  });
});
