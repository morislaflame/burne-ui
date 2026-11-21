import { describe, expect, it, vi } from "vitest";

import { mergeMotionSlotMaps, resolveMotionValue, resolveSlotPhase } from "./resolveMotionValue";
import { MOTION_PHASE_NAMES, type MotionValue } from "./slotMotionTypes";

describe("MOTION_PHASE_NAMES", () => {
  it("includes change as a standard phase", () => {
    expect(MOTION_PHASE_NAMES).toContain("change");
    expect(MOTION_PHASE_NAMES).toContain("mount");
    expect(MOTION_PHASE_NAMES).toHaveLength(10);
  });
});

describe("resolveMotionValue", () => {
  it("prefers part over slot over default", () => {
    expect(resolveMotionValue("selectionFill", "customLift", "hoverLiftSecondLevel")).toBe(
      "selectionFill");
    expect(resolveMotionValue(undefined, "customLift", "hoverLiftSecondLevel")).toBe(
      "customLift");
    expect(resolveMotionValue(undefined, undefined, "hoverLiftSecondLevel")).toBe(
      "hoverLiftSecondLevel");
  });

  it("treats false as a real disable, not a fallthrough", () => {
    expect(resolveMotionValue(false, "hoverLiftSecondLevel", "customLift")).toBe(false);
    expect(resolveMotionValue(undefined, false, "hoverLiftSecondLevel")).toBe(false);
  });

  it("warns once when the winning map carries a layout key", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const value = { width: 120, y: -2 } as MotionValue;
    expect(resolveMotionValue(value, undefined, undefined)).toBe(value);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain("width");
    resolveMotionValue(value, undefined, undefined);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it("warns for margin longhands and skips a transform-only map", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    resolveMotionValue({ y: -2 }, undefined, undefined);
    expect(warn).not.toHaveBeenCalled();
    resolveMotionValue({ marginTop: 8 } as MotionValue, undefined, undefined);
    expect(String(warn.mock.calls[0]?.[0])).toContain("marginTop");
    warn.mockRestore();
  });

  it("does not warn for the SearchInput searchExpand recipe", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(resolveMotionValue(undefined, "searchExpand", "hoverLiftSecondLevel")).toBe("searchExpand");
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("does not warn for a layout key that lost precedence", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(resolveMotionValue("pressSqueeze", { width: 40 } as MotionValue, undefined)).toBe(
      "pressSqueeze",
    );
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
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
        { title: { hoverIn: false } })).toBe(value);
  });

  it("reads change from the base phase contract", () => {
    const change: MotionValue = { scale: 1.02, duration: 0.12 };
    expect(
      resolveSlotPhase(
        "track",
        "change",
        { change },
        { track: { hoverIn: "hoverLiftFirstLevel" } },
        undefined)).toBe(change);
  });

  it("prefers a fill factory on the root map over the kit recipe default", () => {
    const check = () => {};
    expect(
      resolveSlotPhase(
        "fill",
        "check",
        undefined,
        { fill: { check, uncheck: false } },
        { fill: { check: "selectionFill", uncheck: "selectionFill" } })).toBe(check);
  });
});

describe("mergeMotionSlotMaps", () => {
  it("merges per-slot phase objects, override wins", () => {
    const merged = mergeMotionSlotMaps(
      { root: { hoverIn: "hoverLiftSecondLevel" }, title: { hoverIn: false } },
      { title: { hoverIn: { y: -2 } } });
    expect(merged?.root?.hoverIn).toBe("hoverLiftSecondLevel");
    expect(merged?.title?.hoverIn).toEqual({ y: -2 });
  });
});
