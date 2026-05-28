import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Meter } from "./Meter";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
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
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Meter",
  component: Meter,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Индикатор уровня (read-only): линия с заливкой от min до текущего значения. Опциональные подпись и статус сверху, размеры, `color` и `thickness` как у `Slider`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  args: {
    min: 0,
    max: 100,
    size: "base" as const,
    orientation: "horizontal" as const,
    value: 42,
    label: "Загрузка",
    showValue: true,
  },
  argTypes: {
    size: { control: "select", options: ["small", "base", "medium", "large"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof Meter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      {(["small", "base", "medium", "large"] as const).map((size) => (
        <Meter
          key={size}
          size={size}
          label={`Размер ${size}`}
          showValue
          value={25 + (size === "large" ? 50 : size === "medium" ? 35 : size === "base" ? 20 : 10)}
        />
      ))}
    </div>
  ),
};

export const CustomColor: Story = {
  name: "Свой цвет",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-mid">
      <Meter label="Accent (по умолчанию)" showValue value={65} />
      <Meter
        label="Success"
        showValue
        value={80}
        color="var(--color-success)"
      />
      <Meter
        label="Danger"
        showValue
        value={35}
        color="var(--color-danger)"
      />
      <Meter
        label="Warning"
        showValue
        value={55}
        color="var(--color-warning)"
      />
      <Meter label="Hex" showValue value={70} color="#7c3aed" />
      <Meter
        label="Градиент"
        showValue
        value={85}
        color="linear-gradient(90deg, var(--color-accent) 0%, var(--color-info) 100%)"
      />
    </div>
  ),
};

export const CustomThickness: Story = {
  name: "Своя толщина",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      <Meter label="6px" showValue thickness={6} value={40} />
      <Meter label="1rem" showValue thickness="1rem" value={60} />
      <Meter
        label="size=small + thickness=16"
        showValue
        size="small"
        thickness={16}
        value={75}
      />
    </div>
  ),
};

export const StatusText: Story = {
  name: "Текст состояния",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-mid">
      <Meter label="Батарея" valueText="Заряжается" value={72} />
      <Meter label="Сеть" valueText="Отличное соединение" value={92} color="var(--color-success)" />
      <Meter
        label="Память"
        value={88}
        showValue
        formatValue={(v) => `${v}% занято`}
      />
    </div>
  ),
};

export const Vertical: Story = {
  name: "Вертикальный",
  render: () => (
    <div className="flex h-64 items-end gap-xlarge">
      <Meter orientation="vertical" label="CPU" showValue value={45} />
      <Meter
        orientation="vertical"
        label="RAM"
        showValue
        value={72}
        color="var(--color-info)"
      />
      <Meter
        orientation="vertical"
        label="Disk"
        valueText="Высокая"
        value={88}
        color="var(--color-warning)"
      />
    </div>
  ),
};

export const WithoutLabel: Story = {
  name: "Без подписи",
  args: {
    label: undefined,
    showValue: true,
    value: 30,
  },
};

function AnimatedDemo() {
  const [value, setValue] = useState(20);

  useEffect(() => {
    const id = window.setInterval(() => {
      setValue((v) => (v >= 100 ? 15 : v + 7));
    }, 1200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Meter
      label="Анимация значения"
      showValue
      value={value}
      color="linear-gradient(90deg, var(--color-accent) 0%, var(--color-success) 100%)"
    />
  );
}

export const Animated: Story = {
  name: "Анимация",
  render: () => <AnimatedDemo />,
};

export const OnLightTheme: Story = {
  name: "Светлая тема",
  decorators: [...lightThemeDecorator],
  args: {
    label: "Светлая тема",
    showValue: true,
    value: 58,
  },
};
