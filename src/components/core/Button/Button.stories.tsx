import type { ComponentType } from "react";
import { useCallback, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, type ButtonAsyncState } from "./Button";

/** Тёмная тема — токены из `:root`, явный фон под сторисы. */
const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex flex-col items-center justify-center w-full p-8 text-b-text"
      style={{ backgroundColor: "var(--b-color-bg)" }}
    >
      <Story />
    </div>
  ),
] as const;

const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-b-theme="light"
      className="box-border flex flex-col items-center justify-center w-full p-8 text-b-text"
      style={{ backgroundColor: "var(--b-color-bg)" }}
    >
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...darkThemeDecorator],
  args: {
    children: "Кнопка",
    variant: "default",
    size: "s",
    animated: true,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "ghost", "destructive"],
    },
    size: { control: "select", options: ["s", "m", "l", "xl"] },
    animated: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  name: "Размеры (s — xl)",
  render: () => (
    <div className="flex items-start gap-3">
      <Button size="s">Small</Button>
      <Button size="m">Medium</Button>
      <Button size="l">Large</Button>
      <Button size="xl">Extra large</Button>
    </div>
  ),
};

export const Variants: Story = {
  name: "Варианты (default — destructive)",
  render: () => (
    <div className="flex items-start gap-3">
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Удалить</Button>
    </div>
  ),
};

export const VariantsOnLightTheme: Story = {
  name: "Варианты — светлая тема",
  decorators: [...lightThemeDecorator],
  render: () => (
    <div className="flex flex-wrap items-start gap-3">
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Удалить</Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithoutAnimation: Story = {
  args: { animated: false },
};

export const OnLightTheme: Story = {
  name: "Светлая тема (data-b-theme)",
  decorators: [...lightThemeDecorator],
};

export const AsyncSuccess: Story = {
  name: "Async → успех",
  args: {
    children: "Сохранить",
    onAsyncClick: () =>
      new Promise<boolean>((resolve) => {
        window.setTimeout(() => resolve(true), 1400);
      }),
  },
};

export const AsyncError: Story = {
  name: "Async → ошибка",
  args: {
    children: "Отправить",
    onAsyncClick: () =>
      new Promise<boolean>((resolve) => {
        window.setTimeout(() => resolve(false), 1400);
      }),
  },
};

function ControlledAsyncDemo() {
  const [state, setState] = useState<ButtonAsyncState>("idle");

  const run = useCallback(() => {
    if (state !== "idle") return;
    setState("loading");
    window.setTimeout(() => {
      setState(Math.random() > 0.5 ? "success" : "error");
    }, 1200);
  }, [state]);

  return (
    <div className="flex flex-col items-center gap-3">
      <Button asyncState={state} onClick={run} disabled={state !== "idle"}>
        Контролируемая
      </Button>
      <button
        type="button"
        className="text-b-muted text-sm underline"
        onClick={() => setState("idle")}
      >
        Сбросить в idle
      </button>
    </div>
  );
}

export const ControlledAsync: Story = {
  name: "Контроль asyncState",
  render: () => <ControlledAsyncDemo />,
};
