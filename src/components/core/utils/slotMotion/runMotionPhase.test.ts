import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { gsap } from "@/components/core/utils/gsapMotion";
import { MOTION_CONFIG_DEFAULTS } from "@/components/core/utils/motionConfig";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";

import { registerMotionRecipe } from "./motionRecipeRegistry";
import { killStoredMotion, runMotionPhase } from "./runMotionPhase";
import {
  isMotionRunActive,
  LEAVE_COMPLETE_FALLBACK_MS,
  type MotionAnimation,
  type MotionContext,
} from "./slotMotionTypes";
import { waitForLeaveGeneration } from "./waitForLeaveGeneration";

vi.mock("@/components/core/utils/reducedMotion", () => ({
  prefersReducedMotion: vi.fn(() => false),
}));

const prefersReduced = vi.mocked(prefersReducedMotion);

function fakeEl(): HTMLElement {
  return { style: { willChange: "" } } as HTMLElement;
}

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

describe("runMotionPhase", () => {
  beforeEach(() => {
    prefersReduced.mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    prefersReduced.mockReturnValue(false);
  });

  it("kills the stored factory tween when the next phase plays on the same element", () => {
    const el = fakeEl();
    const first = fakeAnimation();
    const second = fakeAnimation();

    runMotionPhase({
      el,
      phase: "hoverIn",
      value: () => first,
      targets: {},
    });
    runMotionPhase({
      el,
      phase: "hoverOut",
      value: () => second,
      targets: {},
    });

    expect(first.kill).toHaveBeenCalledTimes(1);
  });

  it("resolves waitForComplete immediately when the value is false", async () => {
    const { finished } = runMotionPhase({
      el: fakeEl(),
      phase: "leave",
      value: false,
      targets: {},
      waitForComplete: true,
    });

    await expect(finished).resolves.toBeUndefined();
  });

  it("does not play a recipe or vars when the resolved value is false", () => {
    const recipe = vi.fn();
    registerMotionRecipe("test-false-disable", recipe);
    const toSpy = vi.spyOn(gsap, "to");

    runMotionPhase({
      el: fakeEl(),
      phase: "hoverIn",
      value: false,
      targets: {},
    });

    expect(recipe).not.toHaveBeenCalled();
    expect(toSpy).not.toHaveBeenCalled();
  });

  it("does not kill tweens on the element when the value is false", () => {
    const el = fakeEl();
    const first = fakeAnimation();

    runMotionPhase({
      el,
      phase: "check",
      value: () => first,
      targets: {},
    });

    const killTweens = vi.spyOn(gsap, "killTweensOf");
    runMotionPhase({
      el,
      phase: "check",
      value: false,
      targets: {},
    });

    expect(first.kill).not.toHaveBeenCalled();
    expect(killTweens).not.toHaveBeenCalled();
  });

  it("does not kill tweens when `{ recipe: false }` has no transform keys", () => {
    const el = fakeEl();
    const first = fakeAnimation();

    runMotionPhase({
      el,
      phase: "hoverIn",
      value: () => first,
      targets: {},
    });

    const killTweens = vi.spyOn(gsap, "killTweensOf");
    runMotionPhase({
      el,
      phase: "hoverOut",
      value: { recipe: false },
      targets: {},
    });

    expect(first.kill).not.toHaveBeenCalled();
    expect(killTweens).not.toHaveBeenCalled();
  });

  it("applies vars with gsap.set when reduced motion is on", () => {
    prefersReduced.mockReturnValue(true);
    const setSpy = vi.spyOn(gsap, "set");
    const toSpy = vi.spyOn(gsap, "to");
    const el = fakeEl();

    runMotionPhase({
      el,
      phase: "hoverIn",
      value: { y: -4, duration: 0.2 },
      targets: {},
    });

    expect(setSpy).toHaveBeenCalled();
    expect(toSpy).not.toHaveBeenCalled();
  });

  it("applies vars with gsap.set when enableAnimations is off", () => {
    const setSpy = vi.spyOn(gsap, "set");
    const toSpy = vi.spyOn(gsap, "to");

    runMotionPhase({
      el: fakeEl(),
      phase: "hoverIn",
      value: { y: -4, duration: 0.2 },
      targets: {},
      config: { ...MOTION_CONFIG_DEFAULTS, enableAnimations: false },
    });

    expect(setSpy).toHaveBeenCalled();
    expect(toSpy).not.toHaveBeenCalled();
  });

  it("invokes a registered recipe by name", () => {
    const recipe = vi.fn();
    registerMotionRecipe("test-run-recipe", recipe);
    const el = fakeEl();

    runMotionPhase({
      el,
      phase: "check",
      value: "test-run-recipe",
      targets: { fill: el },
    });

    expect(recipe).toHaveBeenCalledTimes(1);
    expect(recipe.mock.calls[0]?.[0]).toHaveProperty("el", el);
    expect(recipe.mock.calls[0]?.[0]).toHaveProperty("phase", "check");
    expect(recipe.mock.calls[0]?.[0]).toHaveProperty("runId");
    expect(typeof (recipe.mock.calls[0]?.[0] as MotionContext).isCurrent).toBe("function");
  });

  it("settles immediately and errors in dev when the recipe name is unknown", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const toSpy = vi.spyOn(gsap, "to");

    const run = runMotionPhase({
      el: fakeEl(),
      phase: "leave",
      value: "not-a-real-recipe",
      targets: {},
      waitForComplete: true,
      slot: "panel",
    });

    await expect(run.finished).resolves.toBeUndefined();
    expect(run.status).toBe("finished");
    expect(toSpy).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
    const message = String(error.mock.calls[0]?.[0]);
    expect(message).toContain('unknown motion recipe "not-a-real-recipe"');
    expect(message).toContain('slot "panel"');
    expect(message).toContain('phase "leave"');
  });

  it("settles waitForComplete leave when killStoredMotion cancels the run", async () => {
    const el = fakeEl();
    const anim = fakeAnimation();
    const complete = vi.fn();

    const leave = runMotionPhase({
      el,
      phase: "leave",
      value: () => anim,
      targets: {},
      waitForComplete: true,
      complete,
    });

    killStoredMotion(el);

    await expect(leave.finished).resolves.toBeUndefined();
    expect(leave.status).toBe("cancelled");
    expect(leave.cancelReason).toBe("killed");
    expect(anim.kill).toHaveBeenCalledTimes(1);
    expect(complete).not.toHaveBeenCalled();
    expect(leave.isCurrent()).toBe(false);
  });

  it("cancels a previous leave when enter plays on the same element", async () => {
    const el = fakeEl();
    const leaveAnim = fakeAnimation();
    const enterAnim = fakeAnimation();
    const complete = vi.fn();

    const leave = runMotionPhase({
      el,
      phase: "leave",
      value: () => leaveAnim,
      targets: {},
      waitForComplete: true,
      complete,
    });
    const enter = runMotionPhase({
      el,
      phase: "enter",
      value: () => enterAnim,
      targets: {},
    });

    expect(leaveAnim.kill).toHaveBeenCalledTimes(1);
    await expect(leave.finished).resolves.toBeUndefined();
    expect(leave.status).toBe("cancelled");
    expect(leave.cancelReason).toBe("superseded");
    expect(complete).not.toHaveBeenCalled();
    expect(leave.isCurrent()).toBe(false);
    expect(enter.isCurrent()).toBe(true);
    expect(enter.status).toBe("running");
  });

  it("does not invoke complete when a stale leave tween completes after cancel", async () => {
    const el = fakeEl();
    const leaveAnim = fakeAnimation();
    const complete = vi.fn();

    const leave = runMotionPhase({
      el,
      phase: "leave",
      value: () => leaveAnim,
      targets: {},
      waitForComplete: true,
      complete,
    });
    leave.cancel("host");
    leaveAnim.triggerComplete();

    await expect(leave.finished).resolves.toBeUndefined();
    expect(leave.status).toBe("cancelled");
    expect(complete).not.toHaveBeenCalled();
  });

  it("does not invoke complete when a stale Promise resolves after cancel", async () => {
    const el = fakeEl();
    let resolvePending: () => void = () => {};
    const pending = new Promise<void>((resolve) => {
      resolvePending = resolve;
    });
    const complete = vi.fn();

    const leave = runMotionPhase({
      el,
      phase: "leave",
      value: () => pending,
      targets: {},
      waitForComplete: true,
      complete,
    });
    leave.cancel("superseded");
    await expect(leave.finished).resolves.toBeUndefined();
    resolvePending();
    await Promise.resolve();

    expect(complete).not.toHaveBeenCalled();
    expect(leave.status).toBe("cancelled");
  });

  it("clears the leave fallback timer on cancel so it cannot complete later", async () => {
    vi.useFakeTimers();
    const complete = vi.fn();
    const leave = runMotionPhase({
      el: fakeEl(),
      phase: "leave",
      value: () => undefined,
      targets: {},
      waitForComplete: true,
      complete,
    });

    leave.cancel("unmount");
    await expect(leave.finished).resolves.toBeUndefined();
    expect(complete).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(LEAVE_COMPLETE_FALLBACK_MS + 50);
    expect(complete).not.toHaveBeenCalled();
    expect(leave.status).toBe("cancelled");
  });

  it("invokes complete once when a waitForComplete tween finishes", async () => {
    const anim = fakeAnimation();
    const complete = vi.fn();
    const leave = runMotionPhase({
      el: fakeEl(),
      phase: "leave",
      value: () => anim,
      targets: {},
      waitForComplete: true,
      complete,
    });

    anim.triggerComplete();
    await expect(leave.finished).resolves.toBeUndefined();
    expect(leave.status).toBe("finished");
    expect(complete).toHaveBeenCalledTimes(1);

    anim.triggerComplete();
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it("marks a rejected Promise factory as failed without hanging finished", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const complete = vi.fn();
    const leave = runMotionPhase({
      el: fakeEl(),
      phase: "leave",
      value: () => Promise.reject(new Error("recipe failed")),
      targets: {},
      waitForComplete: true,
      complete,
    });

    await expect(leave.finished).resolves.toBeUndefined();
    expect(leave.status).toBe("failed");
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it("settles a throwing factory as failed so leave does not hang", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const complete = vi.fn();
    const leave = runMotionPhase({
      el: fakeEl(),
      phase: "leave",
      value: () => {
        throw new Error("sync boom");
      },
      targets: {},
      waitForComplete: true,
      slot: "panel",
      complete,
    });

    await expect(leave.finished).resolves.toBeUndefined();
    expect(leave.status).toBe("failed");
    expect(complete).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toContain("sync boom");
    expect(String(error.mock.calls[0]?.[0])).toContain('slot "panel"');
    expect(String(error.mock.calls[0]?.[0])).toContain("threw");
  });

  it("settles a throwing recipe as failed", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    registerMotionRecipe("test-throw-recipe", () => {
      throw new Error("recipe boom");
    });
    const leave = runMotionPhase({
      el: fakeEl(),
      phase: "leave",
      value: "test-throw-recipe",
      targets: {},
      waitForComplete: true,
      slot: "root",
    });

    await expect(leave.finished).resolves.toBeUndefined();
    expect(leave.status).toBe("failed");
    expect(String(error.mock.calls[0]?.[0])).toContain('recipe "test-throw-recipe"');
    expect(String(error.mock.calls[0]?.[0])).toContain("recipe boom");
  });

  it("exposes runId, isCurrent, and signal on the factory context", () => {
    const el = fakeEl();
    let ctx: MotionContext | undefined;
    const run = runMotionPhase({
      el,
      phase: "enter",
      value: (motionCtx) => {
        ctx = motionCtx;
      },
      targets: {},
    });

    expect(ctx?.runId).toBe(run.id);
    expect(ctx?.isCurrent()).toBe(true);
    expect(ctx?.signal.aborted).toBe(false);
    expect(isMotionRunActive(ctx!)).toBe(true);
    run.cancel();
    expect(ctx?.isCurrent()).toBe(false);
    expect(ctx?.signal.aborted).toBe(true);
    expect(isMotionRunActive(ctx!)).toBe(false);
  });

  it("aborts the signal and runs onCleanup when the run is cancelled", async () => {
    const cleanup = vi.fn();
    let ctx: MotionContext | undefined;
    const leave = runMotionPhase({
      el: fakeEl(),
      phase: "leave",
      value: (motionCtx) => {
        ctx = motionCtx;
        motionCtx.onCleanup(cleanup);
        return fakeAnimation();
      },
      targets: {},
      waitForComplete: true,
    });

    leave.cancel("host");
    await leave.finished;
    expect(ctx?.signal.aborted).toBe(true);
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it("clears will-change on the target when the run is cancelled", async () => {
    const el = fakeEl();
    el.style.willChange = "transform";
    const run = runMotionPhase({
      el,
      phase: "enter",
      value: () => fakeAnimation(),
      targets: {},
    });

    run.cancel("killed");
    await run.finished;

    expect(el.style.willChange).toBe("");
  });

  it("does not apply delayed Promise side effects after abort when the factory checks the signal", async () => {
    const el = fakeEl() as HTMLElement & { wrote?: boolean };
    let resolvePending: () => void = () => {};
    const pending = new Promise<void>((resolve) => {
      resolvePending = resolve;
    });

    const leave = runMotionPhase({
      el,
      phase: "leave",
      value: async (ctx) => {
        await pending;
        if (!isMotionRunActive(ctx)) return;
        el.wrote = true;
        ctx.complete();
      },
      targets: {},
      waitForComplete: true,
    });

    leave.cancel("superseded");
    resolvePending();
    await Promise.resolve();
    await leave.finished;

    expect(el.wrote).toBeUndefined();
    expect(leave.status).toBe("cancelled");
  });

  it("does not treat ctx.complete during abort as a successful finish", async () => {
    const complete = vi.fn();
    const leave = runMotionPhase({
      el: fakeEl(),
      phase: "leave",
      value: (ctx) => {
        ctx.signal.addEventListener(
          "abort",
          () => {
            ctx.complete();
          },
          { once: true },
        );
        return fakeAnimation();
      },
      targets: {},
      waitForComplete: true,
      complete,
    });

    leave.cancel("killed");
    await leave.finished;
    expect(leave.status).toBe("cancelled");
    expect(complete).not.toHaveBeenCalled();
  });
});

describe("waitForLeaveGeneration", () => {
  it("calls onComplete only when host runs finish successfully", async () => {
    const onComplete = vi.fn();
    const anim = fakeAnimation();
    const leave = runMotionPhase({
      el: fakeEl(),
      phase: "leave",
      value: () => anim,
      targets: {},
      waitForComplete: true,
    });

    waitForLeaveGeneration({ runs: [leave], onComplete });
    expect(onComplete).not.toHaveBeenCalled();

    anim.triggerComplete();
    await leave.finished;
    await Promise.resolve();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("does not unmount when the current leave is cancelled by a new play", async () => {
    const el = fakeEl();
    const onComplete = vi.fn();
    const leaveAnim = fakeAnimation();
    const leave = runMotionPhase({
      el,
      phase: "leave",
      value: () => leaveAnim,
      targets: {},
      waitForComplete: true,
    });

    waitForLeaveGeneration({ runs: [leave], onComplete });
    runMotionPhase({
      el,
      phase: "enter",
      value: () => fakeAnimation(),
      targets: {},
    });

    await leave.finished;
    await Promise.resolve();
    expect(onComplete).not.toHaveBeenCalled();
    expect(leave.status).toBe("cancelled");
  });

  it("does not unmount after host kill even if a stale tween later completes", async () => {
    const onComplete = vi.fn();
    const anim = fakeAnimation();
    const leave = runMotionPhase({
      el: fakeEl(),
      phase: "leave",
      value: () => anim,
      targets: {},
      waitForComplete: true,
    });

    const handle = waitForLeaveGeneration({ runs: [leave], onComplete });
    handle.kill();
    anim.triggerComplete();
    await leave.finished;
    await Promise.resolve();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("waits for extra broadcast before completing the host leave", async () => {
    const onComplete = vi.fn();
    const anim = fakeAnimation();
    const leave = runMotionPhase({
      el: fakeEl(),
      phase: "leave",
      value: () => anim,
      targets: {},
      waitForComplete: true,
    });
    let releaseExtra: () => void = () => {};
    const extra = new Promise<void>((resolve) => {
      releaseExtra = resolve;
    });

    waitForLeaveGeneration({ runs: [leave], extra, onComplete });
    anim.triggerComplete();
    await leave.finished;
    await Promise.resolve();
    expect(onComplete).not.toHaveBeenCalled();

    releaseExtra();
    await extra;
    await Promise.resolve();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
