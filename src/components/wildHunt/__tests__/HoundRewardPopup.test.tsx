import { render, screen, fireEvent } from '@testing-library/react';
import { HoundRewardPopup } from '../HoundRewardPopup';
import type { HoundReward } from '../../../data/wildHunt/houndRewards';

const reward: HoundReward = {
  id: 'test-reward',
  description: 'Draw a card from your deck',
};

describe('HoundRewardPopup', () => {
  it('renders the reward description', () => {
    render(<HoundRewardPopup reward={reward} houndLevel={1} onClose={() => {}} />);
    expect(screen.getByText('Draw a card from your deck')).toBeInTheDocument();
  });

  it('renders the hound level', () => {
    render(<HoundRewardPopup reward={reward} houndLevel={2} onClose={() => {}} />);
    expect(screen.getByText(/Level 2 Hound/)).toBeInTheDocument();
  });

  it('calls onClose when the button is clicked', () => {
    const onClose = vi.fn();
    render(<HoundRewardPopup reward={reward} houndLevel={1} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /back to gameboard/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows the reward earned header', () => {
    render(<HoundRewardPopup reward={reward} houndLevel={3} onClose={() => {}} />);
    expect(screen.getByText('Reward Earned!')).toBeInTheDocument();
  });
});
