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
import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { isMotionFeatureEnabled, motionSelectionFill } from "@/components/core/utils/motionConfig";

import {
  useOptionalSelectionIndicatorMotionScope,
  useSelectionIndicatorContext,
} from "./selectionIndicatorContext";
import type { SelectionIndicatorMotion } from "./selectionIndicatorTypes";

export const SELECTION_INDICATOR_MOTION_DEFAULTS: SelectionIndicatorMotion = {
  fill: { check: "selectionFill", uncheck: "selectionFill" },
  mark: { check: "selectionMark", uncheck: "selectionMark" },
};

function applyFillInstant(fill: HTMLElement, on: boolean) {
  gsap.set(fill, { scale: on ? 1 : 0, autoAlpha: on ? 1 : 0, force3D: false });
}

function applyMarkInstant(icon: HTMLElement, on: boolean) {
  gsap.set(icon, { autoAlpha: on ? 1 : 0, scale: 1, force3D: false });
}

export function useSelectionIndicatorAnimation(
  active: boolean,
  fillRef?: RefObject<HTMLElement | null>,
  iconRef?: RefObject<HTMLElement | null>,
) {
  const scope = useOptionalSelectionIndicatorMotionScope();
  const firstLayoutRef = useRef(true);
  const reduceMotion =
    usePrefersReducedMotion() || !isMotionFeatureEnabled("enableSelectionFill");

  useLayoutEffect(() => {
    const fill = fillRef?.current;
    const icon = iconRef?.current;

    // Refs attach in the same commit — don't consume firstLayout if Fill/Mark aren't in the DOM yet.
    if (!fill && !icon) return;

    if (firstLayoutRef.current) {
      firstLayoutRef.current = false;
      if (fill) {
        killMotion(fill);
        applyFillInstant(fill, active);
      }
      if (icon) {
        killMotion(icon);
        applyMarkInstant(icon, active);
      }
      return;
    }

    const phase = active ? "check" : "uncheck";

    if (scope) {
      if (fill) scope.play("fill", phase, { el: fill });
      if (icon) scope.play("mark", phase, { el: icon });
      return;
    }

    if (reduceMotion) {
      if (fill) {
        killMotion(fill);
        applyFillInstant(fill, active);
      }
      if (icon) {
        killMotion(icon);
        applyMarkInstant(icon, active);
      }
      return;
    }

    const fillVars = { ...motionSelectionFill(), overwrite: "auto" as const };
    const markVars = { ...motionSelectionFill(), overwrite: "auto" as const };

    if (fill) {
      killMotion(fill);
      if (active) {
        gsap.fromTo(fill, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, ...fillVars });
      } else {
        gsap.to(fill, { scale: 0, autoAlpha: 0, ...fillVars });
      }
    }

    if (icon) {
      killMotion(icon);
      if (active) {
        gsap.fromTo(icon, { scale: 0.88, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, ...markVars });
      } else {
        gsap.to(icon, { scale: 0.92, autoAlpha: 0, ...markVars });
      }
    }
  }, [active, fillRef, iconRef, reduceMotion, scope]);
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
