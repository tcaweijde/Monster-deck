import type { Monster, MonsterCard, MonsterLevel } from '../types';
import { shuffle } from './shuffle';

export function generateDeck(
  monster: Monster,
  level: MonsterLevel,
  rng?: () => number,
): MonsterCard[] {
  const size = monster.deckSizes[level];
  const pool = monster.cardPool;

  if (pool.length < size) {
    throw new Error(
      `Monster "${monster.id}" has ${pool.length} cards but level ${level} requires ${size}`,
    );
  }

  const shuffledPool = shuffle(pool, rng);
  const selected = shuffledPool.slice(0, size);
  return shuffle(selected, rng);
}
