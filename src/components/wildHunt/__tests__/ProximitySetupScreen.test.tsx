import { render, screen, fireEvent } from '@testing-library/react';
import { ProximitySetupScreen } from '../ProximitySetupScreen';
import type { WildHuntBoardSlot } from '../../../types/wildHunt';

const mockClearActiveWildHuntSlot = vi.fn();
const mockSetShowProximitySetup   = vi.fn();
const mockStartEncounter          = vi.fn();

const activeSlot: WildHuntBoardSlot = {
  monsterId: 'griffin', level: 2, locationType: 'mountain', locationId: 2, status: 'active',
};
const emptySlot: WildHuntBoardSlot = {
  monsterId: null, level: null, locationType: null, locationId: null, status: 'empty',
};

const mockWHState = {
  wildHuntSlots: [activeSlot, emptySlot, emptySlot] as [WildHuntBoardSlot, WildHuntBoardSlot, WildHuntBoardSlot],
  activeWildHuntSlotIndex: 0 as 0 | 1 | 2 | null,
  clearActiveWildHuntSlot: mockClearActiveWildHuntSlot,
  setShowProximitySetup: mockSetShowProximitySetup,
};

vi.mock('../../../store/wildHuntStore', () => ({
  useWildHuntStore: (selector: (s: typeof mockWHState) => unknown) =>
    selector(mockWHState),
}));

vi.mock('../../../store/encounterStore', () => ({
  useEncounterStore: (selector: (s: { startEncounter: typeof mockStartEncounter }) => unknown) =>
    selector({ startEncounter: mockStartEncounter }),
}));

vi.mock('../../../data/monsters', () => ({
  MONSTERS: [
    { id: 'griffin', name: 'Griffin', level: 2, deckSize: 10, cardPool: [], cardFrontImages: [], baseAbility: { name: 'Dive', description: '', trigger: 'passive' } },
  ],
}));

describe('ProximitySetupScreen', () => {
  beforeEach(() => {
    mockWHState.wildHuntSlots = [activeSlot, emptySlot, emptySlot];
    mockWHState.activeWildHuntSlotIndex = 0;
    [mockClearActiveWildHuntSlot, mockSetShowProximitySetup, mockStartEncounter].forEach(m => m.mockClear());
  });

  it('renders null when activeWildHuntSlotIndex is null', () => {
    mockWHState.activeWildHuntSlotIndex = null;
    const { container } = render(<ProximitySetupScreen />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the monster name and level', () => {
    render(<ProximitySetupScreen />);
    expect(screen.getByText('Griffin')).toBeInTheDocument();
    expect(screen.getByText(/Lv\.2/i)).toBeInTheDocument();
  });

  it('calls clearActiveWildHuntSlot and setShowProximitySetup(false) on Back', () => {
    render(<ProximitySetupScreen />);
    fireEvent.click(screen.getByText('← Back'));
    expect(mockClearActiveWildHuntSlot).toHaveBeenCalledTimes(1);
    expect(mockSetShowProximitySetup).toHaveBeenCalledWith(false);
  });

  it('calls startEncounter with monsterId when Start Encounter is clicked', () => {
    render(<ProximitySetupScreen />);
    fireEvent.click(screen.getByText('Start Encounter'));
    expect(mockStartEncounter).toHaveBeenCalledWith('griffin', false, 0);
  });

  it('includes Wild Hunt proximity bonus when toggled on', () => {
    render(<ProximitySetupScreen />);
    fireEvent.click(screen.getByText('Yes (+1 card)'));
    fireEvent.click(screen.getByText('Start Encounter'));
    expect(mockStartEncounter).toHaveBeenCalledWith('griffin', false, 1);
  });

  it('passes playerFirst=true when Monster Trail is selected', () => {
    render(<ProximitySetupScreen />);
    fireEvent.click(screen.getByText('Yes (you go first)'));
    fireEvent.click(screen.getByText('Start Encounter'));
    expect(mockStartEncounter).toHaveBeenCalledWith('griffin', true, 0);
  });

  it('shows bonus card summary when bonusCount > 0', () => {
    render(<ProximitySetupScreen />);
    fireEvent.click(screen.getByText('Yes (+1 card)'));
    expect(screen.getByText(/1 bonus card/i)).toBeInTheDocument();
  });

  it('uses a scrollable content container for smaller screens', () => {
    const { container } = render(<ProximitySetupScreen />);
    expect(container.querySelector('.overflow-y-auto')).toBeInTheDocument();
  });
});
