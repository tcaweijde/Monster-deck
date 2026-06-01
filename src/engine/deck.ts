import type { Monster, MonsterCard } from '../types';
import { shuffle } from './shuffle';

export function generateDeck(
  monster: Monster,
  rng?: () => number,
): MonsterCard[] {
  const size = monster.deckSize;
  const pool = monster.cardPool;

  if (pool.length < size) {
    throw new Error(
      `Monster "${monster.id}" has ${pool.length} cards but needs ${size}`,
    );
  }

  const shuffledPool = shuffle(pool, rng);
  const selected = shuffledPool.slice(0, size);
  return shuffle(selected, rng);
}
