import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AlertDialog } from "@/components/composite/AlertDialog";
import { Dialog } from "@/components/core/Dialog";
import { Drawer } from "@/components/core/Drawer";
import { getBodyScrollLockCountForTests } from "@/components/core/utils/bodyScrollLock";

import { render } from "./helpers";

describe("Э0.1 overlays", () => {
  it("Dialog: Trigger opens a native modal dialog; Close restores focus; Escape dismisses", async () => {
    const { user } = render(
      <Dialog>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Panel>
          <Dialog.Title>Account</Dialog.Title>
          <Dialog.Close aria-label="Dismiss" />
        </Dialog.Panel>
      </Dialog>);

    const trigger = screen.getByRole("button", { name: "Open dialog" });
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(dialog.tagName).toBe("DIALOG");
    expect((dialog as HTMLDialogElement).open).toBe(true);

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("Dialog: dismissOnBackdrop=false keeps the dialog open on overlay pointerdown", async () => {
    const { user } = render(
      <Dialog>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Panel dismissOnBackdrop={false}>
          <Dialog.Title>Locked</Dialog.Title>
        </Dialog.Panel>
      </Dialog>);

    await user.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog");
    const overlay = dialog.querySelector("[aria-hidden]") as HTMLElement;
    expect(overlay).toBeTruthy();
    await user.click(overlay);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("Drawer opens with showModal and closes on Escape", async () => {
    const { user } = render(
      <Drawer>
        <Drawer.Trigger>Open drawer</Drawer.Trigger>
        <Drawer.Panel>
          <Drawer.Title>Menu</Drawer.Title>
          <Drawer.Close aria-label="Close drawer" />
        </Drawer.Panel>
      </Drawer>);

    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("AlertDialog opens as a modal alertdialog", async () => {
    const { user } = render(
      <AlertDialog>
        <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
        <AlertDialog.Panel>
          <AlertDialog.Title>Delete item?</AlertDialog.Title>
          <AlertDialog.Close aria-label="Cancel" />
        </AlertDialog.Panel>
      </AlertDialog>);

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
  });

  it("nested Dialog + AlertDialog keep body scroll locked until the last overlay closes", async () => {
    const { user } = render(
      <Dialog defaultOpen>
        <Dialog.Panel>
          <Dialog.Title>Outer</Dialog.Title>
          <AlertDialog>
            <AlertDialog.Trigger>Confirm</AlertDialog.Trigger>
            <AlertDialog.Panel>
              <AlertDialog.Title>Inner</AlertDialog.Title>
              <AlertDialog.Close aria-label="Back" />
            </AlertDialog.Panel>
          </AlertDialog>
        </Dialog.Panel>
      </Dialog>);

    await screen.findByRole("dialog", { name: "Outer" });
    expect(getBodyScrollLockCountForTests()).toBeGreaterThanOrEqual(1);

    await user.click(screen.getByRole("button", { name: "Confirm" }));
    await screen.findByRole("alertdialog", { name: "Inner" });
    const nestedCount = getBodyScrollLockCountForTests();
    expect(nestedCount).toBeGreaterThanOrEqual(2);

    await user.click(screen.getByRole("button", { name: "Back" }));
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog", { name: "Inner" })).not.toBeInTheDocument();
    });
    expect(getBodyScrollLockCountForTests()).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("dialog", { name: "Outer" })).toBeInTheDocument();
  });
});
