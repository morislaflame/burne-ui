import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoVolumeHigh } from "react-icons/io5";

import { Slider } from "./Slider";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[18rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
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
      className="box-border flex min-h-[18rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Слайдер с кружком в стиле `Checkbox`: при захвате — заливка accent и squeeze, при отпускании заливка исчезает. Опциональная иконка в кружке: accent в покое, accent-foreground при захвате. Поддерживает range, деления (`marks`), disabled и вертикальную ориентацию.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  args: {
    min: 0,
    max: 100,
    step: 1,
    size: "base" as const,
    orientation: "horizontal" as const,
    disabled: false,
    showValue: true,
    label: "Громкость",
    defaultValue: 40,
  },
  argTypes: {
    size: { control: "select", options: ["small", "base", "medium", "large"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      {(["small", "base", "medium", "large"] as const).map((size) => (
        <Slider
          key={size}
          size={size}
          label={`Размер ${size}`}
          showValue
          defaultValue={30 + (size === "large" ? 40 : size === "medium" ? 25 : 15)}
        />
      ))}
    </div>
  ),
};

export const Range: Story = {
  name: "Диапазон",
  render: () => (
    <Slider
      range
      label="Цена"
      showValue
      min={0}
      max={1000}
      step={10}
      defaultValue={[200, 750]}
      formatValue={(v) => `${v} ₽`}
    />
  ),
};

export const WithMarks: Story = {
  name: "Деления",
  render: () => (
    <Slider
      label="Уровень"
      showValue
      min={0}
      max={100}
      marks={[0, 25, 50, 75, 100]}
      defaultValue={50}
    />
  ),
};

export const WithIcon: Story = {
  name: "С иконкой",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      <Slider
        label="Громкость"
        showValue
        defaultValue={45}
        icon={<IoVolumeHigh aria-hidden className="size-full" />}
      />
      <Slider
        range
        label="Диапазон"
        showValue
        defaultValue={[25, 70]}
        icon={<IoVolumeHigh aria-hidden className="size-full" />}
      />
    </div>
  ),
};

export const CustomThickness: Story = {
  name: "Своя толщина",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      <Slider label="10px" showValue thickness={10} defaultValue={35} />
      <Slider label="1.25rem" showValue thickness="1.25rem" defaultValue={55} />
      <Slider
        label="size=small + thickness=20"
        showValue
        size="small"
        thickness={20}
        defaultValue={70}
      />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Отключён",
  args: {
    disabled: true,
    defaultValue: 60,
    label: "Недоступно",
  },
};

export const Vertical: Story = {
  name: "Вертикальный",
  render: () => (
    <div className="flex h-64 items-center gap-xlarge">
      <Slider
        orientation="vertical"
        label="Яркость"
        showValue
        defaultValue={65}
      />
      <Slider
        orientation="vertical"
        range
        label="Диапазон"
        showValue
        defaultValue={[20, 80]}
      />
    </div>
  ),
};

export const WithoutLabel: Story = {
  name: "Без подписи",
  args: {
    label: undefined,
    showValue: false,
    defaultValue: 25,
  },
};

function ControlledDemo() {
  const [value, setValue] = useState(35);
  return (
    <Slider
      label="Контролируемый"
      showValue
      value={value}
      onValueChange={setValue}
    />
  );
}

export const Controlled: Story = {
  name: "Контролируемый",
  render: () => <ControlledDemo />,
};

export const OnLightTheme: Story = {
  name: "Светлая тема",
  decorators: [...lightThemeDecorator],
  args: {
    label: "Светлая тема",
    defaultValue: 55,
  },
};
