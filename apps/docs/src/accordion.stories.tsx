import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from '@ax-ui/react';

const meta: Meta = {
  title: 'Primitives/Accordion',
  parameters: {
    docs: {
      description: {
        component: 'Collapsible content sections. Supports single and multiple open panels. Implements WAI-ARIA Accordion pattern.',
      },
    },
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Accordion.Root defaultValue="item-1" collapsible>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>What is ax-ui?</Accordion.Trigger>
        <Accordion.Content>
          ax-ui is an accessibility-first React component library that provides
          correct, tested, low-dependency primitives.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
        <Accordion.Content>
          Yes! Every component conforms to WAI-ARIA APG patterns and is tested
          with jest-axe and Playwright for keyboard interactions.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>Can I style it?</Accordion.Trigger>
        <Accordion.Content>
          Components ship headless (logic + ARIA + classNames) and styled (with
          default CSS). All visual properties use CSS custom properties under
          the --ax-* prefix.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
};

export const Multiple: StoryObj = {
  render: () => (
    <Accordion.Root type="multiple" defaultValue={['item-1', 'item-2']}>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>Section 1</Accordion.Trigger>
        <Accordion.Content>Content for section 1</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>Section 2</Accordion.Trigger>
        <Accordion.Content>Content for section 2</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>Section 3</Accordion.Trigger>
        <Accordion.Content>Content for section 3</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
};
