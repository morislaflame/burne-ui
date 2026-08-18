import { afterEach, describe, expect, it, vi } from "vitest";

import { gsap } from "@/components/core/utils/gsapMotion";
import { MOTION_CONFIG_DEFAULTS } from "@/components/core/utils/motionConfig";

import type { MotionContext } from "../slotMotionTypes";
import {
  applyProgressFillInstant,
  progressFillRecipe,
  progressFillScaleVars,
  progressIndeterminateRecipe,
  progressScaleFromPercent,
} from "./progressFill";

function fakeEl(): HTMLElement {
  return { style: { willChange: "", width: "", height: "" } } as HTMLElement;
}

function fakeCtx(
  el: HTMLElement,
  overrides: Partial<MotionContext> = {},
): MotionContext {
  return {
    el,
    phase: "change",
    reduced: false,
    config: MOTION_CONFIG_DEFAULTS,
    params: {
      getProgressScale: () => 0.5,
      isHorizontal: true,
    },
    ...overrides,
  } as MotionContext;
}

describe("progressFill recipes", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("clamps percent to a 0…1 scale", () => {
    expect(progressScaleFromPercent(72)).toBeCloseTo(0.72);
    expect(progressScaleFromPercent(-10)).toBe(0);
    expect(progressScaleFromPercent(140)).toBe(1);
    expect(progressScaleFromPercent(Number.NaN)).toBe(0);
  });

  it("snaps determinate fill with compositor scale vars", () => {
    const el = fakeEl();
    const set = vi.spyOn(gsap, "set");
    applyProgressFillInstant(el, 0.4, true);
    expect(progressFillScaleVars(0.4, true)).toEqual({
      scaleX: 0.4,
      scaleY: 1,
      x: 0,
      y: 0,
    });
    expect(set).toHaveBeenCalled();
    expect(set.mock.calls[0]?.[1]).toMatchObject({
      scaleX: 0.4,
      scaleY: 1,
      transformOrigin: "left center",
    });
  });

  it("uses fromTo on enter and to on change", () => {
    const el = fakeEl();
    const fromTo = vi.spyOn(gsap, "fromTo");
    const to = vi.spyOn(gsap, "to");

    progressFillRecipe(fakeCtx(el, { phase: "enter" }));
    expect(fromTo).toHaveBeenCalledTimes(1);
    expect(to).not.toHaveBeenCalled();
    expect(fromTo.mock.calls[0]?.[1]).toMatchObject({ scaleX: 0, scaleY: 1 });
    expect(fromTo.mock.calls[0]?.[2]).toMatchObject({ scaleX: 0.5, scaleY: 1 });

    fromTo.mockClear();
    progressFillRecipe(fakeCtx(el, { phase: "change" }));
    expect(to).toHaveBeenCalledTimes(1);
    expect(fromTo).not.toHaveBeenCalled();
    expect(to.mock.calls[0]?.[1]).toMatchObject({ scaleX: 0.5, scaleY: 1 });
  });

  it("snaps instantly when reduced or enableProgressFill is off", () => {
    const el = fakeEl();
    const to = vi.spyOn(gsap, "to");
    const set = vi.spyOn(gsap, "set");

    const tween = progressFillRecipe(fakeCtx(el, { reduced: true }));
    expect(tween).toBeUndefined();
    expect(to).not.toHaveBeenCalled();
    expect(set).toHaveBeenCalled();

    set.mockClear();
    const disabled = progressFillRecipe(
      fakeCtx(el, {
        config: { ...MOTION_CONFIG_DEFAULTS, enableProgressFill: false },
      }),
    );
    expect(disabled).toBeUndefined();
    expect(set).toHaveBeenCalled();
  });

  it("skips the indeterminate loop when the track has no size", () => {
    const track = fakeEl();
    const fill = fakeEl();
    Object.defineProperty(fill, "parentElement", { value: track });
    const fromTo = vi.spyOn(gsap, "fromTo");

    const tween = progressIndeterminateRecipe(fakeCtx(fill));
    expect(tween).toBeUndefined();
    expect(fromTo).not.toHaveBeenCalled();
  });

  it("loops indeterminate travel from measured sizes", () => {
    const track = fakeEl();
    const fill = fakeEl();
    Object.defineProperty(fill, "parentElement", { value: track });
    Object.defineProperty(track, "offsetWidth", { value: 200 });
    Object.defineProperty(fill, "offsetWidth", { value: 50 });
    const fromTo = vi.spyOn(gsap, "fromTo");

    const tween = progressIndeterminateRecipe(fakeCtx(fill));
    expect(tween).toBeDefined();
    expect(fromTo).toHaveBeenCalledTimes(1);
    expect(fromTo.mock.calls[0]?.[1]).toMatchObject({ x: -50 });
    expect(fromTo.mock.calls[0]?.[2]).toMatchObject({ x: 200, repeat: -1 });
  });
});
