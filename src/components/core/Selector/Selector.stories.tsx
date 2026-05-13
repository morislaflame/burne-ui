import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoCheckmarkCircle, IoGlobeOutline } from "react-icons/io5";

import type { SelectorOption } from "./Selector";
import { Selector } from "./Selector";

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

const sampleOptions: SelectorOption[] = [
  {
    value: "ru",
    label: "Русский",
    description: "Интерфейс и уведомления на русском языке",
    icon: <IoGlobeOutline aria-hidden />,
  },
  {
    value: "en",
    label: "English",
    description: "UI and notifications in English",
    icon: <IoGlobeOutline aria-hidden />,
  },
  {
    value: "de",
    label: "Deutsch",
    description: "Nur Titel in der Auswahl; Beschreibung nur in der Liste",
    icon: <IoGlobeOutline aria-hidden />,
  },
];

const meta = {
  title: "Core Components/Selector",
  component: Selector,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Выпадающий выбор с полем поиска: набор текста фильтрует список по `value`, `filterText` и текстовым `label`/`description`. Размеры как у `Input`, панель — fade как у `Dropdown`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  args: {
    variant: "default" as const,
    status: "default" as const,
    size: "base" as const,
    label: "Язык интерфейса",
    hint: "В триггере отображается только название выбранного пункта.",
    placeholder: "Выберите язык",
    options: sampleOptions,
  },
  argTypes: {
    size: { control: "select", options: ["base", "large", "xlarge"] },
    variant: { control: "select", options: ["default", "outline"] },
    status: {
      control: "select",
      options: ["default", "danger", "success", "warning"],
    },
  },
} satisfies Meta<typeof Selector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("ru");
    return (
      <Selector
        {...args}
        value={value}
        onValueChange={setValue}
        options={args.options ?? sampleOptions}
      />
    );
  },
};

export const Outline: Story = {
  args: { variant: "outline" },
  render: Default.render,
};

export const Large: Story = {
  args: { size: "large", label: "Размер large" },
  render: Default.render,
};

export const Disabled: Story = {
  args: { disabled: true, value: "en" },
  render: (args) => (
    <Selector {...args} options={args.options ?? sampleOptions} />
  ),
};

export const LongList: Story = {
  name: "Длинный список",
  render: function LongListDemo() {
    const many: SelectorOption[] = Array.from({ length: 40 }, (_, i) => ({
      value: `opt-${i}`,
      label: `Пункт ${i + 1}`,
      description:
        i % 5 === 0 ? "С опциональным описанием в списке" : undefined,
      icon:
        i % 7 === 0 ? <IoCheckmarkCircle aria-hidden className="text-success" /> : undefined,
    }));
    const [value, setValue] = useState("opt-0");
    return (
      <Selector
        label="Много пунктов"
        hint="Прокрутка внутри панели; `menuMaxHeight` по умолчанию как у дропдауна."
        options={many}
        value={value}
        onValueChange={setValue}
        menuMaxHeight="min(12rem, 50vh)"
      />
    );
  },
};

export const LightTheme: Story = {
  decorators: [...lightThemeDecorator],
  render: Default.render,
};
