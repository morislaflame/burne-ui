import type { CalendarLocale, CalendarRangeValue } from "@/components/core/Calendar";
import { formatCalendarFieldDay } from "@/components/core/utils/intlFormat";

import type { DatePickerMode, DatePickerStoredValue } from "./datePickerTypes";

export const DATE_PICKER_SINGLE_PLACEHOLDER = "Select a date";
export const DATE_PICKER_RANGE_PLACEHOLDER = "Select a range";

export function isDatePickerRangeValue(value: DatePickerStoredValue): value is CalendarRangeValue {
  return value != null && !(value instanceof Date) && "start" in value && "end" in value;
}

export function datePickerPlaceholder(mode: DatePickerMode, placeholder?: string): string {
  if (placeholder != null) return placeholder;
  return mode === "range" ? DATE_PICKER_RANGE_PLACEHOLDER : DATE_PICKER_SINGLE_PLACEHOLDER;
}

function formatDatePickerDay(date: Date, locale: CalendarLocale): string {
  return formatCalendarFieldDay(date, locale.locale);
}

export function formatDatePickerDisplay(
  value: DatePickerStoredValue,
  mode: DatePickerMode,
  locale: CalendarLocale,
): { text: string; empty: boolean } {
  if (mode === "range") {
    const range = isDatePickerRangeValue(value) ? value : { start: null, end: null };
    if (range.start == null || range.end == null) return { text: "", empty: true };
    return {
      text: `${formatDatePickerDay(range.start, locale)} – ${formatDatePickerDay(range.end, locale)}`,
      empty: false,
    };
  }
  if (!(value instanceof Date)) return { text: "", empty: true };
  return { text: formatDatePickerDay(value, locale), empty: false };
}

/** Local calendar day, so a UTC conversion does not shift the date. */
export function datePickerIsoDay(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function serializeDatePickerValue(value: DatePickerStoredValue, mode: DatePickerMode): string {
  if (mode === "range") {
    const range = isDatePickerRangeValue(value) ? value : { start: null, end: null };
    if (range.start == null || range.end == null) return "";
    return `${datePickerIsoDay(range.start)}/${datePickerIsoDay(range.end)}`;
  }
  return value instanceof Date ? datePickerIsoDay(value) : "";
}

export function datePickerSelectionComplete(next: DatePickerStoredValue, mode: DatePickerMode): boolean {
  if (mode === "range") {
    return isDatePickerRangeValue(next) && next.start != null && next.end != null;
  }
  return next instanceof Date;
}
