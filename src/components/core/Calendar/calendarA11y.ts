import type { CalendarLocale } from "./calendarTypes";

export function calendarNavBackLabel(): string {
  return "Previous";
}

export function calendarNavForwardLabel(): string {
  return "Next";
}

export function calendarDayAriaLabel(
  day: number,
  month: number,
  year: number,
  locale: CalendarLocale,
): string {
  return `${day} ${locale.months[month]} ${year}`;
}

export function calendarDaysGridLabel(
  month: number,
  year: number,
  locale: CalendarLocale,
): string {
  return `${locale.months[month]} ${year}`;
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
