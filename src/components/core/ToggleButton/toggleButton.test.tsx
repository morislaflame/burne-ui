import { fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { render, setReducedMotion } from "@/__tests__/helpers";

import { ToggleButton } from ".";
import { toggleButtonFillClass } from "./toggleButtonStyles";

afterEach(() => {
  setReducedMotion(true);
});

describe("ToggleButton", () => {
  it("resets press-fill coordination on pointercancel, blur, or rejected controlled click so later pressed updates animate", () => {
    setReducedMotion(false);
    const onFillStart = vi.fn();

    const { rerender, container } = render(
      <ToggleButton pressed={false} onFillStart={onFillStart}>
        Pin
      </ToggleButton>,
    );

    const btn = screen.getByRole("button", { name: "Pin" });
    const fill = container.querySelector("[data-selection-fill]")!;

    // 1) Press down then pointercancel outside — deferFillFromPressRef must not stay true
    fireEvent.pointerDown(btn, { button: 0, pointerId: 1 });
    fireEvent.pointerCancel(btn, { pointerId: 1 });

    // 2) Click while controlled pressed={false} stays false — fill must remain off
    fireEvent.pointerDown(btn, { button: 0, pointerId: 2 });
    fireEvent.pointerUp(btn, { pointerId: 2 });
    fireEvent.click(btn);
    expect(fill).toHaveAttribute("data-pressed", "false");
    expect(onFillStart).not.toHaveBeenCalled();

    // 3) Keyboard press down then blur — must release deferFillFromPressRef
    fireEvent.keyDown(btn, { key: " " });
    fireEvent.blur(btn);

    // 4) Programmatic controlled pressed={true} MUST now update fill & displayPressed
    rerender(
      <ToggleButton pressed onFillStart={onFillStart}>
        Pin
      </ToggleButton>,
    );
    expect(onFillStart).toHaveBeenCalledWith(true);
    expect(fill).toHaveAttribute("data-pressed", "true");
  });

  it("uses static Tailwind hover classes instead of dynamic template interpolation", () => {
    const defaultPressed = toggleButtonFillClass({
      fillColor: "bg-primary-tint",
      pressed: true,
      variant: "default",
      roundingClass: "rounded-small",
    });
    expect(defaultPressed).toContain("group-hover/toggle:bg-primary-tint/80");

    const customPressed = toggleButtonFillClass({
      fillColor: "bg-custom-brand",
      pressed: true,
      variant: "default",
      roundingClass: "rounded-small",
    });
    expect(customPressed).toContain("group-hover/toggle:opacity-80");
    expect(customPressed).not.toContain("group-hover/toggle:bg-custom-brand/80");
  });
});
