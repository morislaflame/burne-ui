import { useState, type ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { IoBookmarkOutline, IoHeartOutline } from "react-icons/io5";

import { Text } from "@/components/core/Text";
import { COMPONENT_SIZES } from "@/components/core/utils/componentSize";

import { ToggleButton, type ToggleButtonVariant } from ".";

const VARIANTS: ToggleButtonVariant[] = ["default", "outline", "ghost"];

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
  title: "Core Components/ToggleButton",
  component: ToggleButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Toggle button (like, bookmark): variants `default`, `outline`, `ghost`. On press, smoothly fills with primary, `aria-pressed`. Hover-lift and squeeze like `Button`. No `min-w-button-*` — padding only; height matches Button.",
      },
    },
  },
  decorators: [...framedDecorator],
  args: {
    variant: "default",
    size: "base",
    animated: true,
    defaultPressed: false,
    disabled: false,
  },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    size: { control: "select", options: COMPONENT_SIZES },
  },
} satisfies Meta<typeof ToggleButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ToggleButton icon={<IoHeartOutline aria-hidden />}>Like</ToggleButton>
  ),
};

export const PressInteraction: Story = {
  name: "Interaction: press",
  render: () => (
    <ToggleButton icon={<IoHeartOutline aria-hidden />}>Like</ToggleButton>
  ),
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Like" });
    await expect(button).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-pressed", "false");
  },
};

export const Variants: Story = {
  name: "Variants",
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-mid">
      {VARIANTS.map((variant) => (
        <ToggleButton
          key={variant}
          variant={variant}
          icon={<IoHeartOutline aria-hidden />}
        >
          {variant}
        </ToggleButton>
      ))}
    </div>
  ),
};

export const IconOnly: Story = {
  name: "Icon only",
  render: () => (
    <ToggleButton aria-label="Add to bookmarks" icon={<IoBookmarkOutline aria-hidden />} />
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-mid">
      {COMPONENT_SIZES.map((size) => (
        <ToggleButton
          key={size}
          size={size}
          icon={<IoHeartOutline aria-hidden />}
        >
          {size}
        </ToggleButton>
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  name: "Controlled mode",
  render: function ControlledToggle() {
    const [pressed, setPressed] = useState(false);
    return (
      <div className="flex flex-col items-center gap-mid">
        <ToggleButton
          pressed={pressed}
          onPressedChange={setPressed}
          icon={<IoHeartOutline aria-hidden />}
        >
          {pressed ? "Like" : "Like"}
        </ToggleButton>
        <Text as="p" variant="small" className="text-muted">
          pressed={String(pressed)}
        </Text>
      </div>
    );
  },
};

export const DefaultPressed: Story = {
  name: "Initially pressed",
  args: {
    defaultPressed: true,
    children: "In favorites",
    icon: <IoBookmarkOutline aria-hidden />,
  },
};

export const Disabled: Story = {
  name: "Disabled",
  args: {
    disabled: true,
    children: "Unavailable",
    icon: <IoHeartOutline aria-hidden />,
  },
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for ToggleButton",
      },
    },
  },
  render: () => (
    <ToggleButton
      defaultPressed
      icon={<IoHeartOutline aria-hidden />}
      classNames={{
        root: "rounded-mid ring-1 ring-danger/25",
        fill: "bg-danger/20",
        content: "gap-small",
        icon: "text-danger",
        text: "font-semibold text-danger",
      }}
    >
      Like
    </ToggleButton>
  ),
};

export const LabelLayout: Story = {
  name: "Label + trailing layout",
  render: () => (
    <ToggleButton className="w-full max-w-xs justify-between gap-plus" icon={<IoHeartOutline aria-hidden />}>
      <span>Like</span>
      <span className="text-tools">128</span>
    </ToggleButton>
  ),
};

export const CompoundLayout: Story = {
  name: "Compound API",
  render: () => (
    <ToggleButton className="w-full max-w-xs">
      <ToggleButton.Content className="justify-between gap-plus">
        <ToggleButton.IconStart>
          <IoHeartOutline aria-hidden />
        </ToggleButton.IconStart>
        <ToggleButton.Text>Like</ToggleButton.Text>
        <ToggleButton.IconEnd className="text-tools">128</ToggleButton.IconEnd>
      </ToggleButton.Content>
    </ToggleButton>
  ),
};
