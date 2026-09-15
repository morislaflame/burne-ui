import { describe, expect, it, vi } from "vitest";

import { createMotionScopeController } from "./createMotionScope";
import { nextMotionStateTransition, playMotionStateTransition, snapshotMotionPayload } from "./playMotionState";
import type { MotionContext } from "./slotMotionTypes";

function fakeEl(name: string): HTMLElement {
  return { id: name, style: { willChange: "" } } as unknown as HTMLElement;
}

describe("nextMotionStateTransition", () => {
  it("skips the first commit unless playInitial", () => {
    expect(
      nextMotionStateTransition(undefined, "idle", { isFirst: true, playInitial: false }),
    ).toBeNull();
    expect(
      nextMotionStateTransition(undefined, "idle", { isFirst: true, playInitial: true }),
    ).toEqual({ from: undefined, to: "idle" });
  });

  it("skips the same state", () => {
    expect(
      nextMotionStateTransition("loading", "loading", { isFirst: false, playInitial: false }),
    ).toBeNull();
  });

  it("plays a change", () => {
    expect(
      nextMotionStateTransition("idle", "loading", { isFirst: false, playInitial: false }),
    ).toEqual({ from: "idle", to: "loading" });
  });

  it("skips an empty next", () => {
    expect(
      nextMotionStateTransition("idle", undefined, { isFirst: false, playInitial: false }),
    ).toBeNull();
  });
});

describe("playMotionStateTransition", () => {
  it("plays listed slots and skips false / missing targets", () => {
    const seen: string[] = [];
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        states: {
          loading: {
            root: (ctx: MotionContext) => {
              seen.push(`root:${String(ctx.fromState)}->${ctx.toState}:${String(ctx.payload)}`);
            },
            title: false,
            missing: { y: -1 },
          },
        },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    const root = fakeEl("root");
    const extra = fakeEl("extra");
    scope.register({ id: Symbol("root"), slot: "root", node: root });
    scope.register({ id: Symbol("extra"), slot: "root", node: extra });

    playMotionStateTransition(scope, "idle", "loading", "snap");

    expect(seen).toEqual(["root:idle->loading:snap", "root:idle->loading:snap"]);
  });

  it("warns when the state is missing", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const scope = createMotionScopeController({
      getRootMotion: () => ({ root: { hoverIn: { y: -1 } } }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    playMotionStateTransition(scope, undefined, "nope");
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it("copies a plain object so later mutation does not change ctx.payload", () => {
    let seen: { n?: number } | undefined;
    const payload = { n: 1 };
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        states: {
          error: {
            root: (ctx: MotionContext) => {
              seen = ctx.payload as { n?: number };
            },
          },
        },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    scope.register({ id: Symbol("root"), slot: "root", node: fakeEl("root") });

    playMotionStateTransition(scope, "idle", "error", payload);
    payload.n = 2;

    expect(seen).toEqual({ n: 1 });
    expect(seen).not.toBe(payload);
  });
});

describe("snapshotMotionPayload", () => {
  it("passes through primitives and nullish", () => {
    expect(snapshotMotionPayload(undefined)).toBeUndefined();
    expect(snapshotMotionPayload(null)).toBeNull();
    expect(snapshotMotionPayload("snap")).toBe("snap");
    expect(snapshotMotionPayload(3)).toBe(3);
  });

  it("shallow-copies arrays and plain objects", () => {
    const list = ["a"];
    const copyList = snapshotMotionPayload(list) as string[];
    expect(copyList).toEqual(["a"]);
    expect(copyList).not.toBe(list);
    list.push("b");
    expect(copyList).toEqual(["a"]);

    const box = { n: 1 };
    const copyBox = snapshotMotionPayload(box) as { n: number };
    expect(copyBox).toEqual({ n: 1 });
    expect(copyBox).not.toBe(box);
    expect(Object.isFrozen(copyList)).toBe(true);
    expect(Object.isFrozen(copyBox)).toBe(true);
    expect(() => {
      copyList.push("c");
    }).toThrow(TypeError);
    expect(() => {
      copyBox.n = 2;
    }).toThrow(TypeError);
  });

  it("leaves class instances as the same reference", () => {
    const when = new Date("2026-09-07");
    expect(snapshotMotionPayload(when)).toBe(when);
  });
});
