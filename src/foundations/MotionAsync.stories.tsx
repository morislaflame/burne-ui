import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { MotionAsyncGalleryDemo } from "../../playground/showcase/demos/motionAsync/gallery";

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
  title: "Foundations/MotionAsync",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Factory helpers on MotionContext: ctx.wait, sequence/parallel, onInterrupt/onError. Opt-in GSAP plugins via registerMotionPlugins — not in the kit bundle.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  name: "MotionAsync",
  render: () => <MotionAsyncGalleryDemo />,
};
