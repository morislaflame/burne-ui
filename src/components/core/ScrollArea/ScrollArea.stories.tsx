import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollAreaMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/scrollArea/motionController/gallery";
import { ScrollAreaSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/scrollArea/slotMotion/gallery";
import { ScrollArea } from ".";
import { ScrollAreaAlwaysDemo } from "../../../../playground/showcase/demos/scrollArea/Always.demo";
import { ScrollAreaBothDemo } from "../../../../playground/showcase/demos/scrollArea/Both.demo";
import { ScrollAreaClassNamesDemo } from "../../../../playground/showcase/demos/scrollArea/ClassNames.demo";
import { ScrollAreaCompoundDemo } from "../../../../playground/showcase/demos/scrollArea/Compound.demo";
import { ScrollAreaHorizontalDemo } from "../../../../playground/showcase/demos/scrollArea/Horizontal.demo";
import { ScrollAreaVerticalDemo } from "../../../../playground/showcase/demos/scrollArea/Vertical.demo";

const decorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[28rem] w-full flex-col items-center justify-start gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
];

const meta = {
  title: "Core/ScrollArea",
  component: ScrollArea,
  decorators: decorator,
} satisfies Meta<typeof ScrollArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => <ScrollAreaVerticalDemo />,
};

export const Horizontal: Story = {
  render: () => <ScrollAreaHorizontalDemo />,
};

export const Both: Story = {
  render: () => <ScrollAreaBothDemo />,
};

export const Always: Story = {
  render: () => <ScrollAreaAlwaysDemo />,
};

export const Compound: Story = {
  render: () => <ScrollAreaCompoundDemo />,
};

export const ClassNames: Story = {
  render: () => <ScrollAreaClassNamesDemo />,
};

export const SlotMotion: Story = {
  render: () => <ScrollAreaSlotMotionGalleryDemo />,
};

export const MotionController: Story = {
  render: () => <ScrollAreaMotionControllerGalleryDemo />,
};
