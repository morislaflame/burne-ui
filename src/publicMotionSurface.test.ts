import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const root = dirname(fileURLToPath(import.meta.url));

/** Runtime and type names that §4.6 moved off the app entry. */
const INTERNAL_MOTION = [
  "getMotionConfig",
  "overlayMotionConfig",
  "MOTION_CONFIG_LIMITS",
  "MOTION_RECIPE_METADATA_DEFAULTS",
  "KIT_MOTION_RECIPE_META",
  "isKitMotionRecipe",
  "listMotionRecipes",
  "hasMotionRecipe",
  "unregisterMotionRecipe",
  "isMotionRunActive",
  "killMotion",
  "tweenCssColor",
  "resolveCssColor",
  "playShadowFade",
  "snapShadowFade",
  "removeShadowFadeHost",
  "resolveAdaptiveHoverLiftScale",
  "resolveAdaptivePressSqueezeScale",
  "shouldSkipInteractiveHoverLift",
  "motionPressSqueezeTotalFor",
  "MotionCancelReason",
  "KIT_MOTION_RECIPES",
] as const;

const APP_MOTION = [
  "configureMotion",
  "MotionConfigProvider",
  "useMotionConfig",
  "createMotionController",
  "useMotionControllerHandle",
  "useMotionController",
  "createMotionGroup",
  "useMotionGroupHandle",
  "useMotionGroup",
  "createMotionEvents",
  "createMotionStates",
  "createMotionFactory",
  "registerMotionRecipe",
  "registerMotionPlugins",
  "MOTION_PHASE_NAMES",
  "prefersReducedMotion",
  "MotionController",
  "MotionMapWithEvents",
  "MotionStateHostProps",
  "MotionRun",
  "MotionBroadcastOptions",
  "MotionValue",
  "MotionConfig",
  "MotionContext",
] as const;

function exportNames(source: string): Set<string> {
  const names = new Set<string>();
  for (const block of source.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)) {
    for (const part of block[1].split(",")) {
      const spec = part.trim().replace(/^type\s+/, "");
      const name = spec.split(/\s+as\s+/).pop()?.trim();
      if (name) names.add(name);
    }
  }
  return names;
}

describe("public motion surface", () => {
  const index = exportNames(readFileSync(join(root, "index.ts"), "utf8"));
  const internal = exportNames(readFileSync(join(root, "internal.ts"), "utf8"));

  it("keeps the app motion API on burne-ui", () => {
    for (const name of APP_MOTION) {
      expect(index.has(name), name).toBe(true);
    }
  });

  it("moves the low-level motion API to burne-ui/internal", () => {
    for (const name of INTERNAL_MOTION) {
      expect(index.has(name), `${name} still on the root`).toBe(false);
      expect(internal.has(name), `${name} missing from internal`).toBe(true);
    }
  });
});
