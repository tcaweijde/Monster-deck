import { render, screen, fireEvent } from '@testing-library/react';
import { WildHuntDefeatScreen } from '../WildHuntDefeatScreen';

const mockResetWildHunt = vi.fn();

vi.mock('../../../store/wildHuntStore', () => ({
  useWildHuntStore: (selector: (s: { resetWildHunt: () => void }) => unknown) =>
    selector({ resetWildHunt: mockResetWildHunt }),
}));

describe('WildHuntDefeatScreen', () => {
  beforeEach(() => mockResetWildHunt.mockClear());

  it('renders the Defeated heading', () => {
    render(<WildHuntDefeatScreen />);
    expect(screen.getByText('Defeated')).toBeInTheDocument();
  });

  it('renders the flavour text', () => {
    render(<WildHuntDefeatScreen />);
    expect(screen.getByText(/Wild Hunt has broken through/i)).toBeInTheDocument();
  });

  it('calls resetWildHunt when the screen is tapped', () => {
    render(<WildHuntDefeatScreen />);
    // Click the outer container (which has onClick={resetWildHunt})
    fireEvent.click(screen.getByText('Defeated').closest('[class]')!.parentElement!.parentElement!);
    expect(mockResetWildHunt).toHaveBeenCalled();
  });
});
