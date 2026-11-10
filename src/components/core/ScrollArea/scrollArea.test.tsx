import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";

import { ScrollArea } from ".";

function mockBox(element: HTMLElement, size: { client: number; scroll: number }) {
  Object.defineProperty(element, "clientHeight", { configurable: true, value: size.client });
  Object.defineProperty(element, "scrollHeight", { configurable: true, value: size.scroll });
  Object.defineProperty(element, "clientWidth", { configurable: true, value: size.client });
  Object.defineProperty(element, "scrollWidth", { configurable: true, value: size.client });
}

describe("ScrollArea", () => {
  it("scrolls the viewport from the bar keyboard", () => {
    render(
      <ScrollArea aria-label="Cities" className="h-48 w-64">
        <p>Oslo</p>
      </ScrollArea>,
    );
    const viewport = screen.getByLabelText("Cities");
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

  it("mounts only the bars the compound tree asks for", () => {
    render(
      <ScrollArea aria-label="Notes" orientation="both">
        <ScrollArea.Viewport>
          <p>Note</p>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" />
      </ScrollArea>,
    );
    const bar = screen.getByRole("scrollbar", { hidden: true });
    expect(bar).toHaveAttribute("aria-orientation", "horizontal");
    expect(screen.getAllByRole("scrollbar", { hidden: true })).toHaveLength(1);
  });
});
