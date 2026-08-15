import { describe, expect, it } from "vitest";

import { resolveSlotPhase } from "@/components/core/utils/slotMotion";

import {
  CHECKBOX_MOTION_SLOT_MAP,
  resolveCheckboxIndicatorMotion,
} from "./checkboxAnimations";

describe("resolveCheckboxIndicatorMotion", () => {
  it("maps root indicatorFill onto the SelectionIndicator fill slot", () => {
    expect(CHECKBOX_MOTION_SLOT_MAP.indicatorFill).toBe("fill");

    const check = () => {};
    const uncheck = () => {};
    const mapped = resolveCheckboxIndicatorMotion({
      rootMotion: { indicatorFill: { check, uncheck } },
    });

    expect(
      resolveSlotPhase(
        "fill",
        "check",
        undefined,
        mapped,
        { fill: { check: "selectionFill", uncheck: "selectionFill" } },
      ),
    ).toBe(check);
    expect(
      resolveSlotPhase(
        "fill",
        "uncheck",
        undefined,
        mapped,
        { fill: { check: "selectionFill", uncheck: "selectionFill" } },
      ),
    ).toBe(uncheck);
  });
});
