import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "@/components/core/Checkbox";

import { CheckboxGroup } from "./CheckboxGroup";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
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
  title: "Composite Components/CheckboxGroup",
  component: CheckboxGroup,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [...darkThemeDecorator],
  args: {
    title: "Способ доставки",
    description: "Можно выбрать несколько вариантов.",
    isRequired: false,
    selection: "multiple" as const,
  },
  argTypes: {
    selection: {
      control: "radio",
      options: ["multiple", "single"],
    },
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <CheckboxGroup {...args}>
      <Checkbox name="ship" value="courier" label="Курьер" />
      <Checkbox name="ship" value="pickup" label="Самовывоз" />
      <Checkbox name="ship" value="post" label="Почта" />
    </CheckboxGroup>
  ),
};

export const SingleSelection: Story = {
  name: "Один вариант",
  args: {
    ...meta.args,
    description: "Отмечен только один пункт; при смене выбора остальные снимаются.",
    selection: "single" as const,
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <Checkbox name="ship" value="courier" label="Курьер" />
      <Checkbox name="ship" value="pickup" label="Самовывоз" />
      <Checkbox name="ship" value="post" label="Почта" />
    </CheckboxGroup>
  ),
};

export const Required: Story = {
  name: "Обязательное поле",
  args: { isRequired: true },
  render: (args) => (
    <CheckboxGroup {...args} title="Согласия">
      <Checkbox name="terms" label="Пользовательское соглашение" />
      <Checkbox name="marketing" label="Рассылка (необязательно)" />
    </CheckboxGroup>
  ),
};

export const WithoutDescription: Story = {
  name: "Без подзаголовка",
  render: () => (
    <CheckboxGroup title="Теги">
      <Checkbox name="t1" label="Дизайн" />
      <Checkbox name="t2" label="Разработка" />
    </CheckboxGroup>
  ),
};
