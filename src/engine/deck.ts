import type { Monster, MonsterCard, TrailCard } from '../types';
import { shuffle } from './shuffle';
import { trailCardToMonsterCard } from './trail';

export interface TrailDeckOptions {
  /** The monster's 4 Trail special cards — appended to the final shuffled deck. */
  trailCards?: [TrailCard, TrailCard, TrailCard, TrailCard];
}

export function generateDeck(
  monster: Monster,
  rng?: () => number,
  genericCards: MonsterCard[] = [],
  bonusCount: number = 0,
  trailOptions?: TrailDeckOptions,
): MonsterCard[] {
  const size = monster.deckSize + bonusCount;
  const pool = [...monster.cardPool, ...genericCards];

  if (pool.length < size) {
    throw new Error(
      `Monster "${monster.id}" has ${pool.length} cards but needs ${size}`,
    );
  }

  const shuffledPool = shuffle(pool, rng);
  const selected = shuffledPool.slice(0, size);

  // Append trail special cards
  if (trailOptions?.trailCards) {
    const trailMonsterCards = trailOptions.trailCards.map(trailCardToMonsterCard);
    return shuffle([...selected, ...trailMonsterCards], rng);
  }

  return shuffle(selected, rng);
}
