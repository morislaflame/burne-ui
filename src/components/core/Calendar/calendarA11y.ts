import { formatCalendarDay, formatCalendarMonthYear } from "@/components/core/utils/intlFormat";
import { DEFAULT_BURNE_LABELS, type BurneLabels } from "@/theme/burneLabels";

import type { CalendarLocale } from "./calendarTypes";

export function calendarNavBackLabel(
  labels: Pick<BurneLabels, "calendarPrevious"> = DEFAULT_BURNE_LABELS,
): string {
  return labels.calendarPrevious;
}

export function calendarNavForwardLabel(
  labels: Pick<BurneLabels, "calendarNext"> = DEFAULT_BURNE_LABELS,
): string {
  return labels.calendarNext;
}
 
export function calendarDayAriaLabel(
  day: number,
  month: number,
  year: number,
  locale: CalendarLocale,
): string {
  return formatCalendarDay(new Date(year, month, day), locale.locale);
}
 
export function calendarDaysGridLabel(
  month: number,
  year: number,
  locale: CalendarLocale,
): string {
  return formatCalendarMonthYear(new Date(year, month, 1), locale.locale);
}
 
export function calendarMonthsGridLabel(year: number): string {
  return String(year);
}
 
export function calendarYearsGridLabel(decadeStart: number): string {
  return `${decadeStart}\u2013${decadeStart + 9}`;
}
 
/** Stable key for day-cell focus targeting (`data-calendar-focus-day`). */
export function calendarFocusDayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
 