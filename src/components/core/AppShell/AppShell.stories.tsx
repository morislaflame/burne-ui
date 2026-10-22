import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppShell } from "@/components/core/AppShell";
import { AppShellMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/app-shell/motionController/gallery";
import { AppShellSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/app-shell/slotMotion/gallery";

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
  title: "Core Components/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [...decorator],
} satisfies Meta<typeof AppShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <AppShell ><span>Shell</span></AppShell>,
};

export const CustomClassNames: Story = {
  render: () => <AppShell classNames={{ root: "bg-surface" }}><span>Shell</span></AppShell>,
};

export const SlotMotion: Story = {
  render: () => <AppShellSlotMotionGalleryDemo />,
};

export const MotionController: Story = {
  render: () => <AppShellMotionControllerGalleryDemo />,
};
