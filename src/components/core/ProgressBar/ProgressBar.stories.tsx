import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import {
  DualApiStoryPanel,
  DualApiStoryPanels,
} from "@/stories-utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/stories-utils/dualApiStorySource";

import { ProgressBar } from "@/components/core/ProgressBar";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-theme="light"
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Progress bar (read-only). **Simple** — props on root; **Compound** — `<ProgressBar.Header>` + `<ProgressBar.Track>` + `<ProgressBar.Hint>`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple and Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props on &lt;ProgressBar&gt;">
        <ProgressBar
          label="Loading"
          hint="Estimated time to completion"
          showValue
          value={65}
          min={0}
          max={100}
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <ProgressBar>
          <ProgressBar.Header>
            <ProgressBar.Label>File upload</ProgressBar.Label>
            <ProgressBar.Value />
          </ProgressBar.Header>
          <ProgressBar.Track value={42} min={0} max={100} />
          <ProgressBar.Hint>Estimated time to completion</ProgressBar.Hint>
        </ProgressBar>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const Indeterminate: Story = {
  name: "Indeterminate",
  render: () => (
    <ProgressBar label="Processing" indeterminate showValue={false} />
  ),
};

export const Colors: Story = {
  name: "Colors",
  render: () => (
    <div className="flex flex-col gap-mid">
      <ProgressBar label="Accent (default)" showValue value={65} />
      <ProgressBar label="Success" showValue value={80} color="var(--color-success)" />
      <ProgressBar label="Danger" showValue value={35} color="var(--color-danger)" />
      <ProgressBar label="Warning" showValue value={55} color="var(--color-warning)" />
      <ProgressBar label="Hex" showValue value={70} color="#7c3aed" />
      <ProgressBar
        label="Gradient"
        showValue
        value={60}
        color="linear-gradient(90deg, var(--color-primary) 0%, var(--color-info) 100%)"
      />
    </div>
  ),
};

export const Thickness: Story = {
  name: "Thickness",
  render: () => (
    <div className="flex flex-col gap-mid">
      <ProgressBar label="6px" showValue thickness={6} value={40} />
      <ProgressBar label="1rem" showValue thickness="1rem" value={60} />
      <ProgressBar label="size=small + thickness=16" showValue size="small" thickness={16} value={75} />
    </div>
  ),
};

export const CustomValueText: Story = {
  name: "Custom value text",
  render: () => (
    <div className="flex flex-col gap-mid">
      <ProgressBar label="Battery" valueText="Charging" value={72} />
      <ProgressBar label="Network" valueText="Excellent connection" value={92} color="var(--color-success)" />
      <ProgressBar
        label="Disk"
        valueText="High load"
        value={88}
        color="var(--color-warning)"
      />
    </div>
  ),
};

export const Vertical: Story = {
  name: "Vertical",
  render: () => (
    <div className="flex gap-xlarge">
      <ProgressBar orientation="vertical" label="CPU" showValue value={45} />
      <ProgressBar orientation="vertical" label="RAM" showValue value={72} color="var(--color-info)" />
      <ProgressBar orientation="vertical" label="Disk" valueText="High" value={88} color="var(--color-warning)" />
    </div>
  ),
};

export const Animated: Story = {
  name: "Animation",
  render: function Animated() {
    const [value, setValue] = useState(0);

    useEffect(() => {
      const id = window.setInterval(() => {
        setValue((v) => (v >= 100 ? 0 : v + 5));
      }, 400);
      return () => window.clearInterval(id);
    }, []);

    return (
      <ProgressBar label="Download" min={0} max={100} value={value} showValue color="var(--color-primary)" />
    );
  },
};

export const OnLightTheme: Story = {
  name: "Light theme",
  decorators: [...lightThemeDecorator],
  render: () => <ProgressBar label="Progress" showValue value={55} />,
};

export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div className="flex flex-col gap-plus text-left">
      <p className="text-sm text-muted">
        Scale — <code className="text-primary">role=&quot;progressbar&quot;</code> with{" "}
        <code className="text-primary">aria-valuenow</code> /{" "}
        <code className="text-primary">aria-valuemin</code> /{" "}
        <code className="text-primary">aria-valuemax</code> (or{" "}
        <code className="text-primary">aria-busy</code> when indeterminate). Label —{" "}
        <code className="text-primary">aria-labelledby</code>, hint —{" "}
        <code className="text-primary">aria-describedby</code>.
      </p>
      <ProgressBar
        label="Download"
        hint="Remaining time depends on network speed"
        showValue
        value={48}
        min={0}
        max={100}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("progressbar", { name: /Download/ })).toHaveAttribute(
      "aria-valuenow",
      "48",
    );
  },
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "Slots root, value, track, fill, hint, and error via classNames prop.",
      },
    },
  },
  render: () => (
    <ProgressBar
      label="Loading"
      hint="Remaining time depends on network speed"
      showValue
      value={62}
      color="var(--color-info)"
      classNames={{
        root: "rounded-mid border border-primary/20 p-base",
        value: "text-info font-semibold",
        track: "bg-primary/10",
        fill: "opacity-95",
        hint: "text-muted/80",
      }}
    />
  ),
};
