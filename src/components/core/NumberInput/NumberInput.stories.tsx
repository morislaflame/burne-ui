import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { NumberInput } from ".";
import { NumberInputMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/numberInput/motionController/gallery";
import { NumberInputSizesDemo } from "../../../../playground/showcase/demos/numberInput/Sizes.demo";
import { NumberInputSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/numberInput/slotMotion/gallery";
import { NumberInputVariantsDemo } from "../../../../playground/showcase/demos/numberInput/Variants.demo";

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
  title: "Core/NumberInput",
  component: NumberInput,
  decorators: decorator,
} satisfies Meta<typeof NumberInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Quantity: Story = {
  args: {
    label: "Quantity",
    hint: "Whole units",
    min: 0,
    defaultValue: 1,
  },
};

export const Variants: Story = {
  render: () => <NumberInputVariantsDemo />,
};

export const Sizes: Story = {
  render: () => <NumberInputSizesDemo />,
};

export const Bounds: Story = {
  args: {
    label: "Seats",
    min: 0,
    max: 8,
    defaultValue: 2,
  },
};

export const Decimal: Story = {
  args: {
    label: "Amount",
    min: 0,
    max: 5,
    step: 0.5,
    defaultValue: 1,
  },
};

export const Invalid: Story = {
  args: {
    label: "Quantity",
    error: "Enter a quantity",
  },
};

export const Compound: Story = {
  render: () => (
    <NumberInput min={0} defaultValue={1}>
      <NumberInput.Label>Quantity</NumberInput.Label>
      <NumberInput.Increment />
      <NumberInput.Control />
      <NumberInput.Decrement />
      <NumberInput.Hint>Plus on the start side</NumberInput.Hint>
    </NumberInput>
  ),
};

export const ClassNames: Story = {
  args: {
    label: "Quantity",
    defaultValue: 3,
    classNames: {
      shell: "bg-primary-tint",
      control: "font-w-mid",
    },
  },
};

export const SlotMotion: Story = {
  render: () => <NumberInputSlotMotionGalleryDemo />,
};

export const MotionController: Story = {
  render: () => <NumberInputMotionControllerGalleryDemo />,
};
