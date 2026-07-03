import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { Expandable } from "@/components/core/Expandable";
import { Input } from "@/components/core/Input";
import { SearchInput } from "@/components/core/SearchInput";
import { Text } from "@/components/core/Text";

import { Ripple } from "./Ripple";
import { RIPPLE_COLOR } from "./rippleTokens";

const RIPPLE_COLOR_KEYS = Object.keys(RIPPLE_COLOR).join(", ");

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto flex w-full max-w-lg flex-col gap-xlarge">
        <Story />
      </div>
    </div>
  ),
] as const;

const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-theme="light"
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto flex w-full max-w-lg flex-col gap-xlarge">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Ripple",
  component: Ripple,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `Insert **as the first child** relative to an area with \`relative\`: the \`pointerdown\` listener is on the Ripple node's **parent**; content sits at \`relative z-[1]\` above the layer.

**Named colors** (\`color\`): ${RIPPLE_COLOR_KEYS} — see the \`RIPPLE_COLOR\` object in the kit export. Any other string is treated as a regular CSS color.

**Button** (\`ripple\`): built-in ripple is off by default; enable with a boolean prop. **SearchInput** — same. **Expandable / Accordion**: place \`<Ripple />\` among \`<Expandable.Trigger>\` children — the trigger lifts it into a layer across the **full** \`<button>\` (to the edges, including the chevron area).

**\`direction\`** prop: \`in\` — converges to the press point (default), \`out\` — expands from the point.

Duration — **\`duration\`** (ms). Starting point opacity — only via motion tokens.`,
      },
    },
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    color: {
      control: "select",
      options: Object.keys(RIPPLE_COLOR),
      description: `Key from RIPPLE_COLOR or an arbitrary color string`,
    },
    disabled: { control: "boolean" },
    duration: { control: "number" },
    direction: {
      control: "select",
      options: ["in", "out"],
      description: "in — collapse to point, out — expand from point",
    },
  },
} satisfies Meta<typeof Ripple>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "Playground",
  args: {
    disabled: false,
    color: "neutral",
    direction: "in",
  },
  render: (args) => (
    <div
      className="relative cursor-pointer overflow-hidden rounded-mid border-token bg-surface shadow-token-base"
      role="presentation"
    >
      <Ripple {...args} className="rounded-[inherit]" />
      <div className="relative z-[1] flex min-h-[7rem] flex-col justify-center gap-small px-plus py-plus">
        <Text variant="mid" className="font-medium">
          Ripple area
        </Text>
        <Text variant="base" className="text-muted">
          Click anywhere — the wave converges to the point.
        </Text>
      </div>
    </div>
  ),
};

export const ClickInteraction: Story = {
  name: "Interaction: click",
  args: {
    disabled: false,
    color: "neutral",
    direction: "in",
  },
  render: (args) => (
    <div
      className="relative cursor-pointer overflow-hidden rounded-mid border-token bg-surface shadow-token-base"
      role="presentation"
    >
      <Ripple {...args} className="rounded-[inherit]" />
      <div className="relative z-[1] flex min-h-[7rem] flex-col justify-center gap-small px-plus py-plus">
        <Text variant="mid" className="font-medium">
          Ripple area
        </Text>
      </div>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("Ripple area"));
    await expect(canvas.getByText("Ripple area")).toBeVisible();
  },
};

export const WithCardManual: Story = {
  name: "With Card",
  render: () => (
    <Card
      variant="outline"
      className="relative cursor-pointer"
      onClick={() => {}}
    >
      <Ripple color="neutral" />
      <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
        <Card.Header>
          <Card.Title>Variant without pressable</Card.Title>
          <Card.Description>
            Ripple as first child, text in <code className="text-xs">z-[1]</code> layer.
          </Card.Description>
        </Card.Header>
      </div>
    </Card>
  ),
};

export const WithButton: Story = {
  name: "With Button",
  render: () => (
    <div className="flex flex-col gap-small">
      <Text variant="base" className="text-muted">
        In the app, enable <code className="text-xs">ripple</code>
      </Text>
      <div className="flex flex-wrap gap-small">
        <Button variant="primary" ripple>
          Default
        </Button>
        <Button variant="ghost" ripple={false}>
          No ripple
        </Button>
      </div>
    </div>
  ),
};

