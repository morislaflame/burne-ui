import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";

import { Dropdown } from ".";

describe("Dropdown Phase 2C", () => {
  it("closes the menu when clicking a plain action Dropdown.Item without a value prop (unless closeOnSelect=false)", async () => {
    const onEdit = vi.fn();
    const onSelectAction = vi.fn();
    const { user } = render(
      <Dropdown>
        <Dropdown.Trigger>Actions</Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Item onClick={onEdit}>Edit</Dropdown.Item>
          <Dropdown.Item onSelect={onSelectAction}>Duplicate</Dropdown.Item>
          <Dropdown.Item closeOnSelect={false}>Keep Open</Dropdown.Item>
        </Dropdown.Popover>
      </Dropdown>,
    );

    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.click(trigger);
    expect(await screen.findByRole("menu")).toBeInTheDocument();

    await user.click(screen.getByRole("menuitem", { name: "Keep Open" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    await user.click(trigger);
    await user.click(await screen.findByRole("menuitem", { name: "Duplicate" }));
    expect(onSelectAction).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("opens from closed Trigger with ArrowDown (focuses first item) and ArrowUp (focuses last item), and scrolls items into view", async () => {
    const scrollSpy = vi.fn();
    const origScroll = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = scrollSpy;

    try {
      const { user } = render(
        <Dropdown>
          <Dropdown.Trigger>Menu</Dropdown.Trigger>
          <Dropdown.Popover>
            <Dropdown.Item>Alpha</Dropdown.Item>
            <Dropdown.Item>Beta</Dropdown.Item>
            <Dropdown.Item>Gamma</Dropdown.Item>
          </Dropdown.Popover>
        </Dropdown>,
      );

      const trigger = screen.getByRole("button", { name: "Menu" });
      trigger.focus();

      await user.keyboard("{ArrowUp}");
      const gamma = await screen.findByRole("menuitem", { name: "Gamma" });
      expect(gamma).toHaveFocus();

      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });

      trigger.focus();
      await user.keyboard("{ArrowDown}");
      const alpha = await screen.findByRole("menuitem", { name: "Alpha" });
      expect(alpha).toHaveFocus();

      scrollSpy.mockClear();
      await user.keyboard("{ArrowDown}");
      expect(screen.getByRole("menuitem", { name: "Beta" })).toHaveFocus();
      expect(scrollSpy).toHaveBeenCalledWith({ block: "nearest" });
    } finally {
      HTMLElement.prototype.scrollIntoView = origScroll;
    }
  });

  it("inverts ArrowLeft / ArrowRight for Dropdown.Sub in RTL and rotates submenu chevron", async () => {
    const originalStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, "getComputedStyle").mockImplementation((el) => {
      const style = originalStyle(el);
      if (!(el instanceof HTMLElement) || !el.closest("[dir='rtl']")) return style;
      return new Proxy(style, {
        get(target, prop, receiver) {
          if (prop === "direction") return "rtl";
          const value = Reflect.get(target, prop, receiver);
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
    });

    try {
      const { user } = render(
        <div dir="rtl">
          <Dropdown defaultOpen>
            <Dropdown.Trigger>RTL Menu</Dropdown.Trigger>
            <Dropdown.Popover>
              <Dropdown.Sub>
                <Dropdown.SubTrigger>Share</Dropdown.SubTrigger>
                <Dropdown.SubPopover>
                  <Dropdown.Item>Email</Dropdown.Item>
                </Dropdown.SubPopover>
              </Dropdown.Sub>
            </Dropdown.Popover>
          </Dropdown>
        </div>,
      );

      const subTrigger = await screen.findByRole("menuitem", { name: "Share" });
      const chevron = subTrigger.querySelector("svg");
      expect(chevron?.getAttribute("class")).toContain("rtl:rotate-180");

      subTrigger.focus();
      // In RTL, ArrowRight does NOT open submenu; ArrowLeft opens it!
      fireEvent.keyDown(subTrigger, { key: "ArrowRight" });
      expect(screen.queryByRole("menuitem", { name: "Email" })).not.toBeInTheDocument();

      await user.keyboard("{ArrowLeft}");
      const subItem = await screen.findByRole("menuitem", { name: "Email" });
      expect(subItem).toHaveFocus();

      // In RTL, ArrowRight inside submenu closes ONLY the submenu and returns focus to SubTrigger!
      await user.keyboard("{ArrowRight}");
      await waitFor(() => {
        expect(screen.queryByRole("menuitem", { name: "Email" })).not.toBeInTheDocument();
      });
      expect(subTrigger).toHaveFocus();
      expect(screen.getByRole("menuitem", { name: "Share" })).toBeInTheDocument();
    } finally {
      vi.restoreAllMocks();
    }
  });
});
