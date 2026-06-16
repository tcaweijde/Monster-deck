import { render, screen, fireEvent } from '@testing-library/react';
import { ShieldCounter } from '../ShieldCounter';

describe('ShieldCounter — full mode', () => {
  it('renders the shield count and label', () => {
    render(<ShieldCounter count={7} onAdd={() => {}} onRemove={() => {}} />);
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText(/shields/i)).toBeInTheDocument();
  });

  it('calls onAdd when + is clicked', () => {
    const onAdd = vi.fn();
    render(<ShieldCounter count={5} onAdd={onAdd} onRemove={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('calls onRemove when − is clicked', () => {
    const onRemove = vi.fn();
    render(<ShieldCounter count={5} onAdd={() => {}} onRemove={onRemove} />);
    fireEvent.click(screen.getByRole('button', { name: '−' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('disables − button when count is 0', () => {
    render(<ShieldCounter count={0} onAdd={() => {}} onRemove={() => {}} />);
    expect(screen.getByRole('button', { name: '−' })).toBeDisabled();
  });

  it('does not disable − button when count is above 0', () => {
    render(<ShieldCounter count={1} onAdd={() => {}} onRemove={() => {}} />);
    expect(screen.getByRole('button', { name: '−' })).not.toBeDisabled();
  });
});

describe('ShieldCounter — compact mode', () => {
  it('renders the count in compact mode', () => {
    render(<ShieldCounter count={3} onAdd={() => {}} onRemove={() => {}} compact />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onAdd and onRemove in compact mode', () => {
    const onAdd = vi.fn();
    const onRemove = vi.fn();
    render(<ShieldCounter count={3} onAdd={onAdd} onRemove={onRemove} compact />);
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '−' }));
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('disables − button when count is 0 in compact mode', () => {
    render(<ShieldCounter count={0} onAdd={() => {}} onRemove={() => {}} compact />);
    expect(screen.getByRole('button', { name: '−' })).toBeDisabled();
  });
});
