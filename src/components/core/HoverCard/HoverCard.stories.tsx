import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { HoverCardClassNamesDemo } from "../../../../playground/showcase/demos/hoverCard/HoverCardClassNames.demo";
import { HoverCardCompoundDemo } from "../../../../playground/showcase/demos/hoverCard/HoverCardCompound.demo";
import { HoverCardDefaultDemo } from "../../../../playground/showcase/demos/hoverCard/HoverCardDefault.demo";
import { HoverCardSizesDemo } from "../../../../playground/showcase/demos/hoverCard/HoverCardSizes.demo";
import { HoverCardInstantDemo } from "../../../../playground/showcase/demos/hoverCard/HoverCardInstant.demo";
import { HoverCardSideDemo } from "../../../../playground/showcase/demos/hoverCard/HoverCardSide.demo";
import { HoverCardMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/hoverCard/motionController/gallery";
import { HoverCardSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/hoverCard/slotMotion/gallery";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[20rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
];

const meta = {
  title: "Core Components/HoverCard",
  decorators: framedDecorator,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Profile: Story = { render: () => <HoverCardDefaultDemo /> };
export const Sizes: Story = { render: () => <HoverCardSizesDemo /> };
export const Instant: Story = { render: () => <HoverCardInstantDemo /> };
export const Side: Story = { render: () => <HoverCardSideDemo /> };
export const Compound: Story = { render: () => <HoverCardCompoundDemo /> };
export const SlotMotionGallery: Story = { render: () => <HoverCardSlotMotionGalleryDemo /> };
export const MotionControllerGallery: Story = { render: () => <HoverCardMotionControllerGalleryDemo /> };
export const ClassNames: Story = { render: () => <HoverCardClassNamesDemo /> };
