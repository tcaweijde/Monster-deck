import { render, screen, fireEvent, act } from '@testing-library/react';
import { TrailDrawAlert } from '../TrailDrawAlert';
import type { MonsterAbility } from '../../../types';

const ability: MonsterAbility = {
  name: 'Fiery Roar',
  description: 'The monster deals 2 extra damage.',
  trigger: 'passive',
};

describe('TrailDrawAlert', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when triggered is false', () => {
    render(
      <TrailDrawAlert ability={ability} cardNumber={1} triggered={false} onDismiss={() => {}} />,
    );
    expect(screen.queryByText('Fiery Roar')).not.toBeInTheDocument();
  });

  it('shows card number, ability name and description when triggered', () => {
    render(
      <TrailDrawAlert ability={ability} cardNumber={2} triggered={true} onDismiss={() => {}} />,
    );
    act(() => vi.advanceTimersByTime(50));
    expect(screen.getByText('Fiery Roar')).toBeInTheDocument();
    expect(screen.getByText('The monster deals 2 extra damage.')).toBeInTheDocument();
    expect(screen.getByText(/Special Card #2/)).toBeInTheDocument();
  });

  it('auto-dismisses after 3 seconds and calls onDismiss', () => {
    const onDismiss = vi.fn();
    render(
      <TrailDrawAlert ability={ability} cardNumber={1} triggered={true} onDismiss={onDismiss} />,
    );
    act(() => vi.advanceTimersByTime(100));
    expect(screen.getByText('Fiery Roar')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(3000));
    expect(screen.queryByText('Fiery Roar')).not.toBeInTheDocument();
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('dismisses immediately on click and calls onDismiss', () => {
    const onDismiss = vi.fn();
    render(
      <TrailDrawAlert ability={ability} cardNumber={3} triggered={true} onDismiss={onDismiss} />,
    );
    act(() => vi.advanceTimersByTime(50));
    fireEvent.click(screen.getByText('Fiery Roar'));
    expect(screen.queryByText('Fiery Roar')).not.toBeInTheDocument();
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
