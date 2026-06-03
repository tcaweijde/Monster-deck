import { describe, it, expect } from 'vitest';
import { MONSTERS } from '../index';
import { GENERIC_CARD_POOL } from '../genericCardPool';

describe('all base-game monsters share the generic card pool', () => {
  for (const monster of MONSTERS) {
    it(`${monster.id} uses GENERIC_CARD_POOL by reference`, () => {
      expect(monster.cardPool).toBe(GENERIC_CARD_POOL);
    });
  }
});
