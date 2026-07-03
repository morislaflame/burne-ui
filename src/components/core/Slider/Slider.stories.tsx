import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { IoVolumeHigh } from "react-icons/io5";

import {
  DualApiStoryPanel,
  DualApiStoryPanels,
} from "@/components/core/utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/components/core/utils/dualApiStorySource";

import { Slider } from ".";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[18rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
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
      className="box-border flex min-h-[18rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Slider with a circle in the style of `Checkbox`. **Simple** — props on root; **Compound** — `<Slider.Header>` + `<Slider.Track>` + `<Slider.Hint>`. **a11y:** `role=\"slider\"` on thumb, label — `aria-labelledby`, hint — `aria-describedby`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    size: { control: "select", options: ["small", "base", "mid", "large"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple and Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props on &lt;Slider&gt;">
        <Slider
          label="Volume"
          hint="Hint below track"
          showValue
          defaultValue={40}
          min={0}
          max={100}
          step={1}
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <Slider>
          <Slider.Header>
            <Slider.Label>Volume</Slider.Label>
            <Slider.Value />
          </Slider.Header>
          <Slider.Track defaultValue={55} min={0} max={100} step={1} />
          <Slider.Hint>Hint below track</Slider.Hint>
        </Slider>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <Slider
          key={size}
          size={size}
          label={`Size ${size}`}
          showValue
          defaultValue={30 + (size === "large" ? 40 : size === "mid" ? 25 : 15)}
        />
      ))}
    </div>
  ),
};

export const Range: Story = {
  name: "Range",
  render: () => (
    <Slider
      range={true}
      label="Price"
      showValue
      min={0}
      max={1000}
      step={10}
      defaultValue={[200, 750]}
      formatValue={(v) => `${v} ₽`}
    />
  ),
};

export const WithMarks: Story = {
  name: "Ticks",
  render: () => (
    <Slider
      label="Level"
      showValue
      min={0}
      max={100}
      marks={[0, 25, 50, 75, 100]}
      defaultValue={50}
    />
  ),
};

export const WithIcon: Story = {
  name: "With icon",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      <Slider
        label="Volume"
        showValue
        defaultValue={45}
        icon={<IoVolumeHigh aria-hidden className="size-full" />}
      />
      <Slider
        range={true}
        label="Range"
        showValue
        defaultValue={[25, 70]}
        icon={<IoVolumeHigh aria-hidden className="size-full" />}
      />
    </div>
  ),
};

export const CompoundTrack: Story = {
  name: "Compound Track",
  render: () => (
    <Slider>
      <Slider.Header>
        <Slider.Label>Volume</Slider.Label>
        <Slider.Value />
      </Slider.Header>
      <Slider.Track defaultValue={55} min={0} max={100} step={1}>
        <Slider.Rail>
          <Slider.Fill />
        </Slider.Rail>
        <Slider.Thumb>
          <Slider.Icon>
            <IoVolumeHigh aria-hidden className="size-full" />
          </Slider.Icon>
        </Slider.Thumb>
      </Slider.Track>
      <Slider.Hint>Slider.Rail + Fill + Thumb + Icon</Slider.Hint>
    </Slider>
  ),
};

export const CustomThickness: Story = {
  name: "Custom thickness",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      <Slider label="10px" showValue thickness={10} defaultValue={35} />
      <Slider label="1.25rem" showValue thickness="1.25rem" defaultValue={55} />
      <Slider label="size=small + thickness=20" showValue size="small" thickness={20} defaultValue={70} />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <Slider disabled defaultValue={60} label="Unavailable" showValue />
  ),
};

export const Vertical: Story = {
  name: "Vertical",
  render: () => (
    <div className="flex h-64 items-center gap-xlarge">
      <Slider orientation="vertical" label="Brightness" showValue defaultValue={65} />
      <Slider orientation="vertical" range={true} label="Range" showValue defaultValue={[20, 80]} />
    </div>
  ),
};

export const WithoutLabel: Story = {
  name: "Without label",
  render: () => <Slider showValue={false} defaultValue={25} />,
};

export const Controlled: Story = {
  name: "Controlled",
  render: function Controlled() {
    const [value, setValue] = useState(35);
    return (
      <Slider label="Controlled" showValue value={value} onValueChange={setValue} />
    );
  },
  play: async ({ canvas, userEvent }) => {
    const slider = canvas.getByRole("slider", { name: /Controlled/ });
    slider.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(slider).toHaveAttribute("aria-valuenow", "36");
  },
};

export const OnLightTheme: Story = {
  name: "Light theme",
  decorators: [...lightThemeDecorator],
  render: () => <Slider label="Light theme" showValue defaultValue={55} />,
};

export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div className="flex flex-col gap-plus text-left">
      <p className="text-sm text-muted">
        Slider — <code className="text-primary">role=&quot;slider&quot;</code> on{" "}
        <code className="text-primary">&lt;button&gt;</code> with{" "}
        <code className="text-primary">aria-valuenow</code> / min / max. Label —{" "}
        <code className="text-primary">aria-labelledby</code> from <code className="text-primary">Slider.Label</code>
         , hint — <code className="text-primary">aria-describedby</code>. Without label — fallback{" "}
        <code className="text-primary">aria-label=&quot;Value&quot;</code>.
      </p>
      <Slider label="Volume" hint="Hint linked via aria-describedby" showValue defaultValue={48} />
    </div>
  ),
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for Slider (compound API)",
      },
    },
  },
  render: () => (
    <Slider
      defaultValue={55}
      min={0}
      max={100}
      classNames={{
        root: "rounded-mid border border-primary/25 p-base",
        header: "text-primary",
        value: "font-semibold text-primary",
        track: "ring-1 ring-primary/20",
        rail: "bg-primary/10",
        fill: "bg-primary/80",
        hint: "text-muted/80",
      }}
    >
      <Slider.Header>
        <Slider.Label>Volume</Slider.Label>
        <Slider.Value />
      </Slider.Header>
      <Slider.Track />
      <Slider.Hint>All slots configured via classNames.</Slider.Hint>
    </Slider>
  ),
};
