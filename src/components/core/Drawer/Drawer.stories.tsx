import type { ComponentType } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";

import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";

import { Drawer, type DrawerPlacement, type DrawerExtent } from ".";
import { useDrawer } from "./drawerContext";

const decorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[18rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Drawer",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Slide-out panel (portal to `document.body`). Supports four directions, three sizes, dragging (`Drawer.Handle`), scroll in `Drawer.Body`, and `isDismissable={false}` on `Drawer.Backdrop`.\n\n`Drawer.Trigger` — built-in trigger that opens the drawer after the press animation.",
      },
    },
  },
  decorators: [...decorator],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Default (right) ─────────────────────────────────────────────────────────

export const Default: Story = {
  name: "Default (right)",
  render: function DefaultDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer open={open} onOpenChange={setOpen}>
          <Drawer.Panel>
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>Settings</Drawer.Title>
                <Drawer.Description>Choose the required options.</Drawer.Description>
              </Drawer.HeadingBlock>
              <Drawer.Close />
            </Drawer.Header>
            <Drawer.Body>
              <p className="text-base text-muted">Arbitrary content inside the body.</p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </Drawer.Footer>
          </Drawer.Panel>
        </Drawer>
      </>
    );
  },
};

// ─── With built-in Trigger ────────────────────────────────────────────────────

export const WithTrigger: Story = {
  name: "With Drawer.Trigger",
  parameters: {
    docs: {
      description: {
        story:
          "`Drawer.Trigger asChild` — the trigger opens the drawer after the button press animation completes.",
      },
    },
  },
  render: function WithTriggerDemo() {
    const [open, setOpen] = useState(false);
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <Drawer.Trigger asChild>
          <Button>Open Drawer</Button>
        </Drawer.Trigger>
        <Drawer.Panel>
          <Drawer.Header>
            <Drawer.HeadingBlock>
              <Drawer.Title>Settings</Drawer.Title>
              <Drawer.Description>Opened after the press animation.</Drawer.Description>
            </Drawer.HeadingBlock>
            <Drawer.Close />
          </Drawer.Header>
          <Drawer.Body>
            <p className="text-base text-muted">Drawer content.</p>
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
          </Drawer.Footer>
        </Drawer.Panel>
      </Drawer>
    );
  },
};

function DrawerUncontrolledClose() {
  const { onOpenChange } = useDrawer();
  return (
    <Button variant="ghost" onClick={() => onOpenChange(false)}>
      Close
    </Button>
  );
}

export const Uncontrolled: Story = {
  name: "Uncontrolled (defaultOpen)",
  parameters: {
    docs: {
      description: {
        story:
          "Without `open` — internal state. Trigger opens; Close / Escape / backdrop dismiss.",
      },
    },
  },
  render: function UncontrolledDemo() {
    return (
      <Drawer>
        <Drawer.Trigger asChild>
          <Button>Open Drawer</Button>
        </Drawer.Trigger>
        <Drawer.Panel>
          <Drawer.Header>
            <Drawer.HeadingBlock>
              <Drawer.Title>Uncontrolled drawer</Drawer.Title>
              <Drawer.Description>No parent state — only Trigger / Close.</Drawer.Description>
            </Drawer.HeadingBlock>
            <Drawer.Close />
          </Drawer.Header>
          <Drawer.Body>
            <p className="text-base text-muted">
              Optional <code className="text-foreground">defaultOpen</code> sets the initial state.
            </p>
          </Drawer.Body>
          <Drawer.Footer>
            <DrawerUncontrolledClose />
          </Drawer.Footer>
        </Drawer.Panel>
      </Drawer>
    );
  },
};

// ─── Interaction test ─────────────────────────────────────────────────────────

