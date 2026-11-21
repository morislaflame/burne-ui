import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";
import { ToggleButton } from "@/components/core/ToggleButton";

import { ToggleButtonGroup } from ".";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ToggleButtonGroup", () => {
  it("assigns fallback roving tabIndex=0 to the first non-disabled item when item 0 is disabled", () => {
    render(
      <ToggleButtonGroup aria-label="Formatting">
        <ToggleButton value="bold" disabled>
          Bold
        </ToggleButton>
        <ToggleButton value="italic">Italic</ToggleButton>
        <ToggleButton value="underline">Underline</ToggleButton>
      </ToggleButtonGroup>,
    );

    expect(screen.getByRole("button", { name: "Bold" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute("tabIndex", "0");
    expect(screen.getByRole("button", { name: "Underline" })).toHaveAttribute("tabIndex", "-1");
  });

  it("inverts ArrowLeft and ArrowRight in horizontal RTL", async () => {
    const originalStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, "getComputedStyle").mockImplementation((el) => {
      const style = originalStyle(el);
      if (!(el instanceof HTMLElement) || el.closest("[dir='rtl']") == null) return style;
      return new Proxy(style, {
        get(target, prop, receiver) {
          if (prop === "direction") return "rtl";
          const value = Reflect.get(target, prop, receiver);
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
    });

    const { user } = render(
      <div dir="rtl">
        <ToggleButtonGroup aria-label="Alignment">
          <ToggleButton value="start">Start</ToggleButton>
          <ToggleButton value="center">Center</ToggleButton>
          <ToggleButton value="end">End</ToggleButton>
        </ToggleButtonGroup>
      </div>,
    );

    const startBtn = screen.getByRole("button", { name: "Start" });
    startBtn.focus();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("button", { name: "Center" })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Start" })).toHaveFocus();
  });

  it("blocks selection changes when group is disabled", async () => {
    const onValuesChange = vi.fn();
    const { user } = render(
      <ToggleButtonGroup disabled onValuesChange={onValuesChange} aria-label="Tools">
        <ToggleButton value="a">A</ToggleButton>
        <ToggleButton value="b">B</ToggleButton>
      </ToggleButtonGroup>,
    );

    await user.click(screen.getByRole("button", { name: "A" }));
    expect(onValuesChange).not.toHaveBeenCalled();
  });
});
