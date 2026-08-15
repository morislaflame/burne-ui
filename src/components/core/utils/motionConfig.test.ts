import { afterEach, describe, expect, it, vi } from "vitest";

import {
  applyMotionCssTokens,
  configureMotion,
  getMotionConfig,
  getMotionConfigRevision,
  MOTION_CONFIG_DEFAULTS,
  MOTION_CONFIG_LIMITS,
  MOTION_CSS_VAR,
  overlayMotionConfig,
} from "./motionConfig";
import { normalizeMotionConfig, parseRippleEaseCss } from "./motionConfigValidation";

afterEach(() => {
  configureMotion({ ...MOTION_CONFIG_DEFAULTS });
  vi.restoreAllMocks();
});

function fakeRoot() {
  const props: Record<string, string> = {};
  return {
    style: {
      setProperty(name: string, value: string) {
        props[name] = value;
      },
      removeProperty(name: string) {
        delete props[name];
      },
    },
    props,
  };
}

describe("parseRippleEaseCss", () => {
  it("parses the kit default", () => {
    expect(parseRippleEaseCss("cubic-bezier(0.25, 0.55, 0.35, 0.95)")).toEqual([
      0.25, 0.55, 0.35, 0.95,
    ]);
  });

  it("allows leading dots, negatives, values > 1, and extra spaces", () => {
    expect(parseRippleEaseCss("cubic-bezier( .25 , -0.2 , 1.4 , .95 )")).toEqual([
      0.25, -0.2, 1.4, 0.95,
    ]);
  });

  it("rejects non-bezier strings", () => {
    expect(parseRippleEaseCss("power2.out")).toBeNull();
    expect(parseRippleEaseCss("cubic-bezier(1, 2, 3)")).toBeNull();
  });
});

describe("normalizeMotionConfig", () => {
  it("keeps valid overrides and drops invalid ones", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const next = normalizeMotionConfig({
      interactiveDuration: 320,
      tooltipDuration: Number.NaN,
      hoverLiftScale: Number.POSITIVE_INFINITY,
      enableRipple: true,
      interactiveEase: "back.out(1.4)",
    });
    expect(next).toEqual({
      interactiveDuration: 320,
      enableRipple: true,
      interactiveEase: "back.out(1.4)",
    });
    expect(warn).toHaveBeenCalled();
  });

  it("clamps finite out-of-range durations, scales, opacity, and factor", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const next = normalizeMotionConfig({
      interactiveDuration: -10,
      hoverLiftScale: 3,
      rippleDefaultOpacityFrom: 1.8,
      pressSqueezeDurationFactor: 9,
    });
    expect(next.interactiveDuration).toBe(MOTION_CONFIG_LIMITS.durationMs.min);
    expect(next.hoverLiftScale).toBe(MOTION_CONFIG_LIMITS.scale.max);
    expect(next.rippleDefaultOpacityFrom).toBe(MOTION_CONFIG_LIMITS.opacity.max);
    expect(next.pressSqueezeDurationFactor).toBe(MOTION_CONFIG_LIMITS.factor.max);
  });

  it("clamps pressSqueezeScale items and skips a tuple with NaN", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(normalizeMotionConfig({ pressSqueezeScale: [1, 0.2, 1] }).pressSqueezeScale).toEqual([
      1,
      MOTION_CONFIG_LIMITS.pressSqueezeScale.min,
      1,
    ]);
    expect(
      normalizeMotionConfig({ pressSqueezeScale: [1, Number.NaN, 1] }).pressSqueezeScale,
    ).toBeUndefined();
  });
});

describe("configureMotion", () => {
  it("does not read document.documentElement when document is missing (SSR)", () => {
    expect(typeof document).toBe("undefined");
    const revision = getMotionConfigRevision();
    expect(() => configureMotion({ interactiveDuration: 320 })).not.toThrow();
    expect(getMotionConfig().interactiveDuration).toBe(320);
    expect(getMotionConfigRevision()).toBe(revision + 1);
  });

  it("applies valid fields when a sibling override is invalid", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    configureMotion({
      interactiveDuration: 400,
      tooltipDuration: Number.NaN,
      enableHoverLift: false,
    });
    expect(getMotionConfig().interactiveDuration).toBe(400);
    expect(getMotionConfig().tooltipDuration).toBe(MOTION_CONFIG_DEFAULTS.tooltipDuration);
    expect(getMotionConfig().enableHoverLift).toBe(false);
  });

  it("does not mutate config or bump revision when every field is invalid", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const before = getMotionConfig();
    const revision = getMotionConfigRevision();
    configureMotion({
      interactiveDuration: Number.NaN,
      interactiveEase: "",
      enableAnimations: "yes" as unknown as boolean,
    });
    expect(getMotionConfig()).toBe(before);
    expect(getMotionConfigRevision()).toBe(revision);
  });

  it("accepts cubic-bezier with leading dots and does not write NaNms on a root", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    configureMotion({
      rippleEaseCss: "cubic-bezier(.25,.55,.35,.95)",
      surfaceTransitionDuration: Number.NaN,
    });
    expect(getMotionConfig().rippleEaseCss).toBe("cubic-bezier(.25,.55,.35,.95)");
    expect(getMotionConfig().surfaceTransitionDuration).toBe(
      MOTION_CONFIG_DEFAULTS.surfaceTransitionDuration,
    );

    const root = fakeRoot();
    applyMotionCssTokens(root as unknown as HTMLElement, {
      surfaceTransitionDuration: Number.NaN,
    });
    expect(root.props[MOTION_CSS_VAR.surfaceDuration]).toBeUndefined();

    applyMotionCssTokens(root as unknown as HTMLElement, { surfaceTransitionDuration: 450 });
    expect(root.props[MOTION_CSS_VAR.surfaceDuration]).toBe("450ms");
  });

  it("does not bump revision when overrides already match the live config", () => {
    configureMotion({ interactiveDuration: 320 });
    const revision = getMotionConfigRevision();
    const before = getMotionConfig();
    configureMotion({ interactiveDuration: 320 });
    expect(getMotionConfig()).toBe(before);
    expect(getMotionConfigRevision()).toBe(revision);
  });
});

describe("overlayMotionConfig", () => {
  it("overlays accepted keys and leaves unspecified keys from the base", () => {
    const base = { ...MOTION_CONFIG_DEFAULTS, interactiveDuration: 280, tooltipDuration: 200 };
    const next = overlayMotionConfig(base, {
      interactiveDuration: 120,
      enableHoverLift: false,
    });
    expect(next.interactiveDuration).toBe(120);
    expect(next.enableHoverLift).toBe(false);
    expect(next.tooltipDuration).toBe(200);
    expect(base.interactiveDuration).toBe(280);
  });

  it("returns the same base reference when overlay is empty or fully invalid", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const base = { ...MOTION_CONFIG_DEFAULTS };
    expect(overlayMotionConfig(base)).toBe(base);
    expect(overlayMotionConfig(base, { interactiveDuration: Number.NaN })).toBe(base);
  });
});
