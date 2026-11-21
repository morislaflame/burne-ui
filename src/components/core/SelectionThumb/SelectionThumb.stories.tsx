import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoCheckmark } from "react-icons/io5";

import { SelectionThumb } from "@/components/core/SelectionThumb";
import { SelectionThumbMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/selectionThumb/motionController/gallery";
import { SelectionThumbSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/selectionThumb/slotMotion/gallery";

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

export const CustomClassNames: Story = {
  name: "Custom classNames",
  render: () => (
    <SelectionThumb size="mid" classNames={{ root: "ring-2 ring-primary/30" }}>
      <SelectionThumb.Icon size="mid" classNames={{ root: "text-info", icon: "opacity-90" }}>
        <IoCheckmark aria-hidden />
      </SelectionThumb.Icon>
    </SelectionThumb>
  ),
};

export const SlotMotionGallery: Story = {
  name: "Slot motion gallery",
  render: () => <SelectionThumbSlotMotionGalleryDemo />,
};

export const MotionControllerGallery: Story = {
  name: "MotionController",
  parameters: {
    docs: {
      description: {
        story:
          "`useMotionControllerHandle()` — standalone thumb only. play(root), icon slot, stagger, inside Icon, cancel, thumb events.",
      },
    },
  },
  render: () => <SelectionThumbMotionControllerGalleryDemo />,
};
