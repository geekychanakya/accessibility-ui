import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from '@ax-ui/react';

const meta: Meta = {
  title: 'Primitives/Menu',
  parameters: {
    docs: {
      description: {
        component: 'A dropdown menu with roving tabindex navigation. Implements WAI-ARIA Menu pattern.',
      },
    },
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content>
        <Menu.Item onSelect={() => console.log('edit')}>Edit</Menu.Item>
        <Menu.Item onSelect={() => console.log('duplicate')}>Duplicate</Menu.Item>
        <Menu.Separator />
        <Menu.Item onSelect={() => console.log('archive')}>Archive</Menu.Item>
        <Menu.Item onSelect={() => console.log('delete')} disabled>
          Delete
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};
