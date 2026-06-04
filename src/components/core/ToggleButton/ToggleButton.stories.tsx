import { useState, type ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoBookmarkOutline, IoHeartOutline } from "react-icons/io5";

import { Text } from "@/components/core/Text";
import { COMPONENT_SIZES } from "@/components/core/utils/componentSize";

import { ToggleButton, type ToggleButtonVariant } from "./ToggleButton";

const VARIANTS: ToggleButtonVariant[] = ["default", "outline", "ghost"];

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

const meta = {
  title: "Core Components/ToggleButton",
  component: ToggleButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Кнопка-переключатель (лайк, закладка): варианты `default`, `outline`, `ghost`. При нажатии плавно заливается accent, `aria-pressed`. Hover-lift и squeeze как у `Button`. Без `min-w-button-*` — только паддинги; высота как у кнопки.",
      },
    },
  },
  decorators: [...framedDecorator],
  args: {
    variant: "outline",
    size: "base",
    animated: true,
    defaultPressed: false,
    disabled: false,
  },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    size: { control: "select", options: COMPONENT_SIZES },
  },
} satisfies Meta<typeof ToggleButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ToggleButton leftIcon={<IoHeartOutline aria-hidden />}>Нравится</ToggleButton>
  ),
};

export const Variants: Story = {
  name: "Варианты",
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-mid">
      {VARIANTS.map((variant) => (
        <ToggleButton
          key={variant}
          variant={variant}
          leftIcon={<IoHeartOutline aria-hidden />}
        >
          {variant}
        </ToggleButton>
      ))}
    </div>
  ),
};

export const IconOnly: Story = {
  name: "Только иконка",
  render: () => (
    <ToggleButton aria-label="Добавить в закладки" leftIcon={<IoBookmarkOutline aria-hidden />} />
  ),
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-mid">
      {COMPONENT_SIZES.map((size) => (
        <ToggleButton
          key={size}
          size={size}
          leftIcon={<IoHeartOutline aria-hidden />}
        >
          {size}
        </ToggleButton>
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  name: "Контролируемый режим",
  render: function ControlledToggle() {
    const [pressed, setPressed] = useState(false);
    return (
      <div className="flex flex-col items-center gap-mid">
        <ToggleButton
          pressed={pressed}
          onPressedChange={setPressed}
          leftIcon={<IoHeartOutline aria-hidden />}
        >
          {pressed ? "Нравится" : "Лайкнуть"}
        </ToggleButton>
        <Text as="p" variant="small" className="text-muted">
          pressed={String(pressed)}
        </Text>
      </div>
    );
  },
};

export const DefaultPressed: Story = {
  name: "Изначально нажата",
  args: {
    defaultPressed: true,
    children: "В избранном",
    leftIcon: <IoBookmarkOutline aria-hidden />,
  },
};

export const Disabled: Story = {
  name: "Disabled",
  args: {
    disabled: true,
    children: "Недоступно",
    leftIcon: <IoHeartOutline aria-hidden />,
  },
};
