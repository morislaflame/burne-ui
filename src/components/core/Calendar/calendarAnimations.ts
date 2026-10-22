/**
 * Slot motion for Calendar — look here first.
 *
 * DOM slots: `root` (shell), `navPrev` / `navNext` / `navPrevIcon` / `navNextIcon` (unique on
 * root scope), `header`, `title`, `grid`, `footer`, `footerToday`,
 * `footerClear` (root scope), `cell` / `cellText` (nested unique scope per cell
 * — not shared-scope repeated).
 *
 * `rangeHalfFill` fades with `contentFade`. `cellFill` checks with `selectionFill`.
 * Panel hover is slot `root`: `hoverLiftSecondLevel` with `liftScale: 1` (scale stays 1, rest `--shadow-base` grows). Nav and cells lift on their own.
 */
import type { ForwardedRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
 
import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";
 
import { usesKitElevation, overlaySkinMotion } from "@/skins/resolveVariantVisual";

import { useOptionalCalendarMotionScope } from "./calendarContext";
import type { CalendarMotion, CalendarPartMotion, CalendarVariant } from "./calendarTypes";
import { KIT_CALENDAR_VARIANTS } from "./calendarTypes";

import { bindLiftRecipes } from "@/components/core/utils/slotMotion/recipes/bindLift";
import { bindSecondLevelRecipe } from "@/components/core/utils/slotMotion/recipes/bindSecondLevel";
import { bindContentFadeRecipe } from "@/components/core/utils/slotMotion/recipes/bindContentFade";
import { bindSelectionFillRecipe } from "@/components/core/utils/slotMotion/recipes/bindSelection";

bindLiftRecipes();
bindSecondLevelRecipe();
bindContentFadeRecipe();
bindSelectionFillRecipe();
 
const NAV_OR_CELL = {
  hoverIn: "hoverLiftFirstLevel" as const,
  hoverOut: "hoverLiftFirstLevel" as const,
  pressIn: "pressSqueeze" as const,
  pressOut: false as const,
};
 
export function resolveCalendarMotionDefaults(variant: CalendarVariant = "default"): CalendarMotion {
  const kit = usesKitElevation(variant, KIT_CALENDAR_VARIANTS);
  return overlaySkinMotion(
    {
      root: kit
        ? {
            hoverIn: "hoverLiftSecondLevel",
            hoverOut: "hoverLiftSecondLevel",
          }
        : {},
      navPrev: { ...NAV_OR_CELL },
      navNext: { ...NAV_OR_CELL },
      rangeHalfFill: { enter: "contentFade", leave: "contentFade" },
    },
    variant,
    KIT_CALENDAR_VARIANTS,
    "calendar",
  );
}
 
export function resolveCalendarCellMotionDefaults(): CalendarMotion {
  return {
    cell: { ...NAV_OR_CELL },
    cellFill: { check: "selectionFill", uncheck: "selectionFill" },
  };
}
 
export function useCalendarSlotMotion<T extends HTMLElement>(
  slot: "footerToday" | "footerClear",
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    motion?: CalendarPartMotion;
    forwardedRef?: ForwardedRef<T>;
    onPointerOver?: (e: ReactPointerEvent<T>) => void;
    onPointerOut?: (e: ReactPointerEvent<T>) => void;
    onPointerDown?: (e: ReactPointerEvent<T>) => void;
    onPointerUp?: (e: ReactPointerEvent<T>) => void;
  } = {},
) {
  const scope = useOptionalCalendarMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.[slot]);
  const part = useMotionPart<T>({
    scope,
    slot,
    motion,
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, slot, part.targetRef);
  return part;
}
 