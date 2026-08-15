import { describe, expect, it } from "vitest";

import { getMotionRecipe, registerMotionRecipe } from "./motionRecipeRegistry";
import { mergeMotionSlotMaps, resolveMotionValue, resolveSlotPhase } from "./resolveMotionValue";
import type { MotionValue } from "./slotMotionTypes";

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

describe("motionRecipeRegistry", () => {
  it("registers and replaces recipes by name", () => {
    const first = () => {};
    const second = () => {};
    registerMotionRecipe("custom-test-override", first);
    expect(getMotionRecipe("custom-test-override")).toBe(first);
    registerMotionRecipe("custom-test-override", second);
    expect(getMotionRecipe("custom-test-override")).toBe(second);
  });
});
