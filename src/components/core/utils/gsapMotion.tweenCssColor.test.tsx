import { afterEach, describe, expect, it } from "vitest";

import { setReducedMotion } from "@/__tests__/helpers";

import { tweenCssColor } from "./gsapMotion";

describe("tweenCssColor", () => {
  afterEach(() => {
    setReducedMotion(true);
    document.body.replaceChildren();
  });

  it("pauses the CSS color transition while GSAP owns the tween", () => {
    setReducedMotion(false);
    const el = document.createElement("span");
    el.style.transition = "color 1s linear";
    el.style.color = "rgb(0, 0, 0)";
    document.body.appendChild(el);

    const tween = tweenCssColor(el, "rgb(255, 0, 0)", { duration: 1 });
    expect(el.style.transition).toBe("none");

    tween.progress(1);
    expect(el.style.transition).toBe("color 1s linear");
  });

  it("restores the transition when the tween is killed", () => {
    setReducedMotion(false);
    const el = document.createElement("span");
    el.style.transition = "color 1s linear";
    document.body.appendChild(el);

    const tween = tweenCssColor(el, "rgb(0, 128, 0)", { duration: 1 });
    expect(el.style.transition).toBe("none");
    tween.kill();
    expect(el.style.transition).toBe("color 1s linear");
  });

  it("clears the inline color after the transition is restored", () => {
    setReducedMotion(false);
    const el = document.createElement("span");
    document.body.appendChild(el);

    const tween = tweenCssColor(el, "rgb(0, 0, 255)", {
      duration: 1,
      clearOnComplete: true,
    });
    tween.progress(1);
    expect(el.style.transition).toBe("");
    expect(el.style.color).toBe("");
  });
});
