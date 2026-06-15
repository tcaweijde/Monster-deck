import type { MonsterCard, RevealedCard } from '../types';

export function flipCard(
  deck: MonsterCard[],
  rng: () => number = Math.random,
): { revealed: RevealedCard; remainingDeck: MonsterCard[] } | null {
  if (deck.length === 0) return null;

  const [card, ...remainingDeck] = deck;
  const source = rng() < 0.5 || !card.bottom ? 'top' : 'bottom';
  const revealed: RevealedCard = {
    cardId: card.id,
    chosenHalf: card[source]!,
    source,
  };

  return { revealed, remainingDeck };
}

export function applyDamage(
  deck: MonsterCard[],
  damage: number,
): { discardedCards: MonsterCard[]; remainingDeck: MonsterCard[] } {
  const count = Math.min(damage, deck.length);
  return {
    discardedCards: deck.slice(0, count),
    remainingDeck: deck.slice(count),
  };
}
