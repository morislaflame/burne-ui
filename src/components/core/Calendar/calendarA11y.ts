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
