import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";
import { Dialog } from "@/components/core/Dialog";

import { Toast, toast } from ".";
import { toastAnnouncementText } from "./toastA11y";
import { resolveToastStackLayout, TOAST_STACK_EXPANDED_GAP_PX } from "./toastAPI";
import { ToastProviderRoot } from "./toastProvider";

describe("Toast Phase 2C", () => {
  it("resolves toast.promise when the promise settles in the same microtask tick (no stale toastsRef)", async () => {
    render(
      <Toast.Provider>
        <div>App</div>
      </Toast.Provider>,
    );

    act(() => {
      toast.promise(Promise.resolve("Report exported"), {
        loading: "Exporting...",
        success: (msg) => msg,
      });
    });

    expect(await screen.findByRole("group", { name: "Report exported" })).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Exporting..." })).not.toBeInTheDocument();
  });

  it("deduplicates toast.show({ id }) in place instead of stacking duplicates", async () => {
    render(
      <ToastProviderRoot>
        <div>App</div>
      </ToastProviderRoot>,
    );

    act(() => {
      toast.show({ id: "sync-job", title: "Step 1", duration: 0 });
      toast.show({ id: "sync-job", title: "Step 2", duration: 0 });
    });

    expect(await screen.findByRole("group", { name: "Step 2" })).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Step 1" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("group")).toHaveLength(1);
  });

  it("marks buried toasts beyond TOAST_MAX_VISIBLE (3) as inert and aria-hidden", async () => {
    render(
      <Toast.Provider>
        <div>App</div>
      </Toast.Provider>,
    );

    act(() => {
      toast.show({ id: "t1", title: "Toast 1", duration: 0 });
      toast.show({ id: "t2", title: "Toast 2", duration: 0 });
      toast.show({ id: "t3", title: "Toast 3", duration: 0 });
      toast.show({ id: "t4", title: "Toast 4", duration: 0 });
    });

    await screen.findByRole("region");
    // Newest first: t4 (idx 0), t3 (idx 1), t2 (idx 2), t1 (idx 3 -> hidden & inert!)
    const t4Wrap = screen.getByText("Toast 4", { selector: ":not(.sr-only)" }).closest("[style*='--toast-stack-z']")!;
    const t1Wrap = screen.getByText("Toast 1", { selector: ":not(.sr-only)" }).closest("[style*='--toast-stack-z']")!;

    expect(t4Wrap).not.toHaveAttribute("inert");
    expect(t4Wrap).not.toHaveAttribute("aria-hidden");
    expect(t1Wrap).toHaveAttribute("inert");
    expect(t1Wrap).toHaveAttribute("aria-hidden", "true");
  });

  it("pauses auto-dismiss timers for the entire stack on viewport hover and resumes on leave", () => {
    vi.useFakeTimers();
    try {
      render(
        <Toast.Provider>
          <div>App</div>
        </Toast.Provider>,
      );

      act(() => {
        toast.show({ id: "back", title: "Back toast", duration: 1000 });
        toast.show({ id: "front", title: "Front toast", duration: 1000 });
      });

      const region = screen.getByRole("region");
      act(() => {
        vi.advanceTimersByTime(400);
      });

      // Hover viewport -> pauses BOTH front and back toast timers!
      fireEvent.pointerEnter(region, { pointerType: "mouse" });
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(screen.getByRole("group", { name: "Front toast" })).toBeInTheDocument();
      expect(screen.getByRole("group", { name: "Back toast" })).toBeInTheDocument();

      // Leave viewport -> remaining ~600ms elapses and dismisses both!
      fireEvent.pointerLeave(region, { pointerType: "mouse" });
      act(() => {
        vi.advanceTimersByTime(700);
      });
      expect(screen.queryByRole("group", { name: "Front toast" })).not.toBeInTheDocument();
      expect(screen.queryByRole("group", { name: "Back toast" })).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("extracts recursive plain text from JSX ReactNode title & description for aria-live announcements", () => {
    const text = toastAnnouncementText(
      <span>
        Saved <strong>report.pdf</strong>
      </span>,
      <>
        Uploaded to <code>/docs</code>
      </>,
    );
    expect(text).toBe("Saved report.pdf. Uploaded to /docs");
    void Toast;
  });

  it("portals ToastViewport inside the topmost open modal <dialog> when portalContainer is omitted", async () => {
    render(
      <Toast.Provider>
        <Dialog defaultOpen>
          <Dialog.Panel>
            <Dialog.Title>Checkout</Dialog.Title>
          </Dialog.Panel>
        </Dialog>
      </Toast.Provider>,
    );

    const dialog = await screen.findByRole("dialog", { name: "Checkout" });

    act(() => {
      toast.show({ title: "Payment declined", status: "danger", duration: 0 });
    });

    const viewport = await screen.findByRole("region");
    expect(dialog.contains(viewport)).toBe(true);

    await waitFor(() => {
      act(() => {
        toast.dismissAll();
      });
      expect(screen.queryByRole("region")).not.toBeInTheDocument();
    });
  });

  it("expands multi-toast stack one above another on viewport hover and restores peek on leave", async () => {
    render(
      <Toast.Provider defaultPlacement="bottom-right">
        <div>App</div>
      </Toast.Provider>,
    );

    // Single toast: hover pauses timer but does not expand stack
    act(() => {
      toast.show({ id: "one", title: "First toast", duration: 0 });
    });
    const region = await screen.findByRole("region");
    const stack = region.querySelector("[data-state]") as HTMLElement;
    expect(stack).toHaveAttribute("data-state", "collapsed");

    fireEvent.pointerEnter(region, { pointerType: "mouse" });
    expect(stack).toHaveAttribute("data-state", "collapsed");
    fireEvent.pointerLeave(region, { pointerType: "mouse" });

    // Add two more toasts -> stack of 3 (newest first: three, two, one)
    act(() => {
      toast.show({ id: "two", title: "Second toast", description: "Extra details", duration: 0 });
      toast.show({ id: "three", title: "Third toast", duration: 0 });
    });

    const wrapOf = (title: string) =>
      screen.getByText(title, { selector: ":not(.sr-only)" }).closest("[style*='--toast-stack-z']") as HTMLElement;

    const w3 = wrapOf("Third toast");
    const w2 = wrapOf("Second toast");
    const w1 = wrapOf("First toast");

    // Collapsed: only front card accepts pointer events
    expect(stack).toHaveAttribute("data-state", "collapsed");
    expect(w3.style.getPropertyValue("--toast-stack-events")).toBe("auto");
    expect(w2.style.getPropertyValue("--toast-stack-events")).toBe("none");
    expect(w1.style.getPropertyValue("--toast-stack-events")).toBe("none");

    // Hover: stack expands, bridges gaps with pointer-events-auto, and unlocks all visible cards
    fireEvent.pointerEnter(region, { pointerType: "mouse" });
    expect(stack).toHaveAttribute("data-state", "expanded");
    expect(stack.className).toContain("pointer-events-auto");
    expect(w3.style.getPropertyValue("--toast-stack-events")).toBe("auto");
    expect(w2.style.getPropertyValue("--toast-stack-events")).toBe("auto");
    expect(w1.style.getPropertyValue("--toast-stack-events")).toBe("auto");

    // Verify exact cumulative height + gap math for both bottom-* and top-* placements
    const entries = [
      { id: "three" },
      { id: "two" },
      { id: "one" },
    ] as unknown as Parameters<typeof resolveToastStackLayout>[0]["sorted"];
    const bottomExpanded = resolveToastStackLayout({
      sorted: entries,
      dismissingIds: new Set(),
      heights: { three: 56, two: 84, one: 60 },
      isTop: false,
      paused: true,
    });
    expect(bottomExpanded.expanded).toBe(true);
    expect(bottomExpanded.items.get("three")?.peekY).toBe(0);
    expect(bottomExpanded.items.get("two")?.peekY).toBe(-(56 + TOAST_STACK_EXPANDED_GAP_PX));
    expect(bottomExpanded.items.get("one")?.peekY).toBe(
      -(56 + TOAST_STACK_EXPANDED_GAP_PX + 84 + TOAST_STACK_EXPANDED_GAP_PX),
    );
    expect(bottomExpanded.items.get("two")?.scale).toBe(1);
    expect(bottomExpanded.containerHeight).toBe(56 + 84 + 60 + 2 * TOAST_STACK_EXPANDED_GAP_PX);

    const topExpanded = resolveToastStackLayout({
      sorted: entries,
      dismissingIds: new Set(),
      heights: { three: 56, two: 84, one: 60 },
      isTop: true,
      paused: true,
    });
    expect(topExpanded.items.get("two")?.peekY).toBe(56 + TOAST_STACK_EXPANDED_GAP_PX);

    // Leave: collapses back to peek mode
    fireEvent.pointerLeave(region, { pointerType: "mouse" });
    expect(stack).toHaveAttribute("data-state", "collapsed");
    expect(stack.className).not.toContain("pointer-events-auto");
    expect(w2.style.getPropertyValue("--toast-stack-events")).toBe("none");
  });
});
