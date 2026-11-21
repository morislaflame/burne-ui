/**
 * Slot motion for Surface — look here first.
 *
 * DOM slots: `root`
 *
 * Not a slot: `Content` (layout wrapper).
 * Host: `SkinShell part="surface.root"` registers `root` (`useMotionPart` + enter).
 * Pointer phases only when `motion.root` sets them.
 * Defaults: empty.
 */
import { overlaySkinMotion } from "@/skins/resolveVariantVisual";

import type { SurfaceMotion, SurfaceVariant } from "./surfaceTypes";
import { KIT_SURFACE_VARIANTS } from "./surfaceTypes";

export function resolveSurfaceMotionDefaults(variant: SurfaceVariant = "default"): SurfaceMotion {
  return overlaySkinMotion({}, variant, KIT_SURFACE_VARIANTS, "surface");
}
 