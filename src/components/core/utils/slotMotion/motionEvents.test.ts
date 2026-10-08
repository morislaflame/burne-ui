import { describe, expect, it, vi } from "vitest";

import {
  createMotionEvents,
  createMotionFactory,
  createMotionStates,
  mergeMotionRootSiblings,
  mergeMotionStates,
  remapMotionStateSlots,
  splitMotionRootMap,
} from "./motionEvents";
import type { MotionContext } from "./slotMotionTypes";

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

describe("createMotionStates", () => {
  it("returns the same map", () => {
    const loading = { root: { autoAlpha: 0.7 } };
    const states = createMotionStates({ loading });
    expect(states.loading).toBe(loading);
  });

  it("warns when a built-in phase is used as a state key", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    createMotionStates({ hoverIn: { root: false } } as never);
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});

describe("createMotionFactory", () => {
  it("types ctx.payload and remains a MotionFactory", () => {
    const seen: number[] = [];
    const factory = createMotionFactory<{ attempt: number }>((ctx) => {
      seen.push(ctx.payload?.attempt ?? 0);
    });
    factory({ payload: { attempt: 2 } } as unknown as MotionContext);
    expect(seen).toEqual([2]);
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

  it("peels states so they are not a slot", () => {
    const loading = { root: { autoAlpha: 0.7 } };
    const { slots, states } = splitMotionRootMap({
      root: { hoverIn: { y: -2 } },
      states: { loading },
    });
    expect(slots).toEqual({ root: { hoverIn: { y: -2 } } });
    expect(states).toEqual({ loading });
    expect(slots && "states" in slots).toBe(false);
  });

  it("warns on silent arbitrary keys inside a slot", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    splitMotionRootMap({
      root: { hoverIn: { y: -1 }, "checkout:saving": { y: -4 } } as never,
    });
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it("warns on root phase shorthand and does not lift it onto root", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const { slots } = splitMotionRootMap({
      hoverIn: { y: -4 },
    } as never);
    expect(error).toHaveBeenCalled();
    expect(slots?.root).toBeUndefined();
    expect(slots?.hoverIn).toEqual({ y: -4 });
    error.mockRestore();
  });
});

describe("mergeMotionStates", () => {
  it("merges per-mode slots; override wins", () => {
    expect(
      mergeMotionStates(
        { loading: { root: { autoAlpha: 0.5 }, title: { y: -2 } } },
        { loading: { root: { autoAlpha: 0.8 } }, success: { root: { y: 0 } } })).toEqual({
      loading: { root: { autoAlpha: 0.8 }, title: { y: -2 } },
      success: { root: { y: 0 } },
    });
  });
});

describe("mergeMotionRootSiblings", () => {
  it("merges events and states; local wins", () => {
    const ping = () => {};
    const shake = () => {};
    expect(
      mergeMotionRootSiblings(
        {
          events: { "checkout:saving": ping },
          states: { loading: { root: { autoAlpha: 0.5 } } },
        },
        {
          events: { "checkout:error": shake },
          states: { loading: { title: { y: -2 } } },
        })).toEqual({
      events: { "checkout:saving": ping, "checkout:error": shake },
      states: { loading: { root: { autoAlpha: 0.5 }, title: { y: -2 } } },
    });
  });
});

describe("remapMotionStateSlots", () => {
  it("renames indicator keys and drops chrome slots", () => {
    expect(
      remapMotionStateSlots(
        {
          loading: {
            indicator: { scale: 1.04 },
            label: { autoAlpha: 0.7 },
            fill: { autoAlpha: 0.5 },
          },
        },
        { indicator: "root", indicatorFill: "fill", indicatorMark: "mark" })).toEqual({
      loading: { root: { scale: 1.04 }, fill: { autoAlpha: 0.5 } },
    });
  });
});
