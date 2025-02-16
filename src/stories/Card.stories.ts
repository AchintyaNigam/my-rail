import type { Meta, StoryObj } from '@storybook/react';

import { Card } from '@/components/ui/card';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Card> = {
  component: Card,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    //👇 The args you need here will depend on your component
    children: '',
    className: 'w-100 h-100',
  },
};

