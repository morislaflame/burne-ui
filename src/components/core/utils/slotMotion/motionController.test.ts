import { describe, expect, it, vi } from "vitest";

import { gsap } from "@/components/core/utils/gsapMotion";
import { MOTION_CONFIG_DEFAULTS } from "@/components/core/utils/motionConfig";

import { createMotionScopeController } from "./createMotionScope";
import {
  attachMotionController,
  createMotionController,
  createMotionControllerFromScope,
} from "./motionController";
import type { MotionContext } from "./slotMotionTypes";

function fakeEl(name: string): HTMLElement {
  return { id: name, style: { willChange: "", transform: "" } } as unknown as HTMLElement;
}

function scopeWithRoot(played: string[] = []) {
  const scope = createMotionScopeController({
    getRootMotion: () => ({
      root: {
        hoverIn: (ctx: MotionContext) => {
          played.push(`hoverIn:${ctx.el.id}`);
        },
        hoverOut: (ctx: MotionContext) => {
          played.push(`hoverOut:${ctx.el.id}`);
        },
      },
      title: {
        hoverIn: (ctx: MotionContext) => {
          played.push(`title:${ctx.el.id}`);
        },
      },
    }),
    getDefaults: () => undefined,
    getParams: () => ({}),
    getConfig: () => MOTION_CONFIG_DEFAULTS,
  });
  const root = fakeEl("root");
  const title = fakeEl("title");
  scope.registerTarget("root", root);
  scope.registerTarget("title", title);
  return { scope, root, title, played };
}