export const OpenCloseInteraction: Story = {
  name: "Interaction: open",
  render: function DrawerInteractionDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer open={open} onOpenChange={setOpen}>
          <Drawer.Panel>
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>Settings</Drawer.Title>
                <Drawer.Description>Choose the required options.</Drawer.Description>
              </Drawer.HeadingBlock>
              <Drawer.Close />
            </Drawer.Header>
            <Drawer.Body>
              <p className="text-base text-muted">Arbitrary content inside the body.</p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </Drawer.Footer>
          </Drawer.Panel>
        </Drawer>
      </>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open Drawer" }));
    await expect(await screen.findByRole("dialog", { name: "Settings" })).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

// ─── All placements ───────────────────────────────────────────────────────────

const PLACEMENTS: DrawerPlacement[] = ["right", "left", "bottom", "top"];

const HANDLE_HINT: Record<DrawerPlacement, string> = {
  bottom: "Drag the handle down to close.",
  top: "Drag the handle up to close.",
  left: "Drag the handle left to close.",
  right: "Drag the handle right to close.",
};

function DrawerHandleDemoContent({ placement }: { placement: DrawerPlacement }) {
  const isHorizontal = placement === "left" || placement === "right";

  const main = (
    <>
      <Drawer.Header>
        <Drawer.HeadingBlock>
          <Drawer.Title>Handle · {placement}</Drawer.Title>
          <Drawer.Description>{HANDLE_HINT[placement]}</Drawer.Description>
        </Drawer.HeadingBlock>
        <Drawer.Close />
      </Drawer.Header>
      <Drawer.Body>
        <p className="text-base text-muted">{HANDLE_HINT[placement]}</p>
      </Drawer.Body>
    </>
  );

  if (isHorizontal) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 self-stretch">
        {placement === "right" ? <Drawer.Handle /> : null}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">{main}</div>
        {placement === "left" ? <Drawer.Handle /> : null}
      </div>
    );
  }

  if (placement === "top") {
    return (
      <>
        {main}
        <Drawer.Handle />
      </>
    );
  }

  return (
    <>
      <Drawer.Handle />
      {main}
    </>
  );
}

export const AllPlacements: Story = {
  name: "All placements",
  render: function AllPlacementsDemo() {
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState<DrawerPlacement>("right");

    const openWith = (p: DrawerPlacement) => {
      setPlacement(p);
      setOpen(true);
    };

    return (
      <div className="flex flex-wrap gap-base">
        {PLACEMENTS.map((p) => (
          <Button key={p} variant="outline" onClick={() => openWith(p)}>
            {p}
          </Button>
        ))}
        <Drawer open={open} onOpenChange={setOpen} placement={placement}>
          <Drawer.Panel>
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>placement="{placement}"</Drawer.Title>
              </Drawer.HeadingBlock>
              <Drawer.Close />
            </Drawer.Header>
            <Drawer.Body>
              <p className="text-base text-muted">The drawer slides in from «{placement}».</p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </Drawer.Footer>
          </Drawer.Panel>
        </Drawer>
      </div>
    );
  },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

const SIZES: DrawerExtent[] = ["default", "mid", "full"];

export const Sizes: Story = {
  name: "Sizes",
  render: function SizesDemo() {
    const [open, setOpen] = useState(false);
    const [extent, setExtent] = useState<DrawerExtent>("default");

    const openWith = (nextExtent: DrawerExtent) => {
      setExtent(nextExtent);
      setOpen(true);
    };

    return (
      <div className="flex flex-wrap gap-base">
        {SIZES.map((s) => (
          <Button key={s} variant="outline" onClick={() => openWith(s)}>
            {s}
          </Button>
        ))}
        <Drawer open={open} onOpenChange={setOpen} placement="right">
          <Drawer.Panel extent={extent}>
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>extent="{extent}"</Drawer.Title>
                <Drawer.Description>
                  {extent === "default" && "Default — up to 24rem."}
                  {extent === "mid" && "Half screen — 50vw."}
                  {extent === "full" && "Full screen."}
                </Drawer.Description>
              </Drawer.HeadingBlock>
              <Drawer.Close />
            </Drawer.Header>
            <Drawer.Body>
              <p className="text-base text-muted">Drawer content for size «{extent}».</p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </Drawer.Footer>
          </Drawer.Panel>
        </Drawer>
      </div>
    );
  },
};

// ─── Handle (all placements) ──────────────────────────────────────────────────

export const WithHandle: Story = {
  name: "Handle (all placements)",
  render: function WithHandleDemo() {
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState<DrawerPlacement>("bottom");

    const openWith = (p: DrawerPlacement) => {
      setPlacement(p);
      setOpen(true);
    };

    return (
      <div className="flex flex-wrap gap-base">
        {PLACEMENTS.map((p) => (
          <Button key={p} variant="outline" onClick={() => openWith(p)}>
            {p}
          </Button>
        ))}
        <Drawer open={open} onOpenChange={setOpen} placement={placement}>
          <Drawer.Panel>
            <DrawerHandleDemoContent placement={placement} />
          </Drawer.Panel>
        </Drawer>
      </div>
    );
  },
};

// ─── isDismissable=false ──────────────────────────────────────────────────────

export const NonDismissable: Story = {
  name: "isDismissable={false}",
  render: function NonDismissableDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open (backdrop does not dismiss)
        </Button>
        <Drawer open={open} onOpenChange={setOpen}>
          <Drawer.Panel>
            <Drawer.Backdrop isDismissable={false} />
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>Confirm action</Drawer.Title>
              </Drawer.HeadingBlock>
            </Drawer.Header>
            <Drawer.Body>
              <p className="text-base text-muted">
                Clicking the backdrop does not close. Use the button below.
              </p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Confirm</Button>
            </Drawer.Footer>
          </Drawer.Panel>
        </Drawer>
      </>
    );
  },
};

