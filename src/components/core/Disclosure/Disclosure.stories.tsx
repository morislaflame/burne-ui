import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { IoInformationCircleOutline, IoLockClosedOutline, IoNotificationsOutline } from "react-icons/io5";

import { Text } from "@/components/core/Text";

import { Disclosure } from ".";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[22rem] w-full flex-col items-center justify-start gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-lg">
        <Story />
      </div>
    </div>
  ),
];

const meta = {
  title: "Core Components/Disclosure",
  component: Disclosure,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "base", "mid", "large"],
    },
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "card", "ghost"],
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Expand/collapse content component with animation. **Variants**: `default` (divider), `outline` / `secondary` (trigger outside, border only on content), `card` (single card), `ghost`. Hover-lift and squeeze on trigger. `Disclosure.Group` — accordion and `separated`.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

const bodyText =
  "This is content that appears when the block expands. Height animation is implemented with GSAP and smooth easing. Content can be anything — text, components, lists.";

// ─── Basic ───────────────────────────────────────────────────────────────────

export const Basic: Story = {
  name: "Basic",
  render: () => (
    <Disclosure defaultOpen>
      <Disclosure.Trigger>Main information</Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
      </Disclosure.Content>
    </Disclosure>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Main information" });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  },
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const Variants: Story = {
  name: "Variants",
  render: () => (
    <div className="flex flex-col gap-mid">
      {(["default", "outline", "secondary", "card", "ghost"] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-xsmall">
          <Text as="p" variant="small" className="text-muted capitalize">{variant}</Text>
          <Disclosure variant={variant} defaultOpen>
            <Disclosure.Trigger>Title ({variant})</Disclosure.Trigger>
            <Disclosure.Content>
              <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
            </Disclosure.Content>
          </Disclosure>
        </div>
      ))}
    </div>
  ),
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-col gap-mid">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <Disclosure key={size} variant="outline" size={size}>
          <Disclosure.Trigger>Size: {size}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </div>
  ),
};

// ─── Icon position ────────────────────────────────────────────────────────────

export const IconPosition: Story = {
  name: "Icon position",
  render: () => (
    <div className="flex flex-col gap-small">
      <Disclosure variant="outline" iconPosition="end" defaultOpen>
        <Disclosure.Trigger>Icon on the right (default)</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
        </Disclosure.Content>
      </Disclosure>
      <Disclosure variant="outline" iconPosition="start">
        <Disclosure.Trigger>Icon on the left</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
        </Disclosure.Content>
      </Disclosure>
      <Disclosure variant="outline" iconPosition="end">
        <Disclosure.Trigger icon={<IoInformationCircleOutline className="size-full" />}>
          Custom icon
        </Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
        </Disclosure.Content>
      </Disclosure>
      <Disclosure variant="outline" iconPosition="end">
        <Disclosure.Trigger icon={null}>No icon</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
        </Disclosure.Content>
      </Disclosure>
    </div>
  ),
};

// ─── Controlled ───────────────────────────────────────────────────────────────

export const Controlled: Story = {
  name: "Controlled",
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col gap-mid">
        <div className="flex gap-small">
          <button
            type="button"
            className="text-small text-primary underline"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Collapse" : "Expand"} externally
          </button>
        </div>
        <Disclosure variant="outline" open={open} onOpenChange={setOpen}>
          <Disclosure.Trigger>Controlled block</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
          </Disclosure.Content>
        </Disclosure>
      </div>
    );
  },
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <Disclosure variant="outline" disabled>
      <Disclosure.Trigger>Unavailable block</Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
      </Disclosure.Content>
    </Disclosure>
  ),
};

// ─── Disclosure.Group: Default ─────────────────────────────────────────────────

