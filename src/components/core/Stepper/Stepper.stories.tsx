import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { StepperCheckoutDemo } from "../../../../playground/showcase/demos/stepper/Checkout.demo";
import { StepperSizesDemo } from "../../../../playground/showcase/demos/stepper/Sizes.demo";
import { StepperClassNamesDemo } from "../../../../playground/showcase/demos/stepper/ClassNames.demo";
import { StepperCompoundDemo } from "../../../../playground/showcase/demos/stepper/Compound.demo";
import { StepperFreeDemo } from "../../../../playground/showcase/demos/stepper/Free.demo";
import { StepperMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/stepper/motionController/gallery";
import { StepperSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/stepper/slotMotion/gallery";
import { StepperVerticalDemo } from "../../../../playground/showcase/demos/stepper/Vertical.demo";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[20rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
];

const meta = {
  title: "Core Components/Stepper",
  decorators: framedDecorator,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Checkout: Story = { render: () => <StepperCheckoutDemo /> };
export const Sizes: Story = { render: () => <StepperSizesDemo /> };
export const Vertical: Story = { render: () => <StepperVerticalDemo /> };
export const Free: Story = { render: () => <StepperFreeDemo /> };
export const Compound: Story = { render: () => <StepperCompoundDemo /> };
export const SlotMotionGallery: Story = { render: () => <StepperSlotMotionGalleryDemo /> };
export const MotionControllerGallery: Story = { render: () => <StepperMotionControllerGalleryDemo /> };
export const ClassNames: Story = { render: () => <StepperClassNamesDemo /> };
