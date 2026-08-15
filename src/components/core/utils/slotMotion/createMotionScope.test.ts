import { describe, expect, it, vi } from "vitest";

import { gsap } from "@/components/core/utils/gsapMotion";
import { MOTION_CONFIG_DEFAULTS } from "@/components/core/utils/motionConfig";

import { createMotionRegistry } from "./createMotionRegistry";
import { createMotionScopeController, hideNestedEnterSlots } from "./createMotionScope";
import type { MotionContext } from "./slotMotionTypes";

function fakeEl(name: string): HTMLElement {
  return { id: name, style: { willChange: "" } } as unknown as HTMLElement;
}

describe("createMotionRegistry", () => {
  it("keeps two instances of the same slot", () => {
    const registry = createMotionRegistry();
    const a = fakeEl("a");
    const b = fakeEl("b");
    const idA = Symbol("a");
    const idB = Symbol("b");
    registry.register({ id: idA, slot: "icon", node: a });
    registry.register({ id: idB, slot: "icon", node: b });

    expect(registry.getTarget("icon")).toBe(a);
    expect(registry.getTargets("icon")).toEqual([a, b]);
    expect(registry.getRegistrations("icon")).toHaveLength(2);
  });

  it("disposer removes only its own registration", () => {
    const registry = createMotionRegistry();
    const a = fakeEl("a");
    const b = fakeEl("b");
    const disposeA = registry.register({ id: Symbol("a"), slot: "cell", node: a });
    registry.register({ id: Symbol("b"), slot: "cell", node: b });

    disposeA();

    expect(registry.getTargets("cell")).toEqual([b]);
    expect(registry.getTarget("cell")).toBe(b);
    disposeA();
    expect(registry.getTargets("cell")).toEqual([b]);
  });

  it("setRef(null) on one instance does not drop a sibling", () => {
    const registry = createMotionRegistry();
    const a = fakeEl("a");
    const b = fakeEl("b");
    const idA = Symbol("a");
    const idB = Symbol("b");
    registry.register({ id: idA, slot: "item", node: a });
    registry.register({ id: idB, slot: "item", node: b });

    registry.register({ id: idA, slot: "item", node: null });

    expect(registry.getTargets("item")).toEqual([b]);
    expect(registry.find("item", a)).toBeUndefined();
    expect(registry.find("item", b)?.node).toBe(b);
  });

  it("updates motion on one instance without touching the sibling", () => {
    const registry = createMotionRegistry();
    const a = fakeEl("a");
    const b = fakeEl("b");
    const idA = Symbol("a");
    const idB = Symbol("b");
    registry.register({ id: idA, slot: "icon", node: a, motion: { check: false } });
    registry.register({ id: idB, slot: "icon", node: b, motion: { check: "selectionFill" } });

    registry.register({ id: idA, slot: "icon", node: a, motion: { check: "selectionMark" } });

    expect(registry.find("icon", a)?.motion).toEqual({ check: "selectionMark" });
    expect(registry.find("icon", b)?.motion).toEqual({ check: "selectionFill" });
  });
});

