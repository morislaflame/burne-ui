import { describe, expect, it, vi } from "vitest";

import { gsap } from "@/components/core/utils/gsapMotion";
import { MOTION_CONFIG_DEFAULTS } from "@/components/core/utils/motionConfig";

import { createMotionScopeController } from "./createMotionScope";
import { createMotionControllerFromScope } from "./motionController";
import { createMotionGroup } from "./motionGroup";
import type { MotionContext } from "./slotMotionTypes";

function fakeEl(name: string): HTMLElement {
  return { id: name, style: { willChange: "", transform: "" } } as unknown as HTMLElement;
}

function flushGsap(): void {
  gsap.ticker.tick();
}

function memberWithSlots(played: string[], prefix: string) {
  const scope = createMotionScopeController({
    getRootMotion: () => ({
      root: {
        hoverIn: (ctx: MotionContext) => {
          played.push(`${prefix}:root:${ctx.el.id}`);
        },
      },
      title: {
        hoverIn: (ctx: MotionContext) => {
          played.push(`${prefix}:title:${ctx.el.id}`);
        },
      },
    }),
    getDefaults: () => undefined,
    getParams: () => ({}),
    getConfig: () => MOTION_CONFIG_DEFAULTS,
  });
  const root = fakeEl(`${prefix}-root`);
  const title = fakeEl(`${prefix}-title`);
  scope.registerTarget("root", root);
  scope.registerTarget("title", title);
  return { controller: createMotionControllerFromScope(scope), root, title, scope };
}

describe("MotionGroup", () => {
  it("register / unregister and ids follow Map insertion order", () => {
    const group = createMotionGroup();
    const a = memberWithSlots([], "a");
    const b = memberWithSlots([], "b");

    const disposeA = group.register("alert", a.controller);
    group.register("card", b.controller);

    expect(group.has("alert")).toBe(true);
    expect(group.get("alert")).toBe(a.controller);
    expect(group.ids()).toEqual(["alert", "card"]);

    disposeA();
    expect(group.has("alert")).toBe(false);
    expect(group.ids()).toEqual(["card"]);

    group.unregister("card");
    expect(group.ids()).toEqual([]);
  });

  it("disposer does not delete a replaced member", () => {
    const group = createMotionGroup();
    const first = memberWithSlots([], "a");
    const second = memberWithSlots([], "b");
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const disposeFirst = group.register("alert", first.controller);
    group.register("alert", second.controller);
    disposeFirst();

    expect(group.get("alert")).toBe(second.controller);
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it("getTarget / getTargets delegate to the child controller", () => {
    const group = createMotionGroup();
    const a = memberWithSlots([], "a");
    group.register("alert", a.controller);

    expect(group.getTarget("alert", "root")).toBe(a.root);
    expect(group.getTarget("alert", "title")).toBe(a.title);
    expect(group.getTargets("alert", "title")).toEqual([a.title]);
    expect("querySelector" in group).toBe(false);
  });

  it("play and playSlot route to the named member", () => {
    const played: string[] = [];
    const group = createMotionGroup();
    const a = memberWithSlots(played, "a");
    const b = memberWithSlots(played, "b");
    group.register("alert", a.controller);
    group.register("card", b.controller);

    group.play("alert", "hoverIn");
    group.playSlot("card", "title", "hoverIn");

    expect(played).toEqual(["a:root:a-root", "b:title:b-title"]);
  });

  it("missing member and empty id skip with a dev error", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const group = createMotionGroup();

    expect(group.play("nope", "hoverIn").status).toBe("cancelled");
    expect(group.play("", "hoverIn").status).toBe("cancelled");
    expect(group.getTarget("nope", "root")).toBeNull();
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it("playAll hits each member; stagger is aborted by a later play", async () => {
    vi.useFakeTimers();
    const played: string[] = [];
    const group = createMotionGroup();
    const a = memberWithSlots(played, "a");
    const b = memberWithSlots(played, "b");
    group.register("alert", a.controller);
    group.register("card", b.controller);

    const pending = group.playAll("hoverIn", { stagger: 0.1 });
    expect(played).toEqual(["a:root:a-root"]);
    group.play("card", "hoverIn");
    await vi.advanceTimersByTimeAsync(200);
    await pending;
    expect(played).toEqual(["a:root:a-root", "b:root:b-root"]);
    vi.useRealTimers();
  });

  it("playAll members filter skips unknown ids", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const played: string[] = [];
    const group = createMotionGroup();
    const a = memberWithSlots(played, "a");
    const b = memberWithSlots(played, "b");
    group.register("alert", a.controller);
    group.register("card", b.controller);

    await group.playAll("hoverIn", { members: ["card", "missing"] });
    expect(played).toEqual(["b:root:b-root"]);
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it("timeline sequences member plays at GSAP positions", async () => {
    const played: string[] = [];
    const group = createMotionGroup();
    const a = memberWithSlots(played, "a");
    const b = memberWithSlots(played, "b");
    group.register("alert", a.controller);
    group.register("card", b.controller);

    const tl = group.timeline();
    tl.play("alert", "hoverIn", { position: 0 });
    tl.playSlot("card", "title", "hoverIn", { position: 0 });
    await Promise.resolve();
    flushGsap();

    expect(played).toEqual(["a:root:a-root", "b:title:b-title"]);
    tl.kill();
  });

  it("timeline kill before start skips scheduled plays", async () => {
    const played: string[] = [];
    const group = createMotionGroup();
    const a = memberWithSlots(played, "a");
    const b = memberWithSlots(played, "b");
    group.register("alert", a.controller);
    group.register("card", b.controller);

    const tl = group.timeline();
    tl.play("alert", "hoverIn", { position: 0 });
    tl.play("card", "hoverIn", { position: 0 });
    tl.kill();
    await Promise.resolve();
    flushGsap();
    expect(played).toEqual([]);
  });

  it("timeline kill cancels started runs", async () => {
    const played: string[] = [];
    const group = createMotionGroup();
    const looping = createMotionScopeController({
      getRootMotion: () => ({
        root: {
          hoverIn: (ctx: MotionContext) => {
            played.push(`loop:${ctx.el.id}`);
            ctx.onCleanup(() => played.push("cleanup"));
            return { kill() {} };
          },
        },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
      getConfig: () => MOTION_CONFIG_DEFAULTS,
    });
    looping.registerTarget("root", fakeEl("loop"));
    group.register("alert", createMotionControllerFromScope(looping));

    const tl = group.timeline();
    tl.play("alert", "hoverIn", { position: 0 });
    await Promise.resolve();
    flushGsap();
    expect(played).toEqual(["loop:loop"]);
    tl.kill();
    expect(played).toEqual(["loop:loop", "cleanup"]);
  });

  it("warns when the same controller is registered under two ids", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const group = createMotionGroup();
    const a = memberWithSlots([], "a");
    group.register("alert", a.controller);
    group.register("card", a.controller);
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});
