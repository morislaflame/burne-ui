import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { gsap } from "@/components/core/utils/gsapMotion";

import {
  clearMotionRecipesForTests,
  registerMotionRecipe,
  unregisterMotionRecipe,
} from "../motionRecipeRegistry";
import { runMotionPhase } from "../runMotionPhase";
import { registerKitMotionRecipes } from "./index";

vi.mock("@/components/core/utils/reducedMotion", () => ({
  prefersReducedMotion: vi.fn(() => false),
}));

function fakeEl(): HTMLElement {
  return { style: { willChange: "" }, dataset: {} } as HTMLElement;
}

function play(recipe: string, phase: "enter" | "leave" | "check" | "uncheck") {
  runMotionPhase({
    el: fakeEl(),
    phase,
    value: recipe,
    targets: {},
    getTarget: () => null,
    getTargets: () => [],
    slot: "probe",
  });
}

beforeEach(() => {
  clearMotionRecipesForTests();
  registerKitMotionRecipes();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("recipe override replaces the kit tween", () => {
  it.each(["contentFade", "selectionFill", "chevronRotate"] as const)(
    "%s",
    (name) => {
      const to = vi.spyOn(gsap, "to").mockReturnValue({ kill() {} } as unknown as gsap.core.Tween);
      const fromTo = vi.spyOn(gsap, "fromTo").mockReturnValue({ kill() {} } as unknown as gsap.core.Tween);
      const phase = name === "selectionFill" ? "check" : "enter";
      play(name, phase);
      expect(to.mock.calls.length + fromTo.mock.calls.length).toBeGreaterThan(0);

      to.mockClear();
      fromTo.mockClear();
      const custom = vi.fn();
      registerMotionRecipe(name, custom, { override: true });
      play(name, phase);
      expect(custom).toHaveBeenCalled();
      expect(to).not.toHaveBeenCalled();
      expect(fromTo).not.toHaveBeenCalled();
      unregisterMotionRecipe(name);
    },
  );
});
