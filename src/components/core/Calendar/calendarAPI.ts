import type { CalendarLocale } from "./calendarTypes";
import { calendarDayAriaLabel } from "./calendarA11y";
import type {
  CalendarDayCellModel,
  CalendarMode,
  CalendarMonthCellModel,
  CalendarRangeValue,
  CalendarView,
  CalendarYearCellModel,
} from "./calendarTypes";

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getMonthStartOffset(year: number, month: number): number {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

export function formatCalendarHeaderTitle(
  view: CalendarView,
  viewDate: Date,
  locale: CalendarLocale,
): string {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  if (view === "days") return `${locale.months[month]} ${year}`;
  if (view === "months") return String(year);
  const decadeStart = Math.floor(year / 10) * 10;
  return `${decadeStart}\u2013${decadeStart + 9}`;
}

export function createInitialViewDate(
  defaultMonth: Date | undefined,
  mode: CalendarMode,
  resolvedValue: unknown,
  today: Date,
): Date {
  if (defaultMonth) return new Date(defaultMonth.getFullYear(), defaultMonth.getMonth(), 1);

  let anchor: Date | null = null;
  if (mode === "single" && resolvedValue instanceof Date) anchor = resolvedValue;
  else if (mode === "range") anchor = (resolvedValue as CalendarRangeValue)?.start ?? null;
  else if (mode === "multiple") anchor = (resolvedValue as Date[])?.[0] ?? null;

  if (anchor) return new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  return new Date(today.getFullYear(), today.getMonth(), 1);
}

export function resolveSelectedDates(
  mode: CalendarMode,
  resolvedValue: unknown,
): Date[] {
  if (mode === "single") {
    const v = resolvedValue as Date | null;
    return v ? [v] : [];
  }
  if (mode === "multiple") {
    const v = resolvedValue;
    return Array.isArray(v) ? v : [];
  }
  return [];
}

export function resolveRangeStart(
  mode: CalendarMode,
  rangePending: Date | null,
  resolvedValue: unknown,
): Date | null {
  if (mode !== "range") return null;
  if (rangePending) return rangePending;
  return (resolvedValue as CalendarRangeValue)?.start ?? null;
}

export function resolveRangeEnd(
  mode: CalendarMode,
  rangePending: Date | null,
  resolvedValue: unknown,
): Date | null {
  if (mode !== "range") return null;
  if (rangePending) return null;
  return (resolvedValue as CalendarRangeValue)?.end ?? null;
}

export function navigateViewDate(
  prev: Date,
  view: CalendarView,
  delta: number,
): Date {
  if (view === "days") return new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
  if (view === "months") return new Date(prev.getFullYear() + delta, prev.getMonth(), 1);
  return new Date(prev.getFullYear() + delta * 10, prev.getMonth(), 1);
}

export function buildDayCellModels({
  viewDate,
  selectedDates,
  rangeStart,
  rangeEnd,
  hoverDate,
  mode,
  locale,
  minDate,
  maxDate,
  today,
}: {
  viewDate: Date;
  selectedDates: Date[];
  rangeStart: Date | null;
  rangeEnd: Date | null;
  hoverDate: Date | null;
  mode: CalendarMode;
  locale: CalendarLocale;
  minDate?: Date;
  maxDate?: Date;
  today: Date;
}): CalendarDayCellModel[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const offset = getMonthStartOffset(year, month);

  const effectiveRangeEnd = rangeEnd ?? (rangeStart && hoverDate ? hoverDate : null);

  const rLow =
    rangeStart && effectiveRangeEnd
      ? rangeStart <= effectiveRangeEnd
        ? rangeStart
        : effectiveRangeEnd
      : null;
  const rHigh =
    rangeStart && effectiveRangeEnd
      ? rangeStart <= effectiveRangeEnd
        ? effectiveRangeEnd
        : rangeStart
      : null;

  const rawCells: (number | null)[] = [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const rem = rawCells.length % 7;
  if (rem !== 0) rawCells.push(...Array<null>(7 - rem).fill(null));

  return rawCells.map((day, idx) => {
    if (day === null) {
      return { key: `empty-${year}-${month}-${idx}`, day: null };
    }

    const date = new Date(year, month, day);
    const dayKey = `${year}-${month}-${day}`;
    const isToday = isSameDay(date, today);
    const isSel = mode !== "range" && selectedDates.some((s) => isSameDay(s, date));

    const isRangeStart = mode === "range" && !!rangeStart && isSameDay(date, rangeStart);
    const isRangeEnd =
      mode === "range" && !!effectiveRangeEnd && isSameDay(date, effectiveRangeEnd);
    const inRange =
      mode === "range" && !!rLow && !!rHigh ? date > rLow && date < rHigh : false;

    const sameStartEnd =
      mode === "range" &&
      !!rangeStart &&
      !!effectiveRangeEnd &&
      isSameDay(rangeStart, effectiveRangeEnd);

    const showLeftBg = !sameStartEnd && (inRange || isRangeEnd);
    const showRightBg = !sameStartEnd && (inRange || isRangeStart);

    const isDisabled = (!!minDate && date < minDate) || (!!maxDate && date > maxDate);
    const circleActive = isSel || isRangeStart || isRangeEnd;

    return {
      key: dayKey,
      day,
      date,
      isToday,
      isSelected: isSel,
      isRangeStart,
      isRangeEnd,
      showLeftBg,
      showRightBg,
      isDisabled,
      circleActive,
      ariaLabel: calendarDayAriaLabel(day, month, year, locale),
    };
  });
}

export function buildMonthCellModels(
  viewDate: Date,
  selectedDates: Date[],
  locale: CalendarLocale,
  today: Date,
): CalendarMonthCellModel[] {
  const year = viewDate.getFullYear();

  return locale.monthsShort.map((name, month) => ({
    month,
    name,
    isCurrentMonth: today.getFullYear() === year && today.getMonth() === month,
    isSelected: selectedDates.some(
      (d) => d.getFullYear() === year && d.getMonth() === month,
    ),
  }));
}

export function buildYearCellModels(
  viewDate: Date,
  selectedDates: Date[],
  today: Date,
): CalendarYearCellModel[] {
  const decadeStart = Math.floor(viewDate.getFullYear() / 10) * 10;
  const years = Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i);

  return years.map((year) => ({
    year,
    isCurrentYear: today.getFullYear() === year,
    isSelected: selectedDates.some((d) => d.getFullYear() === year),
    outOfDecade: year < decadeStart || year > decadeStart + 9,
  }));
}

export function createDefaultCalendarValue(
  mode: CalendarMode,
  defaultValue: unknown,
): unknown {
  if (defaultValue !== undefined) return defaultValue;
  if (mode === "range") return { start: null, end: null } satisfies CalendarRangeValue;
  if (mode === "multiple") return [] as Date[];
  return null;
}

export function addCalendarDays(date: Date, delta: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
  return startOfDay(next);
}

export function addCalendarMonths(date: Date, delta: number): Date {
  const targetMonth = new Date(date.getFullYear(), date.getMonth() + delta, 1);
  const maxDay = getDaysInMonth(targetMonth.getFullYear(), targetMonth.getMonth());
  return startOfDay(
    new Date(
      targetMonth.getFullYear(),
      targetMonth.getMonth(),
      Math.min(date.getDate(), maxDay),
    ),
  );
}

export function addCalendarYears(date: Date, delta: number): Date {
  const target = new Date(date.getFullYear() + delta, date.getMonth(), 1);
  const maxDay = getDaysInMonth(target.getFullYear(), target.getMonth());
  return startOfDay(
    new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), maxDay)),
  );
}

