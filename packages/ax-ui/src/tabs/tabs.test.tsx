import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Tabs } from './index';

expect.extend(toHaveNoViolations);

function renderTabs(props: { defaultValue?: string } = {}) {
  return render(
    <Tabs.Root defaultValue={props.defaultValue ?? 'tab1'}>
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Content 1</Tabs.Content>
      <Tabs.Content value="tab2">Content 2</Tabs.Content>
      <Tabs.Content value="tab3">Content 3</Tabs.Content>
    </Tabs.Root>
  );
}

describe('Tabs', () => {
  it('renders tabs with correct roles', () => {
    renderTabs();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });

  it('shows first tab content by default', () => {
    renderTabs();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('switches tab on click', async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('has aria-selected on active tab', () => {
    renderTabs();
    expect(screen.getByText('Tab 1')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Tab 2')).toHaveAttribute('aria-selected', 'false');
  });

  it('uses roving tabindex', () => {
    renderTabs();
    expect(screen.getByText('Tab 1')).toHaveAttribute('tabIndex', '0');
    expect(screen.getByText('Tab 2')).toHaveAttribute('tabIndex', '-1');
  });

  it('navigates with ArrowRight', async () => {
    const user = userEvent.setup();
    renderTabs();

    screen.getByText('Tab 1').focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('Tab 2')).toHaveFocus();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('navigates with ArrowLeft', async () => {
    const user = userEvent.setup();
    renderTabs();

    screen.getByText('Tab 1').focus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByText('Tab 3')).toHaveFocus();
  });

  it('navigates with Home/End', async () => {
    const user = userEvent.setup();
    renderTabs({ defaultValue: 'tab2' });

    screen.getByText('Tab 2').focus();
    await user.keyboard('{Home}');
    expect(screen.getByText('Tab 1')).toHaveFocus();

    await user.keyboard('{End}');
    expect(screen.getByText('Tab 3')).toHaveFocus();
  });

  it('tab panel has aria-labelledby pointing to its trigger', () => {
    renderTabs();
    const panel = screen.getByRole('tabpanel');
    const trigger = screen.getByText('Tab 1');
    expect(panel).toHaveAttribute('aria-labelledby', trigger.id);
  });

  it('trigger has aria-controls pointing to panel', () => {
    renderTabs();
    const trigger = screen.getByText('Tab 1');
    const panel = screen.getByRole('tabpanel');
    expect(trigger).toHaveAttribute('aria-controls', panel.id);
  });

  it('passes axe accessibility check', async () => {
    const { container } = renderTabs();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('calls onValueChange', async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();

    render(
      <Tabs.Root defaultValue="tab1" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Content 1</Tabs.Content>
        <Tabs.Content value="tab2">Content 2</Tabs.Content>
      </Tabs.Root>
    );

    await user.click(screen.getByText('Tab 2'));
    expect(onValueChange).toHaveBeenCalledWith('tab2');
  });
});