describe("createMotionScopeController", () => {
  it("registerTarget(null) does not remove a part registration of the same slot", () => {
    const scope = createMotionScopeController({
      getRootMotion: () => undefined,
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    const host = fakeEl("host");
    const part = fakeEl("part");
    scope.registerTarget("chevron", host);
    const disposePart = scope.register({ id: Symbol("part"), slot: "chevron", node: part });

    scope.registerTarget("chevron", null);

    expect(scope.getTargets("chevron")).toEqual([part]);
    disposePart();
    expect(scope.getTargets("chevron")).toEqual([]);
  });

  it("playBroadcast plays every live instance of a repeated slot", async () => {
    const played: HTMLElement[] = [];
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        icon: {
          check: (ctx: MotionContext) => {
            played.push(ctx.el);
          },
        },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    const a = fakeEl("a");
    const b = fakeEl("b");
    scope.register({ id: Symbol("a"), slot: "icon", node: a });
    scope.register({ id: Symbol("b"), slot: "icon", node: b });

    await scope.playBroadcast("check");

    expect(played).toEqual([a, b]);
  });

  it("playBroadcast skips a disposed instance and still plays the sibling", async () => {
    const played: HTMLElement[] = [];
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        cell: {
          enter: (ctx: MotionContext) => {
            played.push(ctx.el);
          },
        },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    const a = fakeEl("a");
    const b = fakeEl("b");
    const disposeA = scope.register({ id: Symbol("a"), slot: "cell", node: a });
    scope.register({ id: Symbol("b"), slot: "cell", node: b });
    disposeA();

    await scope.playBroadcast("enter");

    expect(played).toEqual([b]);
  });

  it("local play uses the given el, not the first registration", () => {
    const played: HTMLElement[] = [];
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        tab: {
          hoverIn: (ctx: MotionContext) => {
            played.push(ctx.el);
          },
        },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    const first = fakeEl("first");
    const second = fakeEl("second");
    scope.register({ id: Symbol("1"), slot: "tab", node: first });
    scope.register({ id: Symbol("2"), slot: "tab", node: second });

    scope.play("tab", "hoverIn", { el: second });

    expect(played).toEqual([second]);
  });

  it("factory ctx.getTargets returns all instances; ctx.targets is unique/first", () => {
    let seen: {
      targetsTitle: HTMLElement | null | undefined;
      allTitles: readonly HTMLElement[];
    } | null = null;
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        root: {
          hoverIn: (ctx: MotionContext) => {
            seen = {
              targetsTitle: ctx.targets.title,
              allTitles: ctx.getTargets("title"),
            };
          },
        },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    const root = fakeEl("root");
    const t1 = fakeEl("t1");
    const t2 = fakeEl("t2");
    scope.register({ id: Symbol("root"), slot: "root", node: root });
    scope.register({ id: Symbol("t1"), slot: "title", node: t1 });
    scope.register({ id: Symbol("t2"), slot: "title", node: t2 });

    scope.play("root", "hoverIn", { el: root });

    expect(seen).toEqual({
      targetsTitle: t1,
      allTitles: [t1, t2],
    });
  });

  it("exclude skips a slot name across all of its instances", async () => {
    const played: string[] = [];
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        overlay: {
          leave: (ctx: MotionContext) => {
            played.push(`overlay:${ctx.el.id}`);
          },
        },
        title: {
          leave: (ctx: MotionContext) => {
            played.push(`title:${ctx.el.id}`);
          },
        },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    scope.register({ id: Symbol("o"), slot: "overlay", node: fakeEl("o") });
    scope.register({ id: Symbol("t1"), slot: "title", node: fakeEl("t1") });
    scope.register({ id: Symbol("t2"), slot: "title", node: fakeEl("t2") });

    await scope.playBroadcast("leave", { exclude: ["overlay"] });

    expect(played).toEqual(["title:t1", "title:t2"]);
  });

  it("does not play the same node twice when host and part both register it", async () => {
    const played: HTMLElement[] = [];
    const scope = createMotionScopeController({
      getRootMotion: () => undefined,
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    const node = fakeEl("chevron");
    scope.registerTarget("chevron", node);
    scope.register({
      id: Symbol("part"),
      slot: "chevron",
      node,
      motion: {
        enter: (ctx: MotionContext) => {
          played.push(ctx.el);
        },
      },
    });

    await scope.playBroadcast("enter");

    expect(played).toEqual([node]);
  });

  it("passes getConfig() into MotionContext so play does not read a sibling scope", () => {
    const scoped = { ...MOTION_CONFIG_DEFAULTS, interactiveDuration: 90 };
    const seen: number[] = [];
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        root: {
          hoverIn: (ctx: MotionContext) => {
            seen.push(ctx.config.interactiveDuration);
          },
        },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
      getConfig: () => scoped,
    });
    const el = fakeEl("root");
    scope.registerTarget("root", el);
    scope.play("root", "hoverIn");
    expect(seen).toEqual([90]);
  });

  it("hideNestedEnterSlots hides first-paint nested enter and skips the host", () => {
    const setSpy = vi.spyOn(gsap, "set").mockImplementation(() => gsap as unknown as gsap.core.Tween);
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        overlay: { enter: "modalOverlayEnter" },
        title: { enter: { recipe: "myFade", firstPaint: "hidden" } },
        description: { enter: () => {} },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    const overlay = fakeEl("overlay");
    const title = fakeEl("title");
    const description = fakeEl("description");
    scope.register({ id: Symbol("o"), slot: "overlay", node: overlay });
    scope.register({ id: Symbol("t"), slot: "title", node: title });
    scope.register({ id: Symbol("d"), slot: "description", node: description });

    hideNestedEnterSlots(scope, ["overlay", "panel"]);

    expect(setSpy).toHaveBeenCalledTimes(1);
    expect(setSpy.mock.calls[0][0]).toBe(title);
    expect(setSpy.mock.calls[0][1]).toEqual(
      expect.objectContaining({ autoAlpha: 0, force3D: false }),
    );
    expect(setSpy.mock.calls.some((call) => call[0] === overlay)).toBe(false);
    expect(setSpy.mock.calls.some((call) => call[0] === description)).toBe(false);
    setSpy.mockRestore();
  });
});
