import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";

import { gsap, registerMotionPlugins } from "@/components/core/utils/gsapMotion";
import { MOTION_CONFIG_DEFAULTS } from "@/components/core/utils/motionConfig";

import { playDeclarativeMotion, resolveMotionDelay, resolveMotionReplay } from "./motionTween";
import { runMotionPhase } from "./runMotionPhase";
import { isMotionAbortError, type MotionAnimation, type MotionContext, type MotionVars } from "./slotMotionTypes";

function fakeAnimation(): MotionAnimation & { triggerComplete: () => void } {
  let onComplete: ((...args: unknown[]) => unknown) | null = null;
  return {
    kill: vi.fn(),
    eventCallback: ((type: string, callback?: ((...args: unknown[]) => unknown) | null) => {
      if (type !== "onComplete") return undefined;
      if (callback === undefined) return onComplete;
      onComplete = callback;
      return undefined;
    }) as MotionAnimation["eventCallback"],
    triggerComplete: () => {
      onComplete?.();
    },
  };
}

function fakeEl(): HTMLElement {
  return { style: { willChange: "" } } as HTMLElement;
}

describe("resolveMotionReplay", () => {
  it("defaults lifecycle phases to current", () => {
    expect(resolveMotionReplay("hoverIn", { yoyo: true })).toBe("current");
    expect(resolveMotionReplay("enter", {})).toBe("current");
  });

  it("replays yoyo app events from rest unless overridden", () => {
    expect(resolveMotionReplay("notify:ping", { yoyo: true })).toBe("rest");
    expect(resolveMotionReplay("notify:ping", { yoyo: true, replay: "current" })).toBe("current");
    expect(resolveMotionReplay("notify:up", { replay: "rest" })).toBe("rest");
    expect(resolveMotionReplay("checkout:success", {})).toBe("current");
  });
});

describe("playDeclarativeMotion", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("resolves delay: expandDuration to seconds on a declarative tween", () => {
    const toSpy = vi.spyOn(gsap, "to");
    playDeclarativeMotion(
      fakeEl(),
      { y: -4, duration: 0.28, delay: "expandDuration" },
      { phase: "enter", reduced: false, config: MOTION_CONFIG_DEFAULTS },
    );
    expect(toSpy.mock.calls[0]?.[1]).toMatchObject({
      delay: MOTION_CONFIG_DEFAULTS.expandDuration / 1000,
    });
  });

  it("resolves delay: expand as expandDuration on to and fromTo", () => {
    const toSpy = vi.spyOn(gsap, "to");
    const fromToSpy = vi.spyOn(gsap, "fromTo");
    const expandDelay = MOTION_CONFIG_DEFAULTS.expandDuration / 1000;
    playDeclarativeMotion(
      fakeEl(),
      { y: -4, duration: 0.28, delay: "expand" },
      { phase: "enter", reduced: false, config: MOTION_CONFIG_DEFAULTS },
    );
    expect(toSpy.mock.calls[0]?.[1]).toMatchObject({ delay: expandDelay });
    playDeclarativeMotion(
      fakeEl(),
      { y: 8, autoAlpha: 0, duration: 0.28, delay: "expand", replay: "rest" },
      { phase: "enter", reduced: false, config: MOTION_CONFIG_DEFAULTS },
    );
    expect(fromToSpy.mock.calls[0]?.[2]).toMatchObject({
      delay: expandDelay,
      immediateRender: true,
    });
  });

  it("uses gsap.to from the current pose for hover vars", () => {
    const toSpy = vi.spyOn(gsap, "to");
    const fromToSpy = vi.spyOn(gsap, "fromTo");
    const el = fakeEl();

    playDeclarativeMotion(el, { y: -4, duration: 0.2 }, {
      phase: "hoverIn",
      reduced: false,
      config: MOTION_CONFIG_DEFAULTS,
    });

    expect(toSpy).toHaveBeenCalledTimes(1);
    expect(fromToSpy).not.toHaveBeenCalled();
    expect(toSpy.mock.calls[0]?.[1]).toMatchObject({
      y: -4,
      duration: 0.2,
      overwrite: "auto",
      force3D: false,
    });
  });

  it("uses fromTo from rest for yoyo app events", () => {
    const fromToSpy = vi.spyOn(gsap, "fromTo");
    const toSpy = vi.spyOn(gsap, "to");
    const el = fakeEl();

    playDeclarativeMotion(
      el,
      { y: -8, duration: 0.16, yoyo: true, repeat: 1 },
      { phase: "notify:ping", reduced: false, config: MOTION_CONFIG_DEFAULTS },
    );

    expect(fromToSpy).toHaveBeenCalledTimes(1);
    expect(toSpy).not.toHaveBeenCalled();
    expect(fromToSpy.mock.calls[0]?.[1]).toMatchObject({ y: 0 });
    expect(fromToSpy.mock.calls[0]?.[2]).toMatchObject({
      y: -8,
      yoyo: true,
      repeat: 1,
      overwrite: true,
      force3D: false,
    });
  });

  it("honors replay: rest on a lifecycle phase", () => {
    const fromToSpy = vi.spyOn(gsap, "fromTo");

    playDeclarativeMotion(
      fakeEl(),
      { y: -6, duration: 0.28, replay: "rest" },
      { phase: "hoverIn", reduced: false, config: MOTION_CONFIG_DEFAULTS },
    );

    expect(fromToSpy).toHaveBeenCalledTimes(1);
    expect(fromToSpy.mock.calls[0]?.[1]).toMatchObject({ y: 0 });
    expect(fromToSpy.mock.calls[0]?.[2]).toMatchObject({ overwrite: "auto" });
  });
});

