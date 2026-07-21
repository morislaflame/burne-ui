import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";
import { IoCopyOutline, IoLinkOutline, IoShareSocialOutline, IoTrashOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import { Popover } from "@/components/core/Popover";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[18rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Popover panel on trigger **click**. Compound: `<Popover.Trigger>`, `<Popover.Content>`, optional `<Popover.Header>` with `<Popover.Title>` / `<Popover.Description>`, `<Popover.Body>`, `<Popover.Arrow />`. Padding on the whole panel; gap between header and body — `gap` prop on `<Popover.Content>`. Placement and flip — like `Tooltip`; dismiss — click outside or `Escape`.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "Basic",
  render: () => (
    <Popover>
      <Popover.Trigger>
        <Button variant="outline" type="button">
          Open
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Body>
          <Text as="p" variant="small">
            Arbitrary content inside the panel.
          </Text>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open" }));
    await expect(screen.getByText("Arbitrary content inside the panel.")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByText("Arbitrary content inside the panel.")).not.toBeInTheDocument(),
    );
  },
};

export const WithHeader: Story = {
  name: "Header + Label + Hint",
  render: () => (
    <Popover side="bottom">
      <Popover.Trigger>
        <Button variant="secondary" type="button">
          Settings
        </Button>
      </Popover.Trigger>
      <Popover.Content showArrow>
        <Popover.Arrow />
        <Popover.Header>
          <Popover.Title>Export</Popover.Title>
          <Popover.Description>Choose a format or copy the link</Popover.Description>
        </Popover.Header>
        <Popover.Body>
          <div className="flex flex-col gap-small">
            <Button variant="ghost" size="small" type="button">
              Download PDF
            </Button>
            <Button variant="ghost" size="small" type="button">
              Download CSV
            </Button>
          </div>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  ),
};

export const Placements: Story = {
  name: "Placement (4 sides)",
  render: () => (
    <div className="grid grid-cols-2 gap-xlarge py-xlarge">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <div key={side} className="flex items-center justify-center">
          <Popover side={side}>
            <Popover.Trigger>
              <Button variant="outline" type="button" className="capitalize">
                {side}
              </Button>
            </Popover.Trigger>
            <Popover.Content showArrow offset={10}>
              <Popover.Arrow />
              <Popover.Body>
                <Text as="p" variant="small">{`Popover ${side}`}</Text>
              </Popover.Body>
            </Popover.Content>
          </Popover>
        </div>
      ))}
    </div>
  ),
};

const TAG_COLORS = [
  { id: "primary", label: "Primary", className: "bg-primary" },
  { id: "danger", label: "Danger", className: "bg-danger" },
  { id: "success", label: "Success", className: "bg-success" },
  { id: "warning", label: "Warning", className: "bg-warning" },
  { id: "info", label: "Info", className: "bg-info" },
] as const;

