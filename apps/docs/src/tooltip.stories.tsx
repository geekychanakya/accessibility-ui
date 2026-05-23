import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from '@ax-ui/react';

const meta: Meta = {
  title: 'Primitives/Tooltip',
  parameters: {
    docs: {
      description: {
        component: 'A tooltip that shows on hover/focus with configurable delay. Implements WAI-ARIA Tooltip pattern.',
      },
    },
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Tooltip.Root delayMs={300}>
      <Tooltip.Trigger>
        <button>Hover or focus me</button>
      </Tooltip.Trigger>
      <Tooltip.Content>This is a helpful tooltip</Tooltip.Content>
    </Tooltip.Root>
  ),
};
