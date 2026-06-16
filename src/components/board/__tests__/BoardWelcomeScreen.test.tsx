import { render, screen, fireEvent } from '@testing-library/react';
import { BoardWelcomeScreen } from '../BoardWelcomeScreen';

const mockInitNewGame = vi.fn();
const mockInitiateSetup = vi.fn();

vi.mock('../../../store/boardStore', () => ({
  useBoardStore: (selector: (s: { initNewGame: () => void }) => unknown) =>
    selector({ initNewGame: mockInitNewGame }),
}));

vi.mock('../../../store/wildHuntStore', () => ({
  useWildHuntStore: (selector: (s: { initiateSetup: () => void }) => unknown) =>
    selector({ initiateSetup: mockInitiateSetup }),
}));

describe('BoardWelcomeScreen', () => {
  beforeEach(() => {
    mockInitNewGame.mockClear();
    mockInitiateSetup.mockClear();
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
});
