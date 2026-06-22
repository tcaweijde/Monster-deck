import { buildLegendaryFightDeck, lookupProtectionValue } from '../legendaryFightDeck';
import type { LegendaryMonster, TrophyProtectionTable } from '../../types';

// ─── Test Fixtures ────────────────────────────────────────────────────────────

/** Minimal monster with 6 cards (4 standard + 2 special) for fast test setup. */
function makeMonster(overrides: Partial<LegendaryMonster> = {}): LegendaryMonster {
  return {
    id: 'test-monster',
    name: 'Test Monster',
    level: 4,
    baseFightDeckSize: 6,
    fightDeck: [
      { id: 'std-01', top: { name: 'Charge', attack: 3 }, bottom: { name: 'Bite', attack: 2 } },
      { id: 'std-02', top: { name: 'Charge', attack: 4 }, bottom: { name: 'Bite', attack: 3 } },
      { id: 'std-03', top: { name: 'Charge', attack: 5 }, bottom: { name: 'Bite', attack: 4 } },
      { id: 'std-04', top: { name: 'Charge', attack: 6 }, bottom: { name: 'Bite', attack: 5 } },
      {
        id: 'sp-01',
        top: { name: 'Toxic Spores', attack: 8 },
        bottom: { name: 'Lash', attack: 7 },
        isSpecial: true,
        discardAbility: { name: 'Toxic Spores', description: 'Lose 1 life.', trigger: 'discard' },
      },
      {
        id: 'sp-02',
        top: { name: 'Root Lash', attack: 9 },
        bottom: { name: 'Entangle', attack: 8 },
        isSpecial: true,
        discardAbility: { name: 'Root Lash', description: 'Skip next action.', trigger: 'discard' },
      },
    ],
    passiveAbility: { name: 'Spore Cloud', description: 'Discard 1 card each encounter.', trigger: 'passive' },
    image: 'images/test/portrait.webp',
    artAssets: ['images/test/card-front-1.webp'],
    startingLocationName: 'Velen',
    ...overrides,
  };
}

const SIDE_A_TABLE: TrophyProtectionTable = {
  side: 'A',
  entries: [
    { minTrophies: 0, maxTrophies: 0, protectionValue: 3 },
    { minTrophies: 1, maxTrophies: 1, protectionValue: 2 },
    { minTrophies: 2, maxTrophies: 2, protectionValue: 1 },
    { minTrophies: 3, maxTrophies: null, protectionValue: 0 },
  ],
};

const SIDE_B_TABLE: TrophyProtectionTable = {
  side: 'B',
  entries: [
    { minTrophies: 0, maxTrophies: 0, protectionValue: 4 },
    { minTrophies: 1, maxTrophies: 1, protectionValue: 3 },
    { minTrophies: 2, maxTrophies: 2, protectionValue: 2 },
    { minTrophies: 3, maxTrophies: 3, protectionValue: 1 },
    { minTrophies: 4, maxTrophies: null, protectionValue: 0 },
  ],
};

const ALL_TABLES: TrophyProtectionTable[] = [SIDE_A_TABLE, SIDE_B_TABLE];

/** No-op rng that always returns 0 — preserves array order after Fisher-Yates. */
const zeroRng = (): number => 0;

// ─── buildLegendaryFightDeck ──────────────────────────────────────────────────

