import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { IoGlobeOutline, IoPeopleOutline, IoVideocamOutline } from "react-icons/io5";

import { Radio } from "@/components/core/Radio";
import { Text } from "@/components/core/Text";
import { COMPONENT_SIZES } from "@/components/core/utils/sizeLayout";
import { cn } from "@/utils/cn";

import { RadioGroup } from ".";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Composite Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [...darkThemeDecorator],
  args: {
    required: false,
  },
  argTypes: {
    size: {
      control: "select",
      options: COMPONENT_SIZES,
      table: { defaultValue: { summary: "small" } },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const CARD_RADIO_CLASS = cn(
  "group relative flex flex-col gap-mid rounded-mid border-token bg-surface px-mid py-large transition-colors",
  "data-[selected=true]:border-primary data-[selected=true]:bg-default-hover",
  "has-[:focus-visible]:border-primary has-[:focus-visible]:bg-default-hover",
);

export const Playground: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="card">
      <RadioGroup.Legend>
        <RadioGroup.Label>Payment method</RadioGroup.Label>
        <RadioGroup.Hint>Only one option can be selected.</RadioGroup.Hint>
      </RadioGroup.Legend>
      <RadioGroup.List>
        <Radio value="card" label="Bank card" />
        <Radio value="cash" label="Cash" />
        <Radio value="invoice" label="Invoice for business" />
      </RadioGroup.List>
    </RadioGroup>
  ),
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("radio", { name: "card" })).toBeChecked();
    await userEvent.click(canvas.getByRole("radio", { name: "cash" }));
    await expect(canvas.getByRole("radio", { name: "cash" })).toBeChecked();
    await expect(canvas.getByRole("radio", { name: "card" })).not.toBeChecked();
  },
};

export const CardLayout: Story = {
  name: "Cards (compound Radio)",
  render: () => {
    const formats = [
      {
        value: "online",
        title: "Online",
        hint: "Live stream and real-time chat",
        meta: "Free",
        icon: IoVideocamOutline,
      },
      {
        value: "hybrid",
        title: "Hybrid",
        hint: "Venue + online access for remote participants",
        meta: "from 2,900 ₽",
        icon: IoGlobeOutline,
      },
      {
        value: "offline",
        title: "In person",
        hint: "Live networking and coffee breaks",
        meta: "from 4,500 ₽",
        icon: IoPeopleOutline,
      },
    ] as const;

    return (
      <RadioGroup defaultValue="hybrid" name="event-format" className="max-w-2xl">
        <RadioGroup.Legend>
          <RadioGroup.Label>Participation format</RadioGroup.Label>
          <RadioGroup.Hint>Choose how you want to join the event.</RadioGroup.Hint>
        </RadioGroup.Legend>
        <div className="grid gap-large md:grid-cols-3">
          {formats.map((option) => (
            <Radio key={option.value} value={option.value} className={CARD_RADIO_CLASS}>
              <Radio.Control className="absolute top-mid right-mid size-5" />
              <Radio.Content className="flex flex-col gap-mid pr-2xlarge">
                <span className="inline-flex size-10 items-center justify-center rounded-base border-token bg-secondary text-foreground">
                  <option.icon className="size-5" aria-hidden />
                </span>
                <div className="flex flex-col gap-xsmall">
                  <Radio.Label>{option.title}</Radio.Label>
                  <Radio.Hint>{option.hint}</Radio.Hint>
                </div>
                <Text as="span" variant="small" className="font-semibold">
                  {option.meta}
                </Text>
              </Radio.Content>
            </Radio>
          ))}
        </div>
      </RadioGroup>
    );
  },
};

export const Horizontal: Story = {
  name: "Horizontal",
  render: () => (
    <RadioGroup defaultValue="s">
      <RadioGroup.Legend>
        <RadioGroup.Label>Size</RadioGroup.Label>
        <RadioGroup.Hint>Items in a row with wrap when space is tight.</RadioGroup.Hint>
      </RadioGroup.Legend>
      <RadioGroup.List orientation="horizontal">
        <Radio value="s" label="S" />
        <Radio value="m" label="M" />
        <Radio value="l" label="L" />
        <Radio value="xl" label="XL" />
      </RadioGroup.List>
    </RadioGroup>
  ),
};

export const WithDescriptions: Story = {
  name: "With descriptions",
  render: () => (
    <RadioGroup defaultValue="courier">
      <RadioGroup.Legend>
        <RadioGroup.Label>Delivery</RadioGroup.Label>
      </RadioGroup.Legend>
      <RadioGroup.List>
        <Radio value="courier" label="Courier" hint="1–2 business days" />
        <Radio value="pickup" label="Pickup" hint="Free, today" />
        <Radio value="post" label="Mail" hint="5–7 days" />
      </RadioGroup.List>
    </RadioGroup>
  ),
};

export const Required: Story = {
  name: "Required field",
  render: () => (
    <RadioGroup required>
      <RadioGroup.Legend>
        <RadioGroup.Label>Plan</RadioGroup.Label>
      </RadioGroup.Legend>
      <RadioGroup.List>
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" />
      </RadioGroup.List>
    </RadioGroup>
  ),
};

