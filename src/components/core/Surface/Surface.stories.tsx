import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Text } from "@/components/core/Text";

import { hoverVariant } from "@/components/core/utils/hoverVariant";
import { cn } from "@/utils/cn";

import { Surface, type SurfaceVariant } from "./Surface";
import { SurfaceSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/surface/slotMotion/gallery";
import { SurfaceMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/surface/motionController/gallery";

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

const VARIANTS: SurfaceVariant[] = ["default", "secondary", "tertiary"];

const meta = {
  title: "Core Components/Surface",
  component: Surface,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Base panel with theme tokens (`bg-surface`, `bg-secondary`, `bg-tertiary`) — fill only, no border.  Primitive for menus and sections — no Card compound API.",
      },
    },
  },
  decorators: [...framedDecorator],
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    shadow: { control: "select", options: ["none", "small", "base", "mid", "large", "xlarge"] },
    padding: { control: "select", options: ["none", "small", "base", "mid", "large"] },
    radius: { control: "select", options: ["base", "mid", "large"] },
    motionController: {
      control: false,
      description: "Deferred MotionController handle. Not config.motion and not the motion map.",
    },
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
                "w-full rounded-large px-base py-small text-left text-base",
                hoverVariant())}
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
                "w-full rounded-large px-base py-small text-left text-base",
                hoverVariant())}
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
        variant="default"
        padding="base"
        classNames={{
          root: "ring-1 ring-primary/20",
        }}
      >
        Surface surface slots
      </Surface>
    </div>
  ),
};

export const SlotMotionGallery: Story = {
  name: "Slot motion gallery",
  render: () => <SurfaceSlotMotionGalleryDemo />,
};

export const MotionControllerGallery: Story = {
  name: "MotionController",
  parameters: {
    docs: {
      description: {
        story:
          "`useMotionControllerHandle()` — playSlot, playAll stagger, set/cancel, stacked timelines, async events, waitForComplete.",
      },
    },
  },
  render: () => <SurfaceMotionControllerGalleryDemo />,
};
