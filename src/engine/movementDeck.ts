import { shuffle } from './shuffle';
import type { MovementCard } from '../types';

/**
 * Draws the next movement card from the remaining deck.
 *
 * If the remaining deck is empty, the drawn pile is reshuffled to form a new
 * remaining deck and a card is drawn from it. The drawn pile then starts fresh
 * with only that newly drawn card.
 *
 * @param remaining - IDs of movement cards not yet drawn (index 0 = top).
 * @param drawn     - IDs of movement cards already drawn in this shuffle cycle.
 * @param allCards  - The complete movement card definitions to look up by id.
 * @param rng       - Optional random number generator (injectable for tests).
 * @returns The drawn card plus updated remaining and drawn arrays.
 * @throws If the card id resolved from the deck is not found in allCards.
 */
export function drawMovementCard(
  remaining: string[],
  drawn: string[],
  allCards: MovementCard[],
  rng: () => number = Math.random,
): {
  card: MovementCard;
  newRemaining: string[];
  newDrawn: string[];
} {
  if (remaining.length === 0) {
    const shuffled = shuffle([...drawn], rng);
    const drawnId = shuffled[0];
    const newRemaining = shuffled.slice(1);
    const newDrawn = [drawnId];
    const card = allCards.find(c => c.id === drawnId);
    if (card === undefined) {
      throw new Error(`Movement card not found: ${drawnId}`);
    }
    return { card, newRemaining, newDrawn };
  }

  const drawnId = remaining[0];
  const newRemaining = remaining.slice(1);
  const newDrawn = [...drawn, drawnId];
  const card = allCards.find(c => c.id === drawnId);
  if (card === undefined) {
    throw new Error(`Movement card not found: ${drawnId}`);
  }
  return { card, newRemaining, newDrawn };
}
