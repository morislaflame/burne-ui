import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

function TypographySamples() {
  return (
    <div
      className="box-border w-full max-w-3xl rounded-base border-token p-large text-foreground shadow-sm"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="flex flex-col gap-large">
        <p className="text-accent-header">accent-header — scale 4xl</p>
        <p className="text-header-1">header-1 — scale 3xl</p>
        <p className="text-header-2">header-2 — scale 2xl</p>
        <p className="text-large">text-large — scale xl</p>
        <p className="text-mid">text-mid — scale md</p>
        <p className="text-base">
          text-base — scale sm (0.875rem); on mobile / touch → scale base (1rem)
        </p>
        <p className="text-small text-muted">text-small — scale xs</p>
        <p className="text-xsmall text-muted">text-xsmall — scale xsmall</p>
      </div>
    </div>
  );
}

const meta = {
  title: "Foundations/Typography",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas" },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Roles: Story = {
  name: "Text roles",
  render: () => <TypographySamples />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/accent-header/)).toBeVisible();
    await expect(canvas.getByText(/text-small/)).toBeVisible();
  },
};

export const OnDarkCanvas: Story = {
  name: "Dark page background",
  decorators: [
    (Story) => (
      <div
        className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <Story />
      </div>
    ),
  ],
  render: () => <TypographySamples />,
};
