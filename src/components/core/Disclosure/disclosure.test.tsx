import { fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { render, setReducedMotion } from "@/__tests__/helpers";
import { gsap } from "@/components/core/utils/gsapMotion";

import { Disclosure } from ".";

afterEach(() => {
  setReducedMotion(false);
  vi.restoreAllMocks();
});

describe("Disclosure fixes", () => {
  it("sets inert and data-state on Disclosure.Content", () => {
    const { rerender } = render(
      <Disclosure open={false}>
        <Disclosure.Trigger>Details</Disclosure.Trigger>
        <Disclosure.Content data-testid="panel">
          <a href="/more">More</a>
        </Disclosure.Content>
      </Disclosure>,
    );

    const panel = screen.getByTestId("panel");
    expect(panel).toHaveAttribute("data-state", "closed");
    expect(panel.inert).toBe(true);

    rerender(
      <Disclosure open>
        <Disclosure.Trigger>Details</Disclosure.Trigger>
        <Disclosure.Content data-testid="panel">
          <a href="/more">More</a>
        </Disclosure.Content>
      </Disclosure>,
    );
    expect(panel).toHaveAttribute("data-state", "open");
    expect(panel.inert).toBe(false);
  });

  it("keeps an open Disclosure.Group item open when Handle drag snaps back below threshold and animates next click", () => {
    setReducedMotion(false);
    const originalSetCapture = HTMLElement.prototype.setPointerCapture;
    const originalReleaseCapture = HTMLElement.prototype.releasePointerCapture;
    HTMLElement.prototype.setPointerCapture = () => {};
    HTMLElement.prototype.releasePointerCapture = () => {};

    const onValueChange = vi.fn();
    const { container } = render(
      <Disclosure.Group defaultValue="a" variant="card" separated onValueChange={onValueChange}>
        <Disclosure value="a" dragHandle>
          <Disclosure.Trigger>Item A</Disclosure.Trigger>
          <Disclosure.Content>
            <div style={{ height: 100 }}>Content A</div>
          </Disclosure.Content>
          <Disclosure.Handle data-testid="handle" />
        </Disclosure>
      </Disclosure.Group>,
    );

    const trigger = screen.getByRole("button", { name: "Item A" });
    const handle = screen.getByTestId("handle");
    const section = container.querySelector("section")!;
    const inner = section.parentElement as HTMLElement;
    const shell = inner.parentElement as HTMLElement;

    Object.defineProperty(inner, "scrollHeight", { value: 100, configurable: true });
    vi.spyOn(shell, "getBoundingClientRect").mockReturnValue({
      height: 100,
      width: 200,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      bottom: 100,
      right: 200,
      toJSON: () => ({}),
    } as DOMRect);

    vi.spyOn(gsap, "timeline").mockImplementation((vars?: gsap.TimelineVars) => {
      const fake = {
        to: () => fake,
        kill: () => {},
      };
      queueMicrotask(() => vars?.onComplete?.());
      return fake as unknown as gsap.core.Timeline;
    });

    let fakeNow = 1000;
    vi.spyOn(performance, "now").mockImplementation(() => fakeNow);

    fireEvent.pointerDown(handle, { pointerId: 1, clientY: 100 });
    fakeNow = 1200;
    // Drag up only 5px slowly -> velocity = -0.025, ratio = 0.95 -> snaps back to open (true)
    fireEvent.pointerMove(handle, { pointerId: 1, clientY: 95 });
    fireEvent.pointerUp(handle, { pointerId: 1, clientY: 95 });

    return Promise.resolve().then(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(onValueChange).not.toHaveBeenCalled();

      // Next click must still animate instead of skipping because skipContentAnimRef stuck true
      const toSpy = vi.spyOn(gsap, "to");
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(toSpy).toHaveBeenCalled();

      HTMLElement.prototype.setPointerCapture = originalSetCapture;
      HTMLElement.prototype.releasePointerCapture = originalReleaseCapture;
    });
  });

  it("does not preventDefault on native button Enter/Space and supports mergeAsChildProps disabled", async () => {
    const onClick = vi.fn();
    const { user, rerender } = render(
      <Disclosure>
        <Disclosure.Trigger onClick={onClick}>Summary</Disclosure.Trigger>
        <Disclosure.Content>Body</Disclosure.Content>
      </Disclosure>,
    );

    const btn = screen.getByRole("button", { name: "Summary" });
    const enterNotCancelled = fireEvent.keyDown(btn, { key: "Enter" });
    expect(enterNotCancelled).toBe(true);

    btn.focus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(btn).toHaveAttribute("aria-expanded", "true");

    const blockedClick = vi.fn();
    rerender(
      <Disclosure disabled>
        <Disclosure.Trigger asChild onClick={blockedClick}>
          <a href="/nope">Disabled Link Trigger</a>
        </Disclosure.Trigger>
        <Disclosure.Content>Body</Disclosure.Content>
      </Disclosure>,
    );
    const linkTrigger = screen.getByText("Disabled Link Trigger").closest("a")!;
    expect(linkTrigger).not.toHaveAttribute("href");
    expect(linkTrigger).toHaveAttribute("aria-disabled", "true");
    expect(linkTrigger).toHaveAttribute("data-disabled", "");
    fireEvent.click(linkTrigger);
    expect(blockedClick).not.toHaveBeenCalled();
  });
});
