import { describe, expect, it } from "vitest";

import { removeShadowFadeHost, snapShadowFade } from "./shadowFade";

describe("shadow fade hosts", () => {
  it("keeps a plugin kind off the kit elevation host", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);

    snapShadowFade(element, "rest", "elevation");
    snapShadowFade(element, "hover", "gloss");

    const elevation = element.querySelector('[data-burne-shadow-fade="elevation"]');
    const gloss = element.querySelector('[data-burne-shadow-fade="gloss"]');
    expect(elevation).toBeInstanceOf(HTMLElement);
    expect(gloss).toBeInstanceOf(HTMLElement);
    expect(elevation).not.toBe(gloss);
    expect(gloss?.getAttribute("data-burne-shadow-fade")).toBe("gloss");

    removeShadowFadeHost(element, "gloss");
    expect(element.querySelector('[data-burne-shadow-fade="elevation"]')).toBe(elevation);
    expect(element.querySelector('[data-burne-shadow-fade="gloss"]')).toBeNull();

    element.remove();
  });
});
