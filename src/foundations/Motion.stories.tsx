import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { MotionLevel1GalleryDemo } from "../../playground/showcase/demos/motion/gallery";

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
  title: "Foundations/Motion",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Level 1: slow a tree down, snap when animations are off, replace one slot phase with a recipe, false, or a vars map.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  name: "Motion",
  render: () => <MotionLevel1GalleryDemo />,
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("motion-level1-fast")).toHaveTextContent("80ms");
    await expect(canvas.getByTestId("motion-level1-slow")).toHaveTextContent("700ms");
  },
};
