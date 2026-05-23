import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Toggle, Switch } from './index';

expect.extend(toHaveNoViolations);

describe('Toggle', () => {
  it('renders with switch role', () => {
    render(<Toggle>Bold</Toggle>);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('toggles on click', async () => {
    const user = userEvent.setup();
    render(<Toggle>Bold</Toggle>);

    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('supports controlled mode', () => {
    const { rerender } = render(<Toggle pressed={false}>Bold</Toggle>);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');

    rerender(<Toggle pressed={true}>Bold</Toggle>);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onPressedChange', async () => {
    const onPressedChange = jest.fn();
    const user = userEvent.setup();
    render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>);

    await user.click(screen.getByRole('switch'));
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    render(<Toggle disabled>Bold</Toggle>);

    const toggle = screen.getByRole('switch');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('passes axe accessibility check', async () => {
    const { container } = render(<Toggle>Bold</Toggle>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Switch', () => {
  it('renders with switch role', () => {
    render(<Switch aria-label="Dark mode" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('toggles on click', async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="Dark mode" />);

    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('aria-checked', 'false');

    await user.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onCheckedChange', async () => {
    const onCheckedChange = jest.fn();
    const user = userEvent.setup();
    render(<Switch aria-label="Dark mode" onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('renders hidden input when name is provided', () => {
    const { container } = render(<Switch aria-label="Dark mode" name="darkMode" />);
    const input = container.querySelector('input[type="hidden"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'darkMode');
  });

  it('passes axe accessibility check', async () => {
    const { container } = render(<Switch aria-label="Dark mode" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
