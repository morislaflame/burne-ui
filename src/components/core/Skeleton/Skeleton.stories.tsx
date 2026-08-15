import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Button } from "@/components/core/Button";
import { Skeleton } from ".";
import { SkeletonMotionDemo } from "../../../../playground/showcase/demos/skeleton/SkeletonMotion.demo";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[18rem] w-full flex-col items-start justify-center gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
];

const meta = {
  title: "Core Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Loading placeholder component. **Four animations**: `pulse` (blink), `wave` (sliding bar), `shimmer` (gradient), `none` (no animation). Composition: `<Skeleton>` — arbitrary block, `<Skeleton.Circle>` — circle, `<Skeleton.Text>` — text lines, `<Skeleton.Block>` — card, `<Skeleton.Region>` — parent with `aria-busy`.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Variants ─────────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: "All animation variants",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-2xlarge">
      {(["wave", "pulse", "shimmer", "none"] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-small">
          <p className="text-small font-medium text-muted capitalize">{variant}</p>
          <Skeleton animation={variant} className="h-4 w-full" />
          <Skeleton animation={variant} className="h-4 w-4/5" />
          <Skeleton animation={variant} className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("wave")).toBeVisible();
    await expect(canvas.getByText("shimmer")).toBeVisible();
  },
};

// ─── Text skeleton ────────────────────────────────────────────────────────────

export const TextLines: Story = {
  name: "Text lines",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-2xlarge">
      {(["wave", "pulse", "shimmer"] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-small">
          <p className="text-small text-muted">{variant}</p>
          <Skeleton.Text animation={variant} lines={3} />
        </div>
      ))}
    </div>
  ),
};

// ─── Circle skeleton ──────────────────────────────────────────────────────────

export const Circles: Story = {
  name: "Circles",
  render: () => (
    <div className="flex flex-wrap gap-large">
      {(["wave", "pulse", "shimmer"] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-small">
          <p className="text-small text-muted">{variant}</p>
          <Skeleton.Circle animation={variant} size="h-12 w-12" />
        </div>
      ))}
    </div>
  ),
};

// ─── Card layout ─────────────────────────────────────────────────────────────

export const CardLayout: Story = {
  name: "Card (all variants)",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-2xlarge">
      {(["wave", "pulse", "shimmer"] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-small">
          <p className="text-small text-muted">{variant}</p>
          <Skeleton.Region
            busy
            aria-label="Loading card"
            className="flex flex-col gap-mid rounded-mid border-token p-mid"
          >
            <div className="flex items-center gap-mid">
              <Skeleton.Circle animation={variant} size="h-10 w-10" />
              <div className="flex flex-1 flex-col gap-xsmall">
                <Skeleton animation={variant} className="h-3 w-32 rounded-full" />
                <Skeleton animation={variant} className="h-3 w-20 rounded-full" />
              </div>
            </div>
            <Skeleton animation={variant} className="h-40 w-full rounded-small" />
            <Skeleton.Text animation={variant} lines={2} />
            <div className="flex gap-small">
              <Skeleton animation={variant} className="h-control-base w-20 rounded-small" />
              <Skeleton animation={variant} className="h-control-base w-20 rounded-small" />
            </div>
          </Skeleton.Region>
        </div>
      ))}
    </div>
  ),
};

// ─── List layout ─────────────────────────────────────────────────────────────

export const ListLayout: Story = {
  name: "List",
  render: () => (
    <Skeleton.Region busy aria-label="Loading list" className="flex w-full max-w-sm flex-col gap-xsmall">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-mid py-small">
          <Skeleton.Circle animation="wave" size="h-9 w-9" />
          <div className="flex flex-1 flex-col gap-xsmall">
            <Skeleton
              animation="wave"
              className="h-3 rounded-full"
              style={{ width: `${60 + (i % 3) * 15}%`, animationDelay: `${i * 0.08}s` }}
            />
            <Skeleton
              animation="wave"
              className="h-3 rounded-full w-2/5"
              style={{ animationDelay: `${i * 0.08 + 0.04}s` }}
            />
          </div>
        </div>
      ))}
    </Skeleton.Region>
  ),
};

// ─── Block ────────────────────────────────────────────────────────────────────

export const BlockSkeleton: Story = {
  name: "Skeleton.Block",
  render: () => (
    <div className="flex gap-large">
      {(["wave", "pulse", "shimmer"] as const).map((v) => (
        <Skeleton.Block key={v} animation={v} className="h-32 w-40" />
      ))}
    </div>
  ),
};

// ─── Region (aria-busy) ───────────────────────────────────────────────────────

export const LoadingRegion: Story = {
  name: "Skeleton.Region (aria-busy)",
  parameters: {
    docs: {
      description: {
        story:
          "Wrap placeholders in `Skeleton.Region` so the parent announces `aria-busy` / `aria-live`. Decorative skeletons stay `aria-hidden`.",
      },
    },
  },
  render: function LoadingRegionStory() {
    const [busy, setBusy] = useState(true);
    return (
      <div className="flex w-full max-w-sm flex-col gap-large">
        <Button size="small" onClick={() => setBusy((v) => !v)}>
          {busy ? "Show content" : "Show skeleton"}
        </Button>
        <Skeleton.Region busy={busy} aria-label="Profile">
          {busy ? (
            <div className="flex gap-large">
              <Skeleton.Circle size="h-12 w-12" animation="shimmer" />
              <div className="flex min-w-0 flex-1 flex-col gap-small">
                <Skeleton className="h-4 w-32 rounded-small" animation="shimmer" />
                <Skeleton.Text lines={2} animation="shimmer" />
              </div>
            </div>
          ) : (
            <p className="text-base text-foreground">Alex Rivera — product designer</p>
          )}
        </Skeleton.Region>
      </div>
    );
  },
  play: async ({ canvas }) => {
    const region = canvas.getByLabelText("Profile");
    await expect(region).toHaveAttribute("aria-busy", "true");
    await expect(region).toHaveAttribute("aria-live", "polite");
  },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const CustomSizes: Story = {
  name: "Various sizes",
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-small">
      <Skeleton animation="wave" className="h-2 w-full rounded-full" />
      <Skeleton animation="wave" className="h-3 w-full rounded-full" />
      <Skeleton animation="wave" className="h-4 w-full rounded-full" />
      <Skeleton animation="wave" className="h-6 w-full rounded-small" />
      <Skeleton animation="wave" className="h-8 w-full rounded-small" />
      <Skeleton animation="wave" className="h-12 w-full rounded-mid" />
      <Skeleton animation="wave" className="h-24 w-full rounded-mid" />
    </div>
  ),
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for Skeleton, Skeleton.Text, and Skeleton.Circle",
      },
    },
  },
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-large">
      <Skeleton
        animation="wave"
        className="h-4 w-full"
        classNames={{
          root: "rounded-full bg-info/15",
          wave: "from-info/30",
        }}
      />
      <Skeleton.Text
        animation="shimmer"
        lines={3}
        classNames={{
          root: "gap-xsmall",
          line: "rounded-full bg-warning/15",
        }}
      />
      <Skeleton.Circle
        animation="pulse"
        size="h-12 w-12"
        classNames={{
          root: "bg-success/15 ring-2 ring-success/20",
        }}
      />
    </div>
  ),
};

export const SlotMotionGallery: Story = {
  name: "Slot motion gallery",
  render: () => <SkeletonMotionDemo />,
};