describe("MotionController", () => {
  it("playSlot plays the named slot; play defaults to root", () => {
    const { scope, played } = scopeWithRoot();
    const controller = createMotionControllerFromScope(scope);

    controller.play("hoverIn");
    controller.playSlot("title", "hoverIn");

    expect(played).toEqual(["hoverIn:root", "title:title"]);
  });

  it("createMotionController is inert until attach", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const { scope, played } = scopeWithRoot();
    const controller = createMotionController();

    const idle = controller.play("hoverIn");
    expect(idle.status).toBe("cancelled");
    expect(played).toEqual([]);

    attachMotionController(controller, scope);
    controller.play("hoverIn");
    expect(played).toEqual(["hoverIn:root"]);

    attachMotionController(controller, null);
    controller.play("hoverIn");
    expect(played).toEqual(["hoverIn:root"]);
    error.mockRestore();
  });

  it("missing target and unknown event skip with a dev error", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { scope } = scopeWithRoot();
    const controller = createMotionControllerFromScope(scope);

    const missing = controller.playSlot("nope", "hoverIn");
    expect(missing.status).toBe("cancelled");

    const unknown = controller.play("checkout:saving" as "hoverIn");
    expect(unknown.status).toBe("skipped");

    expect(error).toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
    error.mockRestore();
    warn.mockRestore();
  });

  it("playAll of an unknown event skips instead of throwing", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { scope } = scopeWithRoot();
    const controller = createMotionControllerFromScope(scope);

    const { runs } = await controller.playAll("checkout:saving" as "hoverIn");
    expect(runs).toHaveLength(1);
    expect(runs[0]?.status).toBe("skipped");
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("playAll hits every live instance and skip disposed", async () => {
    const played: string[] = [];
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        cell: {
          hoverIn: (ctx: MotionContext) => {
            played.push(ctx.el.id);
          },
        },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    const a = fakeEl("a");
    const b = fakeEl("b");
    const c = fakeEl("c");
    scope.register({ id: Symbol("a"), slot: "cell", node: a });
    const disposeB = scope.register({ id: Symbol("b"), slot: "cell", node: b });
    scope.register({ id: Symbol("c"), slot: "cell", node: c });
    disposeB();

    const controller = createMotionControllerFromScope(scope);
    const { runs } = await controller.playAll("hoverIn");

    expect(played).toEqual(["a", "c"]);
    expect(runs).toHaveLength(2);
  });

  it("a later play() aborts an in-flight playAll stagger", async () => {
    vi.useFakeTimers();
    const played: string[] = [];
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        cell: {
          hoverIn: (ctx: MotionContext) => {
            played.push(`in:${ctx.el.id}`);
          },
        },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    scope.register({ id: Symbol("a"), slot: "cell", node: fakeEl("a") });
    scope.register({ id: Symbol("b"), slot: "cell", node: fakeEl("b") });
    const controller = createMotionControllerFromScope(scope);

    const pending = controller.playAll("hoverIn", { stagger: 0.1 });
    expect(played).toEqual(["in:a"]);
    controller.playSlot("cell", "hoverIn", { el: scope.getTarget("cell") });
    await vi.advanceTimersByTimeAsync(200);
    await pending;
    expect(played).toEqual(["in:a", "in:a"]);
    vi.useRealTimers();
  });

  it("playAll stagger delays later instances", async () => {
    vi.useFakeTimers();
    const played: string[] = [];
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        cell: {
          hoverIn: (ctx: MotionContext) => {
            played.push(ctx.el.id);
          },
        },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    scope.register({ id: Symbol("a"), slot: "cell", node: fakeEl("a") });
    scope.register({ id: Symbol("b"), slot: "cell", node: fakeEl("b") });
    const controller = createMotionControllerFromScope(scope);

    const pending = controller.playAll("hoverIn", { stagger: 0.1 });
    expect(played).toEqual(["a"]);
    await vi.advanceTimersByTimeAsync(100);
    await pending;
    expect(played).toEqual(["a", "b"]);
    vi.useRealTimers();
  });

  it("set snaps compositor vars without a MotionRun", () => {
    const set = vi.spyOn(gsap, "set");
    const { scope, root } = scopeWithRoot();
    const controller = createMotionControllerFromScope(scope);

    controller.set("root", { y: -4, rotation: 8 });

    expect(set).toHaveBeenCalledWith(root, expect.objectContaining({ y: -4, rotation: 8, force3D: false }));
    set.mockRestore();
  });

  it("cancel slot kills that target; cancel() kills the scope", () => {
    const killed: string[] = [];
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        root: {
          hoverIn: (ctx: MotionContext) => {
            ctx.onCleanup(() => killed.push(`root:${ctx.el.id}`));
            return { kill() {} };
          },
        },
        title: {
          hoverIn: (ctx: MotionContext) => {
            ctx.onCleanup(() => killed.push(`title:${ctx.el.id}`));
            return { kill() {} };
          },
        },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    scope.registerTarget("root", fakeEl("root"));
    scope.registerTarget("title", fakeEl("title"));
    const controller = createMotionControllerFromScope(scope);

    const rootRun = controller.play("hoverIn");
    expect(rootRun.status).toBe("running");
    controller.cancel("root");
    expect(rootRun.status).toBe("cancelled");
    expect(killed).toEqual(["root:root"]);

    const titleRun = controller.playSlot("title", "hoverIn");
    controller.cancel();
    expect(titleRun.status).toBe("cancelled");
    expect(killed).toEqual(["root:root", "title:title"]);
  });

  it("external signal cancels the run", () => {
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        root: {
          hoverIn: (ctx: MotionContext) => {
            ctx.onCleanup(() => {});
            return { kill() {} };
          },
        },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    scope.registerTarget("root", fakeEl("root"));
    const controller = createMotionControllerFromScope(scope);
    const abort = new AbortController();
    const run = controller.play("hoverIn", { signal: abort.signal });
    abort.abort();
    expect(run.status).toBe("cancelled");
  });

  it("scope.controller is the same API as createMotionControllerFromScope", () => {
    const { scope, played } = scopeWithRoot();
    scope.controller.playSlot("title", "hoverIn");
    expect(played).toEqual(["title:title"]);
  });

  it("playAll exclude skips named slots", async () => {
    const { scope, played } = scopeWithRoot();
    const controller = createMotionControllerFromScope(scope);
    await controller.playAll("hoverIn", { exclude: ["root"] });
    expect(played).toEqual(["title:title"]);
  });

  it("plays namespaced events from motion.events", () => {
    const played: string[] = [];
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        root: { hoverIn: false },
        events: {
          "checkout:saving": (ctx: MotionContext) => {
            played.push(`saving:${ctx.el.id}:${ctx.phase}`);
          },
        },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    scope.registerTarget("root", fakeEl("root"));
    scope.registerTarget("title", fakeEl("title"));
    const controller = createMotionControllerFromScope(scope);

    controller.play("checkout:saving");
    controller.playSlot("title", "checkout:saving");

    expect(played).toEqual(["saving:root:checkout:saving", "saving:title:checkout:saving"]);
  });

  it("playAll plays the same event factory on every live node", async () => {
    const played: string[] = [];
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        root: { hoverIn: false },
        title: { hoverIn: false },
        events: {
          "notify:ping": (ctx: MotionContext) => {
            played.push(`${ctx.el.id}:${ctx.phase}`);
          },
        },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    scope.registerTarget("root", fakeEl("root"));
    scope.registerTarget("title", fakeEl("title"));
    const controller = createMotionControllerFromScope(scope);

    const { runs } = await controller.playAll("notify:ping");
    expect(played).toEqual(["root:notify:ping", "title:notify:ping"]);
    expect(runs).toHaveLength(2);
  });

  it("false event skips without a missing-target cancel", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const played: string[] = [];
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        root: { hoverIn: false },
        events: { "notify:ping": false },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    scope.registerTarget("root", fakeEl("root"));
    const controller = createMotionControllerFromScope(scope);

    const run = controller.play("notify:ping");
    expect(run.status).toBe("finished");
    expect(played).toEqual([]);
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it("peels events so they are not a motion slot", () => {
    const scope = createMotionScopeController({
      getRootMotion: () => ({
        root: { hoverIn: false },
        events: { "checkout:saving": false },
      }),
      getDefaults: () => undefined,
      getParams: () => ({}),
    });
    expect(scope.getRootMotion()).toEqual({ root: { hoverIn: false } });
    expect(scope.getEvents()?.["checkout:saving"]).toBe(false);
  });
});
