import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { DualApiStoryPanel, DualApiStoryPanels } from "@/stories-utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/stories-utils/dualApiStorySource";

import { Meter } from "@/components/core/Meter";
import { MeterMotionDemo } from "../../../../playground/showcase/demos/meter/MeterMotion.demo";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
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
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Meter",
  component: Meter,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Level indicator (read-only). **Simple** — props on root; **Compound** — `<Meter.Header>` / `<Meter.Track>` / `<Meter.Hint>` / `<Meter.Error>`. **a11y:** `role=\"meter\"`, `aria-labelledby`, `aria-describedby` (hint + error), `aria-valuetext`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    size: { control: "select", options: ["small", "base", "mid", "large"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof Meter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple and Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props on &lt;Meter&gt;">
        <Meter label="Loading" hint="Read-only scale" showValue value={42} min={0} max={100} />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <Meter>
          <Meter.Header>
            <Meter.Label>Loading</Meter.Label>
            <Meter.Value />
          </Meter.Header>
          <Meter.Track value={58} min={0} max={100} />
          <Meter.Hint>Read-only scale</Meter.Hint>
        </Meter>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-2xlarge">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <Meter
          key={size}
          size={size}
          label={`Size ${size}`}
          showValue
          value={25 + (size === "large" ? 50 : size === "mid" ? 35 : size === "base" ? 20 : 10)}
        />
      ))}
    </div>
  ),
};

export const CustomColor: Story = {
  name: "Custom color",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-large">
      <Meter label="Primary (default)" showValue value={65} />
      <Meter label="Success" showValue value={80} color="var(--color-success)" />
      <Meter label="Danger" showValue value={35} color="var(--color-danger)" />
      <Meter label="Warning" showValue value={55} color="var(--color-warning)" />
      <Meter label="Hex" showValue value={70} color="#7c3aed" />
      <Meter
        label="Gradient"
        showValue
        value={85}
        color="linear-gradient(90deg, var(--color-primary) 0%, var(--color-info) 100%)"
      />
    </div>
  ),
};

export const CustomThickness: Story = {
  name: "Custom thickness",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-2xlarge">
      <Meter label="6px" showValue thickness={6} value={40} />
      <Meter label="1rem" showValue thickness="1rem" value={60} />
      <Meter label="size=small + thickness=16" showValue size="small" thickness={16} value={75} />
    </div>
  ),
};

export const StatusText: Story = {
  name: "State text",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-large">
      <Meter label="Battery" valueText="Charging" value={72} />
      <Meter label="Network" valueText="Excellent connection" value={92} color="var(--color-success)" />
      <Meter
        label="Memory"
        value={88}
        showValue
        formatValue={(v: number) => `${v}% used`}
      />
    </div>
  ),
};

export const Vertical: Story = {
  name: "Vertical",
  render: () => (
    <div className="flex h-64 items-end gap-2xlarge">
      <Meter orientation="vertical" label="CPU" showValue value={45} />
      <Meter orientation="vertical" label="RAM" showValue value={72} color="var(--color-info)" />
      <Meter orientation="vertical" label="Disk" valueText="High" value={88} color="var(--color-warning)" />
    </div>
  ),
};

export const WithoutLabel: Story = {
  name: "Without label",
  render: () => <Meter showValue value={30} />,
};

export const Animated: Story = {
  name: "Animation",
  render: function Animated() {
    const [value, setValue] = useState(20);

    useEffect(() => {
      const id = window.setInterval(() => {
        setValue((v) => (v >= 100 ? 15 : v + 7));
      }, 1200);
      return () => window.clearInterval(id);
    }, []);

    return (
      <Meter
        label="Value animation"
        showValue
        value={value}
        color="linear-gradient(90deg, var(--color-primary) 0%, var(--color-success) 100%)"
      />
    );
  },
};

export const OnLightTheme: Story = {
  name: "Light theme",
  decorators: [...lightThemeDecorator],
  render: () => <Meter label="Light theme" showValue value={58} />,
};

export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div className="flex flex-col gap-mid text-left">
      <p className="text-sm text-muted">
        Scale — <code className="text-primary">role=&quot;meter&quot;</code> with{" "}
        <code className="text-primary">aria-valuenow</code> /{" "}
        <code className="text-primary">aria-valuemin</code> /{" "}
        <code className="text-primary">aria-valuemax</code>, label —{" "}
        <code className="text-primary">aria-labelledby</code>, hint and error —{" "}
        <code className="text-primary">aria-describedby</code>.
      </p>
      <Meter label="CPU load" hint="Read-only; value updates automatically" showValue value={67} />
      <Meter label="API quota" hint="Limit refreshes once per day" showValue value={92} error="Request limit exceeded." />
    </div>
  ),
  play: async ({ canvas }) => {
    const meters = canvas.getAllByRole("meter");
    await expect(meters[0]).toHaveAttribute("aria-valuenow", "67");
  },
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "Slots root, header, value, track, fill, hint, and error via classNames prop.",
      },
    },
  },
  render: () => (
    <Meter
      label="Storage"
      hint="Read-only scale"
      showValue
      value={72}
      color="var(--color-info)"
      classNames={{
        root: "rounded-mid border border-primary/20 p-base",
        header: "text-primary",
        value: "text-info font-semibold",
        track: "ring-1 ring-primary/15",
        fill: "opacity-90",
        hint: "text-muted/80",
      }}
    />
  ),
};

export const SlotMotionGallery: Story = {
  name: "Slot motion gallery",
  render: () => <MeterMotionDemo />,
};
