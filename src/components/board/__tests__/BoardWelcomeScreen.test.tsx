import { render, screen, fireEvent } from '@testing-library/react';
import { BoardWelcomeScreen } from '../BoardWelcomeScreen';

const mockInitNewGame = vi.fn();
const mockInitiateSetup = vi.fn();
const mockEnableDagonsLair = vi.fn();
const mockDisableDagonsLair = vi.fn();

vi.mock('../../../store/boardStore', () => ({
  useBoardStore: (
    selector: (s: {
      initNewGame: () => void;
      dagonsLairEnabled: boolean;
      enableDagonsLair: () => void;
      disableDagonsLair: () => void;
    }) => unknown,
  ) =>
    selector({
      initNewGame: mockInitNewGame,
      dagonsLairEnabled: false,
      enableDagonsLair: mockEnableDagonsLair,
      disableDagonsLair: mockDisableDagonsLair,
    }),
}));

vi.mock('../../../store/wildHuntStore', () => ({
  useWildHuntStore: (selector: (s: { initiateSetup: () => void }) => unknown) =>
    selector({ initiateSetup: mockInitiateSetup }),
}));

describe('BoardWelcomeScreen', () => {
  beforeEach(() => {
    mockInitNewGame.mockClear();
    mockInitiateSetup.mockClear();
    mockEnableDagonsLair.mockClear();
    mockDisableDagonsLair.mockClear();
  });

  it('renders the app title and subtitle', () => {
    render(<BoardWelcomeScreen />);
    expect(screen.getByText('Monster Deck')).toBeInTheDocument();
    expect(screen.getByText(/Solo Play/i)).toBeInTheDocument();
  });

  it('calls initNewGame when "Start New Game" is clicked', () => {
    render(<BoardWelcomeScreen />);
    fireEvent.click(screen.getByText('Start New Game'));
    expect(mockInitNewGame).toHaveBeenCalledTimes(1);
  });

  it('calls initiateSetup when "Wild Hunt mode" is clicked', () => {
    render(<BoardWelcomeScreen />);
    fireEvent.click(screen.getByText('Wild Hunt mode'));
    expect(mockInitiateSetup).toHaveBeenCalledTimes(1);
  });

  it('renders the Skellige toggle', () => {
    render(<BoardWelcomeScreen />);
    expect(screen.getByLabelText('Toggle Skellige expansion')).toBeInTheDocument();
  });

  it('calls enableDagonsLair when the Skellige toggle is clicked while disabled', () => {
    render(<BoardWelcomeScreen />);
    fireEvent.click(screen.getByLabelText('Toggle Skellige expansion'));
    expect(mockEnableDagonsLair).toHaveBeenCalledTimes(1);
    expect(mockDisableDagonsLair).not.toHaveBeenCalled();
  });
});
