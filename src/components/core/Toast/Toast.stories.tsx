import type { ComponentType, ReactNode } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen } from "storybook/test";

import { Button } from "@/components/core/Button";

import { Toast, type ToastPlacement, type ToastSize, type ToastStatus } from ".";
import { useToast } from "./useToast";

const pageFrame = (Story: ComponentType) => (
  <div
    className="box-border flex min-h-[16rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
    style={{ backgroundColor: "var(--color-background)" }}
  >
    <Story />
  </div>
);

const decorator = [
  (Story: ComponentType) => (
    <Toast.Provider>
      {pageFrame(Story)}
    </Toast.Provider>
  ),
] as const;

const meta = {
  title: "Core Components/Toast",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Toast notifications. **Imperative API** via `useToast()`. Stack of up to 3 visible toasts; new ones on top (for `top-*`) or bottom (for `bottom-*`). Supports promise states, 5 statuses, 6 placements, custom timeout.",
      },
    },
  },
  decorators: [...decorator],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Statuses ─────────────────────────────────────────────────────────────────

const STATUSES: ToastStatus[] = ["default", "success", "danger", "info", "warning"];

const TOAST_VARIANT_ITEMS: Array<{
  status: ToastStatus;
  title: string;
  description?: string;
  action?: ReactNode;
  loading?: boolean;
}> = [
  {
    status: "default",
    title: "default",
    description: "Neutral notification without a status icon.",
  },
  {
    status: "success",
    title: "profile updated successfully",
  },
  {
    status: "danger",
    title: "unable to connect to server",
    description: "We're experiencing connection issues.",
  },
  {
    status: "info",
    title: "Help",
    description: "Additional information in a neutral informational tone.",
  },
  {
    status: "warning",
    title: "Scheduled maintenance",
    description: "Services will be unavailable Sunday from 2:00 AM to 6:00 AM UTC.",
  },
  {
    status: "info",
    title: "Update available",
    description: "Version 2.4.0 is ready to install.",
    action: (
      <Button size="small" variant="primary" status="info">
        Update
      </Button>
    ),
  },
  {
    status: "default",
    title: "Saving…",
    description: "Wait for the operation to complete.",
    loading: true,
  },
];

function ToastVariantsDemo() {
  return (
    <div className="mx-auto flex w-full max-w-[360px] flex-col gap-plus">
      {TOAST_VARIANT_ITEMS.map((item) => (
        <Toast
          key={`${item.status}-${item.title}`}
          status={item.status}
          title={item.title}
          description={item.description}
          action={item.action}
          loading={item.loading}
          onClose={() => {}}
        />
      ))}
    </div>
  );
}

export const Variants: Story = {
  name: "Variants",
  render: () => <ToastVariantsDemo />,
};

export const Statuses: Story = {
  name: "Statuses",
  render: function StatusesDemo() {
    const { toast } = useToast();
    return (
      <div className="flex flex-wrap gap-base">
        {STATUSES.map((s) => (
          <Button key={s} variant="outline" onClick={() => toast.show({ status: s, title: s, description: `Toast with status «${s}»` })}>
            {s}
          </Button>
        ))}
      </div>
    );
  },
};

// ─── Quick methods ────────────────────────────────────────────────────────────

export const QuickMethods: Story = {
  name: "Quick methods",
  render: function QuickDemo() {
    const { toast } = useToast();
    return (
      <div className="flex flex-wrap gap-base">
        <Button onClick={() => toast.success("File saved", { description: "Sync completed" })}>
          success
        </Button>
        <Button variant="primary" status="danger" onClick={() => toast.danger("Connection error", { description: "Check your network and try again" })}>
          danger
        </Button>
        <Button variant="outline" onClick={() => toast.info("A new version is available")}>
          info
        </Button>
        <Button variant="outline" onClick={() => toast.warning("Storage is almost full")}>
          warning
        </Button>
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "success" }));
    await expect(screen.getByRole("status")).toHaveTextContent("File saved");
  },
};

