/**
 * Slot motion for SelectionThumb — look here first.
 *
 * DOM slots: `root` (shell), `icon` (`SelectionThumb.Icon`)
 *
 * Host: root plays optional `enter`. Pointer phases only when set.
 * Defaults: empty. Switch / Slider hosts keep their own motion; this scope
 * is for standalone / explicit `motion`. A skin overlays its own recipes.
 */
import { overlaySkinMotion } from "@/skins/resolveVariantVisual";

import {
  KIT_SELECTION_THUMB_VARIANTS,
  type SelectionThumbMotion,
  type SelectionThumbVariant,
} from "./selectionThumbTypes";

export function resolveSelectionThumbMotionDefaults(
  variant: SelectionThumbVariant = "default",
): SelectionThumbMotion {
  return overlaySkinMotion({}, variant, KIT_SELECTION_THUMB_VARIANTS, "selectionThumb");
}
