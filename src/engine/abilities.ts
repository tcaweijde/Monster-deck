import type { Monster, MonsterAbility } from '../types';

export function getActiveAbilities(monster: Monster): MonsterAbility[] {
  const abilities: MonsterAbility[] = [monster.baseAbility];
  if (monster.secondaryAbility) {
    abilities.push(monster.secondaryAbility);
  }
  return abilities;
}

export function getDiscardAbilities(monster: Monster): MonsterAbility[] {
  return monster.discardAbility ? [monster.discardAbility] : [];
}

export function hasDiscardTrigger(monster: Monster): boolean {
  return !!monster.discardAbility;
}
