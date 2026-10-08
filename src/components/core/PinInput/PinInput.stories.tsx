import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { PinInputMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/pinInput/motionController/gallery";
import { PinInputSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/pinInput/slotMotion/gallery";
import { PinInput } from ".";
import { PinInputCodeDemo } from "../../../../playground/showcase/demos/pinInput/Code.demo";
import { PinInputCompoundDemo } from "../../../../playground/showcase/demos/pinInput/Compound.demo";
import { PinInputSizesDemo } from "../../../../playground/showcase/demos/pinInput/Sizes.demo";
import { PinInputVariantsDemo } from "../../../../playground/showcase/demos/pinInput/Variants.demo";

const decorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[28rem] w-full flex-col items-center justify-start gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
];

const meta = {
  title: "Core/PinInput",
  component: PinInput,
  decorators: decorator,
} satisfies Meta<typeof PinInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Code: Story = {
  render: () => <PinInputCodeDemo />,
};

export const Variants: Story = {
  render: () => <PinInputVariantsDemo />,
};

export const Sizes: Story = {
  render: () => <PinInputSizesDemo />,
};

export const Mask: Story = {
  args: {
    label: "PIN",
    hint: "Hidden as you type",
    mask: true,
    length: 4,
  },
};

export const Letters: Story = {
  args: {
    label: "Room code",
    hint: "Letters and digits",
    type: "text",
    length: 4,
  },
};

export const Invalid: Story = {
  args: {
    label: "Verification code",
    defaultValue: "000000",
    error: "Wrong code",
  },
};

export const Separator: Story = {
  args: {
    label: "Pairing code",
    hint: "Three and three",
    separator: "–",
    length: 6,
  },
};

export const Compound: Story = {
  render: () => <PinInputCompoundDemo />,
};

export const ClassNames: Story = {
  args: {
    label: "Verification code",
    defaultValue: "123",
    length: 6,
    separator: "–",
    classNames: {
      label: "font-w-mid",
      group: "gap-mid",
      field: "bg-primary-tint",
      separator: "text-primary",
    },
  },
};

export const SlotMotion: Story = {
  render: () => <PinInputSlotMotionGalleryDemo />,
};

export const MotionController: Story = {
  render: () => <PinInputMotionControllerGalleryDemo />,
};
