import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Menu } from './index';

expect.extend(toHaveNoViolations);

function renderMenu() {
  return render(
    <Menu.Root>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content>
        <Menu.Item onSelect={() => {}}>Edit</Menu.Item>
        <Menu.Item onSelect={() => {}}>Duplicate</Menu.Item>
        <Menu.Separator />
        <Menu.Item onSelect={() => {}} disabled>Delete</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
}

describe('Menu', () => {
  it('renders trigger', () => {
    renderMenu();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByText('Actions'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('has correct ARIA attributes on trigger', () => {
    renderMenu();
    const trigger = screen.getByText('Actions');
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders menu items with menuitem role', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByText('Actions'));
    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(3);
  });

  it('navigates with ArrowDown', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByText('Actions'));
    const items = screen.getAllByRole('menuitem');

    expect(items[0]).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(items[1]).toHaveFocus();
  });

  it('navigates with ArrowUp', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByText('Actions'));
    const items = screen.getAllByRole('menuitem');

    expect(items[0]).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(items[items.length - 1]).toHaveFocus();
  });

  it('wraps navigation at boundaries', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByText('Actions'));
    const items = screen.getAllByRole('menuitem');

    await user.keyboard('{End}');
    expect(items[items.length - 1]).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(items[0]).toHaveFocus();
  });

  it('closes on Escape and returns focus to trigger', async () => {
    const user = userEvent.setup();
    renderMenu();

    const trigger = screen.getByText('Actions');
    await user.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('selects item on Enter', async () => {
    const onSelect = jest.fn();
    const user = userEvent.setup();

    render(
      <Menu.Root>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Content>
          <Menu.Item onSelect={onSelect}>Edit</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );

    await user.click(screen.getByText('Actions'));
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalled();
  });

  it('disabled items have aria-disabled', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByText('Actions'));
    const deleteItem = screen.getByText('Delete');
    expect(deleteItem).toHaveAttribute('aria-disabled', 'true');
  });

  it('passes axe accessibility check', async () => {
    const user = userEvent.setup();
    const { container } = renderMenu();

    await user.click(screen.getByText('Actions'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has separator with correct role', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByText('Actions'));
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});
