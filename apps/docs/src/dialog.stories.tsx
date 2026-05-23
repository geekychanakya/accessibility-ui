import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from '@ax-ui/react';

const meta: Meta = {
  title: 'Primitives/Dialog',
  parameters: {
    docs: {
      description: {
        component: 'A modal dialog built on the native `<dialog>` element. Implements WAI-ARIA Dialog pattern with focus trap and keyboard dismissal.',
      },
    },
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Edit Profile</Dialog.Title>
        <Dialog.Description>
          Make changes to your profile. Click save when you&apos;re done.
        </Dialog.Description>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <Dialog.Close>Cancel</Dialog.Close>
          <Dialog.Close>Save changes</Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  ),
};

export const Controlled: StoryObj = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open Controlled Dialog</button>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Content>
            <Dialog.Title>Controlled Dialog</Dialog.Title>
            <Dialog.Description>This dialog is controlled externally.</Dialog.Description>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
      </>
    );
  },
};

import { useState } from 'react';