// ─── Scrollable body ──────────────────────────────────────────────────────────

export const ScrollableBody: Story = {
  name: "Scroll in Body",
  render: function ScrollableBodyDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>Long content</Button>
        <Drawer open={open} onOpenChange={setOpen} placement="right">
          <Drawer.Panel>
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>Long list</Drawer.Title>
                <Drawer.Description>Header and footer are fixed.</Drawer.Description>
              </Drawer.HeadingBlock>
              <Drawer.Close />
            </Drawer.Header>
            <Drawer.Body>
              {Array.from({ length: 18 }).map((_, i) => (
                <p key={i} className="mb-large text-sm leading-normal text-muted last:mb-0">
                  Row {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              ))}
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
            </Drawer.Footer>
          </Drawer.Panel>
        </Drawer>
      </>
    );
  },
};

// ─── With Form ────────────────────────────────────────────────────────────────

export const WithForm: Story = {
  name: "With form",
  render: function WithFormDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Form in Drawer</Button>
        <Drawer open={open} onOpenChange={setOpen} placement="right">
          <Drawer.Panel>
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>Edit profile</Drawer.Title>
                <Drawer.Description>Fill in the fields and save changes.</Drawer.Description>
              </Drawer.HeadingBlock>
              <Drawer.Close />
            </Drawer.Header>
            <Drawer.Body className="flex flex-col gap-large">
              <Input>
                <Input.Label>Name</Input.Label>
                <Input.Control name="name" placeholder="Ivan" />
              </Input>
              <Input>
                <Input.Label>Email</Input.Label>
                <Input.Control name="email" placeholder="you@example.com" />
              </Input>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </Drawer.Footer>
          </Drawer.Panel>
        </Drawer>
      </>
    );
  },
};

// ─── portalContainer (3.1) ────────────────────────────────────────────────────

