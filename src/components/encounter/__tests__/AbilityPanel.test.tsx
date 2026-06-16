import { render, screen } from '@testing-library/react';
import { AbilityPanel } from '../AbilityPanel';
import type { Monster } from '../../../types';

const baseMonster: Monster = {
  id: 'griffin',
  name: 'Griffin',
  level: 2,
  deckSize: 10,
  cardPool: [],
  cardFrontImages: [],
  baseAbility: { name: 'Dive', description: 'Fly over obstacles.', trigger: 'passive' },
};

const monsterWithSecondary: Monster = {
  ...baseMonster,
  secondaryAbility: { name: 'Screech', description: 'Stuns nearby enemies.', trigger: 'passive' },
};

const monsterWithDiscard: Monster = {
  ...baseMonster,
  discardAbility: { name: 'Bleed', description: 'Player loses 1 HP.', trigger: 'discard' },
};

describe('AbilityPanel', () => {
  it('shows the base ability name and description', () => {
    render(<AbilityPanel monster={baseMonster} />);
    expect(screen.getByText('Dive:')).toBeInTheDocument();
    expect(screen.getByText('Fly over obstacles.')).toBeInTheDocument();
  });

  it('shows secondary ability when present', () => {
    render(<AbilityPanel monster={monsterWithSecondary} />);
    expect(screen.getByText('Screech:')).toBeInTheDocument();
    expect(screen.getByText('Stuns nearby enemies.')).toBeInTheDocument();
  });

  it('does not show secondary ability when absent', () => {
    render(<AbilityPanel monster={baseMonster} />);
    expect(screen.queryByText('Screech:')).not.toBeInTheDocument();
  });

  it('shows On Discard badge and ability when discardAbility is set', () => {
    render(<AbilityPanel monster={monsterWithDiscard} />);
    expect(screen.getByText('On Discard')).toBeInTheDocument();
    expect(screen.getByText('Bleed:')).toBeInTheDocument();
    expect(screen.getByText('Player loses 1 HP.')).toBeInTheDocument();
  });

  it('does not show On Discard section when no discardAbility', () => {
    render(<AbilityPanel monster={baseMonster} />);
    expect(screen.queryByText('On Discard')).not.toBeInTheDocument();
  });

  it('applies frost theme heading color', () => {
    render(<AbilityPanel monster={baseMonster} theme="frost" />);
    expect(screen.getByText(/abilities/i)).toHaveClass('text-cyan-400');
  });

  it('applies default theme heading color', () => {
    render(<AbilityPanel monster={baseMonster} theme="default" />);
    expect(screen.getByText(/abilities/i)).toHaveClass('text-amber-400');
  });
});
