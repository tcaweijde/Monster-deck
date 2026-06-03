import { describe, it, expect } from 'vitest';
import { getActiveAbilities, getDiscardAbilities, hasDiscardTrigger } from '../abilities';
import type { Monster, MonsterAbility } from '../../types';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const baseAbility: MonsterAbility = {
  name: 'Base Strike',
  description: 'Deals 2 damage.',
  trigger: 'passive',
};

const secondaryAbility: MonsterAbility = {
  name: 'Secondary Slash',
  description: 'Deals 1 extra damage on a hit.',
  trigger: 'passive',
};

const discardAbility: MonsterAbility = {
  name: 'Discard Rage',
  description: 'When cards are discarded, deal 1 damage.',
  trigger: 'discard',
};

function makeMonster(overrides: Partial<Monster> = {}): Monster {
  return {
    id: 'test',
    name: 'Test Monster',
    level: 1,
    deckSize: 5,
    baseAbility,
    cardPool: [],
    cardFrontImages: [],
    ...overrides,
  };
}

const monsterBaseOnly = makeMonster();
const monsterWithSecondary = makeMonster({ secondaryAbility });
const monsterWithDiscard = makeMonster({ discardAbility });
const monsterWithAll = makeMonster({ secondaryAbility, discardAbility });

// ---------------------------------------------------------------------------
// getActiveAbilities
// ---------------------------------------------------------------------------

describe('getActiveAbilities', () => {
  describe('monster with only a base ability', () => {
    it('should return an array containing only the base ability', () => {
      const abilities = getActiveAbilities(monsterBaseOnly);
      expect(abilities).toHaveLength(1);
      expect(abilities[0]).toBe(baseAbility);
    });

    it('should return the base ability as the first element', () => {
      const abilities = getActiveAbilities(monsterBaseOnly);
      expect(abilities[0].name).toBe('Base Strike');
    });
  });

  describe('monster with base and secondary ability', () => {
    it('should return both abilities', () => {
      const abilities = getActiveAbilities(monsterWithSecondary);
      expect(abilities).toHaveLength(2);
    });

    it('should list the base ability first', () => {
      const abilities = getActiveAbilities(monsterWithSecondary);
      expect(abilities[0]).toBe(baseAbility);
    });

    it('should list the secondary ability second', () => {
      const abilities = getActiveAbilities(monsterWithSecondary);
      expect(abilities[1]).toBe(secondaryAbility);
    });
  });

  describe('monster with discard ability but no secondary', () => {
    it('should not include the discard ability in active abilities', () => {
      const abilities = getActiveAbilities(monsterWithDiscard);
      expect(abilities).toHaveLength(1);
      expect(abilities.every((a) => a.trigger !== 'discard')).toBe(true);
    });
  });

  describe('monster with all abilities', () => {
    it('should return exactly two active abilities (base + secondary)', () => {
      const abilities = getActiveAbilities(monsterWithAll);
      expect(abilities).toHaveLength(2);
    });

    it('should not include the discard ability', () => {
      const abilities = getActiveAbilities(monsterWithAll);
      const names = abilities.map((a) => a.name);
      expect(names).not.toContain('Discard Rage');
    });
  });

  describe('return value integrity', () => {
    it('should return a new array each time (not the same reference)', () => {
      const first = getActiveAbilities(monsterWithSecondary);
      const second = getActiveAbilities(monsterWithSecondary);
      expect(first).not.toBe(second);
    });

    it('should preserve the original ability object references', () => {
      const abilities = getActiveAbilities(monsterWithSecondary);
      expect(abilities[0]).toBe(baseAbility);
      expect(abilities[1]).toBe(secondaryAbility);
    });
  });

  describe('real monster data', () => {
    it('should return one active ability for a monster with no secondary', async () => {
      // Werewolf has a secondary, foglet has a secondary — use a custom minimal monster.
      const minimalMonster = makeMonster({ id: 'minimal' });
      expect(getActiveAbilities(minimalMonster)).toHaveLength(1);
    });
  });
});

// ---------------------------------------------------------------------------
// getDiscardAbilities
// ---------------------------------------------------------------------------

describe('getDiscardAbilities', () => {
  describe('monster without a discard ability', () => {
    it('should return an empty array', () => {
      expect(getDiscardAbilities(monsterBaseOnly)).toEqual([]);
    });

    it('should return an empty array even when secondary is present', () => {
      expect(getDiscardAbilities(monsterWithSecondary)).toEqual([]);
    });
  });

  describe('monster with a discard ability', () => {
    it('should return an array containing the discard ability', () => {
      const abilities = getDiscardAbilities(monsterWithDiscard);
      expect(abilities).toHaveLength(1);
      expect(abilities[0]).toBe(discardAbility);
    });

    it('should return the discard ability even when base and secondary are also present', () => {
      const abilities = getDiscardAbilities(monsterWithAll);
      expect(abilities).toHaveLength(1);
      expect(abilities[0]).toBe(discardAbility);
    });

    it('should preserve the original discard ability object reference', () => {
      const abilities = getDiscardAbilities(monsterWithDiscard);
      expect(abilities[0]).toBe(discardAbility);
    });
  });

  describe('real monster data', () => {

    it('should return an empty array for the werewolf (no discard ability)', async () => {
      const { werewolf } = await import('../../data/monsters/werewolf');
      expect(getDiscardAbilities(werewolf)).toEqual([]);
    });

  });
});

// ---------------------------------------------------------------------------
// hasDiscardTrigger
// ---------------------------------------------------------------------------

describe('hasDiscardTrigger', () => {
  describe('monster without a discard ability', () => {
    it('should return false', () => {
      expect(hasDiscardTrigger(monsterBaseOnly)).toBe(false);
    });

    it('should return false even with a secondary ability', () => {
      expect(hasDiscardTrigger(monsterWithSecondary)).toBe(false);
    });
  });

  describe('monster with a discard ability', () => {
    it('should return true', () => {
      expect(hasDiscardTrigger(monsterWithDiscard)).toBe(true);
    });

    it('should return true even when all ability slots are filled', () => {
      expect(hasDiscardTrigger(monsterWithAll)).toBe(true);
    });
  });

  describe('return type', () => {
    it('should always return a boolean', () => {
      expect(typeof hasDiscardTrigger(monsterBaseOnly)).toBe('boolean');
      expect(typeof hasDiscardTrigger(monsterWithDiscard)).toBe('boolean');
    });
  });

  describe('consistency with getDiscardAbilities', () => {
    it('should return true exactly when getDiscardAbilities returns a non-empty array', () => {
      const monsters = [monsterBaseOnly, monsterWithSecondary, monsterWithDiscard, monsterWithAll];
      for (const monster of monsters) {
        const hasDiscard = hasDiscardTrigger(monster);
        const discardAbilities = getDiscardAbilities(monster);
        expect(hasDiscard).toBe(discardAbilities.length > 0);
      }
    });
  });

  describe('real monster data', () => {

    it('should return false for the werewolf', async () => {
      const { werewolf } = await import('../../data/monsters/werewolf');
      expect(hasDiscardTrigger(werewolf)).toBe(false);
    });
  });
});
