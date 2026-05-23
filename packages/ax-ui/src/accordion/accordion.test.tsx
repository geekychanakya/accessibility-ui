import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Accordion } from './index';

expect.extend(toHaveNoViolations);

function renderAccordion(props: { type?: 'single' | 'multiple'; collapsible?: boolean } = {}) {
  return render(
    <Accordion.Root type={props.type} collapsible={props.collapsible} defaultValue="item-1">
      <Accordion.Item value="item-1">
        <Accordion.Trigger>Section 1</Accordion.Trigger>
        <Accordion.Content>Content 1</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>Section 2</Accordion.Trigger>
        <Accordion.Content>Content 2</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>Section 3</Accordion.Trigger>
        <Accordion.Content>Content 3</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

describe('Accordion', () => {
  it('renders triggers as buttons', () => {
    renderAccordion();
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('shows content for default open item', () => {
    renderAccordion();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('toggles section on click', async () => {
    const user = userEvent.setup();
    renderAccordion();

    await user.click(screen.getByText('Section 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('trigger has aria-expanded', () => {
    renderAccordion();
    expect(screen.getByText('Section 1')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Section 2')).toHaveAttribute('aria-expanded', 'false');
  });

  it('trigger has aria-controls pointing to content', () => {
    renderAccordion();
    const trigger = screen.getByText('Section 1');
    const controlsId = trigger.getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();
    expect(document.getElementById(controlsId!)).toBeInTheDocument();
  });

  it('content region has aria-labelledby', () => {
    renderAccordion();
    const content = screen.getByText('Content 1');
    expect(content).toHaveAttribute('role', 'region');
    expect(content).toHaveAttribute('aria-labelledby');
  });

  it('supports multiple type', async () => {
    const user = userEvent.setup();
    renderAccordion({ type: 'multiple' });

    await user.click(screen.getByText('Section 2'));
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('single type closes other panels', async () => {
    const user = userEvent.setup();
    renderAccordion({ type: 'single' });

    await user.click(screen.getByText('Section 2'));
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('collapsible allows closing all panels', async () => {
    const user = userEvent.setup();
    renderAccordion({ collapsible: true });

    await user.click(screen.getByText('Section 1'));
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('passes axe accessibility check', async () => {
    const { container } = renderAccordion();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
