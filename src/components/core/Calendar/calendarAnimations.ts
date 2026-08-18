/**
 * Slot motion for Calendar — look here first.
 *
 * DOM slots: `navPrev` / `navNext` / `navPrevIcon` / `navNextIcon` (unique on
 * root scope), `header`, `headerTitle`, `grid`, `footer`, `footerToday`,
 * `footerClear` (root scope), `cell` / `cellText` (nested unique scope per cell
 * — not shared-scope repeated).
 *
 * Range half-fill GSAP and ToggleButton fill stay kit-internal.
 * Hover lift is first-level without shadow (adaptive scale via unset `liftScale`).
 */
import type { ForwardedRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";

import { useOptionalCalendarMotionScope } from "./calendarContext";
import type { CalendarMotion, CalendarPartMotion } from "./calendarTypes";

const NAV_OR_CELL = {
  hoverIn: "hoverLiftFirstLevel" as const,
  hoverOut: "hoverLiftFirstLevel" as const,
  pressIn: "pressSqueeze" as const,
  pressOut: false as const,
};

export function resolveCalendarMotionDefaults(): CalendarMotion {
  return {
    navPrev: { ...NAV_OR_CELL },
    navNext: { ...NAV_OR_CELL },
  };
}

export function resolveCalendarCellMotionDefaults(): CalendarMotion {
  return {
    cell: { ...NAV_OR_CELL },
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