export function isCalendarDateDisabled(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
): boolean {
  return (!!minDate && date < minDate) || (!!maxDate && date > maxDate);
}

export function clampCalendarDate(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
): Date {
  let next = startOfDay(date);
  if (minDate && next < minDate) next = startOfDay(minDate);
  if (maxDate && next > maxDate) next = startOfDay(maxDate);
  return next;
}

export function resolveInitialFocusDate({
  mode,
  resolvedValue,
  today,
  minDate,
  maxDate,
}: {
  mode: CalendarMode;
  resolvedValue: unknown;
  today: Date;
  minDate?: Date;
  maxDate?: Date;
}): Date {
  const selected = resolveSelectedDates(mode, resolvedValue)[0];
  if (selected) return clampCalendarDate(selected, minDate, maxDate);

  if (mode === "range") {
    const start = resolveRangeStart(mode, null, resolvedValue);
    if (start) return clampCalendarDate(start, minDate, maxDate);
  }

  return clampCalendarDate(today, minDate, maxDate);
}

/**
 * APG Date Picker day-grid keyboard move.
 * Arrow ±day / ±week, Home/End week bounds, PageUp/Down ±month (Shift = ±year).
 */
export function moveCalendarFocusDate(
  current: Date,
  key: string,
  shiftKey: boolean,
  minDate?: Date,
  maxDate?: Date,
): Date | null {
  let next: Date | null = null;

  switch (key) {
    case "ArrowLeft":
      next = addCalendarDays(current, -1);
      break;
    case "ArrowRight":
      next = addCalendarDays(current, 1);
      break;
    case "ArrowUp":
      next = addCalendarDays(current, -7);
      break;
    case "ArrowDown":
      next = addCalendarDays(current, 7);
      break;
    case "Home": {
      const weekday = (current.getDay() + 6) % 7;
      next = addCalendarDays(current, -weekday);
      break;
    }
    case "End": {
      const weekday = (current.getDay() + 6) % 7;
      next = addCalendarDays(current, 6 - weekday);
      break;
    }
    case "PageUp":
      next = shiftKey
        ? addCalendarYears(current, -1)
        : addCalendarMonths(current, -1);
      break;
    case "PageDown":
      next = shiftKey
        ? addCalendarYears(current, 1)
        : addCalendarMonths(current, 1);
      break;
    default:
      return null;
  }

  next = clampCalendarDate(next, minDate, maxDate);

  if (isCalendarDateDisabled(next, minDate, maxDate)) {
    const direction =
      key === "ArrowLeft" || key === "ArrowUp" || key === "Home" || key === "PageUp"
        ? -1
        : 1;
    let cursor = next;
    for (let i = 0; i < 366; i++) {
      cursor = addCalendarDays(cursor, direction);
      cursor = clampCalendarDate(cursor, minDate, maxDate);
      if (!isCalendarDateDisabled(cursor, minDate, maxDate)) return cursor;
      if (
        (direction < 0 && minDate && isSameDay(cursor, minDate)) ||
        (direction > 0 && maxDate && isSameDay(cursor, maxDate))
      ) {
        break;
      }
    }
    return current;
  }

  return next;
}

/** Month picker (3×4): arrows move selection index. */
export function moveCalendarMonthFocusIndex(
  current: number,
  key: string,
): number | null {
  switch (key) {
    case "ArrowLeft":
      return current > 0 ? current - 1 : 11;
    case "ArrowRight":
      return current < 11 ? current + 1 : 0;
    case "ArrowUp":
      return (current - 3 + 12) % 12;
    case "ArrowDown":
      return (current + 3) % 12;
    case "Home":
      return 0;
    case "End":
      return 11;
    default:
      return null;
  }
}

/** Year picker (3×4 of 12 cells): arrows move selection index. */
export function moveCalendarYearFocusIndex(
  current: number,
  key: string,
): number | null {
  switch (key) {
    case "ArrowLeft":
      return current > 0 ? current - 1 : 11;
    case "ArrowRight":
      return current < 11 ? current + 1 : 0;
    case "ArrowUp":
      return (current - 4 + 12) % 12;
    case "ArrowDown":
      return (current + 4) % 12;
    case "Home":
      return 0;
    case "End":
      return 11;
    default:
      return null;
  }
}

export function chunkCalendarCells<T>(cells: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < cells.length; i += size) {
    rows.push(cells.slice(i, i + size));
  }
  return rows;
}


