import type { ComponentType } from "react";
import { useCallback, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";

import { Form, type FormValues } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import { Dialog, type DialogSize } from ".";
import { useDialog } from "./dialogContext";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-theme="light"
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Dialog",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Modal dialog (portal to `document.body`). Panel: shared `p-large` and `gap-mid` between `Header` / `Body` / `Footer`; scroll lives in `Body`. Sizes `small`–`large`. `variant=\"gloss\"` — glass panel. In `Dialog.Footer`, direct `Button` children without `size` inherit the modal button size.\n\n`Dialog.Trigger` — built-in trigger that opens the dialog after the press animation.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "base", "mid", "large"],
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: function DialogDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="button" onClick={() => setOpen(true)}>
          Open dialog
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Panel>
            <Dialog.Header>
              <Dialog.HeadingBlock>
                <Dialog.Title>Export settings</Dialog.Title>
                <Dialog.Description>
                  Choose format and directory. Changes will not apply until you
                  save the project.
                </Dialog.Description>
              </Dialog.HeadingBlock>
              <Dialog.Close />
            </Dialog.Header>
            <Dialog.Body>
              <p className="text-sm leading-relaxed text-muted">
                Arbitrary content: form fields, lists, preview. Here only
                an illustration of scroll with a large amount of text.
              </p>
              <p className="mt-plus text-sm leading-relaxed text-muted">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </Dialog.Body>
            <Dialog.Footer>
              <Button type="button" size="base" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="button" size="base" variant="primary" onClick={() => setOpen(false)}>
                Save
              </Button>
            </Dialog.Footer>
          </Dialog.Panel>
        </Dialog>
      </>
    );
  },
};

// ─── With built-in Trigger ────────────────────────────────────────────────────

export const WithTrigger: Story = {
  name: "With Dialog.Trigger",
  parameters: {
    docs: {
      description: {
        story:
          "`Dialog.Trigger asChild` — the trigger opens the dialog after the button press animation completes. `e.preventDefault()` suppresses the `Button`'s own animation; Trigger controls it.",
      },
    },
  },
  render: function WithTriggerDemo() {
    const [open, setOpen] = useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button type="button">Open dialog</Button>
        </Dialog.Trigger>
        <Dialog.Panel>
          <Dialog.Header>
            <Dialog.HeadingBlock>
              <Dialog.Title>Settings</Dialog.Title>
              <Dialog.Description>
                Dialog opened after the button press animation.
              </Dialog.Description>
            </Dialog.HeadingBlock>
            <Dialog.Close />
          </Dialog.Header>
          <Dialog.Body>
            <p className="text-sm text-muted">Dialog content.</p>
          </Dialog.Body>
          <Dialog.Footer>
            <Button type="button" size="base" variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button type="button" size="base" variant="primary" onClick={() => setOpen(false)}>
              Done
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    );
  },
};

// ─── Uncontrolled (defaultOpen) ───────────────────────────────────────────────

function DialogUncontrolledDone() {
  const { onOpenChange } = useDialog();
  return (
    <Button type="button" size="base" variant="primary" onClick={() => onOpenChange(false)}>
      Done
    </Button>
  );
}

export const Uncontrolled: Story = {
  name: "Uncontrolled (defaultOpen)",
  parameters: {
    docs: {
      description: {
        story:
          "Without `open` — internal state via `defaultOpen` (here `false`). Trigger and Close/Done drive open/close through context.",
      },
    },
  },
  render: function UncontrolledDemo() {
    return (
      <Dialog>
        <Dialog.Trigger asChild>
          <Button type="button">Open dialog</Button>
        </Dialog.Trigger>
        <Dialog.Panel>
          <Dialog.Header>
            <Dialog.HeadingBlock>
              <Dialog.Title>Uncontrolled dialog</Dialog.Title>
              <Dialog.Description>
                No React state on the parent — only Trigger / Close.
              </Dialog.Description>
            </Dialog.HeadingBlock>
            <Dialog.Close />
          </Dialog.Header>
          <Dialog.Body>
            <p className="text-sm text-muted">
              Use <code className="text-foreground">defaultOpen</code> for the initial state.
            </p>
          </Dialog.Body>
          <Dialog.Footer>
            <DialogUncontrolledDone />
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    );
  },
};

