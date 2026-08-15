import type { ComponentType } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";

import { Button } from "@/components/core/Button";
import { glossDottedDecorator } from "@/stories-utils/glossStoryChrome";
import { AlertDialog, primaryButtonStatusForAlertTone, primaryButtonVariantForAlertTone, type AlertDialogSize } from "./index";
import { useAlertDialog } from "./useAlertDialog";
import type { AlertStatus } from "@/components/core/Alert";
import { AlertDialogMotionDemo } from "../../../../playground/showcase/demos/alertDialog/AlertDialogMotion.demo";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[24rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Composite Components/AlertDialog",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Confirmation modal (`alertdialog`): same semantic statuses and icons as `Alert`; sizes `small`–`large`. `variant=\"gloss\"` — glass panel. In `AlertDialog.Footer`, direct `Button` children without `size` inherit the modal button size (`footerButtonSizeForAlertDialog` / `useAlertDialog().footerButtonSize`). Escape closes (Cancel); backdrop does not. Use `closeOnEscape={false}` to block Escape.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "base", "mid", "large"],
    },
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "gloss"],
    },
    status: {
      control: "select",
      options: ["default", "danger", "success", "info", "warning"],
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function ConfirmTemplate({
  status: statusProp,
  size = "base",
  label = "Open",
  variant = "default",
}: {
  status?: AlertStatus;
  size?: AlertDialogSize;
  label?: string;
  variant?: "default" | "outline" | "secondary" | "gloss";
}) {
  const [open, setOpen] = useState(false);
  const status = statusProp ?? "default";
  const primaryVariant = primaryButtonVariantForAlertTone(status);
  const primaryStatus = primaryButtonStatusForAlertTone(status);
  return (
    <AlertDialog open={open} onOpenChange={setOpen} size={size} status={status} variant={variant}>
      <AlertDialog.Trigger asChild>
        <Button type="button" size="base" variant="outline">
          {label}
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Panel>
        <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Confirmation</AlertDialog.Title>
            <AlertDialog.Description>
              Choose an action — clicking outside the panel will not close the dialog.
            </AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" variant={primaryVariant} status={primaryStatus} onClick={() => setOpen(false)}>
            Continue
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Panel>
    </AlertDialog>
  );
}

export const ConfirmDelete: Story = {
  name: "Danger",
  render: () => <ConfirmTemplate status="danger" label="Delete (danger)" />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Delete (danger)" }));
    await expect(
      await screen.findByRole("alertdialog", { name: "Confirmation" }),
    ).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  },
};

function AlertDialogUncontrolledActions({
  status,
}: {
  status: AlertStatus;
}) {
  const { onOpenChange } = useAlertDialog();
  const primaryVariant = primaryButtonVariantForAlertTone(status);
  const primaryStatus = primaryButtonStatusForAlertTone(status);
  return (
    <>
      <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
        Cancel
      </Button>
      <Button
        type="button"
        variant={primaryVariant}
        status={primaryStatus}
        onClick={() => onOpenChange(false)}
      >
        Continue
      </Button>
    </>
  );
}

export const Uncontrolled: Story = {
  name: "Uncontrolled (defaultOpen)",
  parameters: {
    docs: {
      description: {
        story:
          "Without `open` — internal state. Trigger opens; footer actions call `onOpenChange(false)` from context.",
      },
    },
  },
  render: function UncontrolledDemo() {
    return (
      <AlertDialog status="warning">
        <AlertDialog.Trigger asChild>
          <Button type="button" size="base" variant="outline">
            Open (uncontrolled)
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Panel>
          <AlertDialog.Header>
            <AlertDialog.HeadingBlock>
              <AlertDialog.Title>Uncontrolled alert</AlertDialog.Title>
              <AlertDialog.Description>
                No parent React state — only Trigger and footer actions.
              </AlertDialog.Description>
            </AlertDialog.HeadingBlock>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialogUncontrolledActions status="warning" />
          </AlertDialog.Footer>
        </AlertDialog.Panel>
      </AlertDialog>
    );
  },
};

export const StatusDefault: Story = {
  name: "Status default",
  render: () => <ConfirmTemplate status="default" label="Default" />,
};

export const StatusSuccess: Story = {
  name: "Status success",
  render: () => <ConfirmTemplate status="success" label="Success" />,
};

export const StatusInfo: Story = {
  name: "Status info",
  render: () => <ConfirmTemplate status="info" label="Info" />,
};

export const StatusWarning: Story = {
  name: "Status warning",
  render: () => <ConfirmTemplate status="warning" label="Warning" />,
};

export const Sizes: Story = {
  name: "Sizes small · base · mid · large",
  render: function SizesDemo() {
    return (
      <div className="flex max-w-2xl flex-col flex-wrap gap-2xlarge sm:flex-row sm:items-start">
        {(["small", "base", "mid", "large"] as const).map((size) => (
          <div key={size} className="flex flex-col items-start gap-base">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              {size}
            </span>
            <ConfirmTemplate status="info" size={size} label={`Open (${size})`} />
          </div>
        ))}
      </div>
    );
  },
};

function GlossDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-mid">
      <ConfirmTemplate variant="gloss" status="danger" label="Gloss danger" />
      <ConfirmTemplate variant="gloss" status="success" label="Gloss success" />
      <ConfirmTemplate variant="gloss" status="info" label="Gloss info" />
      <ConfirmTemplate variant="gloss" status="warning" label="Gloss warning" />
    </div>
  );
}

