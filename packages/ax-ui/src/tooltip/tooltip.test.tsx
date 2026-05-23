import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Tooltip } from './index';

expect.extend(toHaveNoViolations);

function renderTooltip() {
  return render(
    <Tooltip.Root delayMs={0}>
      <Tooltip.Trigger>
        <button>Hover me</button>
      </Tooltip.Trigger>
      <Tooltip.Content>Tooltip text</Tooltip.Content>
    </Tooltip.Root>
  );
}

describe('Tooltip', () => {
  it('does not show tooltip by default', () => {
    renderTooltip();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.hover(screen.getByText('Hover me'));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Tooltip text')).toBeInTheDocument();
  });

  it('hides tooltip on unhover', async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.hover(screen.getByText('Hover me'));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.unhover(screen.getByText('Hover me'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on focus', async () => {
    renderTooltip();

    act(() => {
      screen.getByText('Hover me').focus();
    });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('tooltip has correct role', async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.hover(screen.getByText('Hover me'));
    expect(screen.getByRole('tooltip')).toHaveAttribute('role', 'tooltip');
  });

  it('trigger has aria-describedby when tooltip is shown', async () => {
    const user = userEvent.setup();
    renderTooltip();

    const trigger = screen.getByText('Hover me').parentElement!;
    expect(trigger).not.toHaveAttribute('aria-describedby');

    await user.hover(screen.getByText('Hover me'));
    expect(trigger).toHaveAttribute('aria-describedby');
  });

  it('passes axe accessibility check', async () => {
    const user = userEvent.setup();
    const { container } = renderTooltip();

    await user.hover(screen.getByText('Hover me'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
