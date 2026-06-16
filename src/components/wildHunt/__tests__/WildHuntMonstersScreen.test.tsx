import { render, screen, fireEvent } from '@testing-library/react';
import { WildHuntMonstersScreen } from '../WildHuntMonstersScreen';
import type { WildHuntBoardSlot } from '../../../types/wildHunt';

const mockSetActiveWildHuntSlot = vi.fn();
const mockSetShowMonsters       = vi.fn();
const mockSetShowProximitySetup = vi.fn();
const mockGainShields           = vi.fn();
const mockAbsorbDamage          = vi.fn(() => 0);

const activeSlot: WildHuntBoardSlot = {
  monsterId: 'griffin', level: 2, locationType: 'mountain', locationId: 2, status: 'active',
};
const emptySlot: WildHuntBoardSlot = {
  monsterId: null, level: null, locationType: null, locationId: null, status: 'empty',
};

let mockWHState = {
  wildHuntSlots: [activeSlot, emptySlot, emptySlot] as [WildHuntBoardSlot, WildHuntBoardSlot, WildHuntBoardSlot],
  shieldCount: 5,
  gainShields: mockGainShields,
  absorbDamage: mockAbsorbDamage,
  setActiveWildHuntSlot: mockSetActiveWildHuntSlot,
  setShowMonsters: mockSetShowMonsters,
  setShowProximitySetup: mockSetShowProximitySetup,
};

vi.mock('../../../store/wildHuntStore', () => ({
  useWildHuntStore: (selector: (s: typeof mockWHState) => unknown) =>
    selector(mockWHState),
}));

vi.mock('../../../data/monsters', () => ({
  MONSTERS: [
    { id: 'griffin', name: 'Griffin', level: 2, deckSize: 10, cardPool: [], cardFrontImages: [], baseAbility: { name: 'Dive', description: '', trigger: 'passive' } },
  ],
}));

describe('WildHuntMonstersScreen', () => {
  beforeEach(() => {
    mockWHState.wildHuntSlots = [activeSlot, emptySlot, emptySlot];
    [mockSetActiveWildHuntSlot, mockSetShowMonsters, mockSetShowProximitySetup].forEach(m => m.mockClear());
  });

  it('renders the Board heading', () => {
    render(<WildHuntMonstersScreen />);
    expect(screen.getByText('Board')).toBeInTheDocument();
  });

  it('renders the active monster name', () => {
    render(<WildHuntMonstersScreen />);
    expect(screen.getByText('Griffin')).toBeInTheDocument();
  });

  it('renders empty slots with placeholder text', () => {
    render(<WildHuntMonstersScreen />);
    expect(screen.getAllByText('Empty slot')).toHaveLength(2);
  });

  it('calls setShowMonsters(false) when ← Back to Run is clicked', () => {
    render(<WildHuntMonstersScreen />);
    fireEvent.click(screen.getByText('← Back to Run'));
    expect(mockSetShowMonsters).toHaveBeenCalledWith(false);
  });

  it('calls setActiveWildHuntSlot and setShowProximitySetup when active slot is tapped', () => {
    render(<WildHuntMonstersScreen />);
    // Griffin button is the first non-disabled slot button
    const buttons = screen.getAllByRole('button');
    const griffinBtn = buttons.find(b => b.textContent?.includes('Griffin'))!;
    fireEvent.click(griffinBtn);
    expect(mockSetActiveWildHuntSlot).toHaveBeenCalledWith(0);
    expect(mockSetShowProximitySetup).toHaveBeenCalledWith(true);
  });
});
