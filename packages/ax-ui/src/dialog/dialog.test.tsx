import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Dialog } from './index';

expect.extend(toHaveNoViolations);

function renderDialog(props: { defaultOpen?: boolean } = {}) {
  return render(
    <Dialog.Root defaultOpen={props.defaultOpen}>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Test Dialog</Dialog.Title>
        <Dialog.Description>This is a test dialog</Dialog.Description>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
}

describe('Dialog', () => {
  it('renders trigger button', () => {
    renderDialog();
    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
  });

  it('opens when trigger is clicked', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByText('Open Dialog'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
  });

  it('closes when close button is clicked', async () => {
    const user = userEvent.setup();
    renderDialog({ defaultOpen: true });

    await user.click(screen.getByText('Close'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has correct ARIA attributes', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByText('Open Dialog'));
    const dialog = screen.getByRole('dialog');

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
  });

  it('trigger has aria-haspopup', () => {
    renderDialog();
    expect(screen.getByText('Open Dialog')).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('passes axe accessibility check when open', async () => {
    const user = userEvent.setup();
    const { container } = renderDialog();

    await user.click(screen.getByText('Open Dialog'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    renderDialog({ defaultOpen: true });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onOpenChange when state changes', async () => {
    const onOpenChange = jest.fn();
    const user = userEvent.setup();

    render(
      <Dialog.Root onOpenChange={onOpenChange}>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Description>Desc</Dialog.Description>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    );

    await user.click(screen.getByText('Open'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});
