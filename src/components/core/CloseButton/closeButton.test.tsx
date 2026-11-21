import { fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { render, setReducedMotion } from "@/__tests__/helpers";
import { gsap } from "@/components/core/utils/gsapMotion";

import { CloseButton } from ".";

afterEach(() => {
  setReducedMotion(false);
  vi.restoreAllMocks();
});

describe("CloseButton fixes", () => {
  it("marks decorative icon span aria-hidden and broadcasts hover/press to icon slot", () => {
    setReducedMotion(false);
    const hoverIn = vi.fn();
    const pressIn = vi.fn();
    render(
      <CloseButton
        motion={{
          icon: {
            hoverIn: () => {
              hoverIn();
            },
            pressIn: () => {
              pressIn();
            },
          },
        }}
      />,
    );

    const btn = screen.getByRole("button", { name: "Close" });
    const iconSpan = btn.querySelector("span");
    expect(iconSpan).toHaveAttribute("aria-hidden", "true");

    fireEvent.pointerOver(btn);
    expect(hoverIn).toHaveBeenCalledTimes(1);

    fireEvent.pointerDown(btn);
    expect(pressIn).toHaveBeenCalledTimes(1);
  });

  it("clears GSAP transform and shadow when disabled becomes true", () => {
    setReducedMotion(false);
    const { rerender } = render(<CloseButton />);
    const btn = screen.getByRole("button", { name: "Close" });

    gsap.set(btn, { scale: 0.92 });
    btn.style.setProperty("--el-shadow", "0 2px 4px black");
    expect(Number(gsap.getProperty(btn, "scale"))).toBeCloseTo(0.92);

    rerender(<CloseButton disabled />);
    expect(btn.style.getPropertyValue("--el-shadow")).toBe("");
    expect(Number(gsap.getProperty(btn, "scale"))).toBe(1);
  });
});
