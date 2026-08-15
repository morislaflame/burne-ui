/**
 * Slot motion for SelectionThumb — look here first.
 *
 * DOM slots: `root` (shell), `icon` (`SelectionThumb.Icon`)
 *
 * Host: root plays optional `enter`. Pointer phases only when set.
 * Defaults: empty. Switch / Slider hosts keep their own motion; this scope
 * is for standalone / explicit `motion`.
 */
import type { SelectionThumbMotion } from "./selectionThumbTypes";

export function resolveSelectionThumbMotionDefaults(): SelectionThumbMotion {
  return {};
}
