import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "@/components/core/Separator";
import { SeparatorMotionDemo } from "../../../../playground/showcase/demos/separator/SeparatorMotion.demo";

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

export const SlotMotionGallery: Story = {
  name: "Slot motion gallery",
  render: () => <SeparatorMotionDemo />,
};
