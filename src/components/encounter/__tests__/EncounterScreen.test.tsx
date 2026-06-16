import { render, screen, fireEvent } from '@testing-library/react';
import { EncounterScreen } from '../EncounterScreen';
import type { Monster } from '../../../types';

// ─── Shared mock state (mutated per test) ────────────────────────────────────

const mockMonster: Monster = {
  id: 'griffin',
  name: 'Griffin',
  level: 2,
  deckSize: 10,
  cardPool: [],
  cardFrontImages: [],
  baseAbility: { name: 'Dive', description: 'Swoops down.', trigger: 'passive' },
};

const mockQuitEncounter = vi.fn();
const mockCompleteEncounter = vi.fn();

let mockEncounterState = {
  monster: mockMonster as Monster | null,
  deck: [] as unknown[],
  discardPile: [] as unknown[],
  currentCard: null,
  turn: 'monster' as 'monster' | 'player',
  phase: 'playing' as 'setup' | 'playing' | 'victory',
  lastDiscardTriggered: false,
  proximityBonus: 0,
  flipMonsterCard: vi.fn(),
  discardOne: vi.fn(),
  passTurn: vi.fn(),
};

vi.mock('../../../store/encounterStore', () => ({
  useEncounterStore: (selector: (s: typeof mockEncounterState) => unknown) =>
    selector(mockEncounterState),
}));

vi.mock('../../../hooks/useEncounterHandlers', () => ({
  useEncounterHandlers: () => ({
    displayLevel: 2,
    inWildHunt: false,
    quitEncounter: mockQuitEncounter,
    completeEncounter: mockCompleteEncounter,
  }),
}));

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('EncounterScreen', () => {
  beforeEach(() => {
    mockEncounterState.monster = mockMonster;
    mockEncounterState.phase = 'playing';
    mockEncounterState.turn = 'monster';
    mockEncounterState.proximityBonus = 0;
    mockEncounterState.deck = [];
    mockEncounterState.discardPile = [];
    mockQuitEncounter.mockClear();
    mockCompleteEncounter.mockClear();
  });

  it('renders nothing when monster is null', () => {
    mockEncounterState.monster = null;
    const { container } = render(<EncounterScreen />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the monster name', () => {
    render(<EncounterScreen />);
    expect(screen.getByText('Griffin')).toBeInTheDocument();
  });

  it('shows monster level', () => {
    render(<EncounterScreen />);
    expect(screen.getByText('Lv.2')).toBeInTheDocument();
  });

  it('shows monster\'s turn indicator when turn is monster', () => {
    mockEncounterState.turn = 'monster';
    render(<EncounterScreen />);
    expect(screen.getByText("Monster's turn")).toBeInTheDocument();
  });

  it('shows player\'s turn indicator when turn is player', () => {
    mockEncounterState.turn = 'player';
    render(<EncounterScreen />);
    expect(screen.getByText("Player's turn")).toBeInTheDocument();
  });

  it('calls quitEncounter when Quit is clicked', () => {
    render(<EncounterScreen />);
    fireEvent.click(screen.getByText('Quit'));
    expect(mockQuitEncounter).toHaveBeenCalledTimes(1);
  });

  it('shows victory overlay when phase is victory', () => {
    mockEncounterState.phase = 'victory';
    render(<EncounterScreen />);
    expect(screen.getByText('Victory!')).toBeInTheDocument();
    expect(screen.getByText('Griffin defeated')).toBeInTheDocument();
  });

  it('does not show victory overlay during playing phase', () => {
    mockEncounterState.phase = 'playing';
    render(<EncounterScreen />);
    expect(screen.queryByText('Victory!')).not.toBeInTheDocument();
  });

  it('shows deck tracker with correct counts', () => {
    mockEncounterState.deck = new Array(7);
    mockEncounterState.discardPile = new Array(3);
    render(<EncounterScreen />);
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
