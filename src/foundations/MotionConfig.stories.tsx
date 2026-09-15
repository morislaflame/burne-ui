import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { MotionConfigGalleryDemo } from "../../playground/showcase/demos/motionConfig/gallery";

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
  title: "Foundations/MotionConfig",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Provider-scoped motion config. Innermost BurneUIProvider / ThemeProvider / MotionConfigProvider overlay wins; unspecified keys inherit configureMotion(). CSS --motion-surface-duration is per theme root.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  name: "MotionConfig",
  render: () => <MotionConfigGalleryDemo />,
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("motion-config-fast")).toHaveTextContent("80ms");
    await expect(canvas.getByTestId("motion-config-slow")).toHaveTextContent("700ms");
  },
};