// ─── Interaction test ─────────────────────────────────────────────────────────

export const OpenCloseInteraction: Story = {
  name: "Interaction: open",
  render: function DialogInteractionDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="button" onClick={() => setOpen(true)}>
          Open dialog
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Panel>
            <Dialog.Header>
              <Dialog.HeadingBlock>
                <Dialog.Title>Export settings</Dialog.Title>
                <Dialog.Description>
                  Choose format and directory.
                </Dialog.Description>
              </Dialog.HeadingBlock>
              <Dialog.Close />
            </Dialog.Header>
            <Dialog.Body>
              <p className="text-sm text-muted">Dialog content.</p>
            </Dialog.Body>
            <Dialog.Footer>
              <Button type="button" size="base" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="button" size="base" variant="primary" onClick={() => setOpen(false)}>
                Save
              </Button>
            </Dialog.Footer>
          </Dialog.Panel>
        </Dialog>
      </>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));
    await expect(
      await screen.findByRole("dialog", { name: "Export settings" }),
    ).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

// ─── With form ────────────────────────────────────────────────────────────────

export const WithForm: Story = {
  name: "With form",
  render: function DialogWithFormDemo() {
    const [open, setOpen] = useState(false);
    const onSubmit = useCallback((values: FormValues) => {
      void values;
      setOpen(false);
    }, []);

    return (
      <>
        <Button type="button" onClick={() => setOpen(true)}>
          Open form in dialog
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Panel>
            <Dialog.Header>
              <Dialog.HeadingBlock>
                <Dialog.Title>Quick edit</Dialog.Title>
                <Dialog.Description>
                  Data is submitted in the demo only — the page does not reload.
                </Dialog.Description>
              </Dialog.HeadingBlock>
              <Dialog.Close />
            </Dialog.Header>
            <Form
              onSubmit={onSubmit}
              aria-label="Form in dialog"
              className="min-w-0"
            >
              <Dialog.Body>
                <Form.Section>
                  <Input>
                    <Input.Label>Name</Input.Label>
                    <Input.Control name="name" placeholder="Ivan" autoComplete="name" />
                  </Input>
                  <Input>
                    <Input.Label>Email</Input.Label>
                    <Input.Control
                      name="email"
                      inputType="text"
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </Input>
                </Form.Section>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  type="button"
                  size="base"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="base" variant="primary">
                  Save
                </Button>
              </Dialog.Footer>
            </Form>
          </Dialog.Panel>
        </Dialog>
      </>
    );
  },
};

// ─── Scrollable content ───────────────────────────────────────────────────────

export const ScrollableContent: Story = {
  name: "With scrollable content",
  render: function ScrollableContentDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="button" size="base" variant="outline" onClick={() => setOpen(true)}>
          Long content
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Panel>
            <Dialog.Header>
              <Dialog.HeadingBlock>
                <Dialog.Title>Scrollable content</Dialog.Title>
                <Dialog.Description>
                  Header and description stay in place; scroll only in the area below.
                </Dialog.Description>
              </Dialog.HeadingBlock>
              <Dialog.Close />
            </Dialog.Header>
            <Dialog.Body>
              {Array.from({ length: 10 }).map((_, index) => (
                <p key={index} className="mb-mid text-sm leading-normal text-muted last:mb-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                  nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                  fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                  culpa qui officia deserunt mollit anim id est laborum.
                </p>
              ))}
            </Dialog.Body>
            <Dialog.Footer>
              <Button type="button" size="base" variant="ghost" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button type="button" size="base" variant="primary" onClick={() => setOpen(false)}>
                Done
              </Button>
            </Dialog.Footer>
          </Dialog.Panel>
        </Dialog>
      </>
    );
  },
};

