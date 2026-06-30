import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "@/components/core/Input";
import { Label } from "@/components/core/Label";

const decorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[10rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Подпись поля формы. Поддерживает `htmlFor`, `isRequired` и контекст `FieldLabelContext` из Input/ComboBox. `Label.Slot` — null-компонент для compound-разметки.",
      },
    },
  },
  decorators: [...decorator],
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "По умолчанию",
  render: () => <Label htmlFor="label-demo">Email</Label>,
};

export const Required: Story = {
  name: "Обязательное поле",
  render: () => (
    <Label htmlFor="label-required" isRequired>
      Пароль
    </Label>
  ),
};

export const WithInput: Story = {
  name: "С Input",
  render: () => (
    <Input label="Имя пользователя" placeholder="ivan" className="max-w-sm" />
  ),
};

export const LegendSpan: Story = {
  name: "Без htmlFor (span)",
  render: () => <Label id="legend-label">Заголовок секции</Label>,
};

export const CustomClassNames: Story = {
  name: "Полная кастомизация classNames",
  parameters: {
    docs: {
      description: {
        story: "кастомизация classNames для Label",
      },
    },
  },
  render: () => (
    <Label
      htmlFor="label-custom"
      isRequired
      classNames={{
        root: "rounded-mid border border-primary/30 px-base py-xsmall",
        text: "text-primary font-semibold",
        required: "text-warning",
      }}
    >
      Email
    </Label>
  ),
};
