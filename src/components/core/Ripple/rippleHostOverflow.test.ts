import { describe, expect, it } from "vitest";

import { BUTTON_BASE_INTERACTIVE_CLASS } from "@/components/core/Button/buttonStyles";
import { CLOSE_BUTTON_ROOT_BASE_CLASS } from "@/components/core/CloseButton/closeButtonStyles";
import { RIPPLE_LAYER_CLASS } from "@/components/core/Ripple/rippleStyles";
import { TOGGLE_BUTTON_ROOT_BASE_CLASS } from "@/components/core/ToggleButton/toggleButtonStyles";

const OVERFLOW_HIDDEN = /\boverflow-hidden\b/;

describe("Э1.7 ripple clip is on the inner layer", () => {
  it("does not clip hover elevation on Button / ToggleButton / CloseButton roots", () => {
    expect(BUTTON_BASE_INTERACTIVE_CLASS).not.toMatch(OVERFLOW_HIDDEN);
    expect(TOGGLE_BUTTON_ROOT_BASE_CLASS).not.toMatch(OVERFLOW_HIDDEN);
    expect(CLOSE_BUTTON_ROOT_BASE_CLASS).not.toMatch(OVERFLOW_HIDDEN);
  });

  it("clips the wave on the Ripple layer", () => {
    expect(RIPPLE_LAYER_CLASS).toContain("overflow-hidden");
    expect(RIPPLE_LAYER_CLASS).toContain("rounded-[inherit]");
  });
});
