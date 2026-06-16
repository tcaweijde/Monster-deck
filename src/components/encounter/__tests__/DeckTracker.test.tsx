import { render, screen } from '@testing-library/react';
import { DeckTracker } from '../DeckTracker';

describe('DeckTracker', () => {
  it('displays the remaining deck size', () => {
    render(<DeckTracker deckSize={8} discardSize={2} />);
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText(/remaining/i)).toBeInTheDocument();
  });

  it('displays the discard pile size', () => {
    render(<DeckTracker deckSize={8} discardSize={2} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(/discarded/i)).toBeInTheDocument();
  });

  it('shows zero values correctly', () => {
    render(<DeckTracker deckSize={0} discardSize={10} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});
