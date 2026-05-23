import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from '@ax-ui/react';

const meta: Meta = {
  title: 'Primitives/Tabs',
  parameters: {
    docs: {
      description: {
        component: 'Tabbed interface with roving tabindex and automatic activation. Implements WAI-ARIA Tabs pattern.',
      },
    },
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Tabs.Root defaultValue="account">
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="password">Password</Tabs.Trigger>
        <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">
        <h3>Account Settings</h3>
        <p>Manage your account information and preferences.</p>
      </Tabs.Content>
      <Tabs.Content value="password">
        <h3>Password</h3>
        <p>Change your password and security settings.</p>
      </Tabs.Content>
      <Tabs.Content value="notifications">
        <h3>Notifications</h3>
        <p>Configure how you receive notifications.</p>
      </Tabs.Content>
    </Tabs.Root>
  ),
};

export const Vertical: StoryObj = {
  render: () => (
    <Tabs.Root defaultValue="general" orientation="vertical">
      <div style={{ display: 'flex', gap: '16px' }}>
        <Tabs.List>
          <Tabs.Trigger value="general">General</Tabs.Trigger>
          <Tabs.Trigger value="editor">Editor</Tabs.Trigger>
          <Tabs.Trigger value="theme">Theme</Tabs.Trigger>
        </Tabs.List>
        <div>
          <Tabs.Content value="general">General settings content</Tabs.Content>
          <Tabs.Content value="editor">Editor settings content</Tabs.Content>
          <Tabs.Content value="theme">Theme settings content</Tabs.Content>
        </div>
      </div>
    </Tabs.Root>
  ),
};