export const DirectionCompare: Story = {
  name: "Direction in / out",
  render: () => (
    <div className="flex flex-wrap gap-mid">
      <div
        className="relative min-h-[6rem] min-w-[10rem] cursor-pointer overflow-hidden rounded-mid border-token bg-surface"
        role="presentation"
      >
        <Ripple color="neutral" direction="in" />
        <div className="relative z-[1] flex h-full items-center justify-center px-plus">
          <Text variant="small">direction=&quot;in&quot;</Text>
        </div>
      </div>
      <div
        className="relative min-h-[6rem] min-w-[10rem] cursor-pointer overflow-hidden rounded-mid border-token bg-surface"
        role="presentation"
      >
        <Ripple color="neutral" direction="out" />
        <div className="relative z-[1] flex h-full items-center justify-center px-plus">
          <Text variant="small">direction=&quot;out&quot;</Text>
        </div>
      </div>
    </div>
  ),
};

export const WithExpandable: Story = {
  name: "With Expandable",
  render: () => (
    <Expandable defaultOpen>
      <Expandable.Trigger>
        <Ripple color="neutralMuted" />
        <Expandable.Content>
          <Expandable.Title>Ripple across the full trigger</Expandable.Title>
          <Expandable.Description className="text-muted">
            Place <code className="text-xs">&lt;Ripple /&gt;</code> next to content — the trigger mounts the layer across the full button width and under the chevron.
          </Expandable.Description>
        </Expandable.Content>
      </Expandable.Trigger>
      <Expandable.Panel>
        <Text variant="base" className="leading-relaxed">
          Click near the row edge or chevron — effect across the full button.
        </Text>
      </Expandable.Panel>
    </Expandable>
  ),
};

export const WithSearchInput: Story = {
  name: "With SearchInput",
  render: () => (
    <div className="flex flex-col gap-small">
      <Text variant="base" className="text-muted">
        <code className="text-xs">ripple</code> — boolean prop
      </Text>
      <SearchInput placeholder="Search…" ripple />
    </div>
  ),
};

export const WithAlert: Story = {
  name: "With Alert",
  render: () => (
    <Alert
      status="info"
      className="relative max-w-md cursor-pointer overflow-hidden"
    >
      <Ripple color="info" />
      <Alert.Message className="relative z-[1]">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Notification with Ripple</Alert.Title>
          <Alert.Description>Rounding via parent inheritance.</Alert.Description>
        </Alert.Content>
      </Alert.Message>
    </Alert>
  ),
};

export const WithInputShell: Story = {
  name: "With Input (shell)",
  render: () => (
    <div className="flex flex-col gap-small">
      <Text variant="base" className="text-muted">
        Shared interactive card around the field
      </Text>
      <div className="relative overflow-hidden rounded-base border-token bg-surface p-mid shadow-token-base">
        <Ripple color="neutral" />
        <div className="relative z-[1] flex flex-col gap-small">
          <Text variant="small" className="font-medium text-muted">
            Contact
          </Text>
          <Input>
            <Input.Control placeholder="you@example.com" />
          </Input>
        </div>
      </div>
    </div>
  ),
};

export const ArbitraryCssColor: Story = {
  name: "Arbitrary CSS color",
  render: () => (
    <div
      className="relative max-w-xs cursor-pointer overflow-hidden rounded-mid border-token bg-surface p-plus"
      role="presentation"
    >
      <Ripple color="oklch(0.72 0.14 250 / 0.55)" duration={550} />
      <div className="relative z-[1]">
        <Text variant="base">The color prop accepts any string, not just presets.</Text>
      </div>
    </div>
  ),
};

export const OnLightTheme: Story = {
  name: "Light theme",
  decorators: [...lightThemeDecorator],
  render: () => (
    <div
      className="relative cursor-pointer overflow-hidden rounded-mid border-token bg-surface"
      role="presentation"
    >
      <Ripple color="neutral" />
      <div className="relative z-[1] flex min-h-[6rem] items-center justify-center px-plus">
        <Text variant="base">Ripple on light background</Text>
      </div>
    </div>
  ),
};
