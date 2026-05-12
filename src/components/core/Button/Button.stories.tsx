import type { ComponentType } from "react";
import { useCallback, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoAdd } from "react-icons/io5";

import { Button, type ButtonAsyncState } from "./Button";

/** Тёмная тема — токены из `:root`, явный фон под сторисы. */
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
    size: "base",
    animated: true,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "secondary",
        "ghost",
        "danger",
        "success",
        "info",
        "warning",
      ],
    },
    size: {
      control: "select",
      options: ["small", "base", "large", "xlarge"],
    },
    animated: { control: "boolean" },
    ripple: {
      control: "boolean",
      description:
        "Встроенный `<Ripple />` с тоном под variant. По умолчанию в сторибуке включён для демо.",
    },
  },
  render: (args) => <Button {...args} />,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  name: "Размеры (small — xlarge)",
  render: () => (
    <div className="flex items-start gap-plus">
      <Button size="small">
        Small
      </Button>
      <Button size="base">
        Base
      </Button>
      <Button size="large">
        Large
      </Button>
      <Button size="xlarge">
        Extra large
      </Button>
    </div>
  ),
};

export const Variants: Story = {
  name: "Варианты",
  render: () => (
    <div className="flex flex-wrap items-start gap-plus">
      <Button variant="default">
        Default
      </Button>
      <Button variant="outline">
        Outline
      </Button>
      <Button variant="secondary">
        Secondary
      </Button>
      <Button variant="ghost" ripple>
        Ghost
      </Button>
      <Button variant="danger" ripple>
        Удалить
      </Button>
      <Button variant="success" ripple>
        Готово
      </Button>
      <Button variant="info" ripple>
        Сведения
      </Button>
      <Button variant="warning" ripple>
        Внимание
      </Button>
    </div>
  ),
};

export const VariantsOnLightTheme: Story = {
  name: "Варианты — светлая тема",
  decorators: [...lightThemeDecorator],
  render: () => (
    <div className="flex flex-wrap items-start gap-plus">
      <Button variant="default">
        Default
      </Button>
      <Button variant="outline">
        Outline
      </Button>
      <Button variant="secondary">
        Secondary
      </Button>
      <Button variant="ghost" ripple>
        Ghost
      </Button>
      <Button variant="danger" ripple>
        Удалить
      </Button>
      <Button variant="success" ripple>
        Готово
      </Button>
      <Button variant="info" ripple>
        Сведения
      </Button>
      <Button variant="warning" ripple>
        Внимание
      </Button>
    </div>
  ),
};

export const WithLeftIcon: Story = {
  name: "С иконкой слева",
  render: () => (
    <div className="flex flex-wrap items-center gap-plus">
      <Button size="small" leftIcon={<IoAdd aria-hidden />}>
        Добавить
      </Button>
      <Button size="base" variant="outline" leftIcon={<IoAdd aria-hidden />}>
        Создать
      </Button>
      <Button size="large" variant="ghost" leftIcon={<IoAdd aria-hidden />}>
        Ещё
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithoutAnimation: Story = {
  args: { animated: false },
};

export const WithoutRipple: Story = {
  name: "С рипплом",
  args: { ripple: true },
};

export const OnLightTheme: Story = {
  name: "Светлая тема (data-theme)",
  decorators: [...lightThemeDecorator],
};

export const AsyncSuccess: Story = {
  name: "Async → успех",
  args: {
    children: "Сохранить",
    ripple: true,
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
    ripple: true,
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
    <div className="flex flex-col items-center gap-plus">
      <Button asyncState={state} onClick={run} disabled={state !== "idle"} ripple>
        Контролируемая
      </Button>
      <button
        type="button"
        className="text-muted text-sm underline"
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