describe("MotionContext tween helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("exposes fromRest / to / timeline on the factory context", () => {
    let ctx: MotionContext | undefined;
    runMotionPhase({
      el: fakeEl(),
      phase: "notify:ping",
      value: (motionCtx) => {
        ctx = motionCtx;
      },
      targets: {},
    });

    expect(typeof ctx?.fromRest).toBe("function");
    expect(typeof ctx?.to).toBe("function");
    expect(typeof ctx?.fromTo).toBe("function");
    expect(typeof ctx?.timeline).toBe("function");
    expect(typeof ctx?.wait).toBe("function");
    expect(typeof ctx?.sequence).toBe("function");
    expect(typeof ctx?.parallel).toBe("function");
    expect(typeof ctx?.onInterrupt).toBe("function");
    expect(typeof ctx?.onError).toBe("function");
  });

  it("wait resolves after seconds and rejects AbortError on cancel", async () => {
    vi.useFakeTimers();
    let waited = false;
    const ok = runMotionPhase({
      el: fakeEl(),
      phase: "notify:hold",
      value: async (ctx) => {
        await ctx.wait(0.4);
        waited = true;
      },
      targets: {},
    });
    await vi.advanceTimersByTimeAsync(399);
    expect(waited).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    await ok.finished;
    expect(waited).toBe(true);

    let aborted: unknown;
    const hold = runMotionPhase({
      el: fakeEl(),
      phase: "notify:hold",
      value: async (ctx) => {
        try {
          await ctx.wait(1);
        } catch (error) {
          aborted = error;
        }
      },
      targets: {},
    });
    hold.cancel("killed");
    await hold.finished;
    expect(isMotionAbortError(aborted)).toBe(true);
    expect(hold.status).toBe("cancelled");
  });

  it("sequence runs delay literals and waits for a returned tween", async () => {
    vi.useFakeTimers();
    const order: string[] = [];
    const tween = fakeAnimation();
    const run = runMotionPhase({
      el: fakeEl(),
      phase: "notify:stack",
      value: (ctx) =>
        ctx.sequence(
          () => {
            order.push("a");
          },
          0.12,
          () => {
            order.push("b");
            return tween;
          },
        ),
      targets: {},
    });

    expect(order).toEqual(["a"]);
    await vi.advanceTimersByTimeAsync(120);
    await Promise.resolve();
    expect(order).toEqual(["a", "b"]);
    tween.triggerComplete();
    await run.finished;
    expect(run.status).not.toBe("failed");
  });

  it("parallel starts every step before the slowest wait finishes", async () => {
    vi.useFakeTimers();
    const order: string[] = [];
    const run = runMotionPhase({
      el: fakeEl(),
      phase: "notify:stack",
      value: (ctx) =>
        ctx.parallel(
          async () => {
            await ctx.wait(0.2);
            order.push("slow");
          },
          () => {
            order.push("fast");
          },
        ),
      targets: {},
    });

    await Promise.resolve();
    expect(order).toEqual(["fast"]);
    await vi.advanceTimersByTimeAsync(200);
    await run.finished;
    expect(order).toEqual(["fast", "slow"]);
  });

  it("timeline.wait adds a duration gap without a transform target", () => {
    const timeline = {
      to: vi.fn(),
      fromTo: vi.fn(),
      add: vi.fn(),
      kill: vi.fn(),
      eventCallback: vi.fn(),
      repeat: vi.fn(),
    };
    vi.spyOn(gsap, "timeline").mockReturnValue(timeline as unknown as gsap.core.Timeline);

    runMotionPhase({
      el: fakeEl(),
      phase: "notify:stack",
      value: (ctx) => {
        ctx.timeline().wait(0.25);
      },
      targets: {},
    });

    expect(timeline.to).toHaveBeenCalledWith({}, { duration: 0.25, ease: "none" }, undefined);
  });

  it("fromRest restarts from identity and tracks the tween for cancel", () => {
    const fromToSpy = vi.spyOn(gsap, "fromTo");
    const tween = { kill: vi.fn() };
    fromToSpy.mockReturnValue(tween as unknown as gsap.core.Tween);

    const el = fakeEl();
    const run = runMotionPhase({
      el,
      phase: "notify:ping",
      value: (ctx) => ctx.fromRest({ y: -8, duration: 0.16, yoyo: true, repeat: 1 }),
      targets: {},
    });

    expect(fromToSpy).toHaveBeenCalledTimes(1);
    expect(fromToSpy.mock.calls[0]?.[1]).toMatchObject({ y: 0 });
    expect(fromToSpy.mock.calls[0]?.[2]).toMatchObject({
      y: -8,
      overwrite: true,
      force3D: false,
    });

    run.cancel();
    expect(tween.kill).toHaveBeenCalled();
  });

  it("kills a fromRest tween on another slot when the run is cancelled", () => {
    const fromToSpy = vi.spyOn(gsap, "fromTo");
    const tween = { kill: vi.fn() };
    fromToSpy.mockReturnValue(tween as unknown as gsap.core.Tween);

    const root = fakeEl();
    const title = fakeEl();
    const run = runMotionPhase({
      el: root,
      phase: "notify:attention",
      value: (ctx) => {
        ctx.fromRest(title, { y: -4, duration: 0.22 });
      },
      targets: { title },
    });

    run.cancel();
    expect(tween.kill).toHaveBeenCalled();
  });

  it("keeps stacked timeline tweens on the same node", () => {
    const el = fakeEl();
    runMotionPhase({
      el,
      phase: "notify:stack",
      value: (ctx) => {
        const tl = ctx.timeline();
        tl.fromRest(ctx.el, { y: -10, duration: 0.16, ease: "power2.out" }, 0);
        tl.to(ctx.el, { scale: 1.12, duration: 0.16, ease: "back.out(2)" }, 0.08);
        tl.to(ctx.el, { y: 0, scale: 1, duration: 0.22, ease: "power2.inOut" }, 0.28);
        return tl;
      },
      targets: {},
    });

    expect(gsap.getTweensOf(el).length).toBeGreaterThan(1);
  });

  it("accepts yoyo / replay on public MotionVars without layout keys", () => {
    const vars: MotionVars = {
      y: -8,
      duration: 0.16,
      yoyo: true,
      repeat: 1,
      replay: "rest",
    };
    expect(vars.yoyo).toBe(true);
    expectTypeOf<MotionVars>().toHaveProperty("yoyo");
    expectTypeOf<MotionVars>().toHaveProperty("replay");
    expectTypeOf<MotionVars>().not.toHaveProperty("rotation");
  });
});

