import { afterEach, describe, expect, it, vi } from "vitest";

import { gsap } from "@/components/core/utils/gsapMotion";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  initElementShadow,
} from "@/components/core/utils/hoverInteractiveLift";
import { createMotionScopeController } from "@/components/core/utils/slotMotion/createMotionScope";
import { pressSqueezeRecipe } from "@/components/core/utils/slotMotion/recipes/pressSqueeze";
import type { MotionContext } from "@/components/core/utils/slotMotion/slotMotionTypes";
import { shadowMotionFor } from "@/components/core/utils/useShadowMotion";

afterEach(() => {
  document.body.replaceChildren();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function host(): HTMLElement {
  const el = document.createElement("button");
  document.body.appendChild(el);
  return el;
}

describe("shadow fade layers", () => {
  it("mounts static rest / hover / press layers and does not tween boxShadow", () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
    }));

    const el = host();
    initElementShadow(el, "var(--shadow-none)");
    expect(el.querySelector("[data-shadow-fade='rest']")).not.toBeNull();
    expect(el.querySelector("[data-shadow-fade='hover']")).not.toBeNull();
    expect(el.querySelector("[data-shadow-fade='press']")).not.toBeNull();
    expect(el.style.getPropertyValue("--el-shadow").trim()).toBe("var(--shadow-none)");

    const toSpy = vi.spyOn(gsap, "to");
    const fromToSpy = vi.spyOn(gsap, "fromTo");
    animateInteractiveHoverLift(el, true, 1.02, shadowMotionFor("none"));

    expect(fromToSpy).not.toHaveBeenCalled();
    expect(el.style.getPropertyValue("--shadow-fade-hover").trim()).toBe("var(--shadow-lift)");
    for (const call of toSpy.mock.calls) {
      const vars = call[1] as { boxShadow?: string } | undefined;
      expect(vars?.boxShadow).toBeUndefined();
    }
  });

  it("drops a committed hover shadow when the pointer leaves", () => {
    const el = host();
    initElementShadow(el, "var(--shadow-none)");
    el.style.setProperty("--el-shadow", "var(--shadow-lift)");

    animateInteractiveHoverLift(el, false, 1.02, shadowMotionFor("none"));

    expect(el.style.getPropertyValue("--el-shadow").trim()).toBe("var(--shadow-none)");
    expect(el.style.getPropertyValue("--shadow-fade-rest").trim()).toBe("var(--shadow-none)");
  });

  it("press cross-fades layer opacity and does not tween boxShadow", async () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
    }));

    const el = host();
    initElementShadow(el, "var(--shadow-none)");
    const created: gsap.core.Timeline[] = [];
    const original = gsap.timeline.bind(gsap);
    vi.spyOn(gsap, "timeline").mockImplementation((vars) => {
      const tl = original(vars);
      created.push(tl);
      return tl;
    });

    const pending = animateInteractivePressSqueeze(el, {
      pointerInside: true,
      shadow: shadowMotionFor("none"),
    });

    const tl = created[0];
    expect(tl).toBeTruthy();
    const tweensOf = (timeline: gsap.core.Timeline) =>
      timeline.getChildren(false, true, false).filter((child): child is gsap.core.Tween => "targets" in child);
    const pressTweens = tweensOf(tl);
    const targetsOf = (tween: gsap.core.Tween) => tween.targets();
    const pressLayer = el.querySelector("[data-shadow-fade='press']");
    expect(pressLayer).not.toBeNull();
    expect(pressTweens.some((tween) => targetsOf(tween).includes(pressLayer))).toBe(true);
    for (const tween of pressTweens) {
      expect(tween.vars.boxShadow).toBeUndefined();
      if (targetsOf(tween).includes(pressLayer)) {
        expect(tween.vars.opacity).toBe(1);
      }
    }

    tl.progress(1);
    tl.progress(1);
    await pending;

    const hoverLayer = el.querySelector("[data-shadow-fade='hover']");
    const releaseTweens = tweensOf(tl);
    expect(releaseTweens.some((tween) => targetsOf(tween).includes(hoverLayer))).toBe(true);
    for (const tween of releaseTweens) {
      expect(tween.vars.boxShadow).toBeUndefined();
    }
  });

  it("releases a second-level press back to the hover family while the pointer stays", async () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
    }));

    const el = host();
    initElementShadow(el, "var(--shadow-base)");
    const created: gsap.core.Timeline[] = [];
    const original = gsap.timeline.bind(gsap);
    vi.spyOn(gsap, "timeline").mockImplementation((vars) => {
      const tl = original(vars);
      created.push(tl);
      return tl;
    });

    const pending = pressSqueezeRecipe({
      el,
      phase: "pressIn",
      reduced: false,
      params: { hasHoverShadow: true, shadowSize: "base", pointerInside: true },
    } as MotionContext);

    expect(el.style.getPropertyValue("--shadow-fade-hover").trim()).toBe("var(--shadow-base-hover)");
    expect(el.style.getPropertyValue("--shadow-fade-press").trim()).toBe("var(--shadow-base-press)");
    expect(el.style.getPropertyValue("--shadow-fade-rest").trim()).toBe("var(--shadow-base)");

    const tl = created[0];
    tl?.progress(1);
    tl?.progress(1);
    await pending;

    const hoverLayer = el.querySelector("[data-shadow-fade='hover']");
    expect(hoverLayer).not.toBeNull();
    expect(Number(getComputedStyle(hoverLayer!).opacity)).toBeGreaterThan(0.9);
  });

  it("releases to rest scale when hover is off and the pointer stays", async () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
    }));

    const el = host();
    const created: gsap.core.Timeline[] = [];
    const original = gsap.timeline.bind(gsap);
    vi.spyOn(gsap, "timeline").mockImplementation((vars) => {
      const tl = original(vars);
      created.push(tl);
      return tl;
    });

    const pending = animateInteractivePressSqueeze(el, {
      pointerInside: true,
      restoreHover: false,
    });
    const tl = created[0];
    tl?.progress(1);
    tl?.progress(1);
    await pending;

    const scales = tl
      .getChildren(true, true, false)
      .map((tween) => (tween as gsap.core.Tween).vars.scale)
      .filter((scale): scale is number => typeof scale === "number");
    expect(scales.at(-1)).toBe(1);
    expect(scales.some((scale) => scale > 1)).toBe(false);
  });

  it("does not restore hover scale when the slot hoverIn is off", async () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
    }));

    const el = host();
    const created: gsap.core.Timeline[] = [];
    const original = gsap.timeline.bind(gsap);
    vi.spyOn(gsap, "timeline").mockImplementation((vars) => {
      const tl = original(vars);
      created.push(tl);
      return tl;
    });

    const scope = createMotionScopeController({
      getRootMotion: () => ({ root: { hoverIn: false } }),
      getDefaults: () => ({
        root: { hoverIn: "hoverLiftFirstLevel", pressIn: "pressSqueeze", pressOut: false },
      }),
      getParams: () => ({ pointerInside: true }),
    });
    scope.registerTarget("root", el);
    scope.play("root", "pressIn");

    const tl = created[0];
    expect(tl).toBeDefined();
    tl?.progress(1);
    tl?.progress(1);

    const scales = tl!
      .getChildren(true, true, false)
      .map((tween) => (tween as gsap.core.Tween).vars.scale)
      .filter((scale): scale is number => typeof scale === "number");
    expect(scales.at(-1)).toBe(1);
    expect(scales.some((scale) => scale > 1)).toBe(false);
  });

  it("hover and press leave an in-flight leave tween alive", async () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
    }));

    const el = host();
    const leave = gsap.to(el, { y: 24, duration: 1, overwrite: false });
    animateInteractiveHoverLift(el, true, 1.02, shadowMotionFor("none"));
    expect(gsap.getTweensOf(el)).toContain(leave);

    const firstPress = animateInteractivePressSqueeze(el, { pointerInside: false });
    animateInteractivePressSqueeze(el, { pointerInside: false });
    await firstPress;
    expect(gsap.getTweensOf(el)).toContain(leave);
  });
});
