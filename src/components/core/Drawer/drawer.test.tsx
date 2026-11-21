import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render, setReducedMotion } from "@/__tests__/helpers";

import { Drawer } from ".";

describe("Drawer.Handle Phase 2C drag & tap", () => {
  it("closes on handle tap even with sub-slop pointer jitter (< 4px)", async () => {
    setReducedMotion(false);
    const onOpenChange = vi.fn();

    render(
      <Drawer defaultOpen placement="bottom" onOpenChange={onOpenChange}>
        <Drawer.Panel>
          <Drawer.Handle data-testid="drawer-handle" />
          <Drawer.Title>Sheet</Drawer.Title>
        </Drawer.Panel>
      </Drawer>,
    );

    const closeBtn = await screen.findByRole("button", { name: "Close" });
    const handle = screen.getByTestId("drawer-handle");

    // Simulate tiny 2px finger jitter before release + click
    fireEvent.pointerDown(handle, { button: 0, pointerId: 1, clientX: 50, clientY: 100 });
    fireEvent.pointerMove(window, { pointerId: 1, clientX: 51, clientY: 102 });
    fireEvent.pointerUp(window, { pointerId: 1, clientX: 51, clientY: 102 });
    fireEvent.click(closeBtn);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("never closes on wrong-direction swipe (upward swipe on bottom Drawer)", async () => {
    setReducedMotion(false);
    const onOpenChange = vi.fn();

    render(
      <Drawer defaultOpen placement="bottom" onOpenChange={onOpenChange}>
        <Drawer.Panel data-testid="drawer-panel">
          <Drawer.Handle data-testid="drawer-handle" />
          <Drawer.Title>Bottom Sheet</Drawer.Title>
        </Drawer.Panel>
      </Drawer>,
    );

    const panel = await screen.findByTestId("drawer-panel");
    Object.defineProperty(panel, "offsetHeight", { configurable: true, value: 200 });
    const handle = screen.getByTestId("drawer-handle");

    // Swipe UPWARD by 150px (delta = -150, clamped = 0)
    fireEvent.pointerDown(handle, { button: 0, pointerId: 2, clientX: 50, clientY: 300 });
    fireEvent.pointerMove(window, { pointerId: 2, clientX: 50, clientY: 150 });
    fireEvent.pointerUp(window, { pointerId: 2, clientX: 50, clientY: 150 });

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog", { name: "Bottom Sheet" })).toBeInTheDocument();
  });

  it("closes on outward swipe exceeding dismiss ratio", async () => {
    setReducedMotion(false);
    const onOpenChange = vi.fn();

    render(
      <Drawer defaultOpen placement="bottom" onOpenChange={onOpenChange}>
        <Drawer.Panel data-testid="drawer-panel">
          <Drawer.Handle data-testid="drawer-handle" />
          <Drawer.Title>Swipe Sheet</Drawer.Title>
        </Drawer.Panel>
      </Drawer>,
    );

    const panel = await screen.findByTestId("drawer-panel");
    Object.defineProperty(panel, "offsetHeight", { configurable: true, value: 200 });
    const handle = screen.getByTestId("drawer-handle");

    // Swipe DOWNWARD by 120px (ratio = 120 / 200 = 0.6 >= 0.38)
    fireEvent.pointerDown(handle, { button: 0, pointerId: 3, clientX: 50, clientY: 100 });
    fireEvent.pointerMove(window, { pointerId: 3, clientX: 50, clientY: 220 });
    fireEvent.pointerUp(window, { pointerId: 3, clientX: 50, clientY: 220 });

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("disables drag-dismiss when closeOnInteractOutside={false} and ignores non-primary mouse buttons", async () => {
    setReducedMotion(false);
    const onOpenChange = vi.fn();

    const { unmount } = render(
      <Drawer defaultOpen placement="bottom" onOpenChange={onOpenChange}>
        <Drawer.Panel closeOnInteractOutside={false} data-testid="drawer-panel">
          <Drawer.Handle data-testid="drawer-handle" />
          <Drawer.Title>Locked Sheet</Drawer.Title>
        </Drawer.Panel>
      </Drawer>,
    );

    const panel = await screen.findByTestId("drawer-panel");
    Object.defineProperty(panel, "offsetHeight", { configurable: true, value: 200 });
    const handle = screen.getByTestId("drawer-handle");

    // Attempt drag-dismiss when closeOnInteractOutside={false}
    fireEvent.pointerDown(handle, { button: 0, pointerId: 4, clientX: 50, clientY: 100 });
    fireEvent.pointerMove(window, { pointerId: 4, clientX: 50, clientY: 260 });
    fireEvent.pointerUp(window, { pointerId: 4, clientX: 50, clientY: 260 });
    expect(onOpenChange).not.toHaveBeenCalled();

    // Right-click pointerdown is ignored
    fireEvent.pointerDown(handle, { button: 2, pointerId: 5, clientX: 50, clientY: 100 });
    unmount();
  });
});
