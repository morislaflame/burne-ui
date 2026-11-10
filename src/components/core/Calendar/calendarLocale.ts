import type { CalendarLocale } from "./calendarTypes";

import { dateTimeFormat } from "@/components/core/utils/intlFormat";

/** Monday-first English calendar. Field dates read `15 Oct 2026`. */
export const DEFAULT_CALENDAR_LOCALE = "en-GB";

const ACTION_LABELS: Record<string, { today: string; clear: string }> = {
  en: { today: "Today", clear: "Clear" },
  ru: { today: "Сегодня", clear: "Очистить" },
};

export type CalendarLocaleLabels = {
  today?: string;
  clear?: string;
};

function weekdayNames(locale: string): string[] {
  const format = dateTimeFormat(locale, { weekday: "short" });
  return Array.from({ length: 7 }, (_, index) => format.format(new Date(2024, 0, 1 + index)));
}

function monthNames(locale: string, month: "long" | "short"): string[] {
  const format = dateTimeFormat(locale, { month });
  return Array.from({ length: 12 }, (_, index) => format.format(new Date(2024, index, 1)));
}

function actionLabels(locale: string, labels?: CalendarLocaleLabels): { today: string; clear: string } {
  const language = locale.toLowerCase().split("-")[0] ?? "en";
  const preset = ACTION_LABELS[language] ?? ACTION_LABELS.en!;
  return {
    today: labels?.today ?? preset.today,
    clear: labels?.clear ?? preset.clear,
  };
}

export function createCalendarLocale(
  locale: string = DEFAULT_CALENDAR_LOCALE,
  labels?: CalendarLocaleLabels,
): CalendarLocale {
  return {
    locale,
    weekDays: weekdayNames(locale),
    months: monthNames(locale, "long"),
    monthsShort: monthNames(locale, "short"),
    ...actionLabels(locale, labels),
  };
}

export function resolveCalendarLocale(locale: string | CalendarLocale | undefined): CalendarLocale {
  if (locale == null) return EN_LOCALE;
  if (typeof locale === "string") return createCalendarLocale(locale);
  return locale;
}

export const EN_LOCALE: CalendarLocale = createCalendarLocale(DEFAULT_CALENDAR_LOCALE);
