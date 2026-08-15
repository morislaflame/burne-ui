import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { gsap } from "@/components/core/utils/gsapMotion";
import { isMotionEnabled } from "@/components/core/utils/motionConfig";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";

import { registerMotionRecipe } from "./motionRecipeRegistry";
import { runMotionPhase } from "./runMotionPhase";
import type { MotionAnimation } from "./slotMotionTypes";

vi.mock("@/components/core/utils/reducedMotion", () => ({
  prefersReducedMotion: vi.fn(() => false),
}));

vi.mock("@/components/core/utils/motionConfig", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/core/utils/motionConfig")>();
  return {
    ...actual,
    isMotionEnabled: vi.fn(() => true),
  };
});

const prefersReduced = vi.mocked(prefersReducedMotion);
const motionEnabled = vi.mocked(isMotionEnabled);

function fakeEl(): HTMLElement {
  return { style: { willChange: "" } } as HTMLElement;
}

function fakeAnimation(): MotionAnimation {
  let onComplete: ((...args: unknown[]) => unknown) | null = null;
  return {
    kill: vi.fn(),
    eventCallback: ((type: string, callback?: ((...args: unknown[]) => unknown) | null) => {
      if (type !== "onComplete") return undefined;
      if (callback === undefined) return onComplete;
      onComplete = callback;
      return undefined;
    }) as MotionAnimation["eventCallback"],
  };
}

describe("runMotionPhase", () => {
  beforeEach(() => {
    prefersReduced.mockReturnValue(false);
    motionEnabled.mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    prefersReduced.mockReturnValue(false);
    motionEnabled.mockReturnValue(true);
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
    motionEnabled.mockReturnValue(false);
    const setSpy = vi.spyOn(gsap, "set");
    const toSpy = vi.spyOn(gsap, "to");

    runMotionPhase({
      el: fakeEl(),
      phase: "hoverIn",
      value: { y: -4, duration: 0.2 },
      targets: {},
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
    expect(recipe.mock.calls[0]?.[0]).toMatchObject({ el, phase: "check" });
  });
});
