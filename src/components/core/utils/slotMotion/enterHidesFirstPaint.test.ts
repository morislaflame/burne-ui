import { describe, expect, it } from "vitest";

import { enterHidesFirstPaint } from "./enterHidesFirstPaint";

describe("enterHidesFirstPaint", () => {
  it("is false for skip / factory / missing", () => {
    expect(enterHidesFirstPaint(undefined)).toBe(false);
    expect(enterHidesFirstPaint(false)).toBe(false);
    expect(enterHidesFirstPaint(() => {})).toBe(false);
  });

  it("hides vars that set autoAlpha, unless firstPaint is visible", () => {
    expect(enterHidesFirstPaint({ y: 8, autoAlpha: 0 })).toBe(true);
    expect(enterHidesFirstPaint({ autoAlpha: 1 })).toBe(true);
    expect(enterHidesFirstPaint({ autoAlpha: 0, firstPaint: "visible" })).toBe(false);
  });

  it("honors explicit firstPaint on vars / recipe wrapper", () => {
    expect(enterHidesFirstPaint({ firstPaint: "hidden" })).toBe(true);
    expect(enterHidesFirstPaint({ recipe: "myFade", firstPaint: "hidden" })).toBe(true);
    expect(enterHidesFirstPaint({ y: 8, firstPaint: "visible" })).toBe(false);
  });

  it("hides kit contentFade by name; not host portal recipes", () => {
    expect(enterHidesFirstPaint("contentFade")).toBe(true);
    expect(enterHidesFirstPaint({ recipe: "contentFade" })).toBe(true);
    expect(enterHidesFirstPaint("portalSurfaceEnter")).toBe(false);
    expect(enterHidesFirstPaint("modalPanelEnter")).toBe(false);
    expect(enterHidesFirstPaint("hoverLiftSecondLevel")).toBe(false);
  });
});
