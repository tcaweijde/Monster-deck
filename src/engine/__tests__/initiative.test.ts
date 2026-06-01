import { describe, it, expect } from 'vitest';
import { checkInitiative } from '../initiative';

describe('checkInitiative', () => {
  describe('return type', () => {
    it('should return a boolean', () => {
      const result = checkInitiative(() => 0.3);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('threshold boundary (rng < 0.5)', () => {
    it('should return true when rng returns a value strictly less than 0.5', () => {
      expect(checkInitiative(() => 0)).toBe(true);
      expect(checkInitiative(() => 0.1)).toBe(true);
      expect(checkInitiative(() => 0.499)).toBe(true);
      expect(checkInitiative(() => 0.4999999999)).toBe(true);
    });

    it('should return false when rng returns exactly 0.5', () => {
      // The check is strict: rng() < 0.5, so 0.5 is the monster player's turn
      expect(checkInitiative(() => 0.5)).toBe(false);
    });

    it('should return false when rng returns a value greater than 0.5', () => {
      expect(checkInitiative(() => 0.501)).toBe(false);
      expect(checkInitiative(() => 0.9)).toBe(false);
      expect(checkInitiative(() => 0.999)).toBe(false);
      expect(checkInitiative(() => 1)).toBe(false);
    });
  });

  describe('RNG injection', () => {
    it('should use the provided RNG rather than Math.random', () => {
      // Force true every call
      const alwaysLow = () => 0.1;
      expect(checkInitiative(alwaysLow)).toBe(true);

      // Force false every call
      const alwaysHigh = () => 0.9;
      expect(checkInitiative(alwaysHigh)).toBe(false);
    });

    it('should call the RNG exactly once per check', () => {
      let callCount = 0;
      checkInitiative(() => { callCount++; return 0.3; });
      expect(callCount).toBe(1);
    });

    it('should produce alternating results when RNG alternates', () => {
      const values = [0.1, 0.9, 0.2, 0.8];
      let index = 0;
      const alternating = () => values[index++];

      const results = values.map(() => checkInitiative(alternating));
      // Calls happen sequentially within the map — each checkInitiative consumes one value.
      // But index advances inside the closure, so results correspond to original values.
      expect(results).toEqual([true, false, true, false]);
    });
  });

  describe('default RNG', () => {
    it('should not throw when called without an explicit RNG (uses Math.random)', () => {
      expect(() => checkInitiative()).not.toThrow();
    });

    it('should return a boolean when called with the default RNG', () => {
      const result = checkInitiative();
      expect(result === true || result === false).toBe(true);
    });
  });

  describe('statistical distribution (smoke test)', () => {
    it('should produce roughly equal true/false counts over many calls with uniform RNG', () => {
      // Use a counter that cycles 0..99 / 100 to produce evenly-spaced values.
      let n = 0;
      const evenRng = () => (n++ % 100) / 100;

      let trueCount = 0;
      const ITERATIONS = 100;
      for (let i = 0; i < ITERATIONS; i++) {
        if (checkInitiative(evenRng)) trueCount++;
      }

      // Values 0/100..49/100 => true (50 calls), 50/100..99/100 => false (50 calls)
      expect(trueCount).toBe(50);
    });
  });
});
