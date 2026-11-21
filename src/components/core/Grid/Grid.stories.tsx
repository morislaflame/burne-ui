import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Grid } from "@/components/core/Grid";
import { GridMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/grid/motionController/gallery";
import { GridSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/grid/slotMotion/gallery";

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
  title: "Core Components/Grid",
  component: Grid,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [...decorator],
} satisfies Meta<typeof Grid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Grid columns={3} gap="mid">
      <span>A</span>
      <span>B</span>
      <span>C</span>
    </Grid>
  ),
};

export const CustomClassNames: Story = {
  name: "classNames",
  render: () => (
    <Grid columns={3} gap="small" classNames={{ root: "rounded-mid bg-surface p-mid" }}>
      <span>A</span>
      <span>B</span>
      <span>C</span>
    </Grid>
  ),
};

export const SlotMotionGallery: Story = {
  name: "Slot motion gallery",
  render: () => <GridSlotMotionGalleryDemo />,
};

export const MotionControllerGallery: Story = {
  name: "MotionController",
  render: () => <GridMotionControllerGalleryDemo />,
};
