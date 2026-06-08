import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "@/components/core/Checkbox";

import { CheckboxGroup } from ".";

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
      <CheckboxGroup.Legend>
        <CheckboxGroup.Label>Способ доставки</CheckboxGroup.Label>
        <CheckboxGroup.Hint>Можно выбрать несколько вариантов.</CheckboxGroup.Hint>
      </CheckboxGroup.Legend>
      <CheckboxGroup.List>
        <Checkbox name="ship" value="courier" label="Курьер" />
        <Checkbox name="ship" value="pickup" label="Самовывоз" />
        <Checkbox name="ship" value="post" label="Почта" />
      </CheckboxGroup.List>
    </CheckboxGroup>
  ),
};

export const SingleSelection: Story = {
  name: "Один вариант",
  args: {
    selection: "single" as const,
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <CheckboxGroup.Legend>
        <CheckboxGroup.Label>Способ доставки</CheckboxGroup.Label>
        <CheckboxGroup.Hint>
          Отмечен только один пункт; при смене выбора остальные снимаются.
        </CheckboxGroup.Hint>
      </CheckboxGroup.Legend>
      <CheckboxGroup.List>
        <Checkbox name="ship" value="courier" label="Курьер" />
        <Checkbox name="ship" value="pickup" label="Самовывоз" />
        <Checkbox name="ship" value="post" label="Почта" />
      </CheckboxGroup.List>
    </CheckboxGroup>
  ),
};

export const Required: Story = {
  name: "Обязательное поле",
  render: () => (
    <CheckboxGroup isRequired>
      <CheckboxGroup.Legend>
        <CheckboxGroup.Label>Согласия</CheckboxGroup.Label>
      </CheckboxGroup.Legend>
      <CheckboxGroup.List>
        <Checkbox name="terms" label="Пользовательское соглашение" />
        <Checkbox name="marketing" label="Рассылка (необязательно)" />
      </CheckboxGroup.List>
    </CheckboxGroup>
  ),
};

export const WithoutDescription: Story = {
  name: "Без подзаголовка",
  render: () => (
    <CheckboxGroup>
      <CheckboxGroup.Legend>
        <CheckboxGroup.Label>Теги</CheckboxGroup.Label>
      </CheckboxGroup.Legend>
      <CheckboxGroup.List>
        <Checkbox name="t1" label="Дизайн" />
        <Checkbox name="t2" label="Разработка" />
      </CheckboxGroup.List>
    </CheckboxGroup>
  ),
};

export const Horizontal: Story = {
  name: "Горизонтально",
  render: () => (
    <CheckboxGroup>
      <CheckboxGroup.Legend>
        <CheckboxGroup.Label>Способ доставки</CheckboxGroup.Label>
        <CheckboxGroup.Hint>Пункты в ряд с переносом при нехватке места.</CheckboxGroup.Hint>
      </CheckboxGroup.Legend>
      <CheckboxGroup.List orientation="horizontal">
        <Checkbox name="ship" value="courier" label="Курьер" />
        <Checkbox name="ship" value="pickup" label="Самовывоз" />
        <Checkbox name="ship" value="post" label="Почта" />
      </CheckboxGroup.List>
    </CheckboxGroup>
  ),
};