export const OnLightTheme: Story = {
  name: "Light theme",
  decorators: [...lightThemeDecorator],
  render: Default.render,
};

// ─── Gloss variant ───────────────────────────────────────────────────────────

const dottedGridStyle = {
  backgroundImage: "radial-gradient(rgb(128 128 128 / 0.22) 1px, transparent 1px)",
  backgroundSize: "30px 30px",
  backgroundPosition: "2px 2px",
} as const;

function glossDottedDecorator(light = false) {
  return (Story: ComponentType) => (
    <div
      data-theme={light ? "light" : undefined}
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)", ...dottedGridStyle }}
    >
      <div className="mx-auto max-w-xl">
        <Story />
      </div>
    </div>
  );
}

function GlossDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button type="button" variant="gloss">Open gloss dialog</Button>
      </Dialog.Trigger>
      <Dialog.Panel variant="gloss">
        <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>Glass dialog</Dialog.Title>
            <Dialog.Description>
              variant=&quot;gloss&quot; — modal panel with conic border and highlight.
            </Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body className="flex flex-col gap-mid">
          <Input>
            <Input.Label>Name</Input.Label>
            <Input.Control variant="gloss" name="name" placeholder="Ivan" autoComplete="name" />
          </Input>
          <Input>
            <Input.Label>Email</Input.Label>
            <Input.Control
              variant="gloss"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Input>
        </Dialog.Body>
        <Dialog.Footer>
          <Button type="button" size="base" variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" size="base" variant="gloss" onClick={() => setOpen(false)}>
            Save
          </Button>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
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

function DialogTemplate({
  size = "base",
  label = "Open dialog",
}: {
  size?: DialogSize;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Dialog open={open} onOpenChange={setOpen} size={size}>
        <Dialog.Panel>
          <Dialog.Header>
            <Dialog.HeadingBlock>
              <Dialog.Title>Export settings</Dialog.Title>
              <Dialog.Description>
                Choose format and directory. Changes will not apply until you
                save the project.
              </Dialog.Description>
            </Dialog.HeadingBlock>
            <Dialog.Close />
          </Dialog.Header>
          <Dialog.Body>
            <p className="text-sm text-muted">Dialog content to demonstrate size.</p>
          </Dialog.Body>
          <Dialog.Footer>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="primary" onClick={() => setOpen(false)}>
              Save
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

export const Sizes: Story = {
  name: "Sizes small · base · mid · large",
  render: function SizesDemo() {
    return (
      <div className="flex max-w-2xl flex-col flex-wrap gap-xlarge sm:flex-row sm:items-start">
        {(["small", "base", "mid", "large"] as const).map((size) => (
          <div key={size} className="flex flex-col items-start gap-base">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              {size}
            </span>
            <DialogTemplate size={size} label={`Open (${size})`} />
          </div>
        ))}
      </div>
    );
  },
};

// ─── Custom classNames ────────────────────────────────────────────────────────

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for Dialog",
      },
    },
  },
  render: function DialogClassNamesStory() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="button" onClick={() => setOpen(true)}>
          Open dialog
        </Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          classNames={{
            panel: "border-primary/40 bg-primary/5 shadow-token-large",
            title: "text-primary font-semibold",
            description: "text-foreground/80",
            footer: "border-t border-primary/20 pt-small",
          }}
        >
          <Dialog.Panel>
            <Dialog.Header>
              <Dialog.HeadingBlock>
                <Dialog.Title>Settings</Dialog.Title>
                <Dialog.Description>All slots configured via classNames.</Dialog.Description>
              </Dialog.HeadingBlock>
              <Dialog.Close />
            </Dialog.Header>
            <Dialog.Body>
              <p className="text-sm text-muted">Modal content.</p>
            </Dialog.Body>
            <Dialog.Footer>
              <Button type="button" size="small" onClick={() => setOpen(false)}>
                Close
              </Button>
            </Dialog.Footer>
          </Dialog.Panel>
        </Dialog>
      </>
    );
  },
};
