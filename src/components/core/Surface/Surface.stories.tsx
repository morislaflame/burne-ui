import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";

import { hoverVariant } from "@/components/core/utils/hoverVariant";
import { cn } from "@/utils/cn";

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

const VARIANTS: SurfaceVariant[] = ["default", "secondary", "tertiary", "gloss"];

const meta = {
  title: "Core Components/Surface",
  component: Surface,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Базовая панель с токенами темы (`bg-surface`, `bg-secondary`, `bg-tertiary`, `gloss`) — только заливка, без рамки. `variant=\"gloss\"` — стеклянная CSS-панель с conic-обводкой и бликом. Примитив для меню и секций — без compound-API Card.",
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
              className={cn(
                "w-full rounded-mid px-base py-small text-left text-base",
                hoverVariant(),
              )}
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
        Внешняя панель (default)
      </Text>
      <Surface variant="secondary" padding="base" radius="base">
        <Text as="p" variant="small" className="text-muted">
          Внутренний блок secondary
        </Text>
        <Surface variant="tertiary" padding="small" radius="base" className="mt-small">
          <Text as="p" variant="small" className="text-muted">
            Внутренний блок tertiary
          </Text>
        </Surface>
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

const dottedGridStyle = {
  backgroundImage: "radial-gradient(rgb(0 0 0 / 0.15) 1px, transparent 1px)",
  backgroundSize: "30px 30px",
  backgroundPosition: "2px 2px",
} as const;

function GlossPanels() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-xlarge">
      <Surface variant="gloss" padding="plus" radius="large" className="w-56">
        <Text as="p" variant="base" className="font-medium">
          Gloss surface
        </Text>
        <Text as="p" variant="small" className="text-muted">
          variant=&quot;gloss&quot;
        </Text>
      </Surface>
      <Surface variant="gloss" padding="mid" radius="mid" className="w-40">
        <Text as="p" variant="small" className="font-medium">
          Компактная
        </Text>
      </Surface>
    </div>
  );
}

function GlossUnderlay() {
  return (
    <Surface variant="default" padding="plus" radius="mid" className="w-full max-w-md">
      <div className="flex flex-wrap items-center gap-base">
        <Button variant="primary" size="base">
          Generate
        </Button>
        <Button variant="outline" size="base">
          Cancel
        </Button>
        <Badge variant="secondary" status="success">
          Ready
        </Badge>
      </div>
    </Surface>
  );
}

function GlossStoryLayout() {
  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-xlarge">
      <GlossPanels />
      <GlossUnderlay />
    </div>
  );
}

export const Gloss: Story = {
  name: "Gloss",
  decorators: [
    (Story: ComponentType) => (
      <div
        className="box-border flex min-h-[22rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
        style={{
          backgroundColor: "var(--color-background)",
          ...dottedGridStyle,
        }}
      >
        <Story />
      </div>
    ),
  ],
  render: () => <GlossStoryLayout />,
};

export const GlossLight: Story = {
  name: "Gloss — светлая тема",
  decorators: [
    (Story: ComponentType) => (
      <div
        data-theme="light"
        className="box-border flex min-h-[22rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
        style={{
          backgroundColor: "var(--color-background)",
          ...dottedGridStyle,
        }}
      >
        <Story />
      </div>
    ),
  ],
  render: () => <GlossStoryLayout />,
};
