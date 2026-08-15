import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { IoDocumentTextOutline, IoOpenOutline } from "react-icons/io5";

import { Text } from "@/components/core/Text";

import { Link } from "@/components/core/Link";
import { LinkMotionDemo } from "../../../../playground/showcase/demos/link/LinkMotion.demo";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const lightDecorator = [
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
  title: "Core Components/Link",
  component: Link,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Text link: defaults to `text-foreground`; color can be overridden via `className` (e.g. `text-muted` / `text-primary`). Default ↗ icon — `text-muted` until hover. Hover-lift and squeeze on press. Simple API: `underline`, `icon`/`iconPosition`, `showDefaultIcon`. Compound API: `<Link.Icon />` in children.",
      },
    },
  },
  decorators: [...framedDecorator],
  args: {
    href: "#",
    children: "Learn more",
    size: "base",
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ClickInteraction: Story = {
  name: "Interaction: click",
  args: {
    onClick: fn(),
  },
  render: (args) => (
    <Link
      {...args}
      onClick={(event) => {
        event.preventDefault();
        args.onClick?.(event);
      }}
    />
  ),
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("link", { name: "Learn more" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const WithDefaultIcon: Story = {
  name: "Default icon",
  render: () => (
    <div className="flex flex-col items-center gap-large">
      <Link href="#" showDefaultIcon defaultIconPosition="end">
        Next
      </Link>
      <Link href="#" showDefaultIcon defaultIconPosition="start">
        Back to list
      </Link>
    </div>
  ),
};

export const Underline: Story = {
  name: "With underline",
  render: () => (
    <div className="flex flex-col items-center gap-large">
      <Link href="#" underline>
        Underlined link
      </Link>
      <Link href="#" underline showDefaultIcon>
        With icon
      </Link>
    </div>
  ),
};

export const CustomIcons: Story = {
  name: "Custom icons",
  render: () => (
    <div className="flex flex-col items-center gap-large">
      <Link href="#" icon={<IoDocumentTextOutline aria-hidden className="icon-base" />}>
        Documentation
      </Link>
      <Link href="https://example.com" icon={<IoOpenOutline aria-hidden className="icon-base" />} iconPosition="end">
        Open site
      </Link>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-col items-start gap-small">
      <Link href="#" size="small" showDefaultIcon>
        small
      </Link>
      <Link href="#" size="base" showDefaultIcon>
        base
      </Link>
      <Link href="#" size="mid" showDefaultIcon>
        mid
      </Link>
      <Link href="#" size="large" showDefaultIcon>
        large
      </Link>
    </div>
  ),
};

export const InParagraph: Story = {
  name: "In text",
  render: () => (
    <Text as="p" variant="base" className="max-w-md text-center text-muted">
      Read the{" "}
      <Link href="#" underline showDefaultIcon className="inline-flex align-baseline">
        guide
      </Link>{" "}
      or go to profile settings.
    </Text>
  ),
};

export const LightTheme: Story = {
  name: "Light theme",
  decorators: [...lightDecorator],
  args: {
    showDefaultIcon: true,
    children: "Link on light background",
  },
};

export const CompoundApi: Story = {
  name: "Compound API",
  render: () => (
    <div className="flex flex-col items-center gap-large">
      <Link href="#">
        Icon at end (default)
        <Link.Icon />
      </Link>
      <Link href="#">
        <Link.Icon iconPosition="start" />
        Icon at start
      </Link>
      <Link href="#">
        Custom icon
        <Link.Icon>
          <IoOpenOutline aria-hidden className="icon-base" />
        </Link.Icon>
      </Link>
    </div>
  ),
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "Slots root, text and icon via classNames prop.",
      },
    },
  },
  render: () => (
    <Link
      href="#"
      showDefaultIcon
      underline
      classNames={{
        root: "gap-small rounded-mid border border-primary/20 p-xsmall text-info",
        text: "font-semibold",
        icon: "text-warning",
      }}
    >
      Custom link
    </Link>
  ),
};

/** Review 3.8: Link styles on a custom anchor via asChild. */
export const AsChild: Story = {
  name: "asChild — custom anchor",
  parameters: {
    docs: {
      description: {
        story:
          "`asChild` merges Link styles onto a single child (router `Link`, custom `<a>`). `href` is optional — the child owns navigation.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col items-start gap-large">
      <Link asChild underline showDefaultIcon>
        <a href="#docs">Styled router-ready link</a>
      </Link>
      <Link asChild icon={<IoDocumentTextOutline aria-hidden />} iconPosition="start">
        <a href="#file">With start icon</a>
      </Link>
    </div>
  ),
};

export const SlotMotionGallery: Story = {
  name: "Slot motion gallery",
  render: () => <LinkMotionDemo />,
};
