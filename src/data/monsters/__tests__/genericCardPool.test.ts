import { describe, it, expect } from 'vitest';
import { GENERIC_CARD_POOL } from '../genericCardPool';

const MAX_BASE_GAME_DECK_SIZE = 19; // leshen / troll

describe('GENERIC_CARD_POOL', () => {
  it('has at least MAX_BASE_GAME_DECK_SIZE cards', () => {
    expect(GENERIC_CARD_POOL.length).toBeGreaterThanOrEqual(MAX_BASE_GAME_DECK_SIZE);
  });

  it('has unique card IDs', () => {
    const ids = GENERIC_CARD_POOL.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every top half has name "Charge"', () => {
    for (const card of GENERIC_CARD_POOL) {
      expect(card.top.name).toBe('Charge');
    }
  });

  it('every bottom half has name "Bite"', () => {
    for (const card of GENERIC_CARD_POOL) {
      expect(card.bottom.name).toBe('Bite');
    }
  });

  it('every half has a non-negative integer attack value when present', () => {
    for (const card of GENERIC_CARD_POOL) {
      if (card.top.attack !== undefined) {
        expect(card.top.attack).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(card.top.attack)).toBe(true);
      }
      if (card.bottom.attack !== undefined) {
        expect(card.bottom.attack).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(card.bottom.attack)).toBe(true);
      }
    }
  });

  it('every half has attack or effect (never empty)', () => {
    for (const card of GENERIC_CARD_POOL) {
      expect(card.top.attack !== undefined || card.top.effect !== undefined).toBe(true);
      expect(card.bottom.attack !== undefined || card.bottom.effect !== undefined).toBe(true);
    }
  });

  it('every half has a non-empty name', () => {
    for (const card of GENERIC_CARD_POOL) {
      expect(card.top.name.length).toBeGreaterThan(0);
      expect(card.bottom.name.length).toBeGreaterThan(0);
    }
  });

  it('effect is a non-empty string when present (never empty string)', () => {
    for (const card of GENERIC_CARD_POOL) {
      if (card.top.effect !== undefined)    expect(card.top.effect.length).toBeGreaterThan(0);
      if (card.bottom.effect !== undefined) expect(card.bottom.effect.length).toBeGreaterThan(0);
    }
  });
});
