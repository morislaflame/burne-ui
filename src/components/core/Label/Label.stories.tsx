import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "@/components/core/Input";
import { Label } from "@/components/core/Label";

const decorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[10rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Form field label. Supports `htmlFor`, `required`, and `FieldLabelContext` from Input/ComboBox. `Label.Slot` — null component for compound layout.",
      },
    },
  },
  decorators: [...decorator],
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Default",
  render: () => <Label htmlFor="label-demo">Email</Label>,
};

export const Required: Story = {
  name: "Required field",
  render: () => (
    <Label htmlFor="label-required" required>
      Password
    </Label>
  ),
};

export const WithInput: Story = {
  name: "With Input",
  render: () => (
    <Input label="Username" placeholder="ivan" className="max-w-sm" />
  ),
};

export const LegendSpan: Story = {
  name: "Without htmlFor (span)",
  render: () => <Label id="legend-label">Section title</Label>,
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for Label",
      },
    },
  },
  render: () => (
    <Label
      htmlFor="label-custom"
      required
      classNames={{
        root: "rounded-mid border border-primary/30 px-base py-xsmall",
        text: "text-primary font-semibold",
        required: "text-warning",
      }}
    >
      Email
    </Label>
  ),
};
