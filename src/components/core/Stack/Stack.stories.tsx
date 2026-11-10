import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@/components/core/Stack";
import { StackMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/stack/motionController/gallery";
import { StackSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/stack/slotMotion/gallery";

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
  title: "Core Components/Stack",
  component: Stack,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [...decorator],
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Stack gap="mid">
      <span>One</span>
      <span>Two</span>
    </Stack>
  ),
};

export const CustomClassNames: Story = {
  name: "classNames",
  render: () => (
    <Stack gap="small" classNames={{ root: "rounded-mid bg-surface p-mid" }}>
      <span>One</span>
      <span>Two</span>
    </Stack>
  ),
};

export const SlotMotionGallery: Story = {
  name: "Slot motion gallery",
  render: () => <StackSlotMotionGalleryDemo />,
};

export const MotionControllerGallery: Story = {
  name: "MotionController",
  render: () => <StackMotionControllerGalleryDemo />,
};
