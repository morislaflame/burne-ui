import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/core/Button/Button";
import { Text } from "@/components/core/Text";
import { glossDottedDecorator } from "@/components/core/utils/glossStoryChrome";

import { Kbd, type KbdVariant } from ".";

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

const KBD_VARIANTS: KbdVariant[] = [
  "default",
  "primary",
  "outline",
  "secondary",
  "gloss",
];

const meta = {
  title: "Core Components/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Клавиша или сочетание клавиш. Варианты и размеры как у `Badge`, без `status`. Compound: `Kbd.Group` для нескольких клавиш с разделителем.",
      },
    },
  },
  decorators: [...framedDecorator],
  argTypes: {
    variant: {
      control: "select",
      options: KBD_VARIANTS,
    },
    size: {
      control: "select",
      options: ["small", "base", "mid", "large"],
    },
  },
} satisfies Meta<typeof Kbd>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  name: "Варианты",
  render: () => (
    <div className="flex flex-wrap items-center gap-small">
      {KBD_VARIANTS.map((variant) => (
        <Kbd key={variant} variant={variant}>
          {variant === "gloss" ? "⌘ K" : variant}
        </Kbd>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex flex-wrap items-end gap-small">
      <Kbd size="small">Esc</Kbd>
      <Kbd size="base">Esc</Kbd>
      <Kbd size="mid">Esc</Kbd>
      <Kbd size="large">Esc</Kbd>
    </div>
  ),
};

export const Group: Story = {
  name: "Kbd.Group",
  render: () => (
    <div className="flex flex-col gap-mid">
      <Kbd.Group>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </Kbd.Group>
      <Kbd.Group separator={null}>
        <Kbd variant="secondary">Ctrl</Kbd>
        <Kbd variant="secondary">S</Kbd>
      </Kbd.Group>
      <Kbd.Group separator="then">
        <Kbd variant="outline">G</Kbd>
        <Kbd variant="outline">G</Kbd>
      </Kbd.Group>
    </div>
  ),
};

export const InContext: Story = {
  name: "В контексте",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid text-left">
      <Text as="p" variant="small" className="text-muted">
        Нажмите <Kbd>Esc</Kbd>, чтобы закрыть. Сохранить —{" "}
        <Kbd.Group>
          <Kbd>⌘</Kbd>
          <Kbd>S</Kbd>
        </Kbd.Group>
        .
      </Text>
      <Button variant="outline" size="base" type="button" className="justify-between">
        <span>Командная палитра</span>
        <Kbd.Group>
          <Kbd size="small" variant="secondary">
            ⌘
          </Kbd>
          <Kbd size="small" variant="secondary">
            K
          </Kbd>
        </Kbd.Group>
      </Button>
    </div>
  ),
};

function KbdGlossDemo() {
  return (
    <div className="flex flex-col items-center gap-plus">
      <Kbd variant="gloss" size="mid">
        ⌘ K
      </Kbd>
      <Kbd.Group>
        <Kbd variant="gloss">⌘</Kbd>
        <Kbd variant="gloss">Shift</Kbd>
        <Kbd variant="gloss">P</Kbd>
      </Kbd.Group>
      <Button variant="gloss" type="button" className="gap-plus">
        <span>Save</span>
        <Kbd.Group>
          <Kbd variant="gloss" size="small">
            ⌘
          </Kbd>
          <Kbd variant="gloss" size="small">
            S
          </Kbd>
        </Kbd.Group>
      </Button>
    </div>
  );
}

export const Gloss: Story = {
  name: "Gloss",
  parameters: { controls: { disable: true } },
  decorators: [glossDottedDecorator(false)],
  render: () => <KbdGlossDemo />,
};

export const GlossLight: Story = {
  name: "Gloss — светлая тема",
  parameters: { controls: { disable: true } },
  decorators: [glossDottedDecorator(true)],
  render: () => <KbdGlossDemo />,
};

export const CustomClassNames: Story = {
  name: "classNames",
  render: () => (
    <Kbd
      variant="outline"
      classNames={{
        root: "border-primary/40 bg-primary/5",
      }}
    >
      /
    </Kbd>
  ),
};

export const HoverLiftOff: Story = {
  name: "hoverLift={false}",
  render: () => <Kbd hoverLift={false}>Tab</Kbd>,
};
