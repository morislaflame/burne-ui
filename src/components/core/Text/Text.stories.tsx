import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Text } from "./Text";

/** Dark theme — tokens from `:root`, explicit background for stories. */
const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-theme="light"
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Text",
  component: Text,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...darkThemeDecorator],
  args: {
    variant: "base" as const,
    children: "Burne UI design system sample text",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "accent-header",
        "header-1",
        "header-2",
        "large",
        "mid",
        "base",
        "small",
        "tools",
      ],
    },
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Burne UI design system sample text")).toBeVisible();
  },
};

export const AllVariants: Story = {
  name: "All variants",
  render: () => (
    <div className="flex flex-col gap-plus">
      <Text variant="accent-header">accent-header</Text>
      <Text variant="header-1">header-1</Text>
      <Text variant="header-2">header-2</Text>
      <Text variant="large">text-large</Text>
      <Text variant="mid">text-mid</Text>
      <Text variant="base">text-base</Text>
      <Text variant="small" className="text-muted">
        text-small
      </Text>
      <Text variant="tools" className="text-muted">
        text-tools
      </Text>
    </div>
  ),
};

export const AsSpanWithWrap: Story = {
  name: "As span + wrap",
  render: () => (
    <div
      className="w-[140px]"
    >
    <Text
      variant="header-2"
      as="span"
      className="break-words break-all"
    >
      very_long_filename_without_spaces_for_break_all_test.tsx
    </Text>
    </div>
  ),
};

export const OnSurface: Story = {
  name: "On surface panel",
  render: () => (
    <div
      className="box-border w-full max-w-xl rounded-base border-token p-mid text-foreground"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="flex flex-col gap-plus">
        <Text variant="accent-header">accent-header</Text>
        <Text variant="header-1">header-1</Text>
        <Text variant="header-2">header-2</Text>
        <Text variant="large">text-large</Text>
        <Text variant="mid">text-mid</Text>
        <Text variant="base">text-base</Text>
        <Text variant="small" className="text-muted">
          text-small
        </Text>
        <Text variant="tools" className="text-muted">
          tools
        </Text>
      </div>
    </div>
  ),
};

export const OnLightTheme: Story = {
  name: "Light theme (data-theme)",
  decorators: [...lightThemeDecorator],
};
