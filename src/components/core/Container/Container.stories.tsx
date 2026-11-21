import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Container } from "@/components/core/Container";
import { ContainerMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/container/motionController/gallery";
import { ContainerSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/container/slotMotion/gallery";

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
  title: "Core Components/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [...decorator],
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Container maxWidth="small" padding="mid">
      <span>Page</span>
    </Container>
  ),
};

export const CustomClassNames: Story = {
  name: "classNames",
  render: () => (
    <Container maxWidth="small" classNames={{ root: "rounded-mid bg-surface" }}>
      <span>Page</span>
    </Container>
  ),
};

export const SlotMotionGallery: Story = {
  name: "Slot motion gallery",
  render: () => <ContainerSlotMotionGalleryDemo />,
};

export const MotionControllerGallery: Story = {
  name: "MotionController",
  render: () => <ContainerMotionControllerGalleryDemo />,
};
