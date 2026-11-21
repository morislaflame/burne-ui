import { afterEach, describe, expect, it } from "vitest";

import { KIT_MOTION_RECIPES } from "@/components/core/utils/slotMotion/slotMotionTypes";
import { getMotionRecipeMetadata } from "@/components/core/utils/slotMotion/motionRecipeRegistry";
import { KIT_MOTION_RECIPE_NAMES } from "../../cli/skin-recipe.mjs";
import { defineSkin, defineSkinRecipe, skinRecipeName } from "./defineSkin";
import { clearSkinsForTests, hasSkin } from "./skinRegistry";

describe("defineSkin", () => {
  afterEach(() => {
    clearSkinsForTests();
  });

  it("registers a namespaced hover recipe as interactive", () => {
    expect(skinRecipeName("gloss", "hover")).toBe("gloss:hover");
    const hover = defineSkinRecipe("gloss", "hover", () => undefined);
    const prepare = defineSkinRecipe("gloss", "prepare", () => undefined);
    expect(hover).toBe("gloss:hover");
    expect(getMotionRecipeMetadata(hover)?.interactive).toBe(true);
    expect(getMotionRecipeMetadata(prepare)?.interactive).toBe(false);
    defineSkin({ name: "gloss" });
    expect(hasSkin("gloss")).toBe(true);
  });

  it("keeps the CLI kit recipe list aligned", () => {
    expect([...KIT_MOTION_RECIPE_NAMES]).toEqual([...KIT_MOTION_RECIPES]);
  });
});
