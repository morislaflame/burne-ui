import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProgressBar } from "./ProgressBar";

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
  title: "Core Components/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Полоса прогресса (read-only): determinate — заливка до текущего значения; indeterminate — бегущая анимация. Подпись и статус сверху, размеры, `color` и `thickness` как у `Meter` / `Slider`.",
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
    label: "Загрузка файла",
    showValue: true,
  },
  argTypes: {
    size: { control: "select", options: ["small", "base", "medium", "large"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Indeterminate: Story = {
  name: "Indeterminate",
  args: {
    indeterminate: true,
    label: "Обработка",
    showValue: false,
  },
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      {(["small", "base", "medium", "large"] as const).map((size) => (
        <ProgressBar
          key={size}
          size={size}
          label={`Размер ${size}`}
          showValue
          value={20 + (size === "large" ? 55 : size === "medium" ? 40 : size === "base" ? 25 : 10)}
        />
      ))}
    </div>
  ),
};

export const CustomColor: Story = {
  name: "Свой цвет",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-mid">
      <ProgressBar label="Accent" showValue value={65} />
      <ProgressBar
        label="Success"
        showValue
        value={100}
        color="var(--color-success)"
      />
      <ProgressBar
        label="Danger"
        showValue
        value={40}
        color="var(--color-danger)"
      />
      <ProgressBar
        label="Градиент"
        showValue
        value={78}
        color="linear-gradient(90deg, var(--color-accent) 0%, var(--color-info) 100%)"
      />
      <ProgressBar
        label="Indeterminate"
        indeterminate
        color="var(--color-info)"
      />
    </div>
  ),
};

export const CustomThickness: Story = {
  name: "Своя толщина",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      <ProgressBar label="6px" showValue thickness={6} value={40} />
      <ProgressBar label="1rem" showValue thickness="1rem" value={60} />
      <ProgressBar
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
      <ProgressBar label="Экспорт" valueText="3 из 12 файлов" value={25} />
      <ProgressBar
        label="Синхронизация"
        indeterminate
        valueText="Подключение…"
      />
      <ProgressBar
        label="Установка"
        value={66}
        showValue
        formatValue={(v) => `${v}%`}
      />
    </div>
  ),
};

export const Vertical: Story = {
  name: "Вертикальный",
  render: () => (
    <div className="flex h-64 items-end gap-xlarge">
      <ProgressBar orientation="vertical" label="Шаг 1" showValue value={100} />
      <ProgressBar orientation="vertical" label="Шаг 2" showValue value={55} />
      <ProgressBar orientation="vertical" label="Шаг 3" indeterminate />
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

function UploadDemo() {
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const id = window.setInterval(() => {
      setValue((v) => {
        if (v >= 100) {
          setDone(true);
          return 100;
        }
        return v + 4;
      });
    }, 120);
    return () => window.clearInterval(id);
  }, [done]);

  return (
    <ProgressBar
      label="Загрузка"
      showValue
      value={value}
      valueText={done ? "Готово" : undefined}
      color={
        done
          ? "var(--color-success)"
          : "linear-gradient(90deg, var(--color-accent) 0%, var(--color-info) 100%)"
      }
    />
  );
}

export const Animated: Story = {
  name: "Анимация",
  render: () => <UploadDemo />,
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
