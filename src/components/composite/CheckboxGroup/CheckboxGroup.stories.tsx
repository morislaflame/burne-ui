import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Checkbox } from "@/components/core/Checkbox";
import { COMPONENT_SIZES } from "@/components/core/utils/componentSize";

import { CheckboxGroup } from ".";

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
  title: "Composite Components/CheckboxGroup",
  component: CheckboxGroup,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [...darkThemeDecorator],
  args: {
    isRequired: false,
    selection: "multiple" as const,
  },
  argTypes: {
    selection: {
      control: "radio",
      options: ["multiple", "single"],
    },
    size: {
      control: "select",
      options: COMPONENT_SIZES,
      table: { defaultValue: { summary: "small" } },
    },
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <CheckboxGroup {...args}>
      <CheckboxGroup.Legend>
        <CheckboxGroup.Label>Delivery method</CheckboxGroup.Label>
        <CheckboxGroup.Hint>Multiple options can be selected.</CheckboxGroup.Hint>
      </CheckboxGroup.Legend>
      <CheckboxGroup.List>
        <Checkbox name="ship" value="courier" label="Courier" />
        <Checkbox name="ship" value="pickup" label="Pickup" />
        <Checkbox name="ship" value="post" label="Mail" />
      </CheckboxGroup.List>
    </CheckboxGroup>
  ),
};

export const SingleSelection: Story = {
  name: "Single option",
  args: {
    selection: "single" as const,
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <CheckboxGroup.Legend>
        <CheckboxGroup.Label>Delivery method</CheckboxGroup.Label>
        <CheckboxGroup.Hint>
          Only one item is checked; changing selection clears the others.
        </CheckboxGroup.Hint>
      </CheckboxGroup.Legend>
      <CheckboxGroup.List>
        <Checkbox name="ship" value="courier" label="Courier" />
        <Checkbox name="ship" value="pickup" label="Pickup" />
        <Checkbox name="ship" value="post" label="Mail" />
      </CheckboxGroup.List>
    </CheckboxGroup>
  ),
  play: async ({ canvas, userEvent }) => {
    const pickup = canvas.getByRole("checkbox", { name: "Pickup" });
    await userEvent.click(pickup);
    await expect(pickup).toBeChecked();
  },
};

export const Required: Story = {
  name: "Required field",
  render: () => (
    <CheckboxGroup isRequired>
      <CheckboxGroup.Legend>
        <CheckboxGroup.Label>Consents</CheckboxGroup.Label>
      </CheckboxGroup.Legend>
      <CheckboxGroup.List>
        <Checkbox name="terms" label="Terms of service" />
        <Checkbox name="marketing" label="Newsletter (optional)" />
      </CheckboxGroup.List>
    </CheckboxGroup>
  ),
};

export const WithoutDescription: Story = {
  name: "Without subtitle",
  render: () => (
    <CheckboxGroup>
      <CheckboxGroup.Legend>
        <CheckboxGroup.Label>Tags</CheckboxGroup.Label>
      </CheckboxGroup.Legend>
      <CheckboxGroup.List>
        <Checkbox name="t1" label="Design" />
        <Checkbox name="t2" label="Development" />
      </CheckboxGroup.List>
    </CheckboxGroup>
  ),
};

export const Horizontal: Story = {
  name: "Horizontal",
  render: () => (
    <CheckboxGroup>
      <CheckboxGroup.Legend>
        <CheckboxGroup.Label>Delivery method</CheckboxGroup.Label>
        <CheckboxGroup.Hint>Items in a row with wrap when space is tight.</CheckboxGroup.Hint>
      </CheckboxGroup.Legend>
      <CheckboxGroup.List orientation="horizontal">
        <Checkbox name="ship" value="courier" label="Courier" />
        <Checkbox name="ship" value="pickup" label="Pickup" />
        <Checkbox name="ship" value="post" label="Mail" />
      </CheckboxGroup.List>
    </CheckboxGroup>
  ),
};

export const Sizes: Story = {
  name: "Sizes small · base · mid · large",
  render: () => (
    <div className="grid w-full max-w-5xl gap-xlarge md:grid-cols-2">
      {COMPONENT_SIZES.map((size) => (
        <div key={size} className="flex flex-col gap-base">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">{size}</span>
          <CheckboxGroup size={size}>
            <CheckboxGroup.Legend>
              <CheckboxGroup.Label>Delivery method</CheckboxGroup.Label>
              <CheckboxGroup.Hint>size={size}</CheckboxGroup.Hint>
            </CheckboxGroup.Legend>
            <CheckboxGroup.List>
              <Checkbox name={`ship-${size}`} value="courier" label="Courier" />
              <Checkbox name={`ship-${size}`} value="pickup" label="Pickup" />
              <Checkbox name={`ship-${size}`} value="post" label="Mail" />
            </CheckboxGroup.List>
          </CheckboxGroup>
        </div>
      ))}
    </div>
  ),
};
