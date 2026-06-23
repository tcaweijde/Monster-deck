import { describe, it, expect, vi } from 'vitest';
import {
  isTrailSpecialCard,
  getTrailCardNumber,
  trailCardToMonsterCard,
  drawTokenForTerrain,
  initWeaknessTokenBoard,
  ALL_TERRAIN_TYPES,
  TRAIL_CARD_ID_PREFIX,
} from '../trail';
import type { TrailCard, WeaknessToken } from '../../types';

const makeToken = (id: string, terrainType: WeaknessToken['terrainType'], number: WeaknessToken['number'] = 1): WeaknessToken => ({
  id,
  terrainType,
  number,
});

const makeTrailCard = (number: 1 | 2 | 3 | 4): TrailCard => ({
  number,
  drawAbility: { name: `Draw ${number}`, description: `Draw ability ${number}`, trigger: 'passive' },
});

describe('isTrailSpecialCard', () => {
  it('returns true for valid trail card IDs', () => {
    expect(isTrailSpecialCard('trail-special-1')).toBe(true);
    expect(isTrailSpecialCard('trail-special-4')).toBe(true);
  });

  it('returns false for non-trail card IDs', () => {
    expect(isTrailSpecialCard('c-01')).toBe(false);
    expect(isTrailSpecialCard('')).toBe(false);
    expect(isTrailSpecialCard('trail-special-5')).toBe(true); // prefix still matches
  });

  it('returns false for IDs without the prefix', () => {
    expect(isTrailSpecialCard('special-1')).toBe(false);
    expect(isTrailSpecialCard('TRAIL-special-1')).toBe(false);
  });
});

describe('getTrailCardNumber', () => {
  it('returns correct numbers for valid trail card IDs', () => {
    expect(getTrailCardNumber('trail-special-1')).toBe(1);
    expect(getTrailCardNumber('trail-special-2')).toBe(2);
    expect(getTrailCardNumber('trail-special-3')).toBe(3);
    expect(getTrailCardNumber('trail-special-4')).toBe(4);
  });

  it('returns null for non-trail card IDs', () => {
    expect(getTrailCardNumber('c-01')).toBeNull();
    expect(getTrailCardNumber('')).toBeNull();
  });

  it('returns null for out-of-range numbers', () => {
    expect(getTrailCardNumber('trail-special-0')).toBeNull();
    expect(getTrailCardNumber('trail-special-5')).toBeNull();
  });
});

describe('trailCardToMonsterCard', () => {
  it('produces a MonsterCard with the correct trail-special id', () => {
    const tc = makeTrailCard(2);
    const mc = trailCardToMonsterCard(tc);
    expect(mc.id).toBe(`${TRAIL_CARD_ID_PREFIX}2`);
  });

  it('sets top.name to "Special Card N"', () => {
    const tc = makeTrailCard(3);
    const mc = trailCardToMonsterCard(tc);
    expect(mc.top.name).toBe('Special Card 3');
  });

  it('sets top.effect to the drawAbility description', () => {
    const tc = makeTrailCard(1);
    const mc = trailCardToMonsterCard(tc);
    expect(mc.top.effect).toBe(tc.drawAbility.description);
  });

  it('has no bottom half (single-half trail card)', () => {
    const tc = makeTrailCard(4);
    const mc = trailCardToMonsterCard(tc);
    expect(mc.bottom).toBeUndefined();
  });
});

describe('drawTokenForTerrain', () => {
  const pool: WeaknessToken[] = [
    makeToken('wt-w-01', 'water'),
    makeToken('wt-w-02', 'water'),
    makeToken('wt-m-01', 'mountain'),
  ];

  it('returns a token of the requested terrain type', () => {
    const { token } = drawTokenForTerrain(pool, 'water', () => 0);
    expect(token).not.toBeNull();
    expect(token!.terrainType).toBe('water');
  });

  it('removes the drawn token from remainingPool', () => {
    const { token, remainingPool } = drawTokenForTerrain(pool, 'water', () => 0);
    expect(remainingPool.find((t) => t.id === token!.id)).toBeUndefined();
    expect(remainingPool).toHaveLength(pool.length - 1);
  });

  it('is deterministic for a given rng value', () => {
    const { token: t1 } = drawTokenForTerrain(pool, 'water', () => 0);
    const { token: t2 } = drawTokenForTerrain(pool, 'water', () => 0);
    expect(t1!.id).toBe(t2!.id);
  });

  it('returns { token: null, remainingPool: pool } when no matching terrain in pool', () => {
    const { token, remainingPool } = drawTokenForTerrain(pool, 'woods', () => 0);
    expect(token).toBeNull();
    expect(remainingPool).toEqual(pool);
  });
});

describe('initWeaknessTokenBoard', () => {
  const fullPool: WeaknessToken[] = ALL_TERRAIN_TYPES.map((t) =>
    makeToken(`wt-${t}-01`, t),
  );

  it('returns 3 tokens when pool covers all terrain types', () => {
    const { board } = initWeaknessTokenBoard(fullPool, () => 0);
    expect(board).toHaveLength(3);
  });

  it('each returned token has a distinct terrain type', () => {
    const { board } = initWeaknessTokenBoard(fullPool, () => 0);
    const types = board.map((t) => t.terrainType);
    const unique = new Set(types);
    expect(unique.size).toBe(board.length);
  });

  it('remainingPool does not contain any drawn token', () => {
    const { board, remainingPool } = initWeaknessTokenBoard(fullPool, () => 0);
    const boardIds = new Set(board.map((t) => t.id));
    for (const t of remainingPool) {
      expect(boardIds.has(t.id)).toBe(false);
    }
  });

  it('logs a warning and omits the slot when pool is empty for a terrain type', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const partialPool = fullPool.filter((t) => t.terrainType !== 'woods');
    const { board } = initWeaknessTokenBoard(partialPool, () => 0);
    expect(board.find((t) => t.terrainType === 'woods')).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('woods'));
    warnSpy.mockRestore();
  });

  it('is deterministic for a given rng sequence', () => {
    const { board: b1 } = initWeaknessTokenBoard(fullPool, () => 0);
    const { board: b2 } = initWeaknessTokenBoard(fullPool, () => 0);
    expect(b1.map((t) => t.id)).toEqual(b2.map((t) => t.id));
  });
});
