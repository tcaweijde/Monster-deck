import { render, screen, fireEvent } from '@testing-library/react';
import { BoardScreen } from '../BoardScreen';
import type { BoardState } from '../../../types';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockSetActiveSlot = vi.fn();
const mockEndGame = vi.fn();
const mockStartEncounter = vi.fn();

const mockBoard: BoardState = {
  slots: [
    { monsterId: 'griffin',   level: 2, locationType: 'mountain', locationId: 2, status: 'active' },
    { monsterId: 'werewolf',  level: 1, locationType: 'woods',    locationId: 6, status: 'active' },
    { monsterId: 'foglet',    level: 1, locationType: 'water',    locationId: 1, status: 'active' },
  ],
};

let mockBoardState = {
  board: mockBoard as BoardState | null,
  setActiveSlot: mockSetActiveSlot,
  endGame: mockEndGame,
  activeSlotIndex: null,
  handleVictory: vi.fn(),
  clearActiveSlot: vi.fn(),
};

vi.mock('../../../store/boardStore', () => ({
  useBoardStore: (selector: (s: typeof mockBoardState) => unknown) =>
    selector(mockBoardState),
}));

vi.mock('../../../store/encounterStore', () => ({
  useEncounterStore: (selector: (s: { startEncounter: typeof mockStartEncounter }) => unknown) =>
    selector({ startEncounter: mockStartEncounter }),
}));

vi.mock('../../../data/monsters', () => ({
  MONSTERS: [
    { id: 'griffin',  name: 'Griffin',  level: 2, deckSize: 10, cardPool: [], cardFrontImages: [], baseAbility: { name: 'Dive', description: '', trigger: 'passive' } },
    { id: 'werewolf', name: 'Werewolf', level: 1, deckSize: 10, cardPool: [], cardFrontImages: [], baseAbility: { name: 'Rend', description: '', trigger: 'passive' } },
    { id: 'foglet',   name: 'Foglet',   level: 1, deckSize: 10, cardPool: [], cardFrontImages: [], baseAbility: { name: 'Mist', description: '', trigger: 'passive' } },
  ],
}));

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('BoardScreen', () => {
  beforeEach(() => {
    mockBoardState.board = mockBoard;
    mockSetActiveSlot.mockClear();
    mockEndGame.mockClear();
    mockStartEncounter.mockClear();
  });

  it('renders nothing when board is null', () => {
    mockBoardState.board = null;
    const { container } = render(<BoardScreen />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the Board heading', () => {
    render(<BoardScreen />);
    expect(screen.getByText('Board')).toBeInTheDocument();
  });

  it('renders all three monster slot cards by name', () => {
    render(<BoardScreen />);
    expect(screen.getByText('Griffin')).toBeInTheDocument();
    expect(screen.getByText('Werewolf')).toBeInTheDocument();
    expect(screen.getByText('Foglet')).toBeInTheDocument();
  });

  it('calls endGame when End Game is clicked', () => {
    render(<BoardScreen />);
    fireEvent.click(screen.getByText('End Game'));
    expect(mockEndGame).toHaveBeenCalledTimes(1);
  });

  it('calls setActiveSlot and startEncounter when a slot is tapped', () => {
    render(<BoardScreen />);
    // Click first slot button (Griffin)
    fireEvent.click(screen.getAllByRole('button').find(btn => btn.textContent?.includes('Griffin'))!);
    expect(mockSetActiveSlot).toHaveBeenCalledWith(0);
    expect(mockStartEncounter).toHaveBeenCalledWith('griffin');
  });
});
