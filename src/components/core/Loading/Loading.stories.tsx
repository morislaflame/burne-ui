import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Text } from "@/components/core/Text";
import { COMPONENT_SIZES } from "@/components/core/utils/componentSize";

import { Loading, type LoadingColor, type LoadingVariant } from "./Loading";

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

const COLORS: LoadingColor[] = [
  "primary",
  "foreground",
  "muted",
  "secondary",
  "danger",
  "success",
  "info",
  "warning",
];

const meta = {
  title: "Core Components/Loading",
  component: Loading,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Индикатор загрузки: круговой спиннер (`variant=\"spinner\"`) или три прыгающие точки на GSAP (`variant=\"dots\"`). Скорость точек — `configureMotion({ loadingDotsDuration })` (шаг волны = duration / 3). Размеры `small | base | mid | large`.",
      },
    },
  },
  decorators: [...framedDecorator],
  args: {
    variant: "spinner",
    size: "base",
    color: "primary",
  },
  argTypes: {
    variant: { control: "select", options: ["spinner", "dots"] satisfies LoadingVariant[] },
    size: { control: "select", options: COMPONENT_SIZES },
    color: { control: "select", options: COLORS },
  },
} satisfies Meta<typeof Loading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status", { name: "Loading" })).toBeVisible();
  },
};

export const Dots: Story = {
  name: "Прыгающие точки",
  args: {
    variant: "dots",
    size: "mid",
    color: "primary",
  },
};

export const DotsColors: Story = {
  name: "Точки — цвета",
  render: () => (
    <div className="flex flex-wrap items-end justify-center gap-xlarge">
      {COLORS.map((color) => (
        <div key={color} className="flex flex-col items-center gap-small">
          <Loading variant="dots" color={color} size="mid" />
          <Text as="span" variant="small" className="capitalize text-muted">
            {color}
          </Text>
        </div>
      ))}
    </div>
  ),
};

export const DotsSizes: Story = {
  name: "Точки — размеры",
  render: () => (
    <div className="flex flex-wrap items-end justify-center gap-xlarge">
      {COMPONENT_SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-small">
          <Loading variant="dots" size={size} />
          <Text as="span" variant="small" className="capitalize text-muted">
            {size}
          </Text>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex flex-wrap items-end justify-center gap-xlarge">
      {COMPONENT_SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-small">
          <Loading size={size} />
          <Text as="span" variant="small" className="capitalize text-muted">
            {size}
          </Text>
        </div>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  name: "Цвета",
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-xlarge">
      {COLORS.map((color) => (
        <div key={color} className="flex flex-col items-center gap-small">
          <Loading color={color} size="mid" />
          <Text as="span" variant="small" className="capitalize text-muted">
            {color}
          </Text>
        </div>
      ))}
    </div>
  ),
};

export const WithLabel: Story = {
  name: "С подписью",
  render: () => (
    <div className="inline-flex items-center gap-base">
      <Loading size="small" />
      <Text as="span" variant="base" className="text-muted">
        Загружаем данные…
      </Text>
    </div>
  ),
};

export const Centered: Story = {
  name: "По центру блока",
  render: () => (
    <div className="flex h-40 w-72 items-center justify-center rounded-mid border-token bg-surface">
      <Loading size="large" color="primary" label="Загрузка содержимого" />
    </div>
  ),
};
