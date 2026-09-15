import { describe, expect, it } from "vitest";

import {
  animateSearchIconShift,
  animateSearchShellExpand,
  applySearchExpandInstant,
  iconLeftCollapsedPx,
  searchShellRadiusForWidth,
  type SearchExpandMetrics,
} from "./searchInputExpandMotion";

const METRICS: SearchExpandMetrics = {
  targetW: 280,
  collapsedDim: 36,
  expandedRadius: 8,
  padX: 12,
  iconBox: 16,
  iconLeftCollapsedCss: "calc(50% - 8px)",
};

function fakeEl(width = 36): HTMLElement {
  const store: Record<string, string> = {};
  const style = new Proxy(store, {
    get(target, prop) {
      if (prop === "removeProperty") {
        return (name: string) => {
          delete target[name];
          return "";
        };
      }
      return target[prop as string] ?? "";
    },
    set(target, prop, value) {
      target[prop as string] = String(value);
      return true;
    },
  });
  const node = {
    style,
    offsetWidth: width,
    clientWidth: width,
    getBoundingClientRect() {
      const w = store.width ? Number.parseFloat(store.width) : width;
      const left = w > 100 ? 0 : 244;
      return { left, top: 0, right: left + w, bottom: 36, width: w, height: 36 };
    },
  };
  return node as unknown as HTMLElement;
}

describe("searchInputExpandMotion layout exception", () => {
  it("tweens shell width and borderRadius, not scaleX/height/left", () => {
    const shell = fakeEl();
    applySearchExpandInstant(shell, null, false, METRICS);
    const tween = animateSearchShellExpand(shell, true, METRICS);

    expect(tween.vars.width).toBe(280);
    expect(tween.vars.borderRadius).toBe(8);
    expect(tween.vars.scaleX).toBeUndefined();
    expect(tween.vars.x).toBeUndefined();
    expect(tween.vars.height).toBeUndefined();
    expect(tween.vars.left).toBeUndefined();
    expect(tween.vars.force3D).toBe(false);
    expect(tween.duration()).toBeGreaterThan(0.1);

    tween.kill();
  });

  it("collapses to collapsedDim width and half-height radius", () => {
    const shell = fakeEl();
    applySearchExpandInstant(shell, null, true, METRICS);
    const tween = animateSearchShellExpand(shell, false, METRICS);

    expect(tween.vars.width).toBe(36);
    expect(tween.vars.borderRadius).toBe(18);
    expect(tween.vars.scaleX).toBeUndefined();

    tween.kill();
  });

  it("snaps icon left and tweens x, not left or scaleX", () => {
    const shell = fakeEl();
    const icon = fakeEl();
    const tween = animateSearchIconShift(icon, shell, true, METRICS);

    expect(icon.style.left).toBe("12px");
    expect(tween.vars.left).toBeUndefined();
    expect(tween.vars.x).toBe(0);
    expect(tween.vars.scaleX).toBeUndefined();

    tween.kill();
  });

  it("instant path clears transforms and does not set height", () => {
    const shell = fakeEl();
    const icon = fakeEl();
    applySearchExpandInstant(shell, icon, false, METRICS);

    expect(shell.style.width).toBe("");
    expect(shell.style.height).toBe("");
    expect(icon.style.left).toBe(METRICS.iconLeftCollapsedCss);
  });

  it("right-aligned expand does not use FLIP x/scaleX (layout width grows)", () => {
    const shell = fakeEl(36);
    applySearchExpandInstant(shell, null, false, METRICS);
    const tween = animateSearchShellExpand(shell, true, METRICS);
    expect(tween.vars.x).toBeUndefined();
    expect(tween.vars.scaleX).toBeUndefined();
    expect(tween.vars.width).toBe(280);
    tween.kill();
  });

  it("starts width from the current box when interrupted", () => {
    const shell = fakeEl();
    applySearchExpandInstant(shell, null, false, METRICS);
    shell.style.width = "120px";
    const tween = animateSearchShellExpand(shell, true, METRICS);
    expect(searchShellRadiusForWidth(120, METRICS)).toBeCloseTo(
      18 + ((120 - 36) / (280 - 36)) * (8 - 18),
    );
    expect(tween.vars.width).toBe(280);
    tween.kill();
  });

  it("computes collapsed icon left from measured geometry once", () => {
    expect(iconLeftCollapsedPx(METRICS, 2)).toBe((36 - 2 - 16) / 2);
  });
});
