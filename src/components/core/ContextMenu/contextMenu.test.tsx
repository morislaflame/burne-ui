import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";

import { ContextMenu } from ".";

function Menu() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger>Surface</ContextMenu.Trigger>
      <ContextMenu.Popover>
        <ContextMenu.Item>Copy</ContextMenu.Item>
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger>Share</ContextMenu.SubTrigger>
          <ContextMenu.SubPopover>
            <ContextMenu.Item>Mail</ContextMenu.Item>
          </ContextMenu.SubPopover>
        </ContextMenu.Sub>
      </ContextMenu.Popover>
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
        <ContextMenu.Popover>
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Popover>
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

  it("opens on 500ms touch long-press (iOS Safari) and suppresses the synthetic click on release", () => {
    vi.useFakeTimers();
    try {
      const onTriggerClick = vi.fn();
      render(
        <ContextMenu>
          <ContextMenu.Trigger asChild>
            <button type="button" onClick={onTriggerClick}>
              Hold me
            </button>
          </ContextMenu.Trigger>
          <ContextMenu.Popover>
            <ContextMenu.Item>Rename</ContextMenu.Item>
          </ContextMenu.Popover>
        </ContextMenu>,
      );

      const trigger = screen.getByRole("button", { name: "Hold me" });

      fireEvent.pointerDown(trigger, {
        pointerType: "touch",
        pointerId: 10,
        clientX: 80,
        clientY: 120,
      });

      act(() => {
        vi.advanceTimersByTime(499);
      });
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.getByRole("menu")).toBeInTheDocument();

      // Releasing finger synthesizes pointerup + click on trigger -> click must be suppressed!
      fireEvent.pointerUp(window, { pointerId: 10, clientX: 80, clientY: 120 });
      fireEvent.click(trigger);
      expect(onTriggerClick).not.toHaveBeenCalled();
      expect(screen.getByRole("menu")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("cancels touch long-press when finger moves > 10px or scrolls before 500ms", () => {
    vi.useFakeTimers();
    try {
      render(<Menu />);
      const trigger = screen.getByText("Surface");

      fireEvent.pointerDown(trigger, {
        pointerType: "touch",
        pointerId: 11,
        clientX: 50,
        clientY: 50,
      });
      fireEvent.pointerMove(window, {
        pointerId: 11,
        clientX: 65,
        clientY: 50,
      });
      act(() => {
        vi.advanceTimersByTime(600);
      });
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();

      fireEvent.pointerDown(trigger, {
        pointerType: "touch",
        pointerId: 12,
        clientX: 50,
        clientY: 50,
      });
      fireEvent.scroll(window);
      act(() => {
        vi.advanceTimersByTime(600);
      });
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("inherits nested data-theme island from ContextMenu.Trigger onto portaled Popover", async () => {
    render(
      <div data-theme="light">
        <ContextMenu open>
          <ContextMenu.Trigger>Island</ContextMenu.Trigger>
          <ContextMenu.Popover>
            <ContextMenu.Item>Inspect</ContextMenu.Item>
          </ContextMenu.Popover>
        </ContextMenu>
      </div>,
    );

    const menu = await screen.findByRole("menu");
    expect(menu.closest("[data-theme='light']")).toBeTruthy();
  });
});