describe("resolveMotionDelay", () => {
  it("passes numeric seconds through", () => {
    expect(resolveMotionDelay(0.28, MOTION_CONFIG_DEFAULTS)).toBe(0.28);
    expect(resolveMotionDelay(0, MOTION_CONFIG_DEFAULTS)).toBe(0);
  });

  it("maps duration tokens and expand alias from config milliseconds", () => {
    expect(resolveMotionDelay("expandDuration", MOTION_CONFIG_DEFAULTS)).toBe(
      MOTION_CONFIG_DEFAULTS.expandDuration / 1000,
    );
    expect(resolveMotionDelay("expand", MOTION_CONFIG_DEFAULTS)).toBe(
      MOTION_CONFIG_DEFAULTS.expandDuration / 1000,
    );
  });

  it("omits non-finite numbers", () => {
    expect(resolveMotionDelay(Number.NaN, MOTION_CONFIG_DEFAULTS)).toBeUndefined();
    expect(resolveMotionDelay(Number.POSITIVE_INFINITY, MOTION_CONFIG_DEFAULTS)).toBeUndefined();
  });
});

describe("registerMotionPlugins", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("registers object plugins and skips nullish entries", () => {
    const spy = vi.spyOn(gsap, "registerPlugin").mockImplementation(() => gsap);
    const plugin = { name: "TextPlugin" };
    registerMotionPlugins(null, undefined, plugin);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0]?.[0]).toBe(plugin);
  });

  it("is a no-op when nothing to register", () => {
    const spy = vi.spyOn(gsap, "registerPlugin").mockImplementation(() => gsap);
    registerMotionPlugins(null, undefined);
    expect(spy).not.toHaveBeenCalled();
  });
});
