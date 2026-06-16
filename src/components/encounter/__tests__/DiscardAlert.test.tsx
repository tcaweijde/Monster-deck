import { render, screen, fireEvent, act } from '@testing-library/react';
import { DiscardAlert } from '../DiscardAlert';
import type { MonsterAbility } from '../../../types';

const ability: MonsterAbility = {
  name: 'Poison Claw',
  description: 'The player loses 1 HP.',
  trigger: 'discard',
};

describe('DiscardAlert', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when triggered is false', () => {
    render(<DiscardAlert ability={ability} triggered={false} />);
    expect(screen.queryByText('Poison Claw')).not.toBeInTheDocument();
  });

  it('shows ability name and description when triggered becomes true', () => {
    render(<DiscardAlert ability={ability} triggered={true} />);
    act(() => vi.advanceTimersByTime(50));
    expect(screen.getByText('Poison Claw')).toBeInTheDocument();
    expect(screen.getByText('The player loses 1 HP.')).toBeInTheDocument();
  });

  it('auto-dismisses after 3 seconds', () => {
    render(<DiscardAlert ability={ability} triggered={true} />);
    act(() => vi.advanceTimersByTime(100));
    expect(screen.getByText('Poison Claw')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(3000));
    expect(screen.queryByText('Poison Claw')).not.toBeInTheDocument();
  });

  it('dismisses immediately on click', () => {
    render(<DiscardAlert ability={ability} triggered={true} />);
    act(() => vi.advanceTimersByTime(50));
    fireEvent.click(screen.getByText('Poison Claw'));
    expect(screen.queryByText('Poison Claw')).not.toBeInTheDocument();
  });

  it('re-triggers when triggered flips false then true again', () => {
    const { rerender } = render(<DiscardAlert ability={ability} triggered={false} />);
    rerender(<DiscardAlert ability={ability} triggered={true} />);
    act(() => vi.advanceTimersByTime(50));
    expect(screen.getByText('Poison Claw')).toBeInTheDocument();
  });
});
