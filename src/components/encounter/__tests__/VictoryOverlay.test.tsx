import { render, screen, fireEvent } from '@testing-library/react';
import { VictoryOverlay } from '../VictoryOverlay';

describe('VictoryOverlay', () => {
  it('renders the victory heading and monster name', () => {
    render(<VictoryOverlay monsterName="Werewolf" onClose={() => {}} />);
    expect(screen.getByText('Victory!')).toBeInTheDocument();
    expect(screen.getByText('Werewolf defeated')).toBeInTheDocument();
  });

  it('calls onClose when the button is clicked', () => {
    const onClose = vi.fn();
    render(<VictoryOverlay monsterName="Werewolf" onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /return to board/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not show shield loss when wildHuntShieldLoss is not provided', () => {
    render(<VictoryOverlay monsterName="Werewolf" onClose={() => {}} />);
    expect(screen.queryByText(/shield/i)).not.toBeInTheDocument();
  });

  it('shows correct shield loss message with plural shields', () => {
    render(<VictoryOverlay monsterName="Griffin" wildHuntShieldLoss={2} onClose={() => {}} />);
    expect(screen.getByText(/Wild Hunt loses 2 shields/)).toBeInTheDocument();
  });

  it('shows singular "shield" when wildHuntShieldLoss is 1', () => {
    render(<VictoryOverlay monsterName="Foglet" wildHuntShieldLoss={1} onClose={() => {}} />);
    expect(screen.getByText(/Wild Hunt loses 1 shield[^s]/)).toBeInTheDocument();
  });
});
