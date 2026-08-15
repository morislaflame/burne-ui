import { describe, expect, it } from "vitest";

import { mergeMotionSlotMaps, resolveMotionValue, resolveSlotPhase } from "./resolveMotionValue";
import { MOTION_PHASE_NAMES, type MotionValue } from "./slotMotionTypes";

describe("MOTION_PHASE_NAMES", () => {
  it("includes change as a standard phase", () => {
    expect(MOTION_PHASE_NAMES).toContain("change");
    expect(MOTION_PHASE_NAMES).toHaveLength(9);
  });
});

describe("resolveMotionValue", () => {
  it("prefers part over slot over default", () => {
    expect(resolveMotionValue("selectionFill", "hoverLiftGloss", "hoverLiftSecondLevel")).toBe(
      "selectionFill",
    );
    expect(resolveMotionValue(undefined, "hoverLiftGloss", "hoverLiftSecondLevel")).toBe(
      "hoverLiftGloss",
    );
    expect(resolveMotionValue(undefined, undefined, "hoverLiftSecondLevel")).toBe(
      "hoverLiftSecondLevel",
    );
  });

  it("treats false as a real disable, not a fallthrough", () => {
    expect(resolveMotionValue(false, "hoverLiftSecondLevel", "hoverLiftGloss")).toBe(false);
    expect(resolveMotionValue(undefined, false, "hoverLiftSecondLevel")).toBe(false);
  });
});

describe("resolveSlotPhase", () => {
  it("reads the named phase from part / root / defaults", () => {
    const value: MotionValue = { y: -2, duration: 0.2 };
    expect(
      resolveSlotPhase(
        "title",
        "hoverIn",
        { hoverIn: value },
        { title: { hoverIn: "hoverLiftSecondLevel" } },
        { title: { hoverIn: false } },
      ),
    ).toBe(value);
  });

  it("reads change from the base phase contract", () => {
    const change: MotionValue = { scale: 1.02, duration: 0.12 };
    expect(
      resolveSlotPhase(
        "track",
        "change",
        { change },
        { track: { hoverIn: "hoverLiftFirstLevel" } },
        undefined,
      ),
    ).toBe(change);
  });

  it("prefers a fill factory on the root map over the kit recipe default", () => {
    const check = () => {};
    expect(
      resolveSlotPhase(
        "fill",
        "check",
        undefined,
        { fill: { check, uncheck: false } },
        { fill: { check: "selectionFill", uncheck: "selectionFill" } },
      ),
    ).toBe(check);
  });
});

describe("mergeMotionSlotMaps", () => {
  it("merges per-slot phase objects, override wins", () => {
    const merged = mergeMotionSlotMaps(
      { root: { hoverIn: "hoverLiftSecondLevel" }, title: { hoverIn: false } },
      { title: { hoverIn: { y: -2 } } },
    );
    expect(merged?.root?.hoverIn).toBe("hoverLiftSecondLevel");
    expect(merged?.title?.hoverIn).toEqual({ y: -2 });
  });
});