export const WithError: Story = {
  name: "With error",
  render: () => (
    <RadioGroup required>
      <RadioGroup.Legend>
        <RadioGroup.Label>Plan</RadioGroup.Label>
        <RadioGroup.Hint>Select one option before continuing.</RadioGroup.Hint>
      </RadioGroup.Legend>
      <RadioGroup.Group>
        <RadioGroup.List>
          <Radio value="free" label="Free" />
          <Radio value="pro" label="Pro" />
        </RadioGroup.List>
        <RadioGroup.Error>Select a plan to continue.</RadioGroup.Error>
      </RadioGroup.Group>
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  name: "Controlled",
  render: function Controlled() {
    const [value, setValue] = useState<string | undefined>("card");

    return (
      <RadioGroup value={value} onValueChange={setValue}>
        <RadioGroup.Legend>
          <RadioGroup.Label>Controlled</RadioGroup.Label>
          <RadioGroup.Hint>{`Selected: ${value ?? "—"}`}</RadioGroup.Hint>
        </RadioGroup.Legend>
        <RadioGroup.List>
          <Radio value="card" label="Card" />
          <Radio value="cash" label="Cash" />
        </RadioGroup.List>
      </RadioGroup>
    );
  },
};

export const WithoutDescription: Story = {
  name: "Without subtitle",
  render: () => (
    <RadioGroup defaultValue="m">
      <RadioGroup.Legend>
        <RadioGroup.Label>Size</RadioGroup.Label>
      </RadioGroup.Legend>
      <RadioGroup.List>
        <Radio value="s" label="S" />
        <Radio value="m" label="M" />
        <Radio value="l" label="L" />
      </RadioGroup.List>
    </RadioGroup>
  ),
};

export const Sizes: Story = {
  name: "Sizes small · base · mid · large",
  render: () => (
    <div className="grid w-full max-w-5xl gap-2xlarge md:grid-cols-2">
      {COMPONENT_SIZES.map((size) => (
        <div key={size} className="flex flex-col gap-base">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">{size}</span>
          <RadioGroup size={size} defaultValue="card">
            <RadioGroup.Legend>
              <RadioGroup.Label>Payment method</RadioGroup.Label>
              <RadioGroup.Hint>size={size}</RadioGroup.Hint>
            </RadioGroup.Legend>
            <RadioGroup.List>
              <Radio value="card" label="Bank card" />
              <Radio value="cash" label="Cash" />
              <Radio value="invoice" label="Invoice for business" />
            </RadioGroup.List>
          </RadioGroup>
        </div>
      ))}
    </div>
  ),
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for RadioGroup — root, legend, legendHeader, hint, error, list, group, actions.",
      },
    },
  },
  render: () => (
    <RadioGroup
      required
      defaultValue="card"
      className="max-w-md"
      classNames={{
        root: "rounded-mid border border-primary/20 p-base",
        legend: "text-primary",
        legendHeader: "gap-xsmall",
        hint: "text-foreground/70",
        error: "font-medium",
        list: "gap-base",
        group: "gap-large",
        actions: "pt-small",
      }}
    >
      <RadioGroup.Legend>
        <RadioGroup.Label>Payment method</RadioGroup.Label>
        <RadioGroup.Hint>Slots via classNames.</RadioGroup.Hint>
      </RadioGroup.Legend>
      <RadioGroup.Group>
        <RadioGroup.List>
          <Radio value="card" label="Bank card" />
          <Radio value="cash" label="Cash" />
        </RadioGroup.List>
        <RadioGroup.Error>Select a payment method to continue.</RadioGroup.Error>
      </RadioGroup.Group>
      <RadioGroup.Actions>
        <Text as="span" variant="small" className="text-muted">
          Saved automatically
        </Text>
      </RadioGroup.Actions>
    </RadioGroup>
  ),
};

export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div className="flex max-w-md flex-col gap-large text-left">
      <p className="text-sm text-muted">
        Group — native <code className="text-primary">&lt;fieldset&gt;</code> +{" "}
        <code className="text-primary">&lt;legend&gt;</code>. Hint and error —{" "}
        <code className="text-primary">aria-describedby</code> on fieldset; option hint — on input
        via <code className="text-primary">Radio.Hint</code>.
      </p>
      <RadioGroup required>
        <RadioGroup.Legend>
          <RadioGroup.Label>Delivery</RadioGroup.Label>
          <RadioGroup.Hint>Select one delivery method.</RadioGroup.Hint>
        </RadioGroup.Legend>
        <RadioGroup.List>
          <Radio value="courier" label="Courier" hint="1–2 business days" />
          <Radio value="pickup" label="Pickup" hint="Free, today" />
        </RadioGroup.List>
        <RadioGroup.Error role="alert">Select a delivery method.</RadioGroup.Error>
      </RadioGroup>
    </div>
  ),
};
