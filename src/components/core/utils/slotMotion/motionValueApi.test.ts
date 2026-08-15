import { describe, expect, it } from "vitest";

import { tweenCssColor } from "@/components/core/utils/gsapMotion";
import gsap from "gsap";

import type { MotionFactory, MotionValue, MotionVars } from "./slotMotionTypes";

/**
 * Compile-time coverage for the public MotionValue / MotionFactory surface
 * documented in `content/docs/motion`. Factory return is `kill`, not `gsap.core.Animation`.
 */
describe("MotionValue public API", () => {
  it("accepts the documented phase values and factory returns", () => {
    const vars: MotionVars = { y: -2, duration: 0.2 };
    const disable: MotionValue = false;
    const kitName: MotionValue = "pressSqueeze";
    const customName: MotionValue = "myHoverLift";
    const varsValue: MotionValue = vars;
    const recipeVars: MotionValue = { recipe: "pressSqueeze", scale: 1.02 };
    const recipeOff: MotionValue = { recipe: false };

    const tweenFactory: MotionFactory = (ctx) =>
      gsap.to(ctx.el, { y: -2, duration: 0.2 });
    const killFactory: MotionFactory = () => ({ kill: () => undefined });
    const voidFactory: MotionFactory = (ctx) => {
      gsap.set(ctx.el, { y: 0 });
    };
    const promiseFactory: MotionFactory = async (ctx) => {
      ctx.complete();
    };
    const colorFactory: MotionFactory = (ctx) =>
      tweenCssColor(ctx.el, "var(--color-primary)");

    const values: MotionValue[] = [
      disable,
      kitName,
      customName,
      varsValue,
      recipeVars,
      recipeOff,
      tweenFactory,
      killFactory,
      voidFactory,
      promiseFactory,
      colorFactory,
    ];
    expect(values).toHaveLength(11);
  });
});
