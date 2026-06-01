import { describe, it, expect } from 'vitest';
import { shuffle } from '../shuffle';

// Builds an RNG that exhausts a fixed sequence of values in order.
// Any call beyond the sequence throws so tests surface unexpected extra calls.
function seededRng(values: number[]): () => number {
  const queue = [...values];
  return () => {
    if (queue.length === 0) throw new Error('RNG exhausted – more calls than expected');
    return queue.shift()!;
  };
}

describe('shuffle', () => {
  describe('determinism', () => {
    it('should produce the same output for the same RNG sequence', () => {
      const input = [1, 2, 3, 4, 5];

      const result1 = shuffle(input, seededRng([0.1, 0.7, 0.3, 0.9]));
      const result2 = shuffle(input, seededRng([0.1, 0.7, 0.3, 0.9]));

      expect(result1).toEqual(result2);
    });

    it('should produce a known permutation for a given RNG sequence', () => {
      // Trace for [1,2,3,4,5] with values [0.1, 0.7, 0.3, 0.9]:
      //   i=4: j=floor(0.1*5)=0  -> swap index 4 and 0 -> [5,2,3,4,1]
      //   i=3: j=floor(0.7*4)=2  -> swap index 3 and 2 -> [5,2,4,3,1]
      //   i=2: j=floor(0.3*3)=0  -> swap index 2 and 0 -> [4,2,5,3,1]
      //   i=1: j=floor(0.9*2)=1  -> swap index 1 and 1 -> [4,2,5,3,1]
      const result = shuffle([1, 2, 3, 4, 5], seededRng([0.1, 0.7, 0.3, 0.9]));
      expect(result).toEqual([4, 2, 5, 3, 1]);
    });

    it('should produce a different result for a different RNG sequence', () => {
      const input = [1, 2, 3, 4, 5];
      const resultA = shuffle(input, seededRng([0.1, 0.7, 0.3, 0.9]));
      const resultB = shuffle(input, seededRng([0.9, 0.1, 0.8, 0.2]));
      expect(resultA).not.toEqual(resultB);
    });
  });

  describe('element preservation', () => {
    it('should contain exactly the same elements as the input', () => {
      const input = [10, 20, 30, 40, 50];
      const result = shuffle(input, seededRng([0.5, 0.9, 0.1, 0.6]));
      expect([...result].sort((a, b) => a - b)).toEqual([10, 20, 30, 40, 50]);
    });

    it('should not duplicate or drop any element', () => {
      const input = ['a', 'b', 'c', 'd'];
      const result = shuffle(input, seededRng([0.2, 0.8, 0.4]));
      expect(result).toHaveLength(input.length);
      for (const item of input) {
        expect(result).toContain(item);
      }
    });

    it('should handle an array of objects by reference, not by value', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 3 };
      const result = shuffle([obj1, obj2, obj3], seededRng([0.5, 0.9]));
      expect(result).toContain(obj1);
      expect(result).toContain(obj2);
      expect(result).toContain(obj3);
    });
  });

  describe('order change', () => {
    it('should change the order when the RNG causes swaps', () => {
      // With [0.5, 0.9] on [1,2,3]:
      //   i=2: j=floor(0.5*3)=1 -> swap index 2 and 1 -> [1,3,2]
      //   i=1: j=floor(0.9*2)=1 -> swap index 1 and 1 -> [1,3,2]
      const result = shuffle([1, 2, 3], seededRng([0.5, 0.9]));
      expect(result).not.toEqual([1, 2, 3]);
      expect(result).toEqual([1, 3, 2]);
    });

    it('should not mutate the original input array', () => {
      const input = [1, 2, 3, 4];
      const original = [...input];
      shuffle(input, seededRng([0.5, 0.9, 0.2]));
      expect(input).toEqual(original);
    });
  });

  describe('edge cases', () => {
    it('should return an empty array when given an empty array', () => {
      // No RNG calls needed for an empty array
      const result = shuffle([], () => 0);
      expect(result).toEqual([]);
    });

    it('should return the single element unchanged when given a one-element array', () => {
      // Fisher-Yates loop doesn't execute for length === 1 (i starts at 0, condition i > 0 is false)
      const result = shuffle(['solo'], () => { throw new Error('should not be called'); });
      expect(result).toEqual(['solo']);
    });

    it('should use Math.random by default (returns array of same length)', () => {
      const input = [1, 2, 3];
      const result = shuffle(input);
      expect(result).toHaveLength(3);
    });
  });

  describe('RNG call count', () => {
    it('should call rng exactly n-1 times for an array of length n', () => {
      let callCount = 0;
      const countingRng = () => { callCount++; return 0; };
      shuffle([1, 2, 3, 4, 5], countingRng);
      expect(callCount).toBe(4); // n-1 = 4
    });

    it('should make zero RNG calls for a single-element array', () => {
      let callCount = 0;
      shuffle(['x'], () => { callCount++; return 0; });
      expect(callCount).toBe(0);
    });
  });
});
