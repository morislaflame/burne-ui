/**
 * Slot motion for Calendar — look here first.
 *
 * DOM slots: `navPrev` / `navNext` (unique on root scope), `cell` (nested per cell)
 *
 * Range half-fill GSAP and ToggleButton fill stay kit-internal.
 * Hover lift is first-level without shadow (adaptive scale via unset `liftScale`).
 */
import type { CalendarMotion } from "./calendarTypes";

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
