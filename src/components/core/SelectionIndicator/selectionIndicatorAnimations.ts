/**
 * Slot motion for SelectionIndicator — look here first.
 *
 * DOM slots: `root` (shell), `fill`, `mark`
 * Host: `useSelectionIndicatorAnimation` plays `check` / `uncheck`.
 * Defaults: `SELECTION_INDICATOR_MOTION_DEFAULTS`.
 * Checkbox (and Radio / ListBox) embed this host via mapped slot names.
 */
import { useLayoutEffect, useRef, type RefObject } from "react";
 
import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { killMotion } from "@/components/core/utils/gsapMotion";
import { isMotionFeatureEnabledFor } from "@/components/core/utils/motionConfig";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { playSelectionFill, snapSelectionFill } from "@/components/core/utils/slotMotion/recipes/selectionFill";
import { playSelectionMark, snapSelectionMark } from "@/components/core/utils/slotMotion/recipes/selectionMark";
 
import {
  useOptionalSelectionIndicatorMotionScope,
  useSelectionIndicatorContext,
} from "./selectionIndicatorContext";
import { overlaySkinMotion } from "@/skins/resolveVariantVisual";

import type { SelectionIndicatorMotion, SelectionIndicatorVariant } from "./selectionIndicatorTypes";
import { KIT_SELECTION_INDICATOR_VARIANTS } from "./selectionIndicatorTypes";

import { bindSelectionRecipes } from "@/components/core/utils/slotMotion/recipes/bindSelection";

bindSelectionRecipes();
 
export const SELECTION_INDICATOR_MOTION_DEFAULTS: SelectionIndicatorMotion = {
  fill: { check: "selectionFill", uncheck: "selectionFill" },
  mark: { check: "selectionMark", uncheck: "selectionMark" },
};

export function resolveSelectionIndicatorMotionDefaults(
  variant: SelectionIndicatorVariant,
): SelectionIndicatorMotion {
  return overlaySkinMotion(
    SELECTION_INDICATOR_MOTION_DEFAULTS,
    variant,
    KIT_SELECTION_INDICATOR_VARIANTS,
    "selectionIndicator",
  );
}
 
export function useSelectionIndicatorAnimation(
  active: boolean,
  fillRef?: RefObject<HTMLElement | null>,
  iconRef?: RefObject<HTMLElement | null>,
) {
  const config = useMotionConfig();
  const scope = useOptionalSelectionIndicatorMotionScope();
  const firstLayoutRef = useRef(true);
  const reduceMotion =
    usePrefersReducedMotion() ||
    !isMotionFeatureEnabledFor(config, "enableSelectionFill");
 
  useLayoutEffect(() => {
    const fill = fillRef?.current;
    const icon = iconRef?.current;
 
    // Refs attach in the same commit — don't consume firstLayout if Fill/Mark aren't in the DOM yet.
    if (!fill && !icon) return;
 
    if (firstLayoutRef.current) {
      firstLayoutRef.current = false;
      if (fill) {
        killMotion(fill);
        snapSelectionFill(fill, active);
      }
      if (icon) {
        killMotion(icon);
        snapSelectionMark(icon, active);
      }
      return;
    }
 
    const phase = active ? "check" : "uncheck";
 
    if (scope) {
      const root = scope.getTarget("root");
      if (root) scope.play("root", phase, { el: root });
      if (fill) scope.play("fill", phase, { el: fill });
      if (icon) scope.play("mark", phase, { el: icon });
      return;
    }
 
    if (reduceMotion) {
      if (fill) {
        killMotion(fill);
        snapSelectionFill(fill, active);
      }
      if (icon) {
        killMotion(icon);
        snapSelectionMark(icon, active);
      }
      return;
    }
 
    if (fill) {
      killMotion(fill);
      playSelectionFill(fill, active, config);
    }
 
    if (icon) {
      killMotion(icon);
      playSelectionMark(icon, active, config);
    }
  }, [active, config, fillRef, iconRef, reduceMotion, scope]);
}
 
export function SelectionIndicatorMotionSync({
  selected,
  showsFill,
  hasMark,
}: {
  selected: boolean;
  showsFill: boolean;
  hasMark: boolean;
}) {
  const ctx = useSelectionIndicatorContext();
  useSelectionIndicatorAnimation(
    selected,
    showsFill ? ctx.fillRef : undefined,
    hasMark ? ctx.markRef : undefined,
  );
  return null;
}
 