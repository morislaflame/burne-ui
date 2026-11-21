import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { render, setReducedMotion } from "@/__tests__/helpers";
import { Form } from "@/components/composite/Form";
import { gsap } from "@/components/core/utils/gsapMotion";

import { Switch } from ".";
import { measureSwitchTravel } from "./switchGeometry";

afterEach(() => {
  setReducedMotion(true);
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Switch", () => {
  it("measures travel from clientWidth/offsetWidth unaffected by active press transform", () => {
    const track = document.createElement("span");
    const thumb = document.createElement("span");
    Object.defineProperty(track, "clientWidth", { value: 40, configurable: true });
    Object.defineProperty(thumb, "offsetWidth", { value: 20, configurable: true });
    // Simulate a 0.9x press-squeeze transform shrinking getBoundingClientRect
    track.getBoundingClientRect = () => ({ width: 36 } as DOMRect);
    thumb.getBoundingClientRect = () => ({ width: 18 } as DOMRect);

    expect(measureSwitchTravel(track, thumb)).toBe(20);

    // Fallback when clientWidth/offsetWidth are 0 (unit environments)
    Object.defineProperty(track, "clientWidth", { value: 0, configurable: true });
    Object.defineProperty(thumb, "offsetWidth", { value: 0, configurable: true });
    expect(measureSwitchTravel(track, thumb)).toBe(18);
  });

  it("does not recreate ResizeObserver or kill running GSAP tweens when checked toggles", async () => {
    setReducedMotion(false);
    const roCallbacks: ResizeObserverCallback[] = [];
    const observeSpy = vi.fn();
    const disconnectSpy = vi.fn();

    class MockResizeObserver {
      constructor(cb: ResizeObserverCallback) {
        roCallbacks.push(cb);
      }
      observe = observeSpy;
      unobserve = vi.fn();
      disconnect = disconnectSpy;
    }
    vi.stubGlobal("ResizeObserver", MockResizeObserver);

    const killTweensSpy = vi.spyOn(gsap, "killTweensOf");

    const { user } = render(<Switch label="Alerts" />);
    expect(roCallbacks).toHaveLength(1);
    const disconnectsBeforeToggle = disconnectSpy.mock.calls.length;

    await user.click(screen.getByRole("switch", { name: "Alerts" }));
    // Toggling checked must NOT disconnect & recreate ResizeObserver
    expect(disconnectSpy.mock.calls.length).toBe(disconnectsBeforeToggle);
    expect(roCallbacks).toHaveLength(1);

    killTweensSpy.mockClear();
    // Simulate async ResizeObserver firing with unchanged dimensions — must NOT kill tweens
    act(() => {
      roCallbacks[0]?.([], {} as ResizeObserver);
    });
    expect(killTweensSpy).not.toHaveBeenCalled();
  });

  it("integrates with Form disabled, readOnly, value, error, and native form reset", async () => {
    const userClickSpy = vi.fn();
    const { user, rerender, unmount } = render(
      <Form readOnly defaultValues={{ alerts: false }} aria-label="Form">
        <Switch name="alerts" label="Alerts" onClick={userClickSpy} />
      </Form>,
    );
    const roSwitch = screen.getByRole("switch", { name: "Alerts" });
    expect(roSwitch).toHaveAttribute("data-readonly", "");
    await user.click(roSwitch);
    expect(roSwitch).not.toBeChecked();
    expect(userClickSpy).not.toHaveBeenCalled();

    rerender(
      <Form
        defaultValues={{ alerts: false }}
        rules={{ alerts: { required: "Must enable alerts" } }}
        aria-label="Form"
      >
        <Switch name="alerts" label="Alerts" required />
        <button type="submit">Save</button>
      </Form>,
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Must enable alerts");
    const invalidSwitch = screen.getByRole("switch");
    expect(invalidSwitch).toHaveAttribute("aria-invalid", "true");
    expect(invalidSwitch).toHaveAttribute("data-invalid", "");
    expect(invalidSwitch).toHaveAttribute("data-required", "");
    unmount();

    render(
      <form>
        <Switch name="alerts" label="Alerts" defaultChecked />
        <button type="reset">Reset</button>
      </form>,
    );
    const sw = screen.getByRole("switch", { name: "Alerts" });
    expect(sw).toBeChecked();
    expect(sw.closest("label")).toHaveAttribute("data-state", "on");

    await user.click(sw);
    expect(sw).not.toBeChecked();
    expect(sw.closest("label")).toHaveAttribute("data-state", "off");

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() => {
      expect(sw).toBeChecked();
      expect(sw.closest("label")).toHaveAttribute("data-state", "on");
    });
  });

  it("preserves explicit Switch.Track props in compound mode", () => {
    const { container } = render(
      <Switch label="Theme">
        <Switch.Control>
          <Switch.Track size="large" color="rgb(12, 34, 56)" data-testid="custom-track" />
        </Switch.Control>
        <Switch.Label>Theme</Switch.Label>
      </Switch>,
    );
    const track = screen.getByTestId("custom-track");
    expect(track).toBeInTheDocument();
    const fill = container.querySelector("[style*='rgb(12, 34, 56)']");
    expect(fill).toBeTruthy();
  });
});
