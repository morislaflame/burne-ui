import { describe, expect, it, vi } from "vitest";

import { createMotionEvents, splitMotionRootMap } from "./motionEvents";

describe("createMotionEvents", () => {
  it("returns the same map", () => {
    const saving = () => {};
    const events = createMotionEvents({ "checkout:saving": saving });
    expect(events["checkout:saving"]).toBe(saving);
  });

  it("warns when a built-in phase is used as an event key", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    createMotionEvents({ hoverIn: false } as never);
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});

describe("splitMotionRootMap", () => {
  it("peels events so they are not a slot", () => {
    const saving = () => {};
    const { slots, events } = splitMotionRootMap({
      root: { hoverIn: { y: -2 } },
      events: { "checkout:saving": saving },
    });
    expect(slots).toEqual({ root: { hoverIn: { y: -2 } } });
    expect(events).toEqual({ "checkout:saving": saving });
    expect(slots && "events" in slots).toBe(false);
  });

  it("warns on silent arbitrary keys inside a slot", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    splitMotionRootMap({
      root: { hoverIn: { y: -1 }, "checkout:saving": { y: -4 } } as never,
    });
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});
