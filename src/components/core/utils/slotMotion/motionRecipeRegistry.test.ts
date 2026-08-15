import { afterEach, describe, expect, it, vi } from "vitest";

import {
  clearMotionRecipesForTests,
  getMotionRecipe,
  hasMotionRecipe,
  isKitMotionRecipe,
  listMotionRecipes,
  registerKitMotionRecipe,
  registerMotionRecipe,
  unregisterMotionRecipe,
} from "./motionRecipeRegistry";
import { registerKitMotionRecipes } from "./recipes";

afterEach(() => {
  clearMotionRecipesForTests();
  registerKitMotionRecipes();
  vi.restoreAllMocks();
});

describe("motionRecipeRegistry", () => {
  it("registers and replaces custom names without override", () => {
    const first = () => {};
    const second = () => {};
    registerMotionRecipe("custom-test-override", first);
    expect(getMotionRecipe("custom-test-override")).toBe(first);
    registerMotionRecipe("custom-test-override", second);
    expect(getMotionRecipe("custom-test-override")).toBe(second);
  });

  it("does not replace a kit recipe without { override: true }", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const kit = getMotionRecipe("hoverLiftSecondLevel");
    const custom = () => {};
    registerMotionRecipe("hoverLiftSecondLevel", custom);
    expect(getMotionRecipe("hoverLiftSecondLevel")).toBe(kit);
    expect(custom).not.toBe(kit);
    expect(warn).toHaveBeenCalled();
  });

  it("replaces a kit recipe with { override: true } and restores on unregister", () => {
    const kit = getMotionRecipe("pressSqueeze");
    const custom = () => {};
    registerMotionRecipe("pressSqueeze", custom, { override: true });
    expect(getMotionRecipe("pressSqueeze")).toBe(custom);
    expect(unregisterMotionRecipe("pressSqueeze")).toBe(true);
    expect(getMotionRecipe("pressSqueeze")).toBe(kit);
  });

  it("does not let registerKitMotionRecipes wipe an app override", () => {
    const custom = () => {};
    registerMotionRecipe("pressSqueeze", custom, { override: true });
    registerKitMotionRecipes();
    expect(getMotionRecipe("pressSqueeze")).toBe(custom);
  });

  it("updates the kit layer without dropping an app override", () => {
    const custom = () => {};
    const nextKit = () => {};
    registerMotionRecipe("chevronRotate", custom, { override: true });
    registerKitMotionRecipe("chevronRotate", nextKit);
    expect(getMotionRecipe("chevronRotate")).toBe(custom);
    unregisterMotionRecipe("chevronRotate");
    expect(getMotionRecipe("chevronRotate")).toBe(nextKit);
    registerKitMotionRecipes();
  });

  it("has / list / isKitMotionRecipe", () => {
    expect(isKitMotionRecipe("hoverLiftFirstLevel")).toBe(true);
    expect(isKitMotionRecipe("myAppLift")).toBe(false);
    expect(hasMotionRecipe("hoverLiftFirstLevel")).toBe(true);
    expect(hasMotionRecipe("myAppLift")).toBe(false);
    registerMotionRecipe("myAppLift", () => {});
    expect(hasMotionRecipe("myAppLift")).toBe(true);
    expect(listMotionRecipes()).toContain("hoverLiftFirstLevel");
    expect(listMotionRecipes()).toContain("myAppLift");
  });

  it("skips an empty name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    registerMotionRecipe("", () => {});
    expect(hasMotionRecipe("")).toBe(false);
    expect(warn).toHaveBeenCalled();
  });
});
