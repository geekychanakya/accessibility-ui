import type { Meta, StoryObj } from '@storybook/react';
import { Toggle, Switch } from '@ax-ui/react';

const meta: Meta = {
  title: 'Primitives/Toggle',
  parameters: {
    docs: {
      description: {
        component: 'Toggle button and Switch components. Implement WAI-ARIA Switch pattern.',
      },
    },
  },
};

export default meta;

export const ToggleButton: StoryObj = {
  render: () => <Toggle>Bold</Toggle>,
};

export const SwitchDefault: StoryObj = {
  name: 'Switch',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Switch aria-label="Dark mode" />
      <span>Dark mode</span>
    </div>
  ),
};

export const SwitchDisabled: StoryObj = {
  name: 'Switch (Disabled)',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Switch aria-label="Disabled" disabled />
      <span>Disabled switch</span>
    </div>
  ),
};
