import { describe, expect, it } from "vitest";

import { createMotionScopeController } from "./createMotionScope";
import type { MotionContext } from "./slotMotionTypes";
import { hasPointerPhases, slotHasPointerPhases } from "./useSlotLifecycle";

function fakeEl(name: string): HTMLElement {
  return { id: name, style: { willChange: "" } } as unknown as HTMLElement;
}

describe("hasPointerPhases", () => {
  it("is true when any pointer phase is set", () => {
    expect(hasPointerPhases(undefined)).toBe(false);
    expect(hasPointerPhases({})).toBe(false);
    expect(hasPointerPhases({ enter: false })).toBe(false);
    expect(hasPointerPhases({ hoverIn: { y: -2 } })).toBe(true);
    expect(hasPointerPhases({ hoverOut: false })).toBe(true);
    expect(hasPointerPhases({ pressIn: "pressSqueeze" })).toBe(true);
    expect(hasPointerPhases({ pressOut: false })).toBe(true);
  });
});

describe("slotHasPointerPhases", () => {
  it("reads the named slot from a motion map", () => {
    expect(slotHasPointerPhases(undefined, "root")).toBe(false);
    expect(slotHasPointerPhases({ root: { enter: false } }, "root")).toBe(false);
    expect(slotHasPointerPhases({ root: { hoverIn: { y: -1 } } }, "root")).toBe(true);
    expect(slotHasPointerPhases({ root: { hoverIn: { y: -1 } } }, "title")).toBe(false);
  });
});

describe("change-phase host contract", () => {
  it("plays change on the host slot and broadcasts excluding fill", async () => {
    const played: string[] = [];
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        track: {
          change: (ctx: MotionContext) => {
            played.push(`track:${ctx.el.id}`);
          },
        },
        fill: {
          change: (ctx: MotionContext) => {
            played.push(`fill:${ctx.el.id}`);
          },
        },
        header: {
          change: (ctx: MotionContext) => {
            played.push(`header:${ctx.el.id}`);
          },
        },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    const track = fakeEl("track");
    scope.register({ id: Symbol("track"), slot: "track", node: track });
    scope.register({ id: Symbol("fill"), slot: "fill", node: fakeEl("fill") });
    scope.register({ id: Symbol("header"), slot: "header", node: fakeEl("header") });

    scope.play("track", "change", { el: track });
    await scope.playBroadcast("change", { exclude: ["track", "fill"] });

    expect(played).toEqual(["track:track", "header:header"]);
  });

  it("does not play change when the resolved value is false or missing", async () => {
    const played: string[] = [];
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        track: { change: false },
        fill: {
          change: (ctx: MotionContext) => {
            played.push(ctx.el.id);
          },
        },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    const track = fakeEl("track");
    scope.register({ id: Symbol("track"), slot: "track", node: track });
    scope.register({ id: Symbol("fill"), slot: "fill", node: fakeEl("fill") });

    const value = scope.resolve("track", "change");
    if (value !== undefined && value !== false) {
      scope.play("track", "change", { el: track });
    }
    await scope.playBroadcast("change", { exclude: ["track", "fill"] });

    expect(played).toEqual([]);
  });
});
