import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from '@ax-ui/react';

const meta: Meta = {
  title: 'Primitives/Popover',
  parameters: {
    docs: {
      description: {
        component: 'A non-modal popover. Dismisses on Escape and outside click.',
      },
    },
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>Open Popover</Popover.Trigger>
      <Popover.Content>
        <h4 style={{ margin: '0 0 8px' }}>Popover Title</h4>
        <p style={{ margin: 0 }}>This is the popover content. It closes on Escape or outside click.</p>
        <Popover.Close style={{ marginTop: '8px' }}>Close</Popover.Close>
      </Popover.Content>
    </Popover.Root>
  ),
};
