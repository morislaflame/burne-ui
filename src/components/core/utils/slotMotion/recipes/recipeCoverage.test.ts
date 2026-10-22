// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";

import { gsap } from "@/components/core/utils/gsapMotion";
import { MOTION_CONFIG_DEFAULTS } from "@/components/core/utils/motionConfig";

import type { MotionContext } from "../slotMotionTypes";
import { drawerSlideEnterRecipe, drawerSlideLeaveRecipe } from "./drawerSlide";
import { fileRowExitRecipe } from "./fileRowExit";
import { hoverLiftSecondLevelRecipe } from "./hoverLiftSecondLevel";
import { searchExpandRecipe } from "./searchExpand";
import { toastSurfaceEnterRecipe, toastSurfaceLeaveRecipe } from "./toastSurface";

const SEARCH_METRICS = {
  targetW: 240,
  collapsedDim: 40,
  expandedRadius: 12,
  padX: 8,
  iconBox: 16,
  iconLeftCollapsedCss: "12px",
};

function host(): HTMLElement {
  return document.createElement("div");
}

function fakeCtx(el: HTMLElement, overrides: Partial<MotionContext> = {}): MotionContext {
  return {
    el,
    phase: "enter",
    reduced: false,
    config: MOTION_CONFIG_DEFAULTS,
    params: {},
    targets: {},
    complete: vi.fn(),
    signal: new AbortController().signal,
    onCleanup: () => {},
    ...overrides,
  } as MotionContext;
}

describe("recipe coverage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("toastSurface", () => {
    it("returns an enter tween and a leave tween", () => {
      const fromTo = vi.spyOn(gsap, "fromTo");
      const enter = toastSurfaceEnterRecipe(fakeCtx(host()));
      const leave = toastSurfaceLeaveRecipe(fakeCtx(host(), { phase: "leave" }));
      expect(fromTo).toHaveBeenCalledTimes(2);
      expect(enter?.kill).toEqual(expect.any(Function));
      expect(leave?.kill).toEqual(expect.any(Function));
    });

    it("snaps under reduced motion and skips the tween", () => {
      const fromTo = vi.spyOn(gsap, "fromTo");
      const complete = vi.fn();
      expect(
        toastSurfaceEnterRecipe(fakeCtx(host(), { reduced: true })),
      ).toBeUndefined();
      expect(
        toastSurfaceLeaveRecipe(fakeCtx(host(), { phase: "leave", reduced: true, complete })),
      ).toBeUndefined();
      expect(fromTo).not.toHaveBeenCalled();
      expect(complete).toHaveBeenCalledOnce();
    });
  });

  describe("drawerSlide", () => {
    it("returns an enter tween and a leave tween", () => {
      const fromTo = vi.spyOn(gsap, "fromTo");
      const to = vi.spyOn(gsap, "to");
      const enter = drawerSlideEnterRecipe(fakeCtx(host(), { params: { placement: "right" } }));
      const leave = drawerSlideLeaveRecipe(
        fakeCtx(host(), { phase: "leave", params: { placement: "right" } }),
      );
      expect(fromTo).toHaveBeenCalledOnce();
      expect(to).toHaveBeenCalled();
      expect(enter?.kill).toEqual(expect.any(Function));
      expect(leave?.kill).toEqual(expect.any(Function));
    });

    it("snaps under reduced motion and skips the tween", () => {
      const fromTo = vi.spyOn(gsap, "fromTo");
      const to = vi.spyOn(gsap, "to");
      expect(
        drawerSlideEnterRecipe(fakeCtx(host(), { reduced: true, params: { placement: "left" } })),
      ).toBeUndefined();
      expect(
        drawerSlideLeaveRecipe(
          fakeCtx(host(), { phase: "leave", reduced: true, params: { placement: "left" } }),
        ),
      ).toBeUndefined();
      expect(fromTo).not.toHaveBeenCalled();
      expect(to).not.toHaveBeenCalled();
    });
  });

  describe("searchExpand", () => {
    it("returns the shell tween", () => {
      const fromTo = vi.spyOn(gsap, "fromTo");
      const tween = searchExpandRecipe(fakeCtx(host(), { params: SEARCH_METRICS }));
      expect(fromTo).toHaveBeenCalledOnce();
      expect(tween?.kill).toEqual(expect.any(Function));
    });

    it("snaps under reduced motion and skips the tween", () => {
      const fromTo = vi.spyOn(gsap, "fromTo");
      expect(
        searchExpandRecipe(fakeCtx(host(), { reduced: true, params: SEARCH_METRICS })),
      ).toBeUndefined();
      expect(fromTo).not.toHaveBeenCalled();
    });
  });

  describe("fileRowExit", () => {
    it("returns a leave tween and a restore tween", () => {
      const to = vi.spyOn(gsap, "to");
      const leave = fileRowExitRecipe(fakeCtx(host(), { phase: "leave" }));
      const restore = fileRowExitRecipe(fakeCtx(host(), { phase: "enter" }));
      expect(to).toHaveBeenCalledTimes(2);
      expect(leave?.kill).toEqual(expect.any(Function));
      expect(restore?.kill).toEqual(expect.any(Function));
    });

    it("snaps under reduced motion and skips the tween", () => {
      const to = vi.spyOn(gsap, "to");
      expect(fileRowExitRecipe(fakeCtx(host(), { phase: "leave", reduced: true }))).toBeUndefined();
      expect(to).not.toHaveBeenCalled();
    });
  });

  describe("hoverLiftSecondLevel", () => {
    it("returns the scale tween", () => {
      const to = vi.spyOn(gsap, "to");
      const tween = hoverLiftSecondLevelRecipe(
        fakeCtx(host(), { phase: "hoverIn", params: { liftScale: 1.02, shadowSize: "base" } }),
      );
      expect(to).toHaveBeenCalled();
      expect(tween?.kill).toEqual(expect.any(Function));
    });

    it("skips the tween when reduced", () => {
      const to = vi.spyOn(gsap, "to");
      expect(
        hoverLiftSecondLevelRecipe(
          fakeCtx(host(), {
            phase: "hoverIn",
            reduced: true,
            params: { liftScale: 1.02, shadowSize: "base" },
          }),
        ),
      ).toBeUndefined();
      expect(to).not.toHaveBeenCalled();
    });
  });
});
