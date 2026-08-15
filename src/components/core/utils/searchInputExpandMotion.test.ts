import { describe, expect, it } from "vitest";

import {
  animateSearchIconShift,
  animateSearchShellExpand,
  applySearchExpandInstant,
  iconLeftCollapsedPx,
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

describe("searchInputExpandMotion FLIP", () => {
  it("snaps layout width and does not tween width/height/left", () => {
    const shell = fakeEl();
    const tween = animateSearchShellExpand(shell, true, METRICS);

    expect(shell.style.width).toBe("280px");
    expect(tween.vars.width).toBeUndefined();
    expect(tween.vars.height).toBeUndefined();
    expect(tween.vars.left).toBeUndefined();
    expect(tween.vars.x).toBe(0);
    expect(tween.vars.scaleX).toBe(1);
    expect(tween.vars.force3D).toBe(false);

    tween.kill();
  });

  it("snaps icon left and tweens x, not left", () => {
    const shell = fakeEl();
    const icon = fakeEl();
    const tween = animateSearchIconShift(icon, shell, true, METRICS);

    expect(icon.style.left).toBe("12px");
    expect(tween.vars.left).toBeUndefined();
    expect(tween.vars.x).toBe(0);
    expect(tween.vars.scaleX).toBe(1);

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

  it("inverts x when the shell is right-aligned so the first frame does not jump", () => {
    const shell = fakeEl(36);
    applySearchExpandInstant(shell, null, false, METRICS);
    const tween = animateSearchShellExpand(shell, true, METRICS);
    expect(shell.style.width).toBe("280px");
    expect(tween.vars.x).toBe(0);
    expect(tween.vars.scaleX).toBe(1);
    tween.kill();
  });

  it("computes collapsed icon left from measured geometry once", () => {
    expect(iconLeftCollapsedPx(METRICS, 2)).toBe((36 - 2 - 16) / 2);
  });
});
