import { render, screen, fireEvent } from '@testing-library/react';
import { WildHuntSetupScreen } from '../WildHuntSetupScreen';

const mockStartWildHunt    = vi.fn();
const mockConfirmSetup     = vi.fn();
const mockResetWildHunt    = vi.fn();
const mockInitWildHuntBoard = vi.fn();

vi.mock('../../../store/wildHuntStore', () => ({
  useWildHuntStore: (selector: (s: {
    startWildHunt: () => void;
    confirmSetup: () => void;
    resetWildHunt: () => void;
    initWildHuntBoard: () => void;
  }) => unknown) =>
    selector({
      startWildHunt: mockStartWildHunt,
      confirmSetup: mockConfirmSetup,
      resetWildHunt: mockResetWildHunt,
      initWildHuntBoard: mockInitWildHuntBoard,
    }),
}));

vi.mock('../../../data/wildHunt/characters', () => ({
  WILD_HUNT_CHARACTERS: [
    { id: 'wh-eredin', name: 'Eredin', passiveAbility: { name: 'King', description: 'D', trigger: 'passive' }, locationAbility: { name: 'Frost', description: 'D', trigger: 'passive' }, specialCards: [] },
    { id: 'wh-imlerith', name: 'Imlerith', passiveAbility: { name: 'Shield', description: 'D', trigger: 'passive' }, locationAbility: { name: 'Rage', description: 'D', trigger: 'passive' }, specialCards: [] },
  ],
  getWildHuntCharacterById: (id: string) =>
    id === 'wh-eredin'
      ? { id: 'wh-eredin', name: 'Eredin', passiveAbility: { name: 'King', description: 'D', trigger: 'passive' }, locationAbility: { name: 'Frost', description: 'D', trigger: 'passive' }, specialCards: [] }
      : undefined,
}));

describe('WildHuntSetupScreen — difficulty step', () => {
  beforeEach(() => {
    mockStartWildHunt.mockClear();
    mockConfirmSetup.mockClear();
    mockResetWildHunt.mockClear();
    mockInitWildHuntBoard.mockClear();
  });

  it('renders the Wild Hunt heading', () => {
    render(<WildHuntSetupScreen />);
    expect(screen.getByText('Wild Hunt')).toBeInTheDocument();
  });

  it('shows difficulty options', () => {
    render(<WildHuntSetupScreen />);
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Normal')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
    expect(screen.getByText('Very Hard')).toBeInTheDocument();
  });

  it('calls resetWildHunt when Cancel is clicked', () => {
    render(<WildHuntSetupScreen />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockResetWildHunt).toHaveBeenCalledTimes(1);
  });

  it('advances to character step when Next is clicked', () => {
    render(<WildHuntSetupScreen />);
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Choose Character')).toBeInTheDocument();
    expect(screen.getByText('Eredin')).toBeInTheDocument();
    expect(screen.getByText('Imlerith')).toBeInTheDocument();
  });
});

describe('WildHuntSetupScreen — character step', () => {
  beforeEach(() => {
    mockStartWildHunt.mockClear();
    mockConfirmSetup.mockClear();
    mockResetWildHunt.mockClear();
    mockInitWildHuntBoard.mockClear();
  });

  it('goes back to difficulty step when Back is clicked', () => {
    render(<WildHuntSetupScreen />);
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Back'));
    expect(screen.getByText('Choose Difficulty')).toBeInTheDocument();
  });

  it('calls startWildHunt, initWildHuntBoard, and confirmSetup when Begin is clicked', () => {
    render(<WildHuntSetupScreen />);
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Begin'));
    expect(mockStartWildHunt).toHaveBeenCalledTimes(1);
    expect(mockInitWildHuntBoard).toHaveBeenCalledTimes(1);
    expect(mockConfirmSetup).toHaveBeenCalledTimes(1);
  });

  it('passes selected difficulty to startWildHunt', () => {
    render(<WildHuntSetupScreen />);
    fireEvent.click(screen.getByText('Hard'));
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Begin'));
    expect(mockStartWildHunt).toHaveBeenCalledWith('wh-eredin', 'hard');
  });
});