/** Custom panel: tag color picker + preview — example for dropdown-like scenarios. */
function TagColorPopoverDemo() {
  const [colorId, setColorId] = useState<(typeof TAG_COLORS)[number]["id"]>("primary");
  const active = TAG_COLORS.find((c) => c.id === colorId)!;

  return (
    <Popover side="bottom" defaultOpen>
      <Popover.Trigger>
        <Button variant="outline" type="button" className="gap-small">
          <span className={cn("size-3 rounded-full", active.className)} aria-hidden />
          Tag color
        </Button>
      </Popover.Trigger>
      <Popover.Content showArrow className="max-w-none">
        <Popover.Arrow />
        <Popover.Header>
          <Popover.Title>Task label</Popover.Title>
          <Popover.Description>Color is visible in the list and on the kanban board</Popover.Description>
        </Popover.Header>
        <Popover.Body>
          <div className="flex flex-col gap-plus">
            <div className="flex flex-wrap gap-small">
              {TAG_COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  aria-label={color.label}
                  aria-pressed={colorId === color.id}
                  className={cn(
                    "inline-flex size-8 items-center justify-center rounded-base border-2 outline-none transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    colorId === color.id ? "border-primary" : "border-transparent",
                  )}
                  onClick={() => setColorId(color.id)}
                >
                  <span className={cn("size-5 rounded-full", color.className)} />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-base rounded-base border-token bg-secondary px-base py-small">
              <span className={cn("size-4 shrink-0 rounded-full", active.className)} aria-hidden />
              <Text as="span" variant="small">
                {active.label}
              </Text>
            </div>
            <Input label="Label" defaultValue="Urgent" size="small" />
          </div>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}

export const CustomTagColorPanel: Story = {
  name: "Custom panel (TagColorPicker)",
  render: () => <TagColorPopoverDemo />,
};

function ShareLinkPopoverDemo() {
  const [copied, setCopied] = useState(false);

  return (
    <Popover side="top">
      <Popover.Trigger>
        <Button variant="primary" type="button" icon={<IoShareSocialOutline aria-hidden />}>
          Share
        </Button>
      </Popover.Trigger>
      <Popover.Content showArrow>
        <Popover.Arrow />
        <Popover.Header>
          <Popover.Title>Share link</Popover.Title>
          <Popover.Description>Link access — read only</Popover.Description>
        </Popover.Header>
        <Popover.Body>
          <div className="flex flex-col gap-plus">
            <Input
              readOnly
              size="small"
              defaultValue="https://app.example.com/doc/7xk2"
              suffix={
                <Button
                  variant="ghost"
                  size="small"
                  type="button"
                  aria-label="Copy"
                  onClick={() => {
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  <IoCopyOutline aria-hidden />
                </Button>
              }
            />
            <div className="grid grid-cols-2 gap-small">
              <Button variant="outline" size="small" type="button" icon={<IoLinkOutline aria-hidden />}>
                Link
              </Button>
              <Button variant="ghost" size="small" type="button" className="text-danger" icon={<IoTrashOutline aria-hidden />}>
                Revoke
              </Button>
            </div>
            {copied ? (
              <Text as="p" variant="tools" className="text-success">
                Copied
              </Text>
            ) : null}
          </div>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}

export const CustomSharePanel: Story = {
  name: "Custom panel (ShareLink)",
  render: () => <ShareLinkPopoverDemo />,
};

export const Controlled: Story = {
  name: "Controlled",
  render: function ControlledPopover() {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-mid">
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger>
            <Button variant="outline" type="button">
              {open ? "Close" : "Open"}
            </Button>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Body>
              <Text as="p" variant="small">
                External state: {open ? "open" : "closed"}
              </Text>
            </Popover.Body>
          </Popover.Content>
        </Popover>
        <Button variant="ghost" size="small" type="button" onClick={() => setOpen((v) => !v)}>
          Toggle externally
        </Button>
      </div>
    );
  },
};

export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid text-left">
      <p className="text-sm text-muted">
        Panel: <code className="text-primary">role=&quot;dialog&quot;</code>,{" "}
        <code className="text-primary">aria-labelledby</code> /{" "}
        <code className="text-primary">aria-describedby</code> from Header. Trigger —{" "}
        <code className="text-primary">aria-expanded</code> and{" "}
        <code className="text-primary">aria-controls</code>. Dismiss: click outside the panel,{" "}
        <kbd className="rounded-small border-token px-xsmall py-0.5 text-tools">Escape</kbd>.
      </p>
      <Popover>
        <Popover.Trigger>
          <Button variant="outline" type="button">
            Help
          </Button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Header>
            <Popover.Title>Field help</Popover.Title>
          </Popover.Header>
          <Popover.Body>
            <Text as="p" variant="small" className="text-muted">
              Use ISO 8601 format for the date.
            </Text>
          </Popover.Body>
        </Popover.Content>
      </Popover>
    </div>
  ),
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story:
          "Slots root (trigger), trigger, content, panel, label, hint, and body via classNames prop.",
      },
    },
  },
  render: () => (
    <Popover
      classNames={{
        root: "rounded-mid ring-2 ring-primary/40",
        trigger: "rounded-mid",
        content: "ring-1 ring-primary/20",
        panel: "border-primary/25",
        label: "text-primary",
        hint: "text-muted/80",
        body: "text-foreground",
      }}
    >
      <Popover.Trigger>
        <Button variant="outline" type="button">
          Settings
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Header>
          <Popover.Title>Filters</Popover.Title>
          <Popover.Description>Changes apply immediately</Popover.Description>
        </Popover.Header>
        <Popover.Body>
          <Text as="p" variant="small">
            Panel content with custom slots.
          </Text>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  ),
};
