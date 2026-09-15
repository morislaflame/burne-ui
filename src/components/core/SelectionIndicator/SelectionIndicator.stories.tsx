import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { SelectionIndicatorMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/selectionIndicator/motionController/gallery";

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
  title: "Core Components/SelectionIndicator",
  component: SelectionIndicator,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [...decorator],
} satisfies Meta<typeof SelectionIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { selected: true, check: true },
};

export const MotionControllerGallery: Story = {
  args: { selected: true, check: true },
  name: "MotionController",
  parameters: {
    docs: {
      description: {
        story:
          "`useMotionControllerHandle()` — play(check) on root. Checkbox/Radio are embedders: do not put the handle on them.",
      },
    },
  },
  render: () => <SelectionIndicatorMotionControllerGalleryDemo />,
};
