import { render, screen, fireEvent } from '@testing-library/react';
import { HoundCombatModal } from '../HoundCombatModal';
import type { HoundSlot } from '../../../types/wildHunt';

const mockResolveHoundCombat = vi.fn();

vi.mock('../../../store/wildHuntStore', () => ({
  useWildHuntStore: (selector: (s: { resolveHoundCombat: typeof mockResolveHoundCombat }) => unknown) =>
    selector({ resolveHoundCombat: mockResolveHoundCombat }),
}));

vi.mock('../../../data/wildHunt/houndRewards', () => ({
  getRandomHoundReward: () => ({ id: 'test-r', description: 'Draw a card.' }),
}));

const hound: HoundSlot = { id: 'hound-1', level: 2 };
const noop = vi.fn();

describe('HoundCombatModal', () => {
  beforeEach(() => {
    mockResolveHoundCombat.mockReset();
    noop.mockClear();
  });

  it('renders the Hound Combat heading', () => {
    render(<HoundCombatModal hound={hound} onClose={noop} />);
    expect(screen.getByText('Hound Combat')).toBeInTheDocument();
  });

  it('shows hound level and defeat threshold', () => {
    render(<HoundCombatModal hound={hound} onClose={noop} />);
    expect(screen.getByText(/Level 2/)).toBeInTheDocument();
    expect(screen.getByText(/defeat at 3\+/)).toBeInTheDocument();
  });

  it('calls onClose when ✕ is clicked', () => {
    render(<HoundCombatModal hound={hound} onClose={noop} />);
    fireEvent.click(screen.getAllByRole('button').find(b => b.textContent === '✕')!);
    expect(noop).toHaveBeenCalledTimes(1);
  });

  it('advances to input phase when Declare Damage is clicked', () => {
    render(<HoundCombatModal hound={hound} onClose={noop} />);
    fireEvent.click(screen.getByText('Declare Damage'));
    expect(screen.getByText(/Total combo damage/i)).toBeInTheDocument();
  });

  it('shows Hound Defeated when resolved with enough damage', () => {
    mockResolveHoundCombat.mockReturnValue({ defeated: true, excessDamage: 0 });
    render(<HoundCombatModal hound={hound} onClose={noop} />);
    fireEvent.click(screen.getByText('Declare Damage'));
    // Bump damage to 3 (threshold for level 2)
    const plusBtn = screen.getAllByRole('button').find(b => b.textContent === '+')!;
    fireEvent.click(plusBtn); fireEvent.click(plusBtn); fireEvent.click(plusBtn);
    fireEvent.click(screen.getByText('Resolve'));
    expect(mockResolveHoundCombat).toHaveBeenCalledWith('hound-1', 3);
    expect(screen.getByText('Hound Defeated!')).toBeInTheDocument();
  });

  it('shows Hound Survives when resolved with insufficient damage', () => {
    mockResolveHoundCombat.mockReturnValue({ defeated: false, excessDamage: 0 });
    render(<HoundCombatModal hound={hound} onClose={noop} />);
    fireEvent.click(screen.getByText('Declare Damage'));
    fireEvent.click(screen.getByText('Resolve')); // damage=0 < threshold=3
    expect(screen.getByText('Hound Survives')).toBeInTheDocument();
  });

  it('shows excess shield loss when defeated with excess damage', () => {
    mockResolveHoundCombat.mockReturnValue({ defeated: true, excessDamage: 2 });
    render(<HoundCombatModal hound={hound} onClose={noop} />);
    fireEvent.click(screen.getByText('Declare Damage'));
    fireEvent.click(screen.getByText('Resolve'));
    const matches = screen.getAllByText((_, el) =>
      !!el?.textContent?.replace(/\s+/g, ' ').match(/Wild Hunt loses 2 shields/),
    );
    expect(matches.length).toBeGreaterThan(0);
  });

  it('shows reward after defeating the hound', () => {
    mockResolveHoundCombat.mockReturnValue({ defeated: true, excessDamage: 0 });
    render(<HoundCombatModal hound={hound} onClose={noop} />);
    fireEvent.click(screen.getByText('Declare Damage'));
    fireEvent.click(screen.getByText('Resolve'));
    expect(screen.getByText('Draw a card.')).toBeInTheDocument();
  });
});
