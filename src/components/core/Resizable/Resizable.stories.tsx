import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Resizable } from "@/components/core/Resizable";
import { ResizableMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/resizable/motionController/gallery";
import { ResizableSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/resizable/slotMotion/gallery";

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
  title: "Core Components/Resizable",
  component: Resizable,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [...decorator],
} satisfies Meta<typeof Resizable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <Resizable ><Resizable.Panel>A</Resizable.Panel><Resizable.Handle /><Resizable.Panel>B</Resizable.Panel></Resizable>,
};

export const CustomClassNames: Story = {
  render: () => <Resizable classNames={{ root: "bg-surface" }}><Resizable.Panel>A</Resizable.Panel><Resizable.Handle /><Resizable.Panel>B</Resizable.Panel></Resizable>,
};

export const SlotMotion: Story = {
  render: () => <ResizableSlotMotionGalleryDemo />,
};

export const MotionController: Story = {
  render: () => <ResizableMotionControllerGalleryDemo />,
};
