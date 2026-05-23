import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Toast, useToast } from './index';

expect.extend(toHaveNoViolations);

function ToastTrigger() {
  const { addToast } = useToast();
  return (
    <button onClick={() => addToast({ title: 'Test Toast', description: 'Hello' })}>
      Add Toast
    </button>
  );
}

function renderToast() {
  return render(
    <Toast.Provider duration={5000}>
      <ToastTrigger />
      <Toast.Viewport />
    </Toast.Provider>
  );
}

describe('Toast', () => {
  it('renders viewport', () => {
    renderToast();
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('viewport has aria-label', () => {
    renderToast();
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Notifications');
  });

  it('adds toast on trigger', async () => {
    const user = userEvent.setup();
    renderToast();

    await user.click(screen.getByText('Add Toast'));
    expect(screen.getByText('Test Toast')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('toast has status role', async () => {
    const user = userEvent.setup();
    renderToast();

    await user.click(screen.getByText('Add Toast'));
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('toast has dismiss button', async () => {
    const user = userEvent.setup();
    renderToast();

    await user.click(screen.getByText('Add Toast'));
    expect(screen.getByLabelText('Dismiss')).toBeInTheDocument();
  });

  it('dismisses toast on close click', async () => {
    const user = userEvent.setup();
    renderToast();

    await user.click(screen.getByText('Add Toast'));
    expect(screen.getByText('Test Toast')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Dismiss'));
    expect(screen.queryByText('Test Toast')).not.toBeInTheDocument();
  });

  it('passes axe accessibility check', async () => {
    const user = userEvent.setup();
    const { container } = renderToast();

    await user.click(screen.getByText('Add Toast'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
