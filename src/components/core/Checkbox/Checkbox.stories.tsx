import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoStar } from "react-icons/io5";

import { Checkbox } from "./Checkbox";

const framedDecorator = [
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
      <div className="mx-auto w-full max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...framedDecorator],
  args: {
    label: "Согласие на обработку данных",
    size: "base" as const,
    variant: "default" as const,
    disabled: false,
    danger: false,
  },
  argTypes: {
    size: { control: "select", options: ["small", "base", "medium", "large"] },
    variant: { control: "select", options: ["default", "secondary", "outline"] },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid">
      {(["small", "base", "medium", "large"] as const).map((size) => (
        <Checkbox
          key={size}
          size={size}
          defaultChecked={size === "base"}
          label={`Размер ${size}`}
          description="Подзаголовок в muted"
        />
      ))}
    </div>
  ),
};

export const Variants: Story = {
  name: "Варианты кружка",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid">
      <Checkbox variant="default" defaultChecked label="default" />
      <Checkbox variant="secondary" label="secondary" />
      <Checkbox variant="outline" defaultChecked label="outline (o)" />
    </div>
  ),
};

export const States: Story = {
  name: "Состояния",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid">
      <Checkbox label="Обычное" description="Без danger" />
      <Checkbox danger label="С ошибкой" description="Подзаголовок остаётся muted" />
      <Checkbox disabled label="Отключено" description="Нельзя переключить" />
      <Checkbox disabled defaultChecked label="Отключено, включено" />
    </div>
  ),
};

export const CustomIcon: Story = {
  name: "Своя иконка",
  render: () => (
    <Checkbox
      defaultChecked
      checkIcon={<IoStar aria-hidden className="size-full" />}
      label="Избранное"
      description="Вместо галочки — звезда"
    />
  ),
};

function ControlledDemo() {
  const [on, setOn] = useState(false);
  return (
    <div className="flex max-w-md flex-col gap-plus">
      <Checkbox
        checked={on}
        onChange={(e) => setOn(e.target.checked)}
        label="Управляемый чекбокс"
        description={`Сейчас: ${on ? "вкл" : "выкл"}`}
      />
    </div>
  );
}

export const Controlled: Story = {
  name: "Контролируемый",
  render: () => <ControlledDemo />,
};

export const OnLightTheme: Story = {
  name: "Светлая тема",
  decorators: [...lightThemeDecorator],
  render: () => (
    <div className="flex max-w-md flex-col gap-mid">
      <Checkbox defaultChecked label="Светлая тема" description="accent / accent-foreground" />
      <Checkbox variant="outline" label="Outline" />
    </div>
  ),
};
