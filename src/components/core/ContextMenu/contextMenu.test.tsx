import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";

import { ContextMenu } from ".";

function Menu() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger>Surface</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Copy</ContextMenu.Item>
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger>Share</ContextMenu.SubTrigger>
          <ContextMenu.SubContent>
            <ContextMenu.Item>Mail</ContextMenu.Item>
          </ContextMenu.SubContent>
        </ContextMenu.Sub>
      </ContextMenu.Content>
    </ContextMenu>
  );
}

describe("ContextMenu", () => {
  it("opens at the pointer and closes on an action", async () => {
    const { user } = render(<Menu />);
    const trigger = screen.getByText("Surface");
    expect(trigger).toHaveAttribute("data-state", "closed");

    await user.click(trigger);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    expect(fireEvent.contextMenu(trigger, { clientX: 24, clientY: 40 })).toBe(false);
    const menu = await screen.findByRole("menu");
    expect(menu).toBeInTheDocument();
    expect(trigger).toHaveAttribute("data-state", "open");

    await user.click(screen.getByRole("menuitem", { name: "Copy" }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens a controlled menu beside the trigger", async () => {
    render(
      <ContextMenu open>
        <ContextMenu.Trigger>Surface</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>,
    );
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Copy" })).toBeInTheDocument();
  });

  it("opens from the keyboard at the trigger box", async () => {
    const { user } = render(<Menu />);
    const trigger = screen.getByText("Surface");
    trigger.focus();
    await user.keyboard("{Shift>}{F10}{/Shift}");
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Share" })).toBeInTheDocument();
  });
});
