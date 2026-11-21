import { afterEach, describe, expect, it, vi } from "vitest";

import { applySwitchThumbInstant } from "./switchThumb";

function fakeEl(): HTMLElement {
  return { style: { transform: "", willChange: "" } } as HTMLElement;
}

describe("switch thumb travel", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("moves the checked thumb toward the inline end", () => {
    const ltr = fakeEl();
    applySwitchThumbInstant(ltr, true, 18);
    expect(ltr.style.transform).toBe("translate(18px, 0)");

    vi.stubGlobal("getComputedStyle", () => ({ direction: "rtl" }));
    const rtl = fakeEl();
    applySwitchThumbInstant(rtl, true, 18);
    expect(rtl.style.transform).toBe("translate(-18px, 0)");
  });
});
