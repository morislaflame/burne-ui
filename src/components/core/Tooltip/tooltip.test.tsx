import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";

import { Tooltip } from ".";
import { computeTooltipPlacement } from "./tooltipPosition";

const rect = (left: number, top: number, width: number, height: number): DOMRect =>
  ({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  }) as DOMRect;

describe("Tooltip Phase 2C: WCAG 1.4.13 hoverable, touch ghost guard & visualViewport", () => {
  it("publishes data-state on Trigger and stays open when moving pointer onto Tooltip.Content (WCAG 1.4.13)", async () => {
    vi.useFakeTimers();
    try {
      render(
        <Tooltip openDelay={0} closeDelay={0}>
          <Tooltip.Trigger>Help</Tooltip.Trigger>
          <Tooltip.Content>Selectable tooltip text</Tooltip.Content>
        </Tooltip>,
      );

      const trigger = screen.getByText("Help");
      expect(trigger).toHaveAttribute("data-state", "closed");

      fireEvent.pointerEnter(trigger, { pointerType: "mouse" });
      act(() => {
        vi.advanceTimersByTime(10);
      });

      const tip = screen.getByRole("tooltip");
      expect(trigger).toHaveAttribute("data-state", "open");
      expect(tip.className).toContain("pointer-events-auto");
      expect(tip.className).toContain("fixed");
      expect(tip.className).toContain("start-0");

      // Leave trigger across gap -> within 50ms enter tooltip content
      fireEvent.pointerLeave(trigger, { pointerType: "mouse" });
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(screen.getByRole("tooltip")).toBeInTheDocument();

      fireEvent.pointerEnter(tip, { pointerType: "mouse" });
      act(() => {
        vi.advanceTimersByTime(500);
      });
      // Still open while hovering content!
      expect(screen.getByRole("tooltip")).toBeInTheDocument();

      // Leave tooltip content -> closes after bridge delay
      fireEvent.pointerLeave(tip, { pointerType: "mouse" });
      act(() => {
        vi.advanceTimersByTime(150);
      });
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("ignores touch pointerenter/pointerleave so mobile taps do not leave sticky ghost tooltips", async () => {
    render(
      <Tooltip openDelay={0}>
        <Tooltip.Trigger>Tap me</Tooltip.Trigger>
        <Tooltip.Content>Ghost</Tooltip.Content>
      </Tooltip>,
    );

    const trigger = screen.getByText("Tap me");
    fireEvent.pointerEnter(trigger, { pointerType: "touch" });
    await new Promise((r) => setTimeout(r, 30));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("computeTooltipPlacement respects visualViewport and clamps main axis so tall panels never bleed off-screen", () => {
    const prevVV = window.visualViewport;
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: {
        width: 390,
        height: 300, // mobile keyboard open!
        offsetLeft: 0,
        offsetTop: 20,
        addEventListener() {},
        removeEventListener() {},
      },
    });

    try {
      // Trigger near middle; floating panel taller than both top and bottom space (height = 260)
      const placement = computeTooltipPlacement(
        rect(100, 140, 80, 36),
        rect(0, 0, 200, 260),
        "top",
        8,
        { collisionPadding: 8 },
      );

      // Must never bleed above visualViewport.offsetTop + 8 (= 28)
      expect(placement.top).toBeGreaterThanOrEqual(28);
      // Must fit inside visualViewport bottom (320 - 260 - 8 = 52)
      expect(placement.top).toBeLessThanOrEqual(52);
    } finally {
      Object.defineProperty(window, "visualViewport", {
        configurable: true,
        value: prevVV,
      });
    }
  });
});
