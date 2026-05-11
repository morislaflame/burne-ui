import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoHelpCircleOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button/Button";

import { Tooltip, type TooltipVariant } from "./Tooltip";

const VARIANTS: TooltipVariant[] = [
  "default",
  "outline",
  "secondary",
  "danger",
  "info",
  "warning",
  "success",
];

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

/** Фон страницы и `data-theme="light"`, как у `Alert.stories` («Варианты (светлая тема)»). */
const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-theme="light"
      className="box-border w-full p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OnButtonSizes: Story = {
  name: "Размеры на кнопке",
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-mid">
      <Tooltip size="small" variant="default">
        <Tooltip.Trigger>
          <Button size="base" variant="outline" type="button">
            Hover (small)
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Компактный тултип</Tooltip.Content>
      </Tooltip>
      <Tooltip size="base" variant="default">
        <Tooltip.Trigger>
          <Button size="large" variant="outline" type="button">
            Hover (base)
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Стандартный размер подсказки</Tooltip.Content>
      </Tooltip>
      <Tooltip size="large" variant="default">
        <Tooltip.Trigger>
          <Button size="xlarge" variant="outline" type="button">
            Hover (large)
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Более широкий отступ для длинной подсказки</Tooltip.Content>
      </Tooltip>
    </div>
  ),
};

function SemanticVariantsDemo() {
  return (
    <div className="flex min-h-[14rem] max-w-xl flex-row flex-wrap items-center justify-center gap-mid py-xlarge">
      {VARIANTS.map((variant) => (
        <Tooltip key={variant} variant={variant}>
          <Tooltip.Trigger>
            <Button variant="ghost" type="button" className="capitalize">
              {variant}
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>{`Вариант «${variant}»`}</Tooltip.Content>
        </Tooltip>
      ))}
    </div>
  );
}

export const SemanticVariants: Story = {
  name: "Варианты как у Alert — semantic (тёмная тема)",
  render: () => <SemanticVariantsDemo />,
};

export const SemanticVariantsOnLightTheme: Story = {
  name: "Варианты как у Alert — semantic (светлая тема)",
  decorators: [...lightThemeDecorator],
  render: () => <SemanticVariantsDemo />,
};

export const DefaultWithOptionalIcon: Story = {
  name: "Опциональная иконка на default",
  render: () => (
    <Tooltip
      variant="default"
      icon={<IoHelpCircleOutline aria-hidden className="text-accent" />}
    >
      <Tooltip.Trigger>
        <Button size="large" variant="outline" type="button">
          Hover
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Своя иконка только через prop `icon`</Tooltip.Content>
    </Tooltip>
  ),
};

export const SemanticIconHidden: Story = {
  name: "Semantic без иконки",
  render: () => (
    <Tooltip variant="danger" showIcon={false}>
      <Tooltip.Trigger>
        <Button size="large" variant="outline" type="button">
          Hover
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Без стандартной иконки</Tooltip.Content>
    </Tooltip>
  ),
};