// ─── Promise ──────────────────────────────────────────────────────────────────

export const PromiseToast: Story = {
  name: "Promise (loading → success / error)",
  render: function PromiseDemo() {
    const { toast } = useToast();

    const handleSuccess = () => {
      const p = new Promise<string>((resolve) => setTimeout(() => resolve("Done"), 2500));
      toast.promise(p, {
        loading: "Saving…",
        success: (v) => `${v}! Data saved`,
        error: "Failed to save",
      });
    };

    const handleError = () => {
      const p = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Network error")), 2000),
      );
      toast.promise(p, {
        loading: "Uploading file…",
        success: "File uploaded",
        error: (e) => `Error: ${(e as Error).message}`,
      });
    };

    return (
      <div className="flex gap-base">
        <Button onClick={handleSuccess}>Promise → success</Button>
        <Button variant="primary" status="danger" onClick={handleError}>Promise → error</Button>
      </div>
    );
  },
};

// ─── Stack ────────────────────────────────────────────────────────────────────

export const Stack: Story = {
  name: "Stack (multiple toasts)",
  render: function StackDemo() {
    const { toast } = useToast();
    const statuses: ToastStatus[] = ["success", "info", "warning", "danger"];
    let i = 0;
    const addToast = () => {
      const s = statuses[i % statuses.length];
      i++;
      toast.show({ status: s, title: `Notification #${i}`, description: "They appear in the stack" });
    };
    return (
      <div className="flex gap-base">
        <Button onClick={addToast}>Add toast</Button>
        <Button variant="outline" onClick={addToast}>Another one</Button>
      </div>
    );
  },
};

// ─── All placements ───────────────────────────────────────────────────────────

const PLACEMENTS: ToastPlacement[] = [
  "top-left", "top-center", "top-right",
  "bottom-left", "bottom-center", "bottom-right",
];

export const AllPlacements: Story = {
  name: "All placements",
  render: function AllPlacementsDemo() {
    const { toast } = useToast();
    return (
      <div className="grid grid-cols-3 gap-base">
        {PLACEMENTS.map((p) => (
          <Button
            key={p}
            variant="outline"
            onClick={() =>
              toast.show({
                status: "info",
                title: p,
                description: "This notification",
                placement: p,
              })
            }
          >
            {p}
          </Button>
        ))}
      </div>
    );
  },
};

// ─── With action ──────────────────────────────────────────────────────────────

export const WithAction: Story = {
  name: "With action button",
  render: function WithActionDemo() {
    const { toast } = useToast();
    const show = () =>
      toast.show({
        status: "info",
        title: "Update available",
        description: "Version 2.4.0 is ready to install",
        action: (
          <Button size="small" variant="primary" status="info">
            Update
          </Button>
        ),
        timeout: 8000,
      });
    return <Button onClick={show}>Show with action</Button>;
  },
};

// ─── Custom timeout ───────────────────────────────────────────────────────────

export const CustomTimeout: Story = {
  name: "Custom timeout",
  render: function CustomTimeoutDemo() {
    const { toast } = useToast();
    return (
      <div className="flex flex-wrap gap-base">
        <Button onClick={() => toast.success("Closes in 1 sec", { timeout: 1000 })}>
          1 sec
        </Button>
        <Button onClick={() => toast.info("Closes in 8 sec", { timeout: 8000 })}>
          8 sec
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning("Will not auto-close", { timeout: 0 })}
        >
          No timeout
        </Button>
      </div>
    );
  },
};

// ─── Compound API ─────────────────────────────────────────────────────────────

