import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Sidebar } from "@/components/core/Sidebar";
import { SidebarMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/sidebar/motionController/gallery";
import { SidebarSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/sidebar/slotMotion/gallery";

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
  title: "Core Components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [...decorator],
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <Sidebar aria-label="Sections" >Nav</Sidebar>,
};

export const CustomClassNames: Story = {
  render: () => <Sidebar aria-label="Sections" classNames={{ root: "bg-surface" }}>Nav</Sidebar>,
};

export const SlotMotion: Story = {
  render: () => <SidebarSlotMotionGalleryDemo />,
};

export const MotionController: Story = {
  render: () => <SidebarMotionControllerGalleryDemo />,
};
