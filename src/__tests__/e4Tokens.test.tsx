import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { CHECKBOX_CONTROL_TRACK_CLASS, CHECKBOX_INPUT_TRACK_OVERLAY_CLASS } from "@/components/core/Checkbox/checkboxStyles";
import { RADIO_CONTROL_CLASS } from "@/components/core/Radio/radioStyles";
import { SWITCH_CONTROL_BASE_CLASS } from "@/components/core/Switch/switchStyles";
import { NARROW_VIEWPORT_MAX_PX } from "@/tokens/breakpoints";
import primitives from "@/tokens/tokenPrimitives.json" with { type: "json" };
import { createDefaultThemeState, exportThemeCss } from "@/theme/themeDefaults";

function readSrc(relativePath: string) {
  return readFileSync(resolve(relativePath), "utf8");
}

describe("Э4 tokens", () => {
  const tokens = readSrc("src/tokens/styles.css");
  const app = readSrc("src/styles.css");

  it("ships fixed scale knobs and a fluid opt-in", () => {
    expect(tokens).toContain("--space: 0.5rem;");
    expect(tokens).toContain("--radius: 0.5rem;");
    expect(tokens).toContain("--size: 1rem;");
    expect(tokens).toContain("--space-fluid: clamp(");
    expect(tokens).toContain("--radius-fluid: clamp(");
    expect(tokens).toContain("--size-fluid: clamp(");
    expect(tokens).not.toMatch(/--space:\s*clamp\(/);
  });

  it("writes space from the theme state", () => {
    const fixed = createDefaultThemeState("dark");
    expect(exportThemeCss(fixed)).not.toContain("--space:");
    expect(exportThemeCss({ ...fixed, space: 0.625 })).toContain("--space: 0.625rem;");
  });

  it("uses the 4px grid for space, with 6px at small", () => {
    expect(tokens).toContain("--space-xsmall: calc(var(--space) * 0.5);");
    expect(tokens).toContain("--space-small: calc(var(--space) * 0.75);");
    expect(tokens).toContain("--space-2xlarge: calc(var(--space) * 3);");
    expect(tokens).toContain("--space-3xlarge: calc(var(--space) * 4);");
    expect(tokens).toContain("--space-4xlarge: calc(var(--space) * 5);");
    expect(tokens).toContain("--space-5xlarge: calc(var(--space) * 6);");
  });

  it("keeps radius-mid between base and large and adds the outer steps", () => {
    expect(tokens).toContain("--radius-mid: calc(var(--radius) * 1.125);");
    expect(app).toContain("--radius-mid: var(--radius-mid);");
    expect(tokens).toContain("--radius-none: 0px;");
    expect(tokens).toContain("--radius-large: calc(var(--radius) * 1.25);");
    expect(tokens).toContain("--radius-2xlarge: calc(var(--radius) * 2);");
    expect(tokens).toContain("--radius-3xlarge: calc(var(--radius) * 3);");
    expect(tokens).toContain("--radius-full: 9999px;");
    expect(tokens).toContain("--selection-indicator-radius-mid: max(0px, calc(var(--radius-mid) - var(--space-xsmall)));");
    expect(tokens).toContain("--radius-nested: max(0px, calc(var(--radius-outer) - var(--radius-pad)));");
    expect(tokens).not.toMatch(/--selection-indicator-radius-[\w-]+: calc\(var\(--radius-[^)]+\) \* 0\.618\)/);
  });

  it("levels mid and large light and adds an xlarge overlay shadow", () => {
    expect(primitives.shadowGeom.mid.rest[0]).toBe(0);
    expect(primitives.shadowGeom.large.rest[0]).toBe(0);
    const blur = primitives.shadowGeom.xlarge.rest[2];
    expect(blur).toBeGreaterThanOrEqual(15);
    expect(blur).toBeLessThanOrEqual(25);
    expect(tokens).toContain("--shadow-xlarge:");
    expect(app).toContain("@utility shadow-token-xlarge");
  });

  it("adds weight 400, header tracking, round icon sizes, and generated breakpoints", () => {
    expect(tokens).toContain("--font-w-regular: 400;");
    expect(tokens).toContain("--letter-spacing-xlarge: -0.02em;");
    expect(tokens).toContain("--letter-spacing-2xlarge: -0.025em;");
    expect(tokens).toContain("--letter-spacing-3xlarge: -0.03em;");
    expect(app).toContain("calc(var(--letter-spacing) + var(--letter-spacing-3xlarge))");
    expect(tokens).toContain("--icon-size-16: var(--size);");
    expect(tokens).toContain("--icon-size-24: calc(var(--size) * 1.5);");
    expect(NARROW_VIEWPORT_MAX_PX).toBe(primitives.breakpoints.lg);
    expect(NARROW_VIEWPORT_MAX_PX).toBe(1024);
    expect(app).toContain(`@media (max-width: ${NARROW_VIEWPORT_MAX_PX}px)`);
    expect(app).toContain("--breakpoint-lg: 1024px;");
  });

  it("pads checkbox, radio, and switch to a 24px hit target", () => {
    expect(app).toContain(".hit-target-24::before");
    expect(CHECKBOX_CONTROL_TRACK_CLASS).toContain("hit-target-24");
    expect(RADIO_CONTROL_CLASS).toContain("hit-target-24");
    expect(SWITCH_CONTROL_BASE_CLASS).toContain("hit-target-24");
    expect(CHECKBOX_INPUT_TRACK_OVERLAY_CLASS).toContain("inset-[min(0px,calc((100%-24px)/2))]");
    expect(CHECKBOX_INPUT_TRACK_OVERLAY_CLASS).not.toContain("h-full");
  });
});
