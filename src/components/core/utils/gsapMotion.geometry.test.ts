import { afterEach, describe, expect, it } from "vitest";

import { gsap, killMotionGeometry } from "./gsapMotion";

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
});
