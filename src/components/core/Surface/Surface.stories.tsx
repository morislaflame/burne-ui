import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";

import { hoverVariant } from "@/components/core/utils/hoverVariant";
import { cn } from "@/utils/cn";

import { Surface, type SurfaceVariant } from "./Surface";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
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
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
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
          "Base panel with theme tokens (`bg-surface`, `bg-secondary`, `bg-tertiary`, `gloss`) — fill only, no border. `variant=\"gloss\"` — glass CSS panel with conic border and highlight. Primitive for menus and sections — no Card compound API.",
      },
    },
  },
  decorators: [...framedDecorator],
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    shadow: { control: "select", options: ["none", "small", "base", "mid", "large"] },
    padding: { control: "select", options: ["none", "small", "base", "mid", "large"] },
    radius: { control: "select", options: ["base", "mid", "large"] },
  },
} satisfies Meta<typeof Surface>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    padding: "mid",
    children: "Content on surface",
  },
};

export const Variants: Story = {
  name: "Variants",
  render: () => (
    <div className="flex flex-wrap items-start justify-center gap-xlarge">
      {VARIANTS.map((variant) => (
        <Surface key={variant} variant={variant} padding="mid" className="w-48">
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
  name: "Shadow",
  render: () => (
    <div className="flex flex-wrap items-start justify-center gap-xlarge">
      {(["none", "base", "mid", "large"] as const).map((shadow) => (
        <Surface key={shadow} shadow={shadow} padding="mid" className="w-44">
          <Text as="p" variant="base" className="font-medium">
            shadow=&quot;{shadow}&quot;
          </Text>
        </Surface>
      ))}
    </div>
  ),
};

export const MenuPanel: Story = {
  name: "Menu panel",
  render: () => (
    <Surface variant="default" shadow="mid" padding="small" className="w-64">
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

export const MenuInteraction: Story = {
  name: "Interaction: menu",
  render: () => (
    <Surface variant="default" shadow="mid" padding="small" className="w-64">
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
  play: async ({ canvas, userEvent }) => {
    const profile = canvas.getByRole("button", { name: "Profile" });
    await userEvent.click(profile);
    await expect(profile).toHaveFocus();
  },
};

export const NestedSections: Story = {
  name: "Nested sections",
  render: () => (
    <Surface padding="mid" shadow="base" className="flex w-full max-w-sm flex-col gap-mid">
      <Text as="p" variant="base" className="font-medium">
        Outer panel (default)
      </Text>
      <Surface variant="secondary" padding="base" radius="base">
        <Text as="p" variant="small" className="text-muted">
          Inner secondary block
        </Text>
        <Surface variant="tertiary" padding="small" radius="base" className="mt-small">
          <Text as="p" variant="small" className="text-muted">
            Inner tertiary block
          </Text>
        </Surface>
      </Surface>
    </Surface>
  ),
};

export const LightTheme: Story = {
  name: "Light theme",
  decorators: [...lightDecorator],
  args: {
    shadow: "base",
    padding: "mid",
    children: "Surface on light background",
  },
};

const dottedGridStyle = {
  backgroundImage: "radial-gradient(rgb(0 0 0 / 0.15) 1px, transparent 1px)",
  backgroundSize: "30px 30px",
  backgroundPosition: "2px 2px",
} as const;

function GlossPanels() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2xlarge">
      <Surface variant="gloss" padding="mid" radius="large" className="w-56">
        <Text as="p" variant="base" className="font-medium">
          Gloss surface
        </Text>
        <Text as="p" variant="small" className="text-muted">
          variant=&quot;gloss&quot;
        </Text>
      </Surface>
      <Surface variant="gloss" padding="large" radius="mid" className="w-40">
        <Text as="p" variant="small" className="font-medium">
          Compact
        </Text>
      </Surface>
    </div>
  );
}

function GlossUnderlay() {
  return (
    <Surface variant="default" padding="mid" radius="mid" className="w-full max-w-md">
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
    <div className="flex w-full max-w-lg flex-col items-center gap-2xlarge">
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
        className="box-border flex min-h-[22rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
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
  name: "Gloss — light theme",
  decorators: [
    (Story: ComponentType) => (
      <div
        data-theme="light"
        className="box-border flex min-h-[22rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
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

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  render: () => (
    <div className="flex flex-col gap-xlarge">
      <Surface
        padding="base"
        classNames={{ root: "border border-primary/30 ring-1 ring-primary/10" }}
      >
        Default surface slots
      </Surface>
      <Surface
        variant="gloss"
        padding="base"
        classNames={{
          root: "ring-1 ring-primary/20",
          glossContent: "gap-small text-primary",
        }}
      >
        Gloss surface slots
      </Surface>
    </div>
  ),
};
