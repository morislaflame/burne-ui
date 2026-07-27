import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { CloseButton } from "./index";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
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
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/CloseButton",
  component: CloseButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...darkThemeDecorator],
  args: {
    variant: "default",
    size: "base",
    disabled: false,
    ripple: false,
    "aria-label": "Close",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "outline", "secondary", "ghost", "gloss"],
    },
    size: {
      control: "select",
      options: ["small", "base", "mid", "large"],
    },
    ripple: {
      control: "boolean",
      description:
        "Built-in `<Ripple />` with tone matching variant. Off by default in Storybook.",
    },
  },
  render: (args) => <CloseButton {...args} />,
} satisfies Meta<typeof CloseButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ClickInteraction: Story = {
  name: "Interaction: click",
  args: {
    onClick: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Sizes: Story = {
  name: "Sizes (small — large)",
  render: () => (
    <div className="flex items-center gap-mid">
      <CloseButton size="small" aria-label="Close small" />
      <CloseButton size="base" aria-label="Close base" />
      <CloseButton size="mid" aria-label="Close mid" />
      <CloseButton size="large" aria-label="Close large" />
    </div>
  ),
};

export const Variants: Story = {
  name: "Variants",
  render: () => (
    <div className="flex flex-wrap items-center gap-mid">
      <CloseButton variant="default" aria-label="Close default" />
      <CloseButton aria-label="Close (default)" />
      <CloseButton variant="primary" aria-label="Close primary" />
      <CloseButton variant="outline" aria-label="Close outline" />
      <CloseButton variant="secondary" aria-label="Close secondary" />
      <CloseButton variant="ghost" aria-label="Close ghost" />
      <CloseButton variant="gloss" aria-label="Close gloss" />
    </div>
  ),
};

export const VariantsOnLightTheme: Story = {
  name: "Variants — light theme",
  decorators: [...lightThemeDecorator],
  render: () => (
    <div className="flex flex-wrap items-center gap-mid">
      <CloseButton variant="default" aria-label="Close default" />
      <CloseButton aria-label="Close (default)" />
      <CloseButton variant="primary" aria-label="Close primary" />
      <CloseButton variant="outline" aria-label="Close outline" />
      <CloseButton variant="secondary" aria-label="Close secondary" />
      <CloseButton variant="ghost" aria-label="Close ghost" />
      <CloseButton variant="gloss" aria-label="Close gloss" />
    </div>
  ),
};

export const VariantSizesMatrix: Story = {
  name: "variant × size matrix",
  render: () => (
    <div className="flex flex-col gap-mid">
      {(["default", "primary", "outline", "secondary", "ghost"] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-mid">
          <span className="text-muted text-small w-20 shrink-0">{variant}</span>
          <CloseButton variant={variant} size="small" aria-label={`${variant} small`} />
          <CloseButton variant={variant} size="base" aria-label={`${variant} base`} />
          <CloseButton variant={variant} size="mid" aria-label={`${variant} mid`} />
          <CloseButton variant={variant} size="large" aria-label={`${variant} large`} />
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithRipple: Story = {
  name: "With ripple",
  args: { ripple: true },
};

export const OnLightTheme: Story = {
  name: "Light theme (data-theme)",
  decorators: [...lightThemeDecorator],
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for CloseButton",
      },
    },
  },
  render: () => (
    <CloseButton
      variant="outline"
      classNames={{
        root: "border-primary/50 bg-primary/5 shadow-token-mid hover:bg-primary/10",
        icon: "text-primary",
      }}
      aria-label="Close with custom slots"
    />
  ),
};
