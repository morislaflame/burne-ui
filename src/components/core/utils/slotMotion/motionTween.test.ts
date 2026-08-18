import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";

import { gsap } from "@/components/core/utils/gsapMotion";
import { MOTION_CONFIG_DEFAULTS } from "@/components/core/utils/motionConfig";

import { playDeclarativeMotion, resolveMotionReplay } from "./motionTween";
import { runMotionPhase } from "./runMotionPhase";
import type { MotionContext, MotionVars } from "./slotMotionTypes";

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
