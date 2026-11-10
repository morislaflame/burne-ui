import { describe, expect, it } from "vitest";

import { formatLocaleNumber } from "@/components/core/utils/intlFormat";

import { createCalendarLocale, EN_LOCALE } from "./calendarLocale";

describe("calendar locale", () => {
  it("builds English names from Intl and keeps the day-first field", () => {
    expect(EN_LOCALE.locale).toBe("en-GB");
    expect(EN_LOCALE.weekDays).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
    expect(EN_LOCALE.months[9]).toBe("October");
    expect(EN_LOCALE.monthsShort[9]).toBe("Oct");
    expect(EN_LOCALE.today).toBe("Today");
  });

  it("builds Russian names and action labels from the language", () => {
    const locale = createCalendarLocale("ru");
    expect(locale.weekDays[0]).toBe("пн");
    expect(locale.months[9]).toBe("октябрь");
    expect(locale.monthsShort[9]).toBe("окт.");
    expect(locale.today).toBe("Сегодня");
    expect(locale.clear).toBe("Очистить");
  });

  it("formats numbers with Intl", () => {
    expect(formatLocaleNumber(12)).toBe("12");
    expect(formatLocaleNumber(1.5)).toBe("1.5");
    expect(formatLocaleNumber(1.5, "ru")).toBe("1,5");
  });
});