export const PortalContainer: Story = {
  name: "portalContainer",
  parameters: {
    docs: {
      description: {
        story:
          "Custom `portalContainer` uses non-modal `dialog.show()` + `position: absolute`, so the drawer fills the host. Host must be `position: relative`.",
      },
    },
  },
  render: function PortalContainerDemo() {
    const [open, setOpen] = useState(false);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    return (
      <div className="flex w-full max-w-lg flex-col gap-large">
        <p className="text-sm text-muted">
          Drawer stays inside the dashed host (not <code className="text-foreground">document.body</code> / top layer).
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
            <Drawer open={open} onOpenChange={setOpen} portalContainer={container} placement="right">
              <Drawer.Panel extent="default">
                <Drawer.Header>
                  <Drawer.HeadingBlock>
                    <Drawer.Title>Inside host</Drawer.Title>
                    <Drawer.Description>Panel is a DOM child of the dashed container.</Drawer.Description>
                  </Drawer.HeadingBlock>
                  <Drawer.Close />
                </Drawer.Header>
                <Drawer.Body>
                  <p className="text-sm text-muted">Useful for nested shells and scroll regions.</p>
                </Drawer.Body>
                <Drawer.Footer>
                  <Button type="button" size="small" onClick={() => setOpen(false)}>
                    Close
                  </Button>
                </Drawer.Footer>
              </Drawer.Panel>
            </Drawer>
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
          "`Drawer.Trigger asChild` merges host `id`, `data-*`, `className`, and `ref` onto the child via `mergeAsChildProps`.",
      },
    },
  },
  render: function AsChildMergedPropsDemo() {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [refLabel, setRefLabel] = useState("ref: —");

    useLayoutEffect(() => {
      const node = triggerRef.current;
      setRefLabel(node ? `ref → #${node.id} (${node.tagName.toLowerCase()})` : "ref: —");
    }, []);

    return (
      <div className="flex flex-col items-center gap-large">
        <p className="text-sm text-muted">{refLabel}</p>
        <Drawer>
          <Drawer.Trigger
            asChild
            ref={triggerRef}
            id="story-drawer-trigger"
            data-testid="story-drawer-trigger"
            data-analytics="open-drawer"
            className="ring-2 ring-primary/30"
          >
            <Button type="button" variant="outline">
              Open (merged props)
            </Button>
          </Drawer.Trigger>
          <Drawer.Panel>
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>Merged trigger</Drawer.Title>
                <Drawer.Description>
                  Host props from Trigger land on the Button child.
                </Drawer.Description>
              </Drawer.HeadingBlock>
              <Drawer.Close />
            </Drawer.Header>
            <Drawer.Body>
              <p className="text-sm text-muted">Opened via asChild trigger with forwarded props.</p>
            </Drawer.Body>
          </Drawer.Panel>
        </Drawer>
      </div>
    );
  },
  play: async ({ canvas }) => {
    const btn = canvas.getByTestId("story-drawer-trigger");
    await expect(btn).toHaveAttribute("id", "story-drawer-trigger");
    await expect(btn).toHaveAttribute("data-analytics", "open-drawer");
    await expect(btn).toHaveAttribute("aria-haspopup", "dialog");
  },
};

// ─── Custom classNames ────────────────────────────────────────────────────────

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for Drawer",
      },
    },
  },
  render: function DrawerClassNamesStory() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="button" onClick={() => setOpen(true)}>
          Open Drawer
        </Button>
        <Drawer
          open={open}
          onOpenChange={setOpen}
          classNames={{
            trigger: "font-medium",
            panel: "border-primary/40 shadow-token-large",
            header: "border-b border-primary/20 pb-small",
            title: "text-primary font-semibold",
            description: "text-foreground/75",
            footer: "border-t border-primary/20 pt-small",
          }}
        >
          <Drawer.Panel>
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>Settings</Drawer.Title>
                <Drawer.Description>All slots configured via classNames.</Drawer.Description>
              </Drawer.HeadingBlock>
              <Drawer.Close />
            </Drawer.Header>
            <Drawer.Body>
              <p className="text-small text-muted">Slide-out panel content.</p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button type="button" size="small" onClick={() => setOpen(false)}>
                Close
              </Button>
            </Drawer.Footer>
          </Drawer.Panel>
        </Drawer>
      </>
    );
  },
};
