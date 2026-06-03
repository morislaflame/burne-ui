import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Text } from "@/components/core/Text";

import { Surface, type SurfaceVariant } from "./Surface";

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

const lightDecorator = [
  (Story: ComponentType) => (
    <div
      data-theme="light"
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const VARIANTS: SurfaceVariant[] = ["default", "outline", "secondary"];

const meta = {
  title: "Core Components/Surface",
  component: Surface,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Базовая панель с токенами темы (`bg-surface`, `surface-outline`, `surface-secondary`). Примитив для меню, popover-подобных блоков и секций — без compound-API Card и без blur у GlassSurface.",
      },
    },
  },
  decorators: [...framedDecorator],
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    shadow: { control: "select", options: ["none", "sm", "md", "lg"] },
    padding: { control: "select", options: ["none", "small", "base", "plus", "mid"] },
    radius: { control: "select", options: ["base", "mid", "large"] },
  },
} satisfies Meta<typeof Surface>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    padding: "plus",
    children: "Контент на surface",
  },
};

export const Variants: Story = {
  name: "Варианты",
  render: () => (
    <div className="flex flex-wrap items-start justify-center gap-large">
      {VARIANTS.map((variant) => (
        <Surface key={variant} variant={variant} padding="plus" className="w-48">
          <Text as="p" variant="base" className="font-medium capitalize">
            {variant}
          </Text>
          <Text as="p" variant="small" className="text-muted">
            variant=&quot;{variant}&quot;
          </Text>
        </Surface>
      ))}
    </div>
  ),
};

export const WithShadow: Story = {
  name: "Тень",
  render: () => (
    <div className="flex flex-wrap items-start justify-center gap-large">
      {(["none", "sm", "md", "lg"] as const).map((shadow) => (
        <Surface key={shadow} shadow={shadow} padding="plus" className="w-44">
          <Text as="p" variant="base" className="font-medium">
            shadow=&quot;{shadow}&quot;
          </Text>
        </Surface>
      ))}
    </div>
  ),
};

export const MenuPanel: Story = {
  name: "Панель меню",
  render: () => (
    <Surface variant="default" shadow="md" padding="small" className="w-64">
      <ul className="m-0 flex list-none flex-col gap-xsmall p-0">
        {["Dashboard", "Profile", "Settings"].map((label) => (
          <li key={label}>
            <button
              type="button"
              className="w-full rounded-mid px-base py-small text-left text-base hover:bg-accent-fill-hover"
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </Surface>
  ),
};

export const NestedSections: Story = {
  name: "Вложенные секции",
  render: () => (
    <Surface padding="plus" shadow="sm" className="flex w-full max-w-sm flex-col gap-plus">
      <Text as="p" variant="base" className="font-medium">
        Внешняя панель
      </Text>
      <Surface variant="secondary" padding="base" radius="base">
        <Text as="p" variant="small" className="text-muted">
          Внутренний блок secondary
        </Text>
      </Surface>
      <Surface variant="outline" padding="base" radius="base">
        <Text as="p" variant="small" className="text-muted">
          Внутренний блок outline
        </Text>
      </Surface>
    </Surface>
  ),
};

export const LightTheme: Story = {
  name: "Светлая тема",
  decorators: [...lightDecorator],
  args: {
    shadow: "sm",
    padding: "plus",
    children: "Surface на светлом фоне",
  },
};
