import { describe, expect, expectTypeOf, it } from "vitest";

import type {
  MotionContext,
  MotionFactory,
  MotionPayload,
  MotionRecipeParams,
  MotionTransformVars,
  MotionVars,
} from "./slotMotionTypes";
import type { MotionStateHostProps } from "./motionEvents";

/**
 * Compile-time coverage for F17: public MotionVars stay layout-safe;
 * kit compositor vars live on MotionTransformVars; params have no index signature.
 */
describe("MotionVars / MotionTransformVars / MotionRecipeParams", () => {
  it("keeps public vars as a compositor subset without layout keys", () => {
    const vars: MotionVars = { x: 8, y: -2, scale: 1.02, autoAlpha: 1, duration: 0.2 };
    expect(vars.x).toBe(8);

    expectTypeOf<MotionVars>().toHaveProperty("x");
    expectTypeOf<MotionVars>().toHaveProperty("autoAlpha");
    expectTypeOf<MotionVars>().toHaveProperty("yoyo");
    expectTypeOf<MotionVars>().toHaveProperty("replay");
    expectTypeOf<MotionVars>().not.toHaveProperty("width");
    expectTypeOf<MotionVars>().not.toHaveProperty("height");
    expectTypeOf<MotionVars>().not.toHaveProperty("rotation");
    expectTypeOf<MotionVars>().not.toHaveProperty("scaleX");
    expectTypeOf<MotionVars>().not.toHaveProperty("opacity");

    // @ts-expect-error layout is not a public MotionVars key
    const layoutVars: MotionVars = { width: 120 };
    // @ts-expect-error rotation is kit-only (factory or MotionTransformVars)
    const rotateVars: MotionVars = { rotation: 180 };
    expect(layoutVars).toBeDefined();
    expect(rotateVars).toBeDefined();
  });

  it("accepts compositor extras on MotionTransformVars and rejects layout", () => {
    const vars: MotionTransformVars = {
      rotation: 180,
      scaleX: 0.4,
      scaleY: 1,
      opacity: 0,
      autoAlpha: 1,
      x: 0,
      duration: 0.2,
    };
    expect(vars.rotation).toBe(180);

    expectTypeOf<MotionTransformVars>().toHaveProperty("rotation");
    expectTypeOf<MotionTransformVars>().toHaveProperty("scaleX");
    expectTypeOf<MotionTransformVars>().toHaveProperty("opacity");
    expectTypeOf<MotionTransformVars>().not.toHaveProperty("width");
    expectTypeOf<MotionTransformVars>().not.toHaveProperty("top");
    expectTypeOf<MotionTransformVars>().not.toHaveProperty("margin");

    // @ts-expect-error layout is not a compositor var
    const layout: MotionTransformVars = { height: 48 };
    expect(layout).toBeDefined();
  });

  it("types ctx.params as a closed kit set and leaves app extras to factories", () => {
    const params: MotionRecipeParams = {
      liftScale: 1.02,
      placement: "left",
      getTravelPx: () => 12,
      getProgressScale: () => 0.72,
      isHorizontal: true,
      duration: 0.18,
    };
    expect(params.placement).toBe("left");

    expectTypeOf<MotionContext["params"]>().toEqualTypeOf<MotionRecipeParams>();
    expectTypeOf<MotionContext["payload"]>().toEqualTypeOf<unknown>();
    expectTypeOf<MotionContext<{ attempt: number }>["payload"]>().toEqualTypeOf<
      Readonly<{ attempt: number }> | undefined
    >();
    expectTypeOf<MotionStateHostProps<{ attempt: number }>["motionPayload"]>().toEqualTypeOf<
      { attempt: number } | undefined
    >();
    expectTypeOf<MotionPayload>().toHaveProperty("progress");
    expectTypeOf<MotionPayload>().toHaveProperty("itemId");
    expectTypeOf<MotionPayload>().toHaveProperty("result");
    expectTypeOf<MotionPayload>().toHaveProperty("error");
    expectTypeOf<MotionRecipeParams>().toHaveProperty("liftScale");
    expectTypeOf<MotionRecipeParams>().toHaveProperty("getTravelPx");
    expectTypeOf<MotionRecipeParams>().toHaveProperty("getProgressScale");
    expectTypeOf<MotionRecipeParams>().toHaveProperty("isHorizontal");
    expectTypeOf<MotionRecipeParams>().not.toHaveProperty("payload");
    expectTypeOf<MotionRecipeParams>().not.toHaveProperty("notAKitKey");

    // @ts-expect-error custom app data does not go on params
    const extra: MotionRecipeParams = { notAKitKey: true };
    expect(extra).toBeDefined();
  });

  it("allows compositor props in a factory, not in public vars", () => {
    const factory: MotionFactory = (ctx) =>
      ctx.fromRest({ rotation: 45, scaleX: 0.5, opacity: 0.8, duration: 0.2 });
    expect(typeof factory).toBe("function");
    expectTypeOf<MotionContext>().toHaveProperty("wait");
    expectTypeOf<MotionContext>().toHaveProperty("sequence");
    expectTypeOf<MotionContext>().toHaveProperty("parallel");
    expectTypeOf<MotionContext>().toHaveProperty("onInterrupt");
    expectTypeOf<MotionContext>().toHaveProperty("onError");
  });
});
