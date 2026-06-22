import { drawMovementCard } from '../movementDeck';
import type { MovementCard } from '../../types';

// ─── Test Fixtures ────────────────────────────────────────────────────────────

const CARDS: MovementCard[] = [
  { id: 'mv-01', targetLocation1Name: 'Oxenfurt', targetLocation2Name: 'Novigrad', movementDistanceSolo: 2 },
  { id: 'mv-02', targetLocation1Name: 'Novigrad', targetLocation2Name: 'Velen', movementDistanceSolo: 2 },
  { id: 'mv-03', targetLocation1Name: 'Velen', targetLocation2Name: 'Kaer Morhen', movementDistanceSolo: 2 },
];

/** Deterministic rng that always returns 0 (no-op shuffle — preserves order). */
const zeroRng = (): number => 0;

/** Seeded counter rng: cycles through a fixed sequence of values. */
function makeSequenceRng(values: number[]): () => number {
  let index = 0;
  return () => values[index++ % values.length];
}

// ─── Normal Draw ──────────────────────────────────────────────────────────────

describe('drawMovementCard — normal draw', () => {
  it('pops the first id from remaining', () => {
    const remaining = ['mv-01', 'mv-02', 'mv-03'];
    const drawn: string[] = [];

    const { card, newRemaining } = drawMovementCard(remaining, drawn, CARDS, zeroRng);

    expect(card.id).toBe('mv-01');
    expect(newRemaining).toEqual(['mv-02', 'mv-03']);
  });

  it('appends the drawn id to drawn', () => {
    const remaining = ['mv-02', 'mv-03'];
    const drawn = ['mv-01'];

    const { newDrawn } = drawMovementCard(remaining, drawn, CARDS, zeroRng);

    expect(newDrawn).toEqual(['mv-01', 'mv-02']);
  });

  it('returns the correct card object matching the drawn id', () => {
    const remaining = ['mv-03'];
    const drawn = ['mv-01', 'mv-02'];

    const { card } = drawMovementCard(remaining, drawn, CARDS, zeroRng);

    expect(card).toEqual(CARDS[2]);
  });

  it('does not mutate the original remaining or drawn arrays', () => {
    const remaining = ['mv-01', 'mv-02'];
    const drawn = ['mv-03'];
    const remainingCopy = [...remaining];
    const drawnCopy = [...drawn];

    drawMovementCard(remaining, drawn, CARDS, zeroRng);

    expect(remaining).toEqual(remainingCopy);
    expect(drawn).toEqual(drawnCopy);
  });
});

// ─── Reshuffle on Empty Remaining ─────────────────────────────────────────────

describe('drawMovementCard — reshuffle when remaining is empty', () => {
  it('reshuffles the drawn pile and draws from the new deck', () => {
    const remaining: string[] = [];
    const drawn = ['mv-01', 'mv-02', 'mv-03'];

    const { card, newRemaining, newDrawn } = drawMovementCard(remaining, drawn, CARDS, zeroRng);

    // With zeroRng the Fisher-Yates swap always picks index 0, leaving order unchanged.
    // After shuffle(['mv-01','mv-02','mv-03'], zeroRng) the first element is drawn.
    expect(card).toBeDefined();
    expect(newDrawn).toHaveLength(1);
    expect(newRemaining).toHaveLength(drawn.length - 1);
    // newDrawn[0] must exist in CARDS
    expect(CARDS.some(c => c.id === newDrawn[0])).toBe(true);
  });

  it('the new drawn array contains only the single freshly drawn card', () => {
    const remaining: string[] = [];
    const drawn = ['mv-01', 'mv-02', 'mv-03'];

    const { newDrawn } = drawMovementCard(remaining, drawn, CARDS, zeroRng);

    expect(newDrawn).toHaveLength(1);
  });

  it('the new remaining array contains exactly drawn.length - 1 cards', () => {
    const remaining: string[] = [];
    const drawn = ['mv-01', 'mv-02', 'mv-03'];

    const { newRemaining } = drawMovementCard(remaining, drawn, CARDS, zeroRng);

    expect(newRemaining).toHaveLength(2);
  });
});

// ─── Determinism with Seeded RNG ──────────────────────────────────────────────

describe('drawMovementCard — deterministic with seeded rng', () => {
  it('produces the same result for the same seed when reshuffling', () => {
    const remaining: string[] = [];
    const drawn = ['mv-01', 'mv-02', 'mv-03'];

    const seededRng = makeSequenceRng([0.1, 0.9, 0.5]);
    const result1 = drawMovementCard(remaining, drawn, CARDS, seededRng);

    const seededRng2 = makeSequenceRng([0.1, 0.9, 0.5]);
    const result2 = drawMovementCard(remaining, drawn, CARDS, seededRng2);

    expect(result1.card.id).toBe(result2.card.id);
    expect(result1.newRemaining).toEqual(result2.newRemaining);
    expect(result1.newDrawn).toEqual(result2.newDrawn);
  });

  it('produces different results for different seeds', () => {
    const remaining: string[] = [];
    const drawn = ['mv-01', 'mv-02', 'mv-03'];

    // zeroRng keeps order; oneRng reverses order via Fisher-Yates max-swap
    const oneRng = (): number => 0.9999;
    const result1 = drawMovementCard(remaining, drawn, CARDS, zeroRng);
    const result2 = drawMovementCard(remaining, drawn, CARDS, oneRng);

    // At least the remaining arrays should differ when shuffled differently
    expect(result1.newRemaining).not.toEqual(result2.newRemaining);
  });
});

// ─── Error Handling ───────────────────────────────────────────────────────────

describe('drawMovementCard — error handling', () => {
  it('throws when a card id in remaining is not found in allCards', () => {
    const remaining = ['unknown-id'];
    const drawn: string[] = [];

    expect(() => drawMovementCard(remaining, drawn, CARDS, zeroRng)).toThrowError(
      'Movement card not found: unknown-id',
    );
  });

  it('throws when a card id from reshuffled drawn is not found in allCards', () => {
    const remaining: string[] = [];
    const drawn = ['ghost-id'];

    expect(() => drawMovementCard(remaining, drawn, CARDS, zeroRng)).toThrowError(
      'Movement card not found: ghost-id',
    );
  });
});
