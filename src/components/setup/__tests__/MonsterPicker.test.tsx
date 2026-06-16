import { render, screen, fireEvent } from '@testing-library/react';
import { MonsterPicker } from '../MonsterPicker';
import type { Monster } from '../../../types';

vi.mock('../../../data/monsters', () => ({
  MONSTERS: [
    { id: 'griffin',  name: 'Griffin',  level: 2, deckSize: 10, cardPool: [], cardFrontImages: [], baseAbility: { name: 'Dive', description: '', trigger: 'passive' } },
    { id: 'werewolf', name: 'Werewolf', level: 1, deckSize: 8,  cardPool: [], cardFrontImages: [], baseAbility: { name: 'Rend', description: '', trigger: 'passive' } },
    { id: 'foglet',   name: 'Foglet',   level: 1, deckSize: 6,  cardPool: [], cardFrontImages: [], baseAbility: { name: 'Mist', description: '', trigger: 'passive' } },
  ],
}));

// Local reference matching the mock above — used for assertions
const mockMonsters: Monster[] = [
  { id: 'griffin',  name: 'Griffin',  level: 2, deckSize: 10, cardPool: [], cardFrontImages: [], baseAbility: { name: 'Dive', description: '', trigger: 'passive' } },
  { id: 'werewolf', name: 'Werewolf', level: 1, deckSize: 8,  cardPool: [], cardFrontImages: [], baseAbility: { name: 'Rend', description: '', trigger: 'passive' } },
  { id: 'foglet',   name: 'Foglet',   level: 1, deckSize: 6,  cardPool: [], cardFrontImages: [], baseAbility: { name: 'Mist', description: '', trigger: 'passive' } },
];

describe('MonsterPicker', () => {
  it('renders a button for each monster', () => {
    render(<MonsterPicker selected={null} onSelect={() => {}} />);
    expect(screen.getByText('Griffin')).toBeInTheDocument();
    expect(screen.getByText('Werewolf')).toBeInTheDocument();
    expect(screen.getByText('Foglet')).toBeInTheDocument();
  });

  it('shows level and deck size for each monster', () => {
    render(<MonsterPicker selected={null} onSelect={() => {}} />);
    expect(screen.getByText('Level 2 — 10 cards')).toBeInTheDocument();
  });

  it('calls onSelect with the monster when clicked', () => {
    const onSelect = vi.fn();
    render(<MonsterPicker selected={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Griffin'));
    expect(onSelect).toHaveBeenCalledWith(mockMonsters[0]);
  });

  it('applies selected styling to the chosen monster', () => {
    render(<MonsterPicker selected={mockMonsters[0]} onSelect={() => {}} />);
    const griffinBtn = screen.getByText('Griffin').closest('button')!;
    expect(griffinBtn).toHaveClass('border-amber-500');
  });

  it('does not apply selected styling to unselected monsters', () => {
    render(<MonsterPicker selected={mockMonsters[0]} onSelect={() => {}} />);
    const werewolfBtn = screen.getByText('Werewolf').closest('button')!;
    expect(werewolfBtn).not.toHaveClass('border-amber-500');
  });

  it('calls onSelect when Random Monster is clicked', () => {
    const onSelect = vi.fn();
    render(<MonsterPicker selected={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Random Monster'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    const validIds = mockMonsters.map((m) => m.id);
    expect(validIds).toContain(onSelect.mock.calls[0][0].id);
  });
});
