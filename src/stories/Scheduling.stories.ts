import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import Schedule from '@/app/schedule/page';

const meta = {
    title: 'Stories/Scheduling',
    component: Schedule,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Schedule>;

export default meta;

type Story = StoryObj<typeof Schedule>;

export const LoggedOut: Story = {};

// More on component testing: https://storybook.js.org/docs/writing-tests/component-testing
export const LoggedIn: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginButton = canvas.getByRole('button', { name: /Log in/i });
    await expect(loginButton).toBeInTheDocument();
    await userEvent.click(loginButton);
    await expect(loginButton).not.toBeInTheDocument();

    const logoutButton = canvas.getByRole('button', { name: /Log out/i });
    await expect(logoutButton).toBeInTheDocument();
  },
};