import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { AspectRatio } from "@/components/core/AspectRatio";
import { AspectRatioMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/aspect-ratio/motionController/gallery";
import { AspectRatioSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/aspect-ratio/slotMotion/gallery";

const decorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[10rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [...decorator],
} satisfies Meta<typeof AspectRatio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <AspectRatio ratio="16/9" ><span>16/9</span></AspectRatio>,
};

export const CustomClassNames: Story = {
  render: () => <AspectRatio ratio="16/9" classNames={{ root: "bg-surface" }}><span>16/9</span></AspectRatio>,
};

export const SlotMotion: Story = {
  render: () => <AspectRatioSlotMotionGalleryDemo />,
};

export const MotionController: Story = {
  render: () => <AspectRatioMotionControllerGalleryDemo />,
};