export const CompoundApi: Story = {
  name: "Compound API (controlled)",
  render: function CompoundApiDemo() {
    const [show, setShow] = useState(false);
    return (
      <div className="flex gap-base">
        <Button onClick={() => setShow(true)}>Show compound</Button>
        {show && (
          <div className="fixed bottom-4 right-4 z-toast w-[360px]">
            <Toast status="success" onClose={() => setShow(false)}>
              <Toast.Indicator />
              <Toast.Title>Done!</Toast.Title>
              <Toast.Description>Data saved successfully</Toast.Description>
              <Toast.Close />
            </Toast>
          </div>
        )}
      </div>
    );
  },
};

// ─── Dismiss programmatically ─────────────────────────────────────────────────

export const DismissProgrammatically: Story = {
  name: "Dismiss by ID",
  render: function DismissDemo() {
    const { toast } = useToast();
    const [lastId, setLastId] = useState<string | null>(null);
    return (
      <div className="flex gap-base">
        <Button
          onClick={() => {
            const id = toast.show({ status: "info", title: "Persistent toast", timeout: 0 });
            setLastId(id);
          }}
        >
          Show
        </Button>
        <Button
          variant="primary"
          status="danger"
          disabled={!lastId}
          onClick={() => {
            if (lastId) toast.dismiss(lastId);
            setLastId(null);
          }}
        >
          Dismiss by ID
        </Button>
      </div>
    );
  },
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for Toast (imperative API)",
      },
    },
  },
  render: function CustomClassNamesDemo() {
    const { toast } = useToast();
    return (
      <Button
        onClick={() =>
          toast.show({
            status: "info",
            title: "Full Toast customization",
            description: "Slots root, title, description via classNames.",
            classNames: {
              root: "rounded-large border-info/50 bg-info/10 ring-1 ring-info/20",
              indicator: "text-info",
              title: "font-semibold text-info",
              description: "text-foreground/80",
            },
          })
        }
      >
        Show toast with classNames
      </Button>
    );
  },
};

const TOAST_SIZES: ToastSize[] = ["small", "base", "mid", "large"];

export const Sizes: Story = {
  name: "Sizes",
  render: function ToastSizesDemo() {
    const { toast } = useToast();
    return (
      <div className="flex flex-wrap items-center justify-center gap-mid">
        {TOAST_SIZES.map((size) => (
          <Button
            key={size}
            variant="outline"
            type="button"
            onClick={() =>
              toast.show({
                status: "info",
                size,
                title: `size=${size}`,
                description: "Padding, icon, typography, and viewport width.",
              })
            }
          >
            {size}
          </Button>
        ))}
      </div>
    );
  },
};

// ─── portalContainer (3.1) ────────────────────────────────────────────────────

function ToastPortalContainerInner() {
  const { toast } = useToast();
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() =>
        toast.show({
          status: "success",
          title: "Inside custom host",
          description: "This toast is portaled into the dashed container.",
        })
      }
    >
      Show toast in host
    </Button>
  );
}

export const PortalContainer: Story = {
  name: "portalContainer",
  parameters: {
    docs: {
      description: {
        story:
          "`Toast.Provider portalContainer` mounts the toast viewport into a custom host instead of `document.body`.",
      },
    },
  },
  decorators: [
    (Story: ComponentType) => pageFrame(Story),
  ],
  render: function PortalContainerDemo() {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    return (
      <div className="flex w-full max-w-lg flex-col gap-mid">
        <p className="text-sm text-muted">
          Toasts portal into the box below (not <code className="text-foreground">document.body</code>).
        </p>
        <div
          ref={setContainer}
          className="relative flex h-64 flex-col items-center justify-center gap-mid overflow-hidden rounded-mid border-2 border-dashed border-primary/40 bg-surface/40 p-mid"
          style={{ transform: "translateZ(0)" }}
        >
          <p className="absolute left-mid top-mid text-xs text-muted">Custom portal host</p>
          {container ? (
            <Toast.Provider portalContainer={container} defaultPlacement="bottom-center">
              <ToastPortalContainerInner />
            </Toast.Provider>
          ) : null}
        </div>
      </div>
    );
  },
};
