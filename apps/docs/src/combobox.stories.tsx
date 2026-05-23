import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from '@ax-ui/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Primitives/Combobox',
  parameters: {
    docs: {
      description: {
        component: 'An autocomplete combobox with keyboard navigation. Implements WAI-ARIA Combobox pattern.',
      },
    },
  },
};

export default meta;

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'orange', label: 'Orange' },
  { value: 'peach', label: 'Peach' },
  { value: 'strawberry', label: 'Strawberry' },
];

export const Default: StoryObj = {
  render: function Render() {
    const [query, setQuery] = useState('');
    const filtered = fruits.filter((f) =>
      f.label.toLowerCase().includes(query.toLowerCase())
    );

    return (
      <div style={{ maxWidth: '300px' }}>
        <Combobox.Root onInputValueChange={setQuery}>
          <Combobox.Input placeholder="Search fruits..." />
          <Combobox.List>
            {filtered.map((fruit) => (
              <Combobox.Option key={fruit.value} value={fruit.value} label={fruit.label}>
                {fruit.label}
              </Combobox.Option>
            ))}
          </Combobox.List>
        </Combobox.Root>
      </div>
    );
  },
};
