import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SelectionThumb } from "@/components/core/SelectionThumb";
import { SelectionThumbMotionDemo } from "../../../../playground/showcase/demos/selectionThumb/SelectionThumbMotion.demo";

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
  title: "Core Components/SelectionThumb",
  component: SelectionThumb,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [...decorator],
} satisfies Meta<typeof SelectionThumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <SelectionThumb />,
};

export const SlotMotionGallery: Story = {
  name: "Slot motion gallery",
  render: () => <SelectionThumbMotionDemo />,
};
