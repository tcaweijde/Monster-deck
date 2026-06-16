import { render, screen, fireEvent } from '@testing-library/react';
import { WildHuntBoardScreen } from '../WildHuntBoardScreen';
import type { WildHuntBoardSlot } from '../../../types/wildHunt';

const mockAdvanceStage           = vi.fn();
const mockTriggerDefeat          = vi.fn();
const mockSetShowMonsters        = vi.fn();
const mockGainShields            = vi.fn();
const mockAbsorbDamage           = vi.fn(() => 0);
const mockStartEncounterWithMonster = vi.fn();

const emptySlot: WildHuntBoardSlot = {
  monsterId: null, level: null, locationType: null, locationId: null, status: 'empty',
};

let mockWHState = {
  round: 2,
  stage: 1 as 1 | 2 | 3 | 4,
  phase: 'playing' as string,
  wildHuntSlots: [emptySlot, emptySlot, emptySlot] as [WildHuntBoardSlot, WildHuntBoardSlot, WildHuntBoardSlot],
  shieldCount: 7,
  gainShields: mockGainShields,
  absorbDamage: mockAbsorbDamage,
  houndSlots: [] as { id: string; level: 1 | 2 | 3 }[],
  advanceStage: mockAdvanceStage,
  triggerDefeat: mockTriggerDefeat,
  setShowMonsters: mockSetShowMonsters,
  characterId: 'wh-eredin' as string | null,
};

vi.mock('../../../store/wildHuntStore', () => ({
  useWildHuntStore: (selector: (s: typeof mockWHState) => unknown) =>
    selector(mockWHState),
}));

vi.mock('../../../store/encounterStore', () => ({
  useEncounterStore: (selector: (s: { startEncounterWithMonster: typeof mockStartEncounterWithMonster }) => unknown) =>
    selector({ startEncounterWithMonster: mockStartEncounterWithMonster }),
}));

vi.mock('../../../data/wildHunt/spawnTable', () => ({
  getSpawnOutcome: () => ({ monsterLevel: null, monsterBlocked: false, houndLevel: null }),
}));

vi.mock('../../../data/wildHunt/characters', () => ({
  getWildHuntCharacterById: (id: string) =>
    id === 'wh-eredin'
      ? { id: 'wh-eredin', name: 'Eredin', passiveAbility: { name: 'P', description: 'D', trigger: 'passive' }, locationAbility: { name: 'Frost Aura', description: 'Chills nearby foes.', trigger: 'passive' }, specialCards: [] }
      : undefined,
}));

vi.mock('../../../data/wildHunt/bossMonster', () => ({
  buildBossMonster: vi.fn(() => ({ id: 'boss', name: 'Boss', level: 3, deckSize: 10, cardPool: [], cardFrontImages: [], baseAbility: { name: 'A', description: 'D', trigger: 'passive' } })),
}));

describe('WildHuntBoardScreen', () => {
  beforeEach(() => {
    mockWHState.round = 2;
    mockWHState.stage = 1;
    mockWHState.phase = 'playing';
    mockWHState.houndSlots = [];
    [mockAdvanceStage, mockTriggerDefeat, mockSetShowMonsters].forEach(m => m.mockClear());
  });

  it('renders the Wild Hunt heading', () => {
    render(<WildHuntBoardScreen />);
    expect(screen.getByText('Wild Hunt')).toBeInTheDocument();
  });

  it('shows round and stage numbers', () => {
    render(<WildHuntBoardScreen />);
    expect(screen.getByText('2')).toBeInTheDocument(); // round
    expect(screen.getByText('1')).toBeInTheDocument(); // stage
  });

  it('shows the stage label for the current stage', () => {
    render(<WildHuntBoardScreen />);
    expect(screen.getByText('Movement & Action')).toBeInTheDocument();
  });

  it('calls advanceStage when advance button is clicked', () => {
    render(<WildHuntBoardScreen />);
    fireEvent.click(screen.getByText('Advance to Stage 2'));
    expect(mockAdvanceStage).toHaveBeenCalledTimes(1);
  });

  it('calls triggerDefeat when End Run is clicked', () => {
    render(<WildHuntBoardScreen />);
    fireEvent.click(screen.getByText('End Run'));
    expect(mockTriggerDefeat).toHaveBeenCalledTimes(1);
  });

  it('calls setShowMonsters(true) when View Board is clicked', () => {
    render(<WildHuntBoardScreen />);
    fireEvent.click(screen.getByText('View Board'));
    expect(mockSetShowMonsters).toHaveBeenCalledWith(true);
  });

  it('shows Begin Final Battle button when phase is finalBattle', () => {
    mockWHState.phase = 'finalBattle';
    render(<WildHuntBoardScreen />);
    expect(screen.getByText('Begin Final Battle')).toBeInTheDocument();
  });

  it('shows hound entry when stage is 1 and hounds exist', () => {
    mockWHState.houndSlots = [{ id: 'hound-1', level: 2 }];
    render(<WildHuntBoardScreen />);
    expect(screen.getByText(/Lv\.2/i)).toBeInTheDocument();
    expect(screen.getByText('Tap to fight')).toBeInTheDocument();
  });

  it('does not show hounds when stage is not 1', () => {
    mockWHState.stage = 2;
    mockWHState.houndSlots = [{ id: 'hound-1', level: 2 }];
    render(<WildHuntBoardScreen />);
    expect(screen.queryByText('Tap to fight')).not.toBeInTheDocument();
  });
});
