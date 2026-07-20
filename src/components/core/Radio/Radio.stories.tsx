import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { IoStar } from "react-icons/io5";

import {
  DualApiStoryPanel,
  DualApiStoryPanels,
} from "@/stories-utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/stories-utils/dualApiStorySource";

import { Radio } from ".";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Radio",
  component: Radio,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Radio button. **Simple** — `label`, `hint`, and input props on root; **Compound** — `<Radio.Control>` / `<Radio.Indicator>` / `<Radio.Content>` with `<Radio.Label>` and `<Radio.Hint>`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  args: {
    label: "Option A",
    name: "demo",
    value: "a",
  },
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple and Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props on &lt;Radio&gt;">
        <Radio name="simple" value="a" label="Option A" hint="Short option description" defaultChecked />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <Radio name="compound" value="b">
          <Radio.Control />
          <Radio.Content>
            <Radio.Label>Option B</Radio.Label>
            <Radio.Hint>Short option description</Radio.Hint>
          </Radio.Content>
        </Radio>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const Playground: Story = {};

export const WithHint: Story = {
  name: "With hint",
  args: {
    label: "Courier",
    hint: "Delivery in 1–2 days",
    defaultChecked: true,
  },
};

export const SelectInteraction: Story = {
  name: "Interaction: selection",
  args: {
    name: "delivery",
    value: "courier",
    label: "Courier",
    hint: "Delivery in 1–2 days",
  },
  render: (args) => (
    <div className="flex flex-col gap-mid">
      <Radio {...args} />
      <Radio name="delivery" value="pickup" label="Pickup" />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const pickup = canvas.getByRole("radio", { name: "pickup" });
    await userEvent.click(pickup);
    await expect(pickup).toBeChecked();
  },
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-col gap-mid">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <Radio
          key={size}
          size={size}
          name="sizes"
          value={size}
          label={`Size ${size}`}
          defaultChecked={size === "base"}
        />
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  name: "Disabled",
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const CustomIndicator: Story = {
  name: "Custom indicator",
  render: () => (
    <div className="flex flex-col gap-mid">
      <Radio name="custom-indicator" value="plain">
        <Radio.Control />
        <Radio.Content>
          <Radio.Label>Standard</Radio.Label>
          <Radio.Hint>Circle with animated fill</Radio.Hint>
        </Radio.Content>
      </Radio>
      <Radio name="custom-indicator" value="star" defaultChecked>
        <Radio.Control>
          <Radio.Indicator>
            <IoStar aria-hidden className="text-primary-foreground" />
          </Radio.Indicator>
        </Radio.Control>
        <Radio.Content>
          <Radio.Label>Favorite</Radio.Label>
          <Radio.Hint>Custom icon with the same fill animation as the default indicator</Radio.Hint>
        </Radio.Content>
      </Radio>
    </div>
  ),
};

export const IndicatorShape: Story = {
  name: "Indicator — shape",
  render: () => (
    <Radio name="shape" value="mid" defaultChecked size="large">
      <Radio.Control>
        <Radio.Indicator
          classNames={{
            shell: "rounded-mid",
            fill: "rounded-[inherit]",
          }}
        />
      </Radio.Control>
      <Radio.Content>
        <Radio.Label>rounded-mid</Radio.Label>
        <Radio.Hint>Dot inherits shape via rounded-[inherit].</Radio.Hint>
      </Radio.Content>
    </Radio>
  ),
};

export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid text-left">
      <p className="text-sm text-muted">
        Simple and compound — native <code className="text-primary">&lt;label&gt;</code> around input and
        text. Hint and error — via{" "}
        <code className="text-primary">aria-describedby</code> (both ids when set).
      </p>
      <Radio
        id="a11y-radio-simple"
        name="a11y-radio"
        value="simple"
        defaultChecked
        label="Courier"
        hint="Delivery in 1–2 business days"
      />
      <Radio id="a11y-radio-compound" name="a11y-radio" value="compound">
        <Radio.Control />
        <Radio.Content>
          <Radio.Label>Pickup</Radio.Label>
          <Radio.Hint>Free, today</Radio.Hint>
        </Radio.Content>
      </Radio>
      <Radio
        id="a11y-radio-error"
        name="a11y-radio-error"
        value="invalid"
        label="Express"
        hint="Same-day delivery"
        error="Unavailable in your region."
      />
    </div>
  ),
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for Radio (compound API)",
      },
    },
  },
  render: () => (
    <Radio
      name="classnames"
      value="custom"
      defaultChecked
      variant="gloss"
      classNames={{
        root: "rounded-large border-primary/40 bg-primary/5 p-mid shadow-token-mid",
        control: "ring-primary/30",
        controlTrack: "border-primary/50",
        indicator: "rounded-mid",
        indicatorFill: "rounded-[inherit]",
        labelText: "text-primary font-semibold",
        hint: "text-foreground/80",
      }}
    >
      <Radio.Control>
        <Radio.Indicator />
      </Radio.Control>
      <Radio.Content>
        <Radio.Label>Courier</Radio.Label>
        <Radio.Hint>All slots configured via classNames.</Radio.Hint>
      </Radio.Content>
    </Radio>
  ),
};

export const SimpleLabelClassNames: Story = {
  name: "Simple API — classNames.label",
  parameters: {
    docs: {
      description: {
        story: "In simple API, label and labelText slots style the root label.",
      },
    },
  },
  render: () => (
    <Radio
      name="simple-label"
      value="express"
      defaultChecked
      label="Express delivery"
      hint="The label slot styles the label in simple API."
      classNames={{
        label: "text-info",
        labelText: "font-semibold underline decoration-info/30 underline-offset-4",
        hint: "text-muted/80",
      }}
      className="max-w-md"
    />
  ),
};
