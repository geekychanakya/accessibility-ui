import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Combobox } from './index';

expect.extend(toHaveNoViolations);

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
];

function renderCombobox(props: { defaultValue?: string } = {}) {
  return render(
    <Combobox.Root defaultValue={props.defaultValue}>
      <Combobox.Input placeholder="Select a fruit..." />
      <Combobox.List>
        {fruits.map((fruit) => (
          <Combobox.Option key={fruit.value} value={fruit.value} label={fruit.label}>
            {fruit.label}
          </Combobox.Option>
        ))}
      </Combobox.List>
    </Combobox.Root>
  );
}

describe('Combobox', () => {
  it('renders input with combobox role', () => {
    renderCombobox();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('has correct ARIA attributes on input', () => {
    renderCombobox();
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
  });

  it('opens listbox on focus', async () => {
    const user = userEvent.setup();
    renderCombobox();

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('shows options when open', async () => {
    const user = userEvent.setup();
    renderCombobox();

    await user.click(screen.getByRole('combobox'));
    expect(screen.getAllByRole('option')).toHaveLength(4);
  });

  it('navigates options with ArrowDown', async () => {
    const user = userEvent.setup();
    renderCombobox();

    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{ArrowDown}');

    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('data-active', 'true');
  });

  it('selects option on Enter', async () => {
    const user = userEvent.setup();
    renderCombobox();

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(input).toHaveValue('Apple');
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    renderCombobox();

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('updates aria-expanded when open', async () => {
    const user = userEvent.setup();
    renderCombobox();

    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-expanded', 'false');

    await user.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
  });

  it('sets aria-activedescendant on navigation', async () => {
    const user = userEvent.setup();
    renderCombobox();

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{ArrowDown}');

    expect(input).toHaveAttribute('aria-activedescendant');
  });

  it('selected option has aria-selected', async () => {
    const user = userEvent.setup();
    renderCombobox();

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    await user.keyboard('{ArrowDown}');
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('passes axe accessibility check', async () => {
    const user = userEvent.setup();
    const { container } = renderCombobox();

    await user.click(screen.getByRole('combobox'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('input value updates on typing', async () => {
    const user = userEvent.setup();
    renderCombobox();

    const input = screen.getByRole('combobox');
    await user.type(input, 'App');
    expect(input).toHaveValue('App');
  });
});
