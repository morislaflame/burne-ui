import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";

import { ScrollArea } from ".";
import { writeInlineScroll } from "./scrollAreaAPI";

function mockBox(element: HTMLElement, size: { client: number; scroll: number; horizontal?: boolean }) {
  Object.defineProperty(element, "clientHeight", { configurable: true, value: size.client });
  Object.defineProperty(element, "scrollHeight", {
    configurable: true,
    value: size.horizontal ? size.client : size.scroll,
  });
  Object.defineProperty(element, "clientWidth", { configurable: true, value: size.client });
  Object.defineProperty(element, "scrollWidth", {
    configurable: true,
    value: size.horizontal ? size.scroll : size.client,
  });
}

describe("ScrollArea", () => {
  it("scrolls the viewport from the bar keyboard and puts focus-ring-inset on Viewport", () => {
    render(
      <ScrollArea aria-label="Cities" className="h-48 w-64">
        <p>Oslo</p>
      </ScrollArea>,
    );
    const viewport = screen.getByLabelText("Cities");
    expect(viewport.className).toContain("focus-ring-inset");
    mockBox(viewport, { client: 100, scroll: 400 });
    fireEvent.scroll(viewport);
    const bar = screen.getByRole("scrollbar");
    expect(bar).toHaveAttribute("aria-orientation", "vertical");
    expect(bar).toHaveAttribute("aria-valuemax", "300");
    fireEvent.keyDown(bar, { key: "ArrowDown" });
    expect(viewport.scrollTop).toBe(48);
    fireEvent.keyDown(bar, { key: "End" });
    expect(viewport.scrollTop).toBe(300);
  });

  it("mounts only the bars the compound tree asks for and enables horizontal scrolling in compound mode", () => {
    render(
      <ScrollArea aria-label="Notes">
        <ScrollArea.Viewport>
          <p>Note</p>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" />
      </ScrollArea>,
    );
    const viewport = screen.getByLabelText("Notes");
    expect(viewport.className).toContain("overflow-x-auto");
    const bar = screen.getByRole("scrollbar", { hidden: true });
    expect(bar).toHaveAttribute("aria-orientation", "horizontal");
    expect(screen.getAllByRole("scrollbar", { hidden: true })).toHaveLength(1);
  });

  it("negates horizontal --scroll-thumb-offset in RTL, scales Firefox deltaMode=1 wheel, and hides Corner unless both bars visible", () => {
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

    const { container } = render(
      <div dir="rtl">
        <ScrollArea aria-label="RTL Wide" orientation="both" visibility="hover">
          <div>Wide</div>
        </ScrollArea>
      </div>,
    );
    const viewport = screen.getByLabelText("RTL Wide");
    Object.defineProperty(viewport, "clientWidth", { configurable: true, value: 100 });
    Object.defineProperty(viewport, "scrollWidth", { configurable: true, value: 400 });
    Object.defineProperty(viewport, "clientHeight", { configurable: true, value: 100 });
    Object.defineProperty(viewport, "scrollHeight", { configurable: true, value: 400 });
    writeInlineScroll(viewport, 150);
    fireEvent.scroll(viewport);

    const bars = screen.getAllByRole("scrollbar", { hidden: true });
    const hBar = bars.find((b) => b.getAttribute("aria-orientation") === "horizontal")!;
    const vBar = bars.find((b) => b.getAttribute("aria-orientation") === "vertical")!;
    expect(hBar.style.getPropertyValue("--scroll-thumb-offset")).toMatch(/^-/);

    // Corner hidden while visibility="hover" and not hovered
    const corner = container.querySelector("[aria-hidden='true']") as HTMLElement;
    expect(corner.hidden).toBe(true);

    // Firefox line-mode wheel (deltaMode === 1 -> * 16)
    const wheelMoved = fireEvent.wheel(vBar, { deltaY: 2, deltaMode: 1 });
    expect(wheelMoved).toBe(false); // preventDefault called
    expect(viewport.scrollTop).toBe(32);

    // At top boundary, upward wheel does not preventDefault
    viewport.scrollTop = 0;
    const atBoundary = fireEvent.wheel(vBar, { deltaY: -2, deltaMode: 1 });
    expect(atBoundary).toBe(true);

    vi.restoreAllMocks();
  });
});
