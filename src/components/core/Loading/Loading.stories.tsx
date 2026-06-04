import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Text } from "@/components/core/Text";
import { COMPONENT_SIZES } from "@/components/core/utils/componentSize";

import { Loading, type LoadingColor } from "./Loading";

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
  "accent",
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
          "Круговой индикатор загрузки. Размеры `small | base | mid | large` — как спиннер у `Button`. Цвета — accent, foreground, muted и семантические токены.",
      },
    },
  },
  decorators: [...framedDecorator],
  args: {
    size: "base",
    color: "accent",
  },
  argTypes: {
    size: { control: "select", options: COMPONENT_SIZES },
    color: { control: "select", options: COLORS },
  },
} satisfies Meta<typeof Loading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

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
    <div className="flex h-40 w-72 items-center justify-center rounded-mid border border-base bg-surface">
      <Loading size="large" color="accent" label="Загрузка содержимого" />
    </div>
  ),
};
