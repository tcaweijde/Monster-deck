import { render, screen, fireEvent } from '@testing-library/react';
import { WildHuntEncounterScreen } from '../WildHuntEncounterScreen';
import type { Monster } from '../../../types';

const mockMonster: Monster = {
  id: 'wh-eredin',
  name: 'Eredin',
  level: 3,
  deckSize: 10,
  cardPool: [],
  cardFrontImages: [],
  baseAbility: { name: 'Frost Nova', description: 'Deals 2.', trigger: 'passive' },
};

const mockTriggerVictory  = vi.fn();
const mockTriggerDefeat   = vi.fn();
const mockAbsorbDamage    = vi.fn(() => 1);
const mockGainShields     = vi.fn();
const mockResetToSetup    = vi.fn();
const mockClearLastDiscard = vi.fn();
const mockFlipMonsterCard = vi.fn();
const mockDiscardOne      = vi.fn();
const mockPassTurn        = vi.fn();

let mockEncounterState = {
  monster: mockMonster as Monster | null,
  deck: [] as unknown[],
  discardPile: [] as unknown[],
  currentCard: null,
  turn: 'monster' as 'monster' | 'player',
  phase: 'playing' as 'setup' | 'playing' | 'victory',
  lastDiscardedCard: null as unknown,
  flipMonsterCard: mockFlipMonsterCard,
  discardOne: mockDiscardOne,
  passTurn: mockPassTurn,
  clearLastDiscardedCard: mockClearLastDiscard,
  resetToSetup: mockResetToSetup,
};

let mockWHState = {
  shieldCount: 7,
  absorbDamage: mockAbsorbDamage,
  gainShields: mockGainShields,
  triggerVictory: mockTriggerVictory,
  triggerDefeat: mockTriggerDefeat,
};

vi.mock('../../../store/encounterStore', () => ({
  useEncounterStore: (selector: (s: typeof mockEncounterState) => unknown) =>
    selector(mockEncounterState),
}));

vi.mock('../../../store/wildHuntStore', () => ({
  useWildHuntStore: (selector: (s: typeof mockWHState) => unknown) =>
    selector(mockWHState),
}));

describe('WildHuntEncounterScreen', () => {
  beforeEach(() => {
    mockEncounterState.monster = mockMonster;
    mockEncounterState.phase = 'playing';
    mockEncounterState.turn = 'monster';
    mockEncounterState.deck = [];
    mockEncounterState.discardPile = [];
    mockEncounterState.lastDiscardedCard = null;
    mockWHState.shieldCount = 7;
    [mockTriggerVictory, mockTriggerDefeat, mockResetToSetup, mockClearLastDiscard].forEach(m => m.mockClear());
  });

  it('renders nothing when monster is null', () => {
    mockEncounterState.monster = null;
    const { container } = render(<WildHuntEncounterScreen />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the monster name and Final Battle label', () => {
    render(<WildHuntEncounterScreen />);
    expect(screen.getByText('Eredin')).toBeInTheDocument();
    expect(screen.getByText('Final Battle')).toBeInTheDocument();
  });

  it('shows shield count', () => {
    render(<WildHuntEncounterScreen />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('shows monster\'s turn indicator', () => {
    mockEncounterState.turn = 'monster';
    render(<WildHuntEncounterScreen />);
    expect(screen.getByText("Monster's turn")).toBeInTheDocument();
  });

  it('calls triggerDefeat and resetToSetup when Concede is clicked', () => {
    render(<WildHuntEncounterScreen />);
    fireEvent.click(screen.getByText('Concede'));
    expect(mockTriggerDefeat).toHaveBeenCalledTimes(1);
    expect(mockResetToSetup).toHaveBeenCalledTimes(1);
  });

  it('shows victory overlay and calls triggerVictory when phase is victory', () => {
    mockEncounterState.phase = 'victory';
    render(<WildHuntEncounterScreen />);
    expect(screen.getByText('Wild Hunt Defeated!')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Claim Victory'));
    expect(mockTriggerVictory).toHaveBeenCalledTimes(1);
    expect(mockResetToSetup).toHaveBeenCalledTimes(1);
  });

  it('shows special card alert when lastDiscardedCard has discardAbility', () => {
    mockEncounterState.lastDiscardedCard = {
      cardId: 'special-1',
      name: 'Ice Shard',
      discardAbility: { name: 'Frost Chill', description: 'Freeze player.', trigger: 'discard' },
    };
    render(<WildHuntEncounterScreen />);
    expect(screen.getByText('Frost Chill')).toBeInTheDocument();
    expect(screen.getByText('Freeze player.')).toBeInTheDocument();
  });
});