export const Gloss: Story = {
  name: "Gloss",
  parameters: { controls: { disable: true } },
  decorators: [glossDottedDecorator(false)],
  render: () => <GlossDemo />,
};

export const GlossLight: Story = {
  name: "Gloss — light theme",
  parameters: { controls: { disable: true } },
  decorators: [glossDottedDecorator(true)],
  render: () => <GlossDemo />,
};

// ─── portalContainer (3.1) ────────────────────────────────────────────────────

export const PortalContainer: Story = {
  name: "portalContainer",
  parameters: {
    docs: {
      description: {
        story:
          "Custom `portalContainer` uses non-modal `dialog.show()` + `position: absolute`, so the alert stays inside the host. Host must be `position: relative`.",
      },
    },
  },
  render: function PortalContainerDemo() {
    const [open, setOpen] = useState(false);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    return (
      <div className="flex w-full max-w-lg flex-col gap-large">
        <p className="text-sm text-muted">
          Overlay stays inside the dashed host (not <code className="text-foreground">document.body</code> / top layer).
        </p>
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          Open in custom host
        </Button>
        <div
          ref={setContainer}
          className="relative h-72 overflow-hidden rounded-mid border-2 border-dashed border-primary/40 bg-surface/40 p-large"
        >
          <p className="text-xs text-muted">Custom portal host</p>
          {container ? (
            <AlertDialog
              open={open}
              onOpenChange={setOpen}
              portalContainer={container}
              status="warning"
              size="small"
            >
              <AlertDialog.Panel>
                <AlertDialog.Header>
                  <AlertDialog.HeadingBlock>
                    <AlertDialog.Title>Inside host</AlertDialog.Title>
                    <AlertDialog.Description>
                      Panel is a DOM child of the dashed container.
                    </AlertDialog.Description>
                  </AlertDialog.HeadingBlock>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                  <Button type="button" size="small" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="button" size="small" onClick={() => setOpen(false)}>
                    Continue
                  </Button>
                </AlertDialog.Footer>
              </AlertDialog.Panel>
            </AlertDialog>
          ) : null}
        </div>
      </div>
    );
  },
};

// ─── asChild merged props (3.3) ───────────────────────────────────────────────

export const AsChildMergedProps: Story = {
  name: "asChild — merged props & ref",
  parameters: {
    docs: {
      description: {
        story:
          "`AlertDialog.Trigger asChild` merges host `id`, `data-*`, `className`, and `ref` onto the child via `mergeAsChildProps`.",
      },
    },
  },
  render: function AsChildMergedPropsDemo() {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [refLabel, setRefLabel] = useState("ref: —");
    const [open, setOpen] = useState(false);

    useLayoutEffect(() => {
      const node = triggerRef.current;
      setRefLabel(node ? `ref → #${node.id} (${node.tagName.toLowerCase()})` : "ref: —");
    }, []);

    return (
      <div className="flex flex-col items-center gap-large">
        <p className="text-sm text-muted">{refLabel}</p>
        <AlertDialog open={open} onOpenChange={setOpen} status="danger">
          <AlertDialog.Trigger
            asChild
            ref={triggerRef}
            id="story-alert-dialog-trigger"
            data-testid="story-alert-dialog-trigger"
            data-analytics="open-alert-dialog"
            className="ring-2 ring-primary/30"
          >
            <Button type="button" variant="outline">
              Open (merged props)
            </Button>
          </AlertDialog.Trigger>
          <AlertDialog.Panel>
            <AlertDialog.Header>
              <AlertDialog.HeadingBlock>
                <AlertDialog.Title>Merged trigger</AlertDialog.Title>
                <AlertDialog.Description>
                  Host props from Trigger land on the Button child.
                </AlertDialog.Description>
              </AlertDialog.HeadingBlock>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Panel>
        </AlertDialog>
      </div>
    );
  },
  play: async ({ canvas }) => {
    const btn = canvas.getByTestId("story-alert-dialog-trigger");
    await expect(btn).toHaveAttribute("id", "story-alert-dialog-trigger");
    await expect(btn).toHaveAttribute("data-analytics", "open-alert-dialog");
  },
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "Slot customization via `classNames` on root (like `Dialog`).",
      },
    },
  },
  render: function AlertDialogClassNamesStory() {
    const [open, setOpen] = useState(false);
    return (
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        status="warning"
        classNames={{
          panel: "ring-1 ring-warning/30",
          title: "text-warning font-semibold",
          description: "text-foreground/80",
          footer: "border-t border-warning/20 pt-small",
        }}
      >
        <AlertDialog.Trigger asChild>
          <Button type="button" variant="outline">
            Open
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Panel>
          <AlertDialog.Header>
            <AlertDialog.HeadingBlock>
              <AlertDialog.Title>Unsaved changes</AlertDialog.Title>
              <AlertDialog.Description>
                All slots configured via classNames on root.
              </AlertDialog.Description>
            </AlertDialog.HeadingBlock>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => setOpen(false)}>
              Continue
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Panel>
      </AlertDialog>
    );
  },
};

export const SlotMotionGallery: Story = {
  name: "Slot motion gallery (instant, indicator, chrome, overlay)",
  render: () => <AlertDialogMotionDemo />,
};
