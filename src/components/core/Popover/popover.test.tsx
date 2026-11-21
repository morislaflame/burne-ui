import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";
import { Select } from "@/components/core/Select";

import { Popover } from ".";

describe("Popover Phase 2C", () => {
  it("publishes data-state on Trigger, tabIndex=-1 & fixed top-0 start-0 on Content, and focuses Content without buttons", async () => {
    const { user } = render(
      <Popover>
        <Popover.Trigger>Info</Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Plain text popover</Popover.Title>
          <Popover.Body>Read-only note</Popover.Body>
        </Popover.Content>
      </Popover>,
    );

    const trigger = screen.getByRole("button", { name: "Info" });
    expect(trigger).toHaveAttribute("data-state", "closed");

    trigger.focus();
    await user.keyboard("{Enter}");

    const dialog = await screen.findByRole("dialog", { name: "Plain text popover" });
    expect(trigger).toHaveAttribute("data-state", "open");
    expect(dialog).toHaveAttribute("tabindex", "-1");
    expect(dialog.className).toContain("fixed");
    expect(dialog.className).toContain("top-0");
    expect(dialog.className).toContain("start-0");
    expect(dialog).toHaveFocus();
  });

  it("does not steal focus back to Trigger when closing via pointerdown on another focusable control", async () => {
    const { user } = render(
      <div>
        <Popover>
          <Popover.Trigger>Open Popover</Popover.Trigger>
          <Popover.Content>
            <Popover.Title>Menu</Popover.Title>
          </Popover.Content>
        </Popover>
        <input aria-label="Search input" />
      </div>,
    );

    const trigger = screen.getByRole("button", { name: "Open Popover" });
    const externalInput = screen.getByRole("textbox", { name: "Search input" });

    await user.click(trigger);
    expect(await screen.findByRole("dialog", { name: "Menu" })).toBeInTheDocument();

    // Clicking external <input> closes Popover and leaves focus on externalInput
    await user.click(externalInput);
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument();
    });
    expect(externalInput).toHaveFocus();
  });

  it("keeps outer Popover open when selecting an option inside a nested Select", async () => {
    const { user } = render(
      <Popover defaultOpen>
        <Popover.Trigger>Filter</Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Filter options</Popover.Title>
          <Select
            label="Status"
            items={[
              { value: "open", label: "Open" },
              { value: "closed", label: "Closed" },
            ]}
          />
        </Popover.Content>
      </Popover>,
    );

    expect(await screen.findByRole("dialog", { name: "Filter options" })).toBeInTheDocument();

    const combo = screen.getByRole("combobox", { name: "Status" });
    combo.focus();
    await user.keyboard("{ArrowDown}");
    const option = await screen.findByRole("option", { name: "Closed" });

    await user.click(option);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(combo).toHaveTextContent("Closed");
    expect(screen.getByRole("dialog", { name: "Filter options" })).toBeInTheDocument();
  });
});
