import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { IoChevronForward, IoSettingsOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { Dropdown } from "@/components/core/Dropdown";
import { Popover } from "@/components/core/Popover";
import { Select } from "@/components/core/Select";
import { Toast, useToast } from "@/components/core/Toast";
import { Tooltip } from "@/components/core/Tooltip";
import {
  burneZIndexScale,
  Z_INDEX_CSS_VAR,
  Z_INDEX_DEFAULTS,
  type ZIndexLayer,
} from "@/tokens/zIndex";

const LAYER_NOTE: Record<ZIndexLayer, string> = {
  dialog: "Dialog / Drawer / AlertDialog",
  dropdown: "Dropdown menu",
  "dropdown-sub": "Dropdown.SubContent",
  popover: "Popover / Select / ComboBox",
  toast: "Toast viewport",
  tooltip: "Tooltip",
};

const LAYER_SWATCH: Record<ZIndexLayer, string> = {
  dialog: "bg-info/40 border-info",
  dropdown: "bg-success/40 border-success",
  "dropdown-sub": "bg-success/55 border-success",
  popover: "bg-warning/40 border-warning",
  toast: "bg-danger/40 border-danger",
  tooltip: "bg-primary/35 border-primary",
};

/** Layers shown as overlapping cards (skip dropdown-sub — same band as dropdown +10). */
const VISUAL_LAYERS: ZIndexLayer[] = [
  "dialog",
  "dropdown",
  "popover",
  "toast",
  "tooltip",
];

const LAYER_Z_CLASS: Record<ZIndexLayer, string> = {
  dialog: "z-dialog",
  dropdown: "z-dropdown",
  "dropdown-sub": "z-dropdown-sub",
  popover: "z-popover",
  toast: "z-toast",
  tooltip: "z-tooltip",
};

function ZIndexScaleTable() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-base">
      <p className="text-small text-muted">
        Low → high within one stacking context. Default Dialog uses{" "}
        <code className="text-foreground">showModal()</code> (browser top layer) —
        body-portaled menus cannot stack above it via z-index.
      </p>
      <ul className="flex flex-col gap-small">
        {[...burneZIndexScale].reverse().map((layer) => (
          <li
            key={layer}
            className={`flex items-center justify-between gap-mid rounded-mid border-token px-base py-small ${LAYER_SWATCH[layer]}`}
          >
            <div className="min-w-0">
              <p className="font-w-mid text-foreground">
                {Z_INDEX_CSS_VAR[layer]}
                <span className="ml-small text-muted">· z-{layer}</span>
              </p>
              <p className="text-small text-muted">{LAYER_NOTE[layer]}</p>
            </div>
            <code className="shrink-0 text-xsmall text-foreground">
              {Z_INDEX_DEFAULTS[layer]}
            </code>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LayeredCardsDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-mid">
      <p className="text-small text-muted">
        Overlapping siblings in one parent — z-index utilities decide paint order.
      </p>
      <div className="relative h-72 w-full overflow-hidden rounded-mid border-token bg-surface">
        {VISUAL_LAYERS.map((layer, index) => (
          <div
            key={layer}
            className={`absolute flex w-[min(16rem,70%)] flex-col gap-xsmall rounded-mid border-2 p-base shadow-token-mid ${LAYER_SWATCH[layer]} ${LAYER_Z_CLASS[layer]}`}
            style={{
              top: `${1.25 + index * 2.25}rem`,
              left: `${1.25 + index * 1.75}rem`,
            }}
          >
            <span className="font-w-mid text-foreground">z-{layer}</span>
            <span className="text-xsmall text-muted">
              {Z_INDEX_CSS_VAR[layer]} = {Z_INDEX_DEFAULTS[layer]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Contained Dialog (`show()`, not top-layer `showModal()`). Menus portal to
 * `document.body` with higher `--z-*` — they stack above the dialog because both
 * participate in the root stacking context (unlike `showModal()` top layer).
 */
function ContainedOverlayStackDemo() {
  const { toast } = useToast();
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(true);

  return (
    <div className="flex w-full max-w-xl flex-col gap-mid">
      <p className="text-small text-muted">
        Dialog mounts into a custom host via{" "}
        <code className="text-foreground">portalContainer</code> → non-modal{" "}
        <code className="text-foreground">show()</code> (no browser top layer).
        Select / Dropdown / Popover stay on <code className="text-foreground">body</code>{" "}
        with higher z-index and paint above the dialog. Default{" "}
        <code className="text-foreground">showModal()</code> would trap everything under
        the top layer regardless of tokens.
      </p>

      <div className="flex flex-wrap gap-base">
        <Button type="button" variant="outline" onClick={() => setDialogOpen(true)}>
          Open dialog
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            toast.show({
              title: "Toast above dialog",
              description: "z-toast on document.body.",
              status: "info",
            })
          }
        >
          Show toast
        </Button>
      </div>

      <div
        ref={setHost}
        className="relative h-[28rem] overflow-hidden rounded-mid border-2 border-dashed border-primary/40 bg-surface/50"
      >
        <p className="absolute left-mid top-mid z-0 text-xsmall text-muted">
          Contained dialog host (show, not showModal)
        </p>

        {host ? (
          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            portalContainer={host}
            size="small"
          >
            <Dialog.Panel>
              <Dialog.Header>
                <Dialog.HeadingBlock>
                  <Dialog.Title>Contained stacking</Dialog.Title>
                  <Dialog.Description>
                    Open Select / Dropdown / Popover — body portals with z-popover /
                    z-dropdown sit above this z-dialog panel.
                  </Dialog.Description>
                </Dialog.HeadingBlock>
                <Dialog.Close />
              </Dialog.Header>
              <Dialog.Body>
                <div className="flex flex-col gap-mid">
                  <Select
                    label="Language"
                    placeholder="Choose…"
                    options={[
                      { value: "en", label: "English" },
                      { value: "ru", label: "Russian" },
                      { value: "de", label: "Deutsch" },
                    ]}
                  />

                  <div className="flex flex-wrap gap-base">
                    <Dropdown>
                      <Dropdown.Trigger asChild>
                        <Button type="button" variant="outline" size="small">
                          Dropdown
                        </Button>
                      </Dropdown.Trigger>
                      <Dropdown.Popover>
                        <Dropdown.Group>
                          <Dropdown.Item value="a" selection={false}>
                            <Dropdown.ItemLabel>Item A</Dropdown.ItemLabel>
                          </Dropdown.Item>
                          <Dropdown.Sub>
                            <Dropdown.SubTrigger>More</Dropdown.SubTrigger>
                            <Dropdown.SubContent>
                              <Dropdown.Item value="b" selection={false}>
                                <Dropdown.ItemLabel>Sub item</Dropdown.ItemLabel>
                                <Dropdown.ItemIcon>
                                  <IoChevronForward aria-hidden />
                                </Dropdown.ItemIcon>
                              </Dropdown.Item>
                            </Dropdown.SubContent>
                          </Dropdown.Sub>
                        </Dropdown.Group>
                      </Dropdown.Popover>
                    </Dropdown>

                    <Popover>
                      <Popover.Trigger asChild>
                        <Button
                          type="button"
                          variant="secondary"
                          size="small"
                          icon={<IoSettingsOutline aria-hidden />}
                        >
                          Popover
                        </Button>
                      </Popover.Trigger>
                      <Popover.Content>
                        <Popover.Body>
                          z-popover — above z-dialog (same root context).
                        </Popover.Body>
                      </Popover.Content>
                    </Popover>

                    <Tooltip delayShowMs={0}>
                      <Tooltip.Trigger asChild>
                        <Button type="button" variant="ghost" size="small">
                          Tip
                        </Button>
                      </Tooltip.Trigger>
                      <Tooltip.Content>z-tooltip on top.</Tooltip.Content>
                    </Tooltip>
                  </div>
                </div>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  type="button"
                  size="small"
                  variant="ghost"
                  onClick={() => setDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  size="small"
                  variant="primary"
                  onClick={() =>
                    toast.success("Saved", {
                      description: "z-toast above the contained dialog.",
                    })
                  }
                >
                  Toast
                </Button>
              </Dialog.Footer>
            </Dialog.Panel>
          </Dialog>
        ) : null}
      </div>
    </div>
  );
}

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

const toastDecorator = [
  (Story: ComponentType) => (
    <Toast.Provider>
      <div
        className="box-border flex min-h-[32rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <Story />
      </div>
    </Toast.Provider>
  ),
] as const;

const meta = {
  title: "Foundations/Z-Index",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Overlay stacking tokens (`--z-dialog` → `--z-tooltip`). z-index only orders siblings inside the same stacking context. Default Dialog `showModal()` uses the browser top layer — menus must share that context (e.g. contained `portalContainer` + `show()`) for the scale to apply.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  name: "Token scale",
  decorators: [...framedDecorator],
  render: () => <ZIndexScaleTable />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText("--z-tooltip")).toBeVisible();
    await expect(canvas.getByText("--z-dialog")).toBeVisible();
  },
};

export const LayeredCards: Story = {
  name: "Layered cards",
  decorators: [...framedDecorator],
  parameters: {
    docs: {
      description: {
        story:
          "Pure CSS demo: overlapping siblings with `z-dialog` … `z-tooltip` in one parent stacking context.",
      },
    },
  },
  render: () => <LayeredCardsDemo />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText("z-tooltip")).toBeVisible();
    await expect(canvas.getByText("z-dialog")).toBeVisible();
  },
};

export const ContainedOverlayStacking: Story = {
  name: "Contained overlay stacking",
  decorators: [...toastDecorator],
  parameters: {
    docs: {
      description: {
        story:
          "Dialog uses custom `portalContainer` → `show()` (not the browser top layer from `showModal()`). Menus / toast / tooltip portal to `document.body` with higher `--z-*` and therefore paint above the dialog. With default `showModal()`, z-index cannot escape the top layer.",
      },
    },
  },
  render: () => <ContainedOverlayStackDemo />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("dialog")).toBeVisible();
    await expect(canvas.getByText("Contained stacking")).toBeVisible();
  },
};
