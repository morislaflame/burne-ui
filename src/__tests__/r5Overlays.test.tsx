import { fireEvent, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { AlertDialog } from "@/components/composite/AlertDialog";
import { Dialog } from "@/components/core/Dialog";
import { Drawer } from "@/components/core/Drawer";
import { Dropdown } from "@/components/core/Dropdown";
import { Popover } from "@/components/core/Popover";
import { Toast } from "@/components/core/Toast";
import { useToast } from "@/components/core/Toast/useToast";
import { Tooltip } from "@/components/core/Tooltip";

import { installFocusSpy, openedWithVisibleFocus } from "./focusSpy";
import { render } from "./helpers";

describe("R5.1 Dialog", () => {
  it("opens and closes, restores focus, and paints focus-visible from the keyboard", async () => {
    const spy = installFocusSpy();
    const { user } = render(
      <Dialog>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Panel>
          <Dialog.Title>Account</Dialog.Title>
          <Dialog.Close aria-label="Dismiss" />
        </Dialog.Panel>
      </Dialog>,
    );
    const trigger = screen.getByRole("button", { name: "Open dialog" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("dialog", { name: "Account" })).toBeInTheDocument();
    expect(openedWithVisibleFocus(spy)).toBe(true);

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
    spy.mockRestore();
  });

  it("closes on the backdrop and reports controlled open changes", async () => {
    const onOpenChange = vi.fn();
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        >
          <Dialog.Trigger>Open dialog</Dialog.Trigger>
          <Dialog.Panel>
            <Dialog.Title>Account</Dialog.Title>
          </Dialog.Panel>
        </Dialog>
      );
    }
    const { user } = render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    const dialog = await screen.findByRole("dialog");
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    const overlay = dialog.querySelector("[aria-hidden]") as HTMLElement;
    await user.click(overlay);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});

describe("R5.1 Drawer", () => {
  it("opens from the keyboard with a visible focus and restores the trigger", async () => {
    const spy = installFocusSpy();
    const { user } = render(
      <Drawer>
        <Drawer.Trigger>Open drawer</Drawer.Trigger>
        <Drawer.Panel>
          <Drawer.Title>Menu</Drawer.Title>
          <Drawer.Close aria-label="Close drawer" />
        </Drawer.Panel>
      </Drawer>,
    );
    const trigger = screen.getByRole("button", { name: "Open drawer" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("dialog", { name: "Menu" })).toBeInTheDocument();
    expect(openedWithVisibleFocus(spy)).toBe(true);
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
    spy.mockRestore();
  });

  it("closes on the backdrop when uncontrolled and when controlled", async () => {
    const onOpenChange = vi.fn();
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <Drawer
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        >
          <Drawer.Trigger>Open drawer</Drawer.Trigger>
          <Drawer.Panel>
            <Drawer.Title>Menu</Drawer.Title>
          </Drawer.Panel>
        </Drawer>
      );
    }
    const { user } = render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    const dialog = await screen.findByRole("dialog");
    await user.click(dialog.querySelector("[aria-hidden]") as HTMLElement);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});

describe("R5.1 AlertDialog", () => {
  it("opens from the keyboard, closes on Escape, and restores the trigger", async () => {
    const spy = installFocusSpy();
    const { user } = render(
      <AlertDialog>
        <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
        <AlertDialog.Panel>
          <AlertDialog.Title>Delete item?</AlertDialog.Title>
          <AlertDialog.Close aria-label="Cancel" />
        </AlertDialog.Panel>
      </AlertDialog>,
    );
    const trigger = screen.getByRole("button", { name: "Delete" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
    expect(openedWithVisibleFocus(spy)).toBe(true);
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
    spy.mockRestore();
  });

  it("keeps the dialog on a backdrop click and closes from Cancel", async () => {
    const onOpenChange = vi.fn();
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <AlertDialog
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        >
          <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
          <AlertDialog.Panel>
            <AlertDialog.Title>Delete item?</AlertDialog.Title>
            <AlertDialog.Close aria-label="Cancel" />
          </AlertDialog.Panel>
        </AlertDialog>
      );
    }
    const { user } = render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Delete" }));
    const dialog = await screen.findByRole("alertdialog");
    await user.click(dialog.querySelector("[aria-hidden]") as HTMLElement);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});

describe("R5.1 Popover", () => {
  function panel() {
    return (
      <Popover>
        <Popover.Trigger>Open popover</Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Details</Popover.Title>
          <button type="button">Inside</button>
        </Popover.Content>
      </Popover>
    );
  }

  it("opens, closes on Escape and outside pointer, and restores the trigger", async () => {
    const { user } = render(panel());
    const trigger = screen.getByRole("button", { name: "Open popover" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("dialog", { name: "Details" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("dialog", { name: "Details" })).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("opens from the keyboard with a visible focus and reports controlled changes", async () => {
    const spy = installFocusSpy();
    const onOpenChange = vi.fn();
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <Popover
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        >
          <Popover.Trigger>Open popover</Popover.Trigger>
          <Popover.Content>
            <Popover.Title>Details</Popover.Title>
            <button type="button">Inside</button>
          </Popover.Content>
        </Popover>
      );
    }
    const { user } = render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Open popover" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("dialog", { name: "Details" })).toBeInTheDocument();
    expect(openedWithVisibleFocus(spy)).toBe(true);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    spy.mockRestore();
  });
});

describe("R5.1 Dropdown", () => {
  function menu() {
    return (
      <Dropdown>
        <Dropdown.Trigger>Menu</Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Item>Copy</Dropdown.Item>
          <Dropdown.Item>Paste</Dropdown.Item>
        </Dropdown.Popover>
      </Dropdown>
    );
  }

  it("opens, closes on Escape and outside pointer, and restores the trigger", async () => {
    const { user } = render(menu());
    const trigger = screen.getByRole("button", { name: "Menu" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("menuitem", { name: "Copy" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("menuitem")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("menuitem", { name: "Copy" })).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    await waitFor(() => {
      expect(screen.queryByRole("menuitem")).not.toBeInTheDocument();
    });
  });

  it("opens from the keyboard with a visible focus and follows controlled open", async () => {
    const spy = installFocusSpy();
    const onOpenChange = vi.fn();
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <Dropdown
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        >
          <Dropdown.Trigger>Menu</Dropdown.Trigger>
          <Dropdown.Popover>
            <Dropdown.Item>Copy</Dropdown.Item>
          </Dropdown.Popover>
        </Dropdown>
      );
    }
    const { user } = render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Menu" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("menuitem", { name: "Copy" })).toBeInTheDocument();
    expect(openedWithVisibleFocus(spy)).toBe(true);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    spy.mockRestore();
  });
});

describe("R5.1 Tooltip", () => {
  it("opens from keyboard focus, closes on Escape, and closes when the pointer leaves", async () => {
    const { user } = render(
      <Tooltip openDelay={0}>
        <Tooltip.Trigger>Hint</Tooltip.Trigger>
        <Tooltip.Content>More info</Tooltip.Content>
      </Tooltip>,
    );
    const trigger = screen.getByText("Hint");
    trigger.focus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("More info");
    expect(document.activeElement).toBe(trigger);
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    fireEvent.pointerEnter(trigger);
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
    fireEvent.pointerLeave(trigger);
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  it("reports controlled open changes", async () => {
    const onOpenChange = vi.fn();
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <Tooltip
          openDelay={0}
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        >
          <Tooltip.Trigger>Hint</Tooltip.Trigger>
          <Tooltip.Content>More info</Tooltip.Content>
        </Tooltip>
      );
    }
    render(<Harness />);
    fireEvent.focus(screen.getByText("Hint"));
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

describe("R5.1 Toast", () => {
  it("dismisses from the close button and stays after an outside click", async () => {
    function Harness() {
      const [show, setShow] = useState(true);
      if (!show) return <p>gone</p>;
      return <Toast title="Saved" description="Draft stored" onClose={() => setShow(false)} />;
    }
    const { user } = render(<Harness />);
    expect(screen.getByText("Saved")).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    expect(screen.getByText("Saved")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.getByText("gone")).toBeInTheDocument();
  });

  it("shows and dismisses a toast from the provider", async () => {
    function Probe() {
      const { toast } = useToast();
      return (
        <button
          type="button"
          onClick={() => {
            const id = toast.show({ title: "Queued" });
            toast.dismiss(id);
          }}
        >
          Ping
        </button>
      );
    }
    const { user } = render(
      <Toast.Provider>
        <Probe />
      </Toast.Provider>,
    );
    await user.click(screen.getByRole("button", { name: "Ping" }));
    await waitFor(() => {
      expect(screen.getAllByText("Queued").some((node) => !node.className.includes("sr-only"))).toBe(false);
    });
  });
});
