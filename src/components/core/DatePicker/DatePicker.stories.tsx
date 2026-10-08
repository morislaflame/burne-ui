import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { DatePicker } from ".";
import { DatePickerMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/datePicker/motionController/gallery";
import { DatePickerSizesDemo } from "../../../../playground/showcase/demos/datePicker/Sizes.demo";
import { DatePickerSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/datePicker/slotMotion/gallery";
import { DatePickerVariantsDemo } from "../../../../playground/showcase/demos/datePicker/Variants.demo";

const decorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[28rem] w-full flex-col items-center justify-start gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="w-full max-w-xs">
        <Story />
      </div>
    </div>
  ),
];

const meta = {
  title: "Core/DatePicker",
  component: DatePicker,
  decorators: decorator,
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: {
    label: "Date",
    hint: "Opens a calendar",
  },
};

export const Variants: Story = {
  render: () => <DatePickerVariantsDemo />,
};

export const Sizes: Story = {
  render: () => <DatePickerSizesDemo />,
};

export const Locale: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-large">
      <DatePicker label="Date" locale="en-GB" defaultValue={new Date(2026, 9, 15)} />
      <DatePicker label="Дата" locale="ru" defaultValue={new Date(2026, 9, 15)} />
    </div>
  ),
};

export const Range: Story = {
  args: {
    mode: "range",
    label: "Stay",
  },
};

export const Invalid: Story = {
  args: {
    label: "Date",
    error: "Pick a day",
  },
};

export const Compound: Story = {
  render: () => (
    <DatePicker>
      <DatePicker.Label>Departure</DatePicker.Label>
      <DatePicker.Trigger />
      <DatePicker.Popover />
      <DatePicker.Hint>Single day</DatePicker.Hint>
    </DatePicker>
  ),
};

export const ClassNames: Story = {
  args: {
    label: "Date",
    classNames: {
      trigger: "bg-primary-tint",
      value: "font-w-mid",
    },
  },
};

export const SlotMotion: Story = {
  render: () => <DatePickerSlotMotionGalleryDemo />,
};

export const MotionController: Story = {
  render: () => <DatePickerMotionControllerGalleryDemo />,
};
