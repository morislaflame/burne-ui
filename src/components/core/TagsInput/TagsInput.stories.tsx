import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TagsInputClassNamesDemo } from "../../../../playground/showcase/demos/tagsInput/ClassNames.demo";
import { TagsInputCompoundDemo } from "../../../../playground/showcase/demos/tagsInput/Compound.demo";
import { TagsInputInvalidDemo } from "../../../../playground/showcase/demos/tagsInput/Invalid.demo";
import { TagsInputLimitDemo } from "../../../../playground/showcase/demos/tagsInput/Limit.demo";
import { TagsInputMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/tagsInput/motionController/gallery";
import { TagsInputSizesDemo } from "../../../../playground/showcase/demos/tagsInput/Sizes.demo";
import { TagsInputSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/tagsInput/slotMotion/gallery";
import { TagsInputTopicsDemo } from "../../../../playground/showcase/demos/tagsInput/Topics.demo";
import { TagsInputVariantsDemo } from "../../../../playground/showcase/demos/tagsInput/Variants.demo";
import { TagsInput } from ".";

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
  title: "Core/TagsInput",
  component: TagsInput,
  decorators: decorator,
} satisfies Meta<typeof TagsInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Topics: Story = { render: () => <TagsInputTopicsDemo /> };
export const Variants: Story = { render: () => <TagsInputVariantsDemo /> };
export const Sizes: Story = { render: () => <TagsInputSizesDemo /> };
export const Limit: Story = { render: () => <TagsInputLimitDemo /> };
export const Invalid: Story = { render: () => <TagsInputInvalidDemo /> };
export const Compound: Story = { render: () => <TagsInputCompoundDemo /> };
export const ClassNames: Story = { render: () => <TagsInputClassNamesDemo /> };
export const SlotMotion: Story = { render: () => <TagsInputSlotMotionGalleryDemo /> };
export const MotionController: Story = { render: () => <TagsInputMotionControllerGalleryDemo /> };
