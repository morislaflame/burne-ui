import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { MotionGroupGalleryDemo } from "../../playground/showcase/demos/motionGroup/gallery";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Foundations/MotionGroup",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Register child MotionController handles by id. Cross-component checkout, lists, and unmount — not a motionId prop on kit roots, and not querySelector.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  name: "MotionGroup",
  render: () => <MotionGroupGalleryDemo />,
};
