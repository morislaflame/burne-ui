import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";
import { ContextMenu } from "@/components/core/ContextMenu";
import { Dropdown } from "@/components/core/Dropdown";
import { Popover } from "@/components/core/Popover";
import { Select } from "@/components/core/Select";
import { Tooltip } from "@/components/core/Tooltip";

import { Dialog } from ".";

describe("Dialog Phase 2C: Top-Layer portals & LIFO Escape", () => {
  it("publishes data-state, overflow-hidden on dialog, touch-none on overlay, and cascades variant from Root to Panel", async () => {
    render(
      <Dialog defaultOpen variant="outline">
        <Dialog.Panel>
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Panel>
      </Dialog>,
    );

    const dialog = await screen.findByRole("dialog", { name: "Settings" });
    expect(dialog).toHaveAttribute("data-state", "open");
    expect(dialog.className).toContain("overflow-hidden");

    const overlay = dialog.querySelector("[aria-hidden]") as HTMLElement;
    expect(overlay.className).toContain("touch-none");

    const panel = dialog.querySelector("[data-variant]") as HTMLElement;
    expect(panel).toHaveAttribute("data-variant", "outline");
  });

  it("mounts Popover, Dropdown, Dropdown.Sub, Tooltip, ContextMenu, and Select portals inside the open Top-Layer <dialog>", async () => {
    const { user } = render(
      <Dialog defaultOpen>
        <Dialog.Panel>
          <Dialog.Title>Workspace</Dialog.Title>
          <Dialog.Body>
            <Popover open>
              <Popover.Trigger>PopBtn</Popover.Trigger>
              <Popover.Content>
                <Popover.Title>InnerPopover</Popover.Title>
              </Popover.Content>
            </Popover>

            <Dropdown open>
              <Dropdown.Trigger>DropBtn</Dropdown.Trigger>
              <Dropdown.Popover>
                <Dropdown.Item>First</Dropdown.Item>
                <Dropdown.Sub>
                  <Dropdown.SubTrigger>More</Dropdown.SubTrigger>
                  <Dropdown.SubPopover>
                    <Dropdown.Item>SubAction</Dropdown.Item>
                  </Dropdown.SubPopover>
                </Dropdown.Sub>
              </Dropdown.Popover>
            </Dropdown>

            <Tooltip open openDelay={0}>
              <Tooltip.Trigger>TipBtn</Tooltip.Trigger>
              <Tooltip.Content>InnerTip</Tooltip.Content>
            </Tooltip>

            <ContextMenu open>
              <ContextMenu.Trigger>CtxArea</ContextMenu.Trigger>
              <ContextMenu.Popover>
                <ContextMenu.Item>CtxAction</ContextMenu.Item>
              </ContextMenu.Popover>
            </ContextMenu>

            <Select
              open
              label="Role"
              items={[{ value: "admin", label: "Admin" }]}
            />
          </Dialog.Body>
        </Dialog.Panel>
      </Dialog>,
    );

    const dialog = await screen.findByRole("dialog", { name: "Workspace" });
    const innerPop = await screen.findByRole("dialog", { name: "InnerPopover" });
    const tip = await screen.findByRole("tooltip");
    const listbox = await screen.findByRole("listbox");
    const dropItem = await screen.findByRole("menuitem", { name: "First" });
    const ctxItem = await screen.findByRole("menuitem", { name: "CtxAction" });

    await user.click(screen.getByRole("menuitem", { name: "More" }));
    const subItem = await screen.findByRole("menuitem", { name: "SubAction" });

    expect(dialog.contains(innerPop)).toBe(true);
    expect(dialog.contains(tip)).toBe(true);
    expect(dialog.contains(listbox)).toBe(true);
    expect(dialog.contains(dropItem)).toBe(true);
    expect(dialog.contains(ctxItem)).toBe(true);
    expect(dialog.contains(subItem)).toBe(true);
  });

  it("closes nested floating overlays one by one in LIFO order on Escape without closing Dialog", async () => {
    const { user } = render(
      <Dialog defaultOpen>
        <Dialog.Panel>
          <Dialog.Title>Editor</Dialog.Title>
          <Dialog.Body>
            <Popover>
              <Popover.Trigger>Open Popover</Popover.Trigger>
              <Popover.Content>
                <Popover.Title>Filter</Popover.Title>
                <Dropdown>
                  <Dropdown.Trigger>Open Menu</Dropdown.Trigger>
                  <Dropdown.Popover>
                    <Dropdown.Item>Sort A-Z</Dropdown.Item>
                  </Dropdown.Popover>
                </Dropdown>
              </Popover.Content>
            </Popover>
          </Dialog.Body>
        </Dialog.Panel>
      </Dialog>,
    );

    expect(await screen.findByRole("dialog", { name: "Editor" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open Popover" }));
    expect(await screen.findByRole("dialog", { name: "Filter" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open Menu" }));
    expect(await screen.findByRole("menuitem", { name: "Sort A-Z" })).toBeInTheDocument();

    // 1st Escape: closes Dropdown only
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("menuitem", { name: "Sort A-Z" })).not.toBeInTheDocument();
    });
    expect(screen.getByRole("dialog", { name: "Filter" })).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Editor" })).toBeInTheDocument();

    // 2nd Escape: closes Popover only
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Filter" })).not.toBeInTheDocument();
    });
    expect(screen.getByRole("dialog", { name: "Editor" })).toBeInTheDocument();

    // 3rd Escape: closes Dialog
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Editor" })).not.toBeInTheDocument();
    });
  });
});
