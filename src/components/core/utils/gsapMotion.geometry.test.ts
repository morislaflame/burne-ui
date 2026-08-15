import { afterEach, describe, expect, it } from "vitest";

import { gsap, killMotion, killMotionGeometry, setWillChangeTransform } from "./gsapMotion";

function stylable(willChange = "transform") {
  return { style: { willChange } };
}

describe("killMotion will-change cleanup", () => {
  afterEach(() => {
    gsap.globalTimeline.clear();
  });

  it("clears will-change after start → kill on a stylable target", () => {
    const el = stylable("");
    setWillChangeTransform(el, true);
    gsap.to(el, { x: 12, duration: 10 });
    expect(el.style.willChange).toBe("transform");

    killMotion(el);

    expect(el.style.willChange).toBe("");
    expect(gsap.getTweensOf(el).length).toBe(0);
  });

  it("clears will-change on SVG-like nodes that are not HTMLElement", () => {
    const svg = stylable("transform");
    killMotion(svg);
    expect(svg.style.willChange).toBe("");
  });

  it("clears will-change on NodeList-like and nested arrays", () => {
    const a = stylable("transform");
    const b = stylable("transform");
    const c = stylable("transform");
    const list = { 0: a, 1: b, length: 2 };

    killMotion(list, [c]);

    expect(a.style.willChange).toBe("");
    expect(b.style.willChange).toBe("");
    expect(c.style.willChange).toBe("");
  });

  it("clears will-change from a tween.targets() handle", () => {
    const el = stylable("transform");
    const handle = { targets: () => [el] };

    killMotion(handle as unknown as gsap.TweenTarget);

    expect(el.style.willChange).toBe("");
  });
});

describe("killMotionGeometry", () => {
  afterEach(() => {
    gsap.globalTimeline.clear();
  });

  it("does not kill a parent opacity enter tween", () => {
    const parent = { opacity: 1, y: 0, style: { willChange: "" } };
    const fill = { width: 40, style: { willChange: "" } };
    gsap.ticker.lagSmoothing(0);

    gsap.to(parent, { opacity: 0, y: 6, duration: 10 });
    gsap.to(fill, { width: 80, duration: 10 });

    killMotionGeometry(fill as unknown as HTMLElement);

    expect(gsap.getTweensOf(parent).length).toBeGreaterThan(0);
  });

  it("clears will-change on geometry targets", () => {
    const fill = stylable("transform");
    killMotionGeometry(fill);
    expect(fill.style.willChange).toBe("");
  });
});
