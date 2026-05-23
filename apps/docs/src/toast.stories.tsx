import type { Meta, StoryObj } from '@storybook/react';
import { Toast, useToast } from '@ax-ui/react';

const meta: Meta = {
  title: 'Primitives/Toast',
  parameters: {
    docs: {
      description: {
        component: 'Toast notifications with auto-dismiss. Uses a live region for screen reader announcements.',
      },
    },
  },
};

export default meta;

function ToastDemo() {
  const { addToast } = useToast();

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={() => addToast({ title: 'Success', description: 'Your changes have been saved.' })}>
        Show Success Toast
      </button>
      <button onClick={() => addToast({ title: 'Error', description: 'Something went wrong.' })}>
        Show Error Toast
      </button>
    </div>
  );
}

export const Default: StoryObj = {
  render: () => (
    <Toast.Provider>
      <ToastDemo />
      <Toast.Viewport />
    </Toast.Provider>
  ),
};
