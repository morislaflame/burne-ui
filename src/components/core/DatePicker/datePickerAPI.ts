import type { CalendarLocale, CalendarRangeValue } from "@/components/core/Calendar";
import { formatCalendarFieldDay } from "@/components/core/utils/intlFormat";

import type { BurneLabels } from "@/theme/burneLabels";

import type { DatePickerMode, DatePickerStoredValue } from "./datePickerTypes";

export function isDatePickerRangeValue(value: DatePickerStoredValue): value is CalendarRangeValue {
  return value != null && !(value instanceof Date) && "start" in value && "end" in value;
}

export function datePickerPlaceholder(
  mode: DatePickerMode,
  placeholder: string | undefined,
  labels: Pick<BurneLabels, "selectDate" | "selectDateRange">,
): string {
  if (placeholder != null) return placeholder;
  if (mode === "range") return labels.selectDateRange;
  return labels.selectDate;
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
  if (mode === "multiple") {
    const dates = Array.isArray(value) ? value : [];
    if (dates.length === 0) return { text: "", empty: true };
    return {
      text: dates.map((date) => formatDatePickerDay(date, locale)).join(", "),
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
  if (mode === "multiple") {
    const dates = Array.isArray(value) ? value : [];
    return dates.map((date) => datePickerIsoDay(date)).join(",");
  }
  return value instanceof Date ? datePickerIsoDay(value) : "";
}

export function datePickerSelectionComplete(next: DatePickerStoredValue, mode: DatePickerMode): boolean {
  if (mode === "range") {
    return isDatePickerRangeValue(next) && next.start != null && next.end != null;
  }
  if (mode === "multiple") return false;
  return next instanceof Date;
}

export function parseDatePickerIsoDay(raw: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function parseDatePickerFormValue(
  raw: unknown,
  mode: DatePickerMode,
): DatePickerStoredValue {
  if (mode === "range") {
    if (isDatePickerRangeValue(raw as DatePickerStoredValue)) {
      return raw as CalendarRangeValue;
    }
    if (typeof raw === "string" && raw.includes("/")) {
      const [startStr = "", endStr = ""] = raw.split("/");
      return {
        start: parseDatePickerIsoDay(startStr),
        end: parseDatePickerIsoDay(endStr),
      };
    }
    return { start: null, end: null };
  }
  if (mode === "multiple") {
    if (Array.isArray(raw)) {
      return raw
        .map((item) =>
          item instanceof Date
            ? item
            : typeof item === "string"
              ? parseDatePickerIsoDay(item)
              : null,
        )
        .filter((item): item is Date => item != null);
    }
    if (typeof raw === "string" && raw.trim()) {
      return raw
        .split(",")
        .map((part) => parseDatePickerIsoDay(part))
        .filter((item): item is Date => item != null);
    }
    return [];
  }
  if (raw instanceof Date) return raw;
  if (typeof raw === "string" && raw.trim()) return parseDatePickerIsoDay(raw);
  return null;
}
