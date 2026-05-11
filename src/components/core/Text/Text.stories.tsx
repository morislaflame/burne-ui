import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Text } from "./Text";

/** Тёмная тема — токены из `:root`, явный фон под сторисы. */
const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex flex-col items-center justify-center w-full p-xlarge text-foreground"
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
      className="box-border flex flex-col items-center justify-center w-full p-xlarge text-foreground"
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
    children: "Пример текста дизайн-системы Burne UI",
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

export const Default: Story = {};

export const AsSpanWithWrap: Story = {
  name: "Как span + перенос",
  render: () => (
    <div
      className="w-[140px]"
    >
    <Text
      variant="header-2"
      as="span"
      className="break-words break-all"
    >
      Очень_длинное_имя_файла_без_пробелов_для_проверки_break_all.tsx
    </Text>
    </div>
  ),
};

export const OnSurface: Story = {
  name: "На панели surface",
  render: () => (
    <div
      className="box-border w-full max-w-xl rounded-base border border-base p-mid text-foreground"
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
  name: "Светлая тема (data-theme)",
  decorators: [...lightThemeDecorator],
};
