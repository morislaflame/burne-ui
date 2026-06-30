import type { CalendarLocale } from "./calendarTypes";

export function calendarNavBackLabel(): string {
  return "Назад";
}

export function calendarNavForwardLabel(): string {
  return "Вперёд";
}

export function calendarDayAriaLabel(
  day: number,
  month: number,
  year: number,
  locale: CalendarLocale,
): string {
  return `${day} ${locale.months[month]} ${year}`;
}
