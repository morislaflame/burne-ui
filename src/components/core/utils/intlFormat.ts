const dateTimeFormats = new Map<string, Intl.DateTimeFormat>();
const numberFormats = new Map<string, Intl.NumberFormat>();

export function dateTimeFormat(
  locale: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const key = `${locale}\0${JSON.stringify(options)}`;
  const cached = dateTimeFormats.get(key);
  if (cached) return cached;
  const format = new Intl.DateTimeFormat(locale, options);
  dateTimeFormats.set(key, format);
  return format;
}

export function formatCalendarFieldDay(date: Date, locale: string): string {
  return dateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatCalendarDay(date: Date, locale: string): string {
  return dateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatCalendarMonthYear(date: Date, locale: string): string {
  return dateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
}

/** One fraction digit when the value is not an integer. Default locale `en`. */
export function formatLocaleNumber(value: number, locale = "en"): string {
  const digits = Number.isInteger(value) ? 0 : 1;
  const key = `${locale}\0${digits}`;
  let format = numberFormats.get(key);
  if (!format) {
    format = new Intl.NumberFormat(locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
    numberFormats.set(key, format);
  }
  return format.format(value);
}
