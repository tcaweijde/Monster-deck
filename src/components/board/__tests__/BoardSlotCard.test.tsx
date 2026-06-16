import { render, screen, fireEvent } from '@testing-library/react';
import { BoardSlotCard } from '../BoardSlotCard';
import type { BoardSlot } from '../../../types';

const activeSlot: BoardSlot = {
  monsterId: 'griffin',
  level: 2,
  locationType: 'mountain',
  locationId: 2, // Henfors
  status: 'active',
};

const encounteringSlot: BoardSlot = { ...activeSlot, status: 'encountering' };

describe('BoardSlotCard', () => {
  it('renders monster name and level', () => {
    render(<BoardSlotCard slot={activeSlot} monsterName="Griffin" onStartEncounter={() => {}} />);
    expect(screen.getByText('Griffin')).toBeInTheDocument();
    expect(screen.getByText('Lv.2')).toBeInTheDocument();
  });

  it('renders the location name as the image alt text', () => {
    render(<BoardSlotCard slot={activeSlot} monsterName="Griffin" onStartEncounter={() => {}} />);
    expect(screen.getByRole('img', { name: 'Henfors' })).toBeInTheDocument();
  });

  it('calls onStartEncounter when clicked', () => {
    const onStartEncounter = vi.fn();
    render(<BoardSlotCard slot={activeSlot} monsterName="Griffin" onStartEncounter={onStartEncounter} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onStartEncounter).toHaveBeenCalledTimes(1);
  });

  it('is disabled and shows "In combat" when status is encountering', () => {
    render(<BoardSlotCard slot={encounteringSlot} monsterName="Griffin" onStartEncounter={() => {}} />);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('In combat')).toBeInTheDocument();
  });

  it('does not show "In combat" when status is active', () => {
    render(<BoardSlotCard slot={activeSlot} monsterName="Griffin" onStartEncounter={() => {}} />);
    expect(screen.queryByText('In combat')).not.toBeInTheDocument();
  });

  it('falls back to fallback image on img error', () => {
    render(<BoardSlotCard slot={activeSlot} monsterName="Griffin" onStartEncounter={() => {}} />);
    const img = screen.getByRole('img', { name: 'Henfors' });
    fireEvent.error(img);
    expect(img).toHaveAttribute('src', expect.stringContaining('fallback.png'));
  });
});
