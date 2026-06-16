import { render, screen, fireEvent } from '@testing-library/react';
import { SetupScreen } from '../SetupScreen';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockStartEncounter = vi.fn();

vi.mock('../../../store/encounterStore', () => ({
  useEncounterStore: (selector: (s: { startEncounter: typeof mockStartEncounter }) => unknown) =>
    selector({ startEncounter: mockStartEncounter }),
}));

vi.mock('../../../data/monsters', () => ({
  MONSTERS: [
    { id: 'griffin',  name: 'Griffin',  level: 2, deckSize: 10, cardPool: [], cardFrontImages: [], baseAbility: { name: 'Dive', description: '', trigger: 'passive' } },
    { id: 'werewolf', name: 'Werewolf', level: 1, deckSize: 8,  cardPool: [], cardFrontImages: [], baseAbility: { name: 'Rend', description: '', trigger: 'passive' } },
  ],
}));

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('SetupScreen', () => {
  beforeEach(() => {
    mockStartEncounter.mockClear();
  });

  it('renders the app title', () => {
    render(<SetupScreen />);
    expect(screen.getByText('Monster Deck')).toBeInTheDocument();
  });

  it('renders the monster picker', () => {
    render(<SetupScreen />);
    expect(screen.getByText('Griffin')).toBeInTheDocument();
    expect(screen.getByText('Werewolf')).toBeInTheDocument();
  });

  it('does not show Start Encounter before a monster is selected', () => {
    render(<SetupScreen />);
    expect(screen.queryByText('Start Encounter')).not.toBeInTheDocument();
  });

  it('shows Start Encounter after selecting a monster', () => {
    render(<SetupScreen />);
    fireEvent.click(screen.getByText('Griffin'));
    expect(screen.getByText('Start Encounter')).toBeInTheDocument();
  });

  it('calls startEncounter with the selected monster id', () => {
    render(<SetupScreen />);
    fireEvent.click(screen.getByText('Griffin'));
    fireEvent.click(screen.getByText('Start Encounter'));
    expect(mockStartEncounter).toHaveBeenCalledWith('griffin', false);
  });

  it('shows Trail token toggle after monster selection', () => {
    render(<SetupScreen />);
    fireEvent.click(screen.getByText('Griffin'));
    expect(screen.getByText('Trail token')).toBeInTheDocument();
  });

  it('toggles playerHasTrail and calls startEncounter with true', () => {
    render(<SetupScreen />);
    fireEvent.click(screen.getByText('Griffin'));
    fireEvent.click(screen.getByText('Trail token'));
    fireEvent.click(screen.getByText('Start Encounter'));
    expect(mockStartEncounter).toHaveBeenCalledWith('griffin', true);
  });
});