export const GroupDefault: Story = {
  name: "Disclosure.Group — default",
  render: () => (
    <Disclosure.Group variant="default">
      {[
        { value: "a", title: "What is the Disclosure component?",   icon: <IoInformationCircleOutline /> },
        { value: "b", title: "How to use it in a project?",        icon: <IoNotificationsOutline /> },
        { value: "c", title: "Is there an accordion mode?",          icon: <IoLockClosedOutline /> },
      ].map(({ value, title, icon }) => (
        <Disclosure key={value} value={value}>
          <Disclosure.Trigger icon={icon}>{title}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </Disclosure.Group>
  ),
};

// ─── Disclosure.Group: Outline ─────────────────────────────────────────────────

export const GroupSecondary: Story = {
  name: "Disclosure.Group — secondary",
  render: () => (
    <Disclosure.Group variant="secondary" defaultValue="a">
      {["a", "b", "c"].map((v) => (
        <Disclosure key={v} value={v}>
          <Disclosure.Trigger>Section {v.toUpperCase()}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </Disclosure.Group>
  ),
};

export const GroupOutline: Story = {
  name: "Disclosure.Group — outline",
  render: () => (
    <Disclosure.Group variant="outline" defaultValue="a">
      {["a", "b", "c"].map((v) => (
        <Disclosure key={v} value={v}>
          <Disclosure.Trigger>Section {v.toUpperCase()}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </Disclosure.Group>
  ),
};

// ─── Disclosure.Group: Card ────────────────────────────────────────────────────

export const GroupCard: Story = {
  name: "Disclosure.Group — card",
  render: () => (
    <Disclosure.Group variant="card" defaultValue="b">
      {["a", "b", "c"].map((v) => (
        <Disclosure key={v} value={v}>
          <Disclosure.Trigger>Item {v.toUpperCase()}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </Disclosure.Group>
  ),
};

// ─── Disclosure.Group: Separated ──────────────────────────────────────────────

export const FramedVariantsClosed: Story = {
  name: "Outline / Secondary — closed",
  render: () => (
    <div className="flex flex-col gap-mid">
      <Disclosure variant="outline">
        <Disclosure.Trigger>Outline — title outside border</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
        </Disclosure.Content>
      </Disclosure>
      <Disclosure variant="secondary">
        <Disclosure.Trigger>Secondary — title outside border</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
        </Disclosure.Content>
      </Disclosure>
    </div>
  ),
};

export const GroupSeparated: Story = {
  name: "Disclosure.Group — separated",
  render: () => (
    <Disclosure.Group variant="outline" separated defaultValue="a">
      {["a", "b", "c"].map((v) => (
        <Disclosure key={v} value={v}>
          <Disclosure.Trigger>Section {v.toUpperCase()}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </Disclosure.Group>
  ),
};

// ─── Disclosure.Group: Separated Card ─────────────────────────────────────────

export const CardDragHandle: Story = {
  name: "Card — drag handle",
  render: () => (
    <Disclosure variant="card" dragHandle defaultOpen>
      <Disclosure.Trigger>Drag the handle down or up</Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" variant="small" className="text-muted">
          {bodyText} Expand and collapse work by dragging the handle or clicking the title.
        </Text>
      </Disclosure.Content>
      <Disclosure.Handle />
    </Disclosure>
  ),
};

export const GroupSeparatedCard: Story = {
  name: "Disclosure.Group — separated cards",
  render: () => (
    <Disclosure.Group variant="card" separated defaultValue="a">
      {["a", "b", "c"].map((v) => (
        <Disclosure key={v} value={v}>
          <Disclosure.Trigger>Card {v.toUpperCase()}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </Disclosure.Group>
  ),
};

// ─── Disclosure.Group: Non-accordion ──────────────────────────────────────────

export const GroupNonAccordion: Story = {
  name: "Disclosure.Group — multiple open",
  render: () => (
    <Disclosure.Group variant="outline" accordion={false}>
      {["a", "b", "c"].map((v) => (
        <Disclosure key={v} value={v} defaultOpen={v === "a" || v === "b"}>
          <Disclosure.Trigger>Section {v.toUpperCase()}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </Disclosure.Group>
  ),
};

// ─── Disclosure.Group: Controlled ─────────────────────────────────────────────

export const GroupControlled: Story = {
  name: "Disclosure.Group — controlled",
  render: () => {
    const [value, setValue] = useState<string | null>("a");
    return (
      <div className="flex flex-col gap-mid">
        <div className="flex gap-small">
          {["a", "b", "c"].map((v) => (
            <button
              key={v}
              type="button"
              className={`text-small underline ${value === v ? "text-primary font-medium" : "text-muted"}`}
              onClick={() => setValue(value === v ? null : v)}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>
        <Disclosure.Group variant="outline" value={value} onValueChange={setValue}>
          {["a", "b", "c"].map((v) => (
            <Disclosure key={v} value={v}>
              <Disclosure.Trigger>Section {v.toUpperCase()}</Disclosure.Trigger>
              <Disclosure.Content>
                <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
              </Disclosure.Content>
            </Disclosure>
          ))}
        </Disclosure.Group>
      </div>
    );
  },
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for Disclosure",
      },
    },
  },
  render: () => (
    <Disclosure
      variant="outline"
      defaultOpen
      classNames={{
        trigger: "border border-primary/30 rounded-mid",
        triggerTitle: "text-primary font-semibold",
        contentPanel: "border border-primary/20 bg-primary/5",
      }}
    >
      <Disclosure.Trigger>Notification settings</Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" variant="small" className="text-muted">
          Slots configured via classNames on root.
        </Text>
      </Disclosure.Content>
    </Disclosure>
  ),
};
