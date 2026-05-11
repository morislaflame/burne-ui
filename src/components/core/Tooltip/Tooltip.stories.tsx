import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoHelpCircleOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button/Button";

import { Tooltip, type TooltipVariant } from "./Tooltip";

const VARIANTS: TooltipVariant[] = [
  "default",
  "outline",
  "danger",
  "info",
  "warning",
  "success",
];

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-8 p-10 text-brn-text"
      style={{ backgroundColor: "var(--brn-color-bg)" }}
    >
      <Story />
    </div>
  ),
] as const;

/** Фон страницы и `data-brn-theme="light"`, как у `Alert.stories` («Варианты (светлая тема)»). */
const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-brn-theme="light"
      className="box-border w-full p-8 text-brn-text"
      style={{ backgroundColor: "var(--brn-color-bg)" }}
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
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Tooltip size="s" variant="default">
        <Tooltip.Trigger>
          <Button size="m" variant="outline" type="button">
            Hover (s)
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Компактный тултип</Tooltip.Content>
      </Tooltip>
      <Tooltip size="m" variant="default">
        <Tooltip.Trigger>
          <Button size="l" variant="outline" type="button">
            Hover (m)
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Стандартный размер подсказки</Tooltip.Content>
      </Tooltip>
      <Tooltip size="l" variant="default">
        <Tooltip.Trigger>
          <Button size="xl" variant="outline" type="button">
            Hover (l)
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Более широкий отступ для длинной подсказки</Tooltip.Content>
      </Tooltip>
    </div>
  ),
};

function SemanticVariantsDemo() {
  return (
    <div className="flex min-h-[14rem] max-w-xl flex-row flex-wrap items-center justify-center gap-4 py-10">
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
      icon={<IoHelpCircleOutline aria-hidden className="text-brn-accent" />}
    >
      <Tooltip.Trigger>
        <Button size="l" variant="outline" type="button">
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
        <Button size="l" variant="outline" type="button">
          Hover
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Без стандартной иконки</Tooltip.Content>
    </Tooltip>
  ),
};