describe('buildLegendaryFightDeck', () => {
  it('returns a deck of the requested actualSize', () => {
    const monster = makeMonster();
    const deck = buildLegendaryFightDeck(monster, 4, zeroRng);
    expect(deck).toHaveLength(4);
  });

  it('returns all cards when actualSize equals baseFightDeckSize', () => {
    const monster = makeMonster();
    const deck = buildLegendaryFightDeck(monster, monster.baseFightDeckSize, zeroRng);
    expect(deck).toHaveLength(monster.baseFightDeckSize);
  });

  it('returns an empty array when actualSize is 0', () => {
    const monster = makeMonster();
    const deck = buildLegendaryFightDeck(monster, 0, zeroRng);
    expect(deck).toHaveLength(0);
  });

  it('clamps actualSize above baseFightDeckSize to baseFightDeckSize', () => {
    const monster = makeMonster();
    const deck = buildLegendaryFightDeck(monster, 999, zeroRng);
    expect(deck).toHaveLength(monster.baseFightDeckSize);
  });

  it('clamps negative actualSize to 0', () => {
    const monster = makeMonster();
    const deck = buildLegendaryFightDeck(monster, -5, zeroRng);
    expect(deck).toHaveLength(0);
  });

  it('removes cards from the front of fightDeck when actualSize < baseFightDeckSize', () => {
    const monster = makeMonster();
    // actualSize=4 → remove 2 from front → remaining starts at index 2
    const deck = buildLegendaryFightDeck(monster, 4, zeroRng);
    const deckIds = deck.map(c => c.id);
    // First two cards (std-01, std-02) must be excluded
    expect(deckIds).not.toContain('std-01');
    expect(deckIds).not.toContain('std-02');
    // Cards from index 2 onward must all be present
    expect(deckIds).toContain('std-03');
    expect(deckIds).toContain('std-04');
    expect(deckIds).toContain('sp-01');
    expect(deckIds).toContain('sp-02');
  });

  it('is deterministic with the same injected rng', () => {
    const monster = makeMonster();
    const makeSeqRng = () => {
      let i = 0;
      const vals = [0.1, 0.9, 0.4, 0.7, 0.2];
      return () => vals[i++ % vals.length];
    };

    const deck1 = buildLegendaryFightDeck(monster, 6, makeSeqRng());
    const deck2 = buildLegendaryFightDeck(monster, 6, makeSeqRng());

    expect(deck1.map(c => c.id)).toEqual(deck2.map(c => c.id));
  });

  it('does not mutate the monster fightDeck', () => {
    const monster = makeMonster();
    const originalIds = monster.fightDeck.map(c => c.id);
    buildLegendaryFightDeck(monster, 4, zeroRng);
    expect(monster.fightDeck.map(c => c.id)).toEqual(originalIds);
  });
});

// ─── lookupProtectionValue — Side A ──────────────────────────────────────────

describe('lookupProtectionValue — Side A', () => {
  it('returns 3 for 0 trophies', () => {
    expect(lookupProtectionValue(ALL_TABLES, 'A', 0)).toBe(3);
  });

  it('returns 2 for 1 trophy', () => {
    expect(lookupProtectionValue(ALL_TABLES, 'A', 1)).toBe(2);
  });

  it('returns 1 for 2 trophies', () => {
    expect(lookupProtectionValue(ALL_TABLES, 'A', 2)).toBe(1);
  });

  it('returns 0 for 3 trophies', () => {
    expect(lookupProtectionValue(ALL_TABLES, 'A', 3)).toBe(0);
  });

  it('returns 0 for 5 trophies (open-ended tier)', () => {
    expect(lookupProtectionValue(ALL_TABLES, 'A', 5)).toBe(0);
  });
});

// ─── lookupProtectionValue — Side B ──────────────────────────────────────────

describe('lookupProtectionValue — Side B', () => {
  it('returns 4 for 0 trophies', () => {
    expect(lookupProtectionValue(ALL_TABLES, 'B', 0)).toBe(4);
  });

  it('returns 3 for 1 trophy', () => {
    expect(lookupProtectionValue(ALL_TABLES, 'B', 1)).toBe(3);
  });

  it('returns 0 for 4 trophies (open-ended tier)', () => {
    expect(lookupProtectionValue(ALL_TABLES, 'B', 4)).toBe(0);
  });

  it('returns 0 for 10 trophies (open-ended tier)', () => {
    expect(lookupProtectionValue(ALL_TABLES, 'B', 10)).toBe(0);
  });
});

// ─── lookupProtectionValue — Fallback and Error ───────────────────────────────

describe('lookupProtectionValue — fallback and errors', () => {
  it('warns and falls back to last entry when no matching entry is found', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    // Table with a gap: entries only cover trophies 0–1, nothing for 5
    const gappedTable: TrophyProtectionTable = {
      side: 'A',
      entries: [
        { minTrophies: 0, maxTrophies: 0, protectionValue: 3 },
        { minTrophies: 1, maxTrophies: 1, protectionValue: 2 },
        // No open-ended entry — trophies >= 2 have no match
      ],
    };

    const result = lookupProtectionValue([gappedTable], 'A', 5);

    expect(warnSpy).toHaveBeenCalledOnce();
    expect(result).toBe(2); // last entry's protectionValue

    warnSpy.mockRestore();
  });

  it('throws when no table is found for the requested side', () => {
    expect(() => lookupProtectionValue([SIDE_A_TABLE], 'B', 0)).toThrowError(
      'Trophy protection table not found for side: B',
    );
  });
});
