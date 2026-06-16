import { render, screen, fireEvent } from '@testing-library/react';
import { WildHuntVictoryScreen } from '../WildHuntVictoryScreen';

const mockResetWildHunt = vi.fn();

let mockWHState = {
  characterId: null as string | null,
  resetWildHunt: mockResetWildHunt,
};

vi.mock('../../../store/wildHuntStore', () => ({
  useWildHuntStore: (selector: (s: typeof mockWHState) => unknown) =>
    selector(mockWHState),
}));

vi.mock('../../../data/wildHunt/characters', () => ({
  getWildHuntCharacterById: (id: string) =>
    id === 'wh-eredin'
      ? { id: 'wh-eredin', name: 'Eredin', passiveAbility: { name: 'P', description: 'D', trigger: 'passive' }, locationAbility: { name: 'L', description: 'LD', trigger: 'passive' }, specialCards: [] }
      : undefined,
}));

describe('WildHuntVictoryScreen', () => {
  beforeEach(() => {
    mockWHState.characterId = null;
    mockResetWildHunt.mockClear();
  });

  it('renders the victory message', () => {
    render(<WildHuntVictoryScreen />);
    expect(screen.getByText(/Wild Hunt has been defeated/i)).toBeInTheDocument();
  });

  it('renders the New Run button', () => {
    render(<WildHuntVictoryScreen />);
    expect(screen.getByRole('button', { name: /new run/i })).toBeInTheDocument();
  });

  it('calls resetWildHunt when New Run is clicked', () => {
    render(<WildHuntVictoryScreen />);
    fireEvent.click(screen.getByRole('button', { name: /new run/i }));
    expect(mockResetWildHunt).toHaveBeenCalledTimes(1);
  });
});
