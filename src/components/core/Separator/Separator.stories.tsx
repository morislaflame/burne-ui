import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "@/components/core/Separator";
import { Text } from "@/components/core/Text";
import { SeparatorMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/separator/motionController/gallery";
import { SeparatorSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/separator/slotMotion/gallery";

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
  title: "Core Components/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [...decorator],
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <Separator className="w-full" />,
};

export const CustomClassNames: Story = {
  name: "Custom className",
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-mid">
      <Text variant="small">Above</Text>
      <Separator className="border-t-danger" />
      <Text variant="small">Below</Text>
    </div>
  ),
};

export const SlotMotionGallery: Story = {
  name: "Slot motion gallery",
  render: () => <SeparatorSlotMotionGalleryDemo />,
};

export const MotionControllerGallery: Story = {
  name: "MotionController",
  parameters: {
    docs: {
      description: {
        story:
          "`useMotionControllerHandle()` — play / set on root, cancel loop, sep events.",
      },
    },
  },
  render: () => <SeparatorMotionControllerGalleryDemo />,
};
