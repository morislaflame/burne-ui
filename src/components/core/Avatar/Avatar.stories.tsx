import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";

import { DualApiStoryPanel, DualApiStoryPanels } from "@/stories-utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/stories-utils/dualApiStorySource";
import { PIN_IMAGE1, PIN_IMAGE2, PIN_IMAGE3, PIN_IMAGE4 } from "@/stories-utils/mockImages";

import { Avatar } from ".";
import { AvatarSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/avatar/slotMotion/gallery";
import { AvatarMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/avatar/motionController/gallery";

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

const meta = {
  title: "Core Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "User avatar. **Simple** — `label`, `src`, `nickname` on root; **Compound** — `<Avatar.Image>` / `<Avatar.Fallback>`. ",
      },
    },
  },
  decorators: [...framedDecorator],
  argTypes: {
    motionController: {
      control: false,
      description: "Deferred MotionController handle. Not config.motion and not the motion map.",
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple and Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props on &lt;Avatar&gt;">
        <Avatar
          size="base"
          label="Grace Hopper"
          src={PIN_IMAGE2}
          alt=""
          loading="lazy"
          nickname="grace_h"
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <Avatar size="base" label="Grace Hopper" nickname="grace_h">
          <Avatar.Image src={PIN_IMAGE2} alt="" loading="lazy" />
          <Avatar.Fallback />
        </Avatar>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-row flex-wrap items-center gap-2xlarge">
      <Avatar size="small" label="Ada Lovelace" src={PIN_IMAGE1} alt="" loading="lazy" />
      <Avatar size="base" label="Grace Hopper" src={PIN_IMAGE2} alt="" loading="lazy" />
      <Avatar size="mid" label="Alan Turing" src={PIN_IMAGE4} alt="" loading="lazy" />
      <Avatar size="large" label="Katherine Johnson" src={PIN_IMAGE3} alt="" loading="lazy" />
    </div>
  ),
};

export const FallbackOnly: Story = {
  name: "Letter from label only",
  render: () => (
    <div className="flex flex-row flex-wrap items-center gap-xlarge">
      <Avatar size="small" label="Burne Team" />
      <Avatar size="base" label="Anna Karenina" />
      <Avatar size="large" label="北京" />
    </div>
  ),
};

export const BrokenImageUsesFallback: Story = {
  name: "Broken image → fallback",
  render: () => (
    <Avatar
      size="base"
      label="Sergei Prokofiev"
      src="https://example.invalid/avatar-missing.png"
      alt=""
    />
  ),
};

export const AvatarGroupStory: Story = {
  name: "Group (stacking + GSAP lift)",
  render: () => (
    <Avatar.Group>
      <Avatar size="base" label="One" nickname="echo_north" src={PIN_IMAGE1} alt="" loading="lazy" />
      <Avatar
        size="base"
        label="Two"
        nickname="orbit_fox"
        tooltipStatus="info"
        src={PIN_IMAGE2}
        alt=""
        loading="lazy"
      />
      <Avatar
        size="base"
        label="Three"
        nickname="vela_wave"
        tooltipStatus="success"
        src={PIN_IMAGE3}
        alt=""
        loading="lazy"
      />
      <Avatar
        size="base"
        label="Four"
        nickname="rust_line"
        tooltipVariant="outline"
        src={PIN_IMAGE4}
        alt=""
        loading="lazy"
      />
      <Avatar size="base" label="Plus five" nickname="+5" tooltipStatus="warning" />
    </Avatar.Group>
  ),
};

export const WithNicknameTooltip: Story = {
  name: "Nickname in Tooltip",
  render: () => (
    <Avatar
      size="large"
      label="Amelia Clarke"
      nickname="starlight.muse"
      tooltipVariant="default"
      tooltipSize="base"
      src={PIN_IMAGE1}
      alt=""
      loading="lazy"
    />
  ),
};

export const HoverInteraction: Story = {
  name: "Interaction: tooltip",
  render: () => (
    <Avatar
      size="large"
      label="Amelia Clarke"
      nickname="starlight.muse"
      tooltipVariant="default"
      tooltipSize="base"
      src={PIN_IMAGE1}
      alt=""
      loading="lazy"
    />
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByRole("group", { name: "Amelia Clarke" }));
    await waitFor(
      () => expect(screen.getByRole("tooltip")).toHaveTextContent("starlight.muse"),
      { timeout: 1000 });
  },
};

export const CompoundCustomFallback: Story = {
  name: "Compound — custom Fallback",
  render: () => (
    <Avatar size="base" label="Design System">
      <Avatar.Fallback>DS</Avatar.Fallback>
    </Avatar>
  ),
};

export const CustomClassNames: Story = {
  name: "Custom classNames",
  render: () => (
    <div className="flex flex-wrap items-center gap-2xlarge">
      <Avatar
        variant="default"
        size="base"
        label="Root"
        src={PIN_IMAGE1}
        alt=""
        loading="lazy"
        classNames={{
          root: "ring-2 ring-primary ring-offset-2 ring-offset-background",
        }}
      />
      <Avatar
        variant="default"
        size="mid"
        label="Wrap"
        src={PIN_IMAGE2}
        alt=""
        loading="lazy"
        classNames={{
          root: "border border-info/40",
        }}
      />
      <Avatar
        variant="default"
        size="large"
        label="Fallback"
        className="text-primary"
        classNames={{
          root: "bg-primary/10 text-primary font-semibold",
        }}
      />
    </div>
  ),
};

export const SlotMotionGallery: Story = {
  name: "Slot motion gallery",
  render: () => <AvatarSlotMotionGalleryDemo />,
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
  render: () => <AvatarMotionControllerGalleryDemo />,
};
