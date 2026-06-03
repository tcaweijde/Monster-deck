import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MonsterCardDisplay } from '../MonsterCardDisplay';
import type { RevealedCard } from '../../../types';

function makeRevealedCard(
  name: string,
  source: 'top' | 'bottom',
  effect?: string,
): RevealedCard {
  return {
    cardId: 'generic-01',
    source,
    chosenHalf: { name, attack: 3, ...(effect ? { effect } : {}) },
  };
}

const noop = () => {};
const baseProps = {
  deckEmpty: false,
  turn: 'player' as const,
  cardFrontImages: [],
  onFlip: noop,
  onSwipeDamage: noop,
  onPass: noop,
};

describe('MonsterCardDisplay — revealed half name', () => {
  it('shows "Charge" when the top half is resolved', () => {
    render(
      <MonsterCardDisplay
        {...baseProps}
        currentCard={makeRevealedCard('Charge', 'top')}
      />,
    );
    expect(screen.getByText('Charge')).toBeInTheDocument();
  });

  it('shows "Bite" when the bottom half is resolved', () => {
    render(
      <MonsterCardDisplay
        {...baseProps}
        currentCard={makeRevealedCard('Bite', 'bottom')}
      />,
    );
    expect(screen.getByText('Bite')).toBeInTheDocument();
  });

  it('shows effect text when the half has an effect', () => {
    render(
      <MonsterCardDisplay
        {...baseProps}
        currentCard={makeRevealedCard('Charge', 'top', 'Shield 1')}
      />,
    );
    expect(screen.getByText('Shield 1')).toBeInTheDocument();
  });

  it('does not render an effect element when effect is absent', () => {
    render(
      <MonsterCardDisplay
        {...baseProps}
        currentCard={makeRevealedCard('Bite', 'bottom')}
      />,
    );
    expect(screen.queryByText(/shield|bleed/i)).not.toBeInTheDocument();
  });
});
