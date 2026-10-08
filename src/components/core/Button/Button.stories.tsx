import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { IoAdd, IoSave } from "react-icons/io5";

import { Button, type ButtonStatus, type ButtonVariant } from ".";
import { ButtonSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/button/slotMotion/gallery";
import { ButtonMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/button/motionController/gallery";
import { ButtonMotionStateSaveDemo } from "../../../../playground/showcase/demos/button/ButtonMotionStateSave.demo";

const BUTTON_VARIANTS: ButtonVariant[] = [
  "default",
  "primary",
  "outline",
  "secondary",
  "ghost",
];

const BUTTON_STATUSES: ButtonStatus[] = [
  "default",
  "danger",
  "success",
  "info",
  "warning",
];

/** Dark theme — tokens from `:root`, explicit background for stories. */
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
  title: "Core Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...darkThemeDecorator],
  args: {
    children: "Button",
    variant: "default",
    status: "default",
    size: "base",
    disabled: false,
    iconOnly: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "primary",
        "outline",
        "secondary",
        "ghost",
      ],
    },
    status: {
      control: "select",
      options: ["default", "danger", "success", "info", "warning"] satisfies ButtonStatus[],
    },
    size: {
      control: "select",
      options: ["small", "base", "mid", "large"],
    },
    iconOnly: {
      control: "boolean",
      description: "Icon only: `min-w-fit` instead of `min-w-button-*`. Set `aria-label`.",
    },
    ripple: {
      control: "boolean",
      description:
        "Built-in `<Ripple />` with tone matching variant. Enabled by default in Storybook for demo.",
    },
    motionController: {
      control: false,
      description: "Deferred MotionController handle. Not config.motion and not the motion map.",
    },
  },
  render: (args) => <Button {...args} />,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ClickInteraction: Story = {
  name: "Interaction: click",
  args: {
    children: "Button",
    onClick: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Button" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Sizes: Story = {
  name: "Sizes (small — large)",
  render: () => (
    <div className="flex items-start gap-mid">
      <Button size="small">
        Small
      </Button>
      <Button size="base">
        Base
      </Button>
      <Button size="mid">
        Mid
      </Button>
      <Button size="large">
        Large
      </Button>
    </div>
  ),
};

export const IconOnlySizes: Story = {
  name: "Icon only (iconOnly)",
  render: () => (
    <div className="flex flex-wrap items-center gap-mid">
      <Button size="small" variant="outline" iconOnly aria-label="Add">
        <IoAdd aria-hidden className="icon-small" />
      </Button>
      <Button size="base" variant="outline" iconOnly aria-label="Add">
        <IoAdd aria-hidden className="icon-base" />
      </Button>
      <Button size="mid" variant="outline" iconOnly aria-label="Add">
        <IoAdd aria-hidden className="icon-large" />
      </Button>
      <Button size="large" variant="outline" iconOnly aria-label="Add">
        <IoAdd aria-hidden className="icon-large" />
      </Button>
    </div>
  ),
};

export const Variants: Story = {
  name: "Variants",
  render: () => (
    <div className="flex flex-wrap items-start gap-mid">
      <Button>
        Default
      </Button>
      <Button variant="primary">
        Primary
      </Button>
      <Button variant="outline">
        Outline
      </Button>
      <Button variant="secondary">
        Secondary
      </Button>
      <Button variant="ghost" ripple>
        Ghost
      </Button>
    </div>
  ),
};

export const VariantsOnLightTheme: Story = {
  name: "Variants — light theme",
  decorators: [...lightThemeDecorator],
  render: () => (
    <div className="flex flex-wrap items-start gap-mid">
      <Button>
        Default
      </Button>
      <Button variant="primary">
        Primary
      </Button>
      <Button variant="outline">
        Outline
      </Button>
      <Button variant="secondary">
        Secondary
      </Button>
      <Button variant="ghost" ripple>
        Ghost
      </Button>
    </div>
  ),
};

function StatusVariantsDemo() {
  return (
    <div className="flex w-full max-w-4xl flex-col gap-2xlarge py-large">
      {BUTTON_STATUSES.map((status) => (
        <div key={status} className="flex flex-col gap-base">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            status: {status}
          </span>
          <div className="flex flex-wrap items-center gap-base">
            {BUTTON_VARIANTS.map((variant) => (
              <Button
                key={`${status}-${variant}`}
                variant={variant}
                status={status}
                className="min-w-[7.5rem] capitalize"
              >
                {variant}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export const StatusVariants: Story = {
  name: "Statuses × variants (dark theme)",
  render: () => <StatusVariantsDemo />,
};

export const StatusVariantsOnLightTheme: Story = {
  name: "Statuses × variants (light theme)",
  decorators: [...lightThemeDecorator],
  render: () => <StatusVariantsDemo />,
};

export const WithIcon: Story = {
  name: "With icon",
  render: () => (
    <div className="flex flex-wrap items-center gap-mid">
      <Button size="small" icon={<IoAdd aria-hidden />}>
        Add
      </Button>
      <Button size="base" variant="outline" icon={<IoAdd aria-hidden />} iconPosition="end">
        Create
      </Button>
      <Button size="large" variant="ghost" icon={<IoAdd aria-hidden />}>
        More
      </Button>
    </div>
  ),
};

export const OverrideIconSize: Story = {
  name: "Override icon size",
  render: () => (
    <div className="flex flex-wrap items-center gap-mid">
      <Button size="base" icon={<IoAdd aria-hidden />}>
        Default
      </Button>
      <Button
        size="base"
        icon={<IoAdd aria-hidden />}
        classNames={{ icon: "icon-slot-large" }}
      >
        Large icon
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithoutRipple: Story = {
  name: "With ripple",
  args: { ripple: true },
};

export const OnLightTheme: Story = {
  name: "Light theme (data-theme)",
  decorators: [...lightThemeDecorator],
};

export const MotionStateSave: Story = {
  name: "motionState save",
  render: () => <ButtonMotionStateSaveDemo />,
};

export const LabelLayout: Story = {
  name: "Label + shortcut layout",
  render: () => (
    <Button variant="default" type="button" className="w-full max-w-xs justify-between gap-mid">
      <span>Command palette</span>
      <span className="inline-flex gap-xsmall">
        <span className="rounded-small bg-surface px-xsmall py-0.5 font-mono text-xsmall">⌘</span>
        <span className="rounded-small bg-surface px-xsmall py-0.5 font-mono text-xsmall">K</span>
      </span>
    </Button>
  ),
};

export const CompoundLayout: Story = {
  name: "Compound API",
  render: () => (
    <Button variant="outline" type="button" className="w-full max-w-xs">
      <Button.Label className="justify-between gap-mid">
        <Button.Text>Command palette</Button.Text>
        <span className="inline-flex gap-xsmall font-mono text-xsmall">
          <span>⌘</span>
          <span>K</span>
        </span>
      </Button.Label>
    </Button>
  ),
};

/** Review 3.8: Button as link via asChild. */
export const AsChildLink: Story = {
  name: "asChild — link",
  parameters: {
    docs: {
      description: {
        story:
          "`asChild` merges Button styles and motion onto a single child (e.g. `<a>`, Next.js `<Link>`). Child text becomes the label.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-large">
      <Button asChild variant="primary">
        <a href="#docs">Primary link</a>
      </Button>
      <Button asChild variant="outline" icon={<IoAdd aria-hidden />} iconPosition="end">
        <a href="#new">New page</a>
      </Button>
      <Button asChild variant="ghost" size="small">
        <a href="#ghost">Ghost link</a>
      </Button>
    </div>
  ),
};

export const CustomClassNames: Story = {
  name: "Custom classNames",
  render: () => (
    <Button
      variant="outline"
      status="info"
      icon={<IoSave aria-hidden />}
      classNames={{
        root: "rounded-large border-token-info",
        content: "gap-small",
        label: "gap-small",
        icon: "icon-slot-large text-info",
        text: "font-w-strong text-info",
      }}
    >
      Save draft
    </Button>
  ),
};

export const SlotMotionGallery: Story = {
  name: "Slot motion gallery",
  render: () => <ButtonSlotMotionGalleryDemo />,
};

export const MotionControllerGallery: Story = {
  name: "MotionController",
  parameters: {
    docs: {
      description: {
        story:
          "`useMotionControllerHandle()` — playSlot, playAll stagger, set/cancel, stacked timelines, async events, waitForComplete.",
      },
    },
  },
  render: () => <ButtonMotionControllerGalleryDemo />,
};
