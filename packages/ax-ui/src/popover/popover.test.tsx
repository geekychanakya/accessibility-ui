import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Popover } from './index';

expect.extend(toHaveNoViolations);

function renderPopover() {
  return render(
    <Popover.Root>
      <Popover.Trigger>Toggle Popover</Popover.Trigger>
      <Popover.Content>
        <p>Popover content</p>
        <Popover.Close>Close</Popover.Close>
      </Popover.Content>
    </Popover.Root>
  );
}

describe('Popover', () => {
  it('renders trigger', () => {
    renderPopover();
    expect(screen.getByText('Toggle Popover')).toBeInTheDocument();
  });

  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    renderPopover();

    await user.click(screen.getByText('Toggle Popover'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes on close button click', async () => {
    const user = userEvent.setup();
    renderPopover();

    await user.click(screen.getByText('Toggle Popover'));
    await user.click(screen.getByText('Close'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('trigger has aria-expanded', async () => {
    const user = userEvent.setup();
    renderPopover();

    const trigger = screen.getByText('Toggle Popover');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('trigger has aria-haspopup', () => {
    renderPopover();
    expect(screen.getByText('Toggle Popover')).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    renderPopover();

    await user.click(screen.getByText('Toggle Popover'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('passes axe accessibility check', async () => {
    const user = userEvent.setup();
    const { container } = renderPopover();

    await user.click(screen.getByText('Toggle Popover'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
