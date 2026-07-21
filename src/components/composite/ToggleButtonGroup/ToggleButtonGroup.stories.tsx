import { useState, type ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { IoBookmarkOutline, IoGridOutline, IoHeartOutline, IoListOutline, IoTextOutline } from "react-icons/io5";

import { Text } from "@/components/core/Text";
import { ToggleButton } from "@/components/core/ToggleButton";

import { ToggleButtonGroup } from "./index";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Composite Components/ToggleButtonGroup",
  component: ToggleButtonGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "`ToggleButton` group: attached like `ButtonGroup` by default; `separated` — with gap. `type=\"single\"` — only one selected (radiogroup). Horizontal and vertical orientation, `disabled` on the group.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof ToggleButtonGroup>;

export default meta;

type Story = StoryObj<typeof ToggleButtonGroup>;

export const ConnectedHorizontal: Story = {
  name: "Attached (horizontal)",
  render: () => (
    <ToggleButtonGroup aria-label="Format filter" defaultValue={["bold"]}>
      <ToggleButton value="bold" icon={<IoTextOutline aria-hidden />}>
        Bold
      </ToggleButton>
      <ToggleButton value="italic">Italic</ToggleButton>
      <ToggleButton value="underline">Underline</ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const ConnectedVertical: Story = {
  name: "Attached (vertical)",
  render: () => (
    <ToggleButtonGroup orientation="vertical" aria-label="List view" defaultValue={["list"]}>
      <ToggleButton value="list" icon={<IoListOutline aria-hidden />}>
        List
      </ToggleButton>
      <ToggleButton value="grid" icon={<IoGridOutline aria-hidden />}>
        Grid
      </ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const Separated: Story = {
  name: "Separated",
  render: () => (
    <ToggleButtonGroup separated aria-label="Tags" defaultValue={["design"]}>
      <ToggleButton value="design">Design</ToggleButton>
      <ToggleButton value="dev">Dev</ToggleButton>
      <ToggleButton value="qa">QA</ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const SingleSelection: Story = {
  name: "Single selection",
  render: function SingleSelectDemo() {
    const [value, setValue] = useState("list");
    return (
      <div className="flex flex-col items-center gap-mid">
        <ToggleButtonGroup
          type="single"
          value={value}
          onValueChange={(v) => setValue(v as string)}
          aria-label="Display mode"
        >
          <ToggleButton value="list" icon={<IoListOutline aria-hidden />}>
            List
          </ToggleButton>
          <ToggleButton value="grid" icon={<IoGridOutline aria-hidden />}>
            Grid
          </ToggleButton>
        </ToggleButtonGroup>
        <Text as="p" variant="small" className="text-muted">
          value=&quot;{value}&quot;
        </Text>
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("radio", { name: "Grid" }));
    await expect(canvas.getByText('value="grid"')).toBeInTheDocument();
  },
};

export const SingleSeparated: Story = {
  name: "Single + separated",
  render: () => (
    <ToggleButtonGroup type="single" separated defaultValue="like" aria-label="Reactions">
      <ToggleButton value="like" icon={<IoHeartOutline aria-hidden />}>
        Like
      </ToggleButton>
      <ToggleButton value="save" icon={<IoBookmarkOutline aria-hidden />}>
        Save
      </ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <ToggleButtonGroup disabled defaultValue={["a"]} aria-label="Disabled group">
      <ToggleButton value="a">A</ToggleButton>
      <ToggleButton value="b">B</ToggleButton>
      <ToggleButton value="c">C</ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const Variants: Story = {
  name: "Variants",
  render: () => (
    <div className="flex flex-col items-center gap-large">
      {(["default", "outline", "ghost"] as const).map((variant) => (
        <ToggleButtonGroup key={variant} variant={variant} defaultValue={["one"]} aria-label={variant}>
          <ToggleButton value="one">{variant} 1</ToggleButton>
          <ToggleButton value="two">{variant} 2</ToggleButton>
        </ToggleButtonGroup>
      ))}
    </div>
  ),
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  render: () => (
    <ToggleButtonGroup
      type="single"
      defaultValue="a"
      aria-label="Custom slots"
      classNames={{
        root: "rounded-mid border border-primary/25 p-xsmall",
        separator: "border-primary/40",
      }}
    >
      <ToggleButton value="a">A</ToggleButton>
      <ToggleButton value="b">B</ToggleButton>
      <ToggleButton value="c">C</ToggleButton>
    </ToggleButtonGroup>
  ),
};
