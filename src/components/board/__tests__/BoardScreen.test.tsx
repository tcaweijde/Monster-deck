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
  setActivePermanentSlot: vi.fn(),
  setRandomEncounterActive: vi.fn(),
  endGame: mockEndGame,
  activeSlotIndex: null,
  activePermanentSlot: false,
  dagonsLairEnabled: false,
  randomEncounterActive: false,
  handleVictory: vi.fn(),
  clearActiveSlot: vi.fn(),
  handlePermanentVictory: vi.fn(),
  clearActivePermanentSlot: vi.fn(),
  clearRandomEncounter: vi.fn(),
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
    { id: 'leshen',   name: 'Leshen',   level: 3, deckSize: 10, cardPool: [], cardFrontImages: [], baseAbility: { name: 'Roots', description: '', trigger: 'passive' } },
  ],
  dagon: { id: 'dagon', name: 'Dagon', level: 2, deckSize: 15, cardPool: [], cardFrontImages: [], baseAbility: { name: 'Ancient Dominion', description: '', trigger: 'passive' } },
  getMonsterById: (id: string) => undefined,
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

  it("renders Dagon's Lair slot when permanentSlot is present on the board", () => {
    mockBoardState.board = {
      ...mockBoard,
      permanentSlot: { monsterId: 'dagon', level: 3, locationType: 'water', locationId: 22, status: 'active' },
    };
    render(<BoardScreen />);
    expect(screen.getByText('Dagon')).toBeInTheDocument();
  });

  it("tapping Dagon's Lair calls setActivePermanentSlot and startEncounter with dagon", () => {
    mockBoardState.board = {
      ...mockBoard,
      permanentSlot: { monsterId: 'dagon', level: 3, locationType: 'water', locationId: 22, status: 'active' },
    };
    render(<BoardScreen />);
    fireEvent.click(screen.getAllByRole('button').find(btn => btn.textContent?.includes('Dagon'))!);
    expect(mockBoardState.setActivePermanentSlot).toHaveBeenCalledTimes(1);
    expect(mockStartEncounter).toHaveBeenCalledWith('dagon');
  });

  it('renders the Random Encounter button', () => {
    render(<BoardScreen />);
    expect(screen.getByText(/Random Encounter/i)).toBeInTheDocument();
  });

  it('clicking Random Encounter calls setRandomEncounterActive and startEncounter with a non-board monster', () => {
    render(<BoardScreen />);
    fireEvent.click(screen.getByText(/Random Encounter/i));
    expect(mockBoardState.setRandomEncounterActive).toHaveBeenCalledTimes(1);
    expect(mockStartEncounter).toHaveBeenCalledTimes(1);
    // The monster started must NOT be one of the board monsters
    const startedId = mockStartEncounter.mock.calls[0][0] as string;
    const boardIds = mockBoard.slots.map((s) => s.monsterId);
    expect(boardIds).not.toContain(startedId);
  });
});
