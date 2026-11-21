import { formatCalendarMonthYear } from "@/components/core/utils/intlFormat";

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

  if (view === "days") return formatCalendarMonthYear(viewDate, locale.locale);
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
  if (rangePending) return startOfDay(rangePending);
  const start = (resolvedValue as CalendarRangeValue)?.start ?? null;
  return start ? startOfDay(start) : null;
}
 
export function resolveRangeEnd(
  mode: CalendarMode,
  rangePending: Date | null,
  resolvedValue: unknown,
): Date | null {
  if (mode !== "range") return null;
  if (rangePending) return null;
  const end = (resolvedValue as CalendarRangeValue)?.end ?? null;
  return end ? startOfDay(end) : null;
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
  isDateUnavailable,
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
  isDateUnavailable?: (date: Date) => boolean;
  today: Date;
}): CalendarDayCellModel[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const offset = getMonthStartOffset(year, month);
 
  const normalizedStart = rangeStart ? startOfDay(rangeStart) : null;
  const normalizedEnd = rangeEnd ? startOfDay(rangeEnd) : null;
  const normalizedHover = hoverDate ? startOfDay(hoverDate) : null;
  const effectiveRangeEnd =
    normalizedEnd ?? (normalizedStart && normalizedHover ? normalizedHover : null);
 
  const rLow =
    normalizedStart && effectiveRangeEnd
      ? normalizedStart <= effectiveRangeEnd
        ? normalizedStart
        : effectiveRangeEnd
      : null;
  const rHigh =
    normalizedStart && effectiveRangeEnd
      ? normalizedStart <= effectiveRangeEnd
        ? effectiveRangeEnd
        : normalizedStart
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
 
    const disabled = isCalendarDateDisabled(date, minDate, maxDate, isDateUnavailable);
    const circleActive = isSel || isRangeStart || isRangeEnd;
 
    return {
      key: dayKey,
      day,
      date,
      today: isToday,
      selected: isSel,
      rangeStart: isRangeStart,
      rangeEnd: isRangeEnd,
      showLeftBg,
      showRightBg,
      disabled,
      circleActive,
      ariaLabel: calendarDayAriaLabel(day, month, year, locale),
    };
  });
}
 
export function isCalendarMonthDisabled(
  year: number,
  month: number,
  minDate?: Date,
  maxDate?: Date,
): boolean {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month, getDaysInMonth(year, month));
  const min = minDate ? startOfDay(minDate) : undefined;
  const max = maxDate ? startOfDay(maxDate) : undefined;
  return (!!min && monthEnd < min) || (!!max && monthStart > max);
}

export function isCalendarYearDisabled(
  year: number,
  minDate?: Date,
  maxDate?: Date,
): boolean {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);
  const min = minDate ? startOfDay(minDate) : undefined;
  const max = maxDate ? startOfDay(maxDate) : undefined;
  return (!!min && yearEnd < min) || (!!max && yearStart > max);
}

export function canCalendarNavigate(
  view: CalendarView,
  viewDate: Date,
  direction: -1 | 1,
  minDate?: Date,
  maxDate?: Date,
): boolean {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  if (direction < 0) {
    if (!minDate) return true;
    const min = startOfDay(minDate);
    if (view === "days") {
      const prevMonthEnd = new Date(year, month, 0);
      return prevMonthEnd >= min;
    }
    if (view === "months") {
      const prevYearEnd = new Date(year - 1, 11, 31);
      return prevYearEnd >= min;
    }
    const decadeStart = Math.floor(year / 10) * 10;
    const prevDecadeEnd = new Date(decadeStart - 1, 11, 31);
    return prevDecadeEnd >= min;
  }
  if (!maxDate) return true;
  const max = startOfDay(maxDate);
  if (view === "days") {
    const nextMonthStart = new Date(year, month + 1, 1);
    return nextMonthStart <= max;
  }
  if (view === "months") {
    const nextYearStart = new Date(year + 1, 0, 1);
    return nextYearStart <= max;
  }
  const decadeStart = Math.floor(year / 10) * 10;
  const nextDecadeStart = new Date(decadeStart + 10, 0, 1);
  return nextDecadeStart <= max;
}

export function buildMonthCellModels(
  viewDate: Date,
  selectedDates: Date[],
  locale: CalendarLocale,
  today: Date,
  minDate?: Date,
  maxDate?: Date,
): CalendarMonthCellModel[] {
  const year = viewDate.getFullYear();
 
  return locale.monthsShort.map((name, month) => ({
    month,
    name,
    isCurrentMonth: today.getFullYear() === year && today.getMonth() === month,
    isSelected: selectedDates.some(
      (d) => d.getFullYear() === year && d.getMonth() === month,
    ),
    disabled: isCalendarMonthDisabled(year, month, minDate, maxDate),
  }));
}
 
export function buildYearCellModels(
  viewDate: Date,
  selectedDates: Date[],
  today: Date,
  minDate?: Date,
  maxDate?: Date,
): CalendarYearCellModel[] {
  const decadeStart = Math.floor(viewDate.getFullYear() / 10) * 10;
  const years = Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i);
 
  return years.map((year) => ({
    year,
    isCurrentYear: today.getFullYear() === year,
    isSelected: selectedDates.some((d) => d.getFullYear() === year),
    outOfDecade: year < decadeStart || year > decadeStart + 9,
    disabled: isCalendarYearDisabled(year, minDate, maxDate),
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
 
/** True when any day from `start` through `end` is unavailable. */
export function calendarRangeHitsUnavailable(
  start: Date,
  end: Date,
  isDateUnavailable?: (date: Date) => boolean,
): boolean {
  if (!isDateUnavailable) return false;
  const from = start.getTime() <= end.getTime() ? startOfDay(start) : startOfDay(end);
  const to = start.getTime() <= end.getTime() ? startOfDay(end) : startOfDay(start);
  for (let cursor = from; cursor.getTime() <= to.getTime(); cursor = addCalendarDays(cursor, 1)) {
    if (isDateUnavailable(cursor)) return true;
  }
  return false;
}

export function isCalendarDateDisabled(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  isDateUnavailable?: (date: Date) => boolean,
): boolean {
  const day = startOfDay(date);
  const min = minDate ? startOfDay(minDate) : undefined;
  const max = maxDate ? startOfDay(maxDate) : undefined;
  return (!!min && day < min) || (!!max && day > max) || !!isDateUnavailable?.(day);
}
 
export function clampCalendarDate(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
): Date {
  let next = startOfDay(date);
  const min = minDate ? startOfDay(minDate) : undefined;
  const max = maxDate ? startOfDay(maxDate) : undefined;
  if (min && next < min) next = min;
  if (max && next > max) next = max;
  return next;
}
 
export function resolveInitialFocusDate({
  mode,
  resolvedValue,
  initialMonth,
  today,
  minDate,
  maxDate,
}: {
  mode: CalendarMode;
  resolvedValue: unknown;
  initialMonth?: Date;
  today: Date;
  minDate?: Date;
  maxDate?: Date;
}): Date {
  const candidateFromValue =
    resolveSelectedDates(mode, resolvedValue)[0] ??
    (mode === "range" ? resolveRangeStart(mode, null, resolvedValue) : null);

  if (initialMonth) {
    const mYear = initialMonth.getFullYear();
    const mMonth = initialMonth.getMonth();
    if (
      candidateFromValue &&
      candidateFromValue.getFullYear() === mYear &&
      candidateFromValue.getMonth() === mMonth
    ) {
      return clampCalendarDate(candidateFromValue, minDate, maxDate);
    }
    if (today.getFullYear() === mYear && today.getMonth() === mMonth) {
      return clampCalendarDate(today, minDate, maxDate);
    }
    return clampCalendarDate(new Date(mYear, mMonth, 1), minDate, maxDate);
  }

  if (candidateFromValue) return clampCalendarDate(candidateFromValue, minDate, maxDate);
  return clampCalendarDate(today, minDate, maxDate);
}
 
function resolveRtlHorizontalKey(key: string, rtl: boolean): string {
  if (!rtl) return key;
  if (key === "ArrowLeft") return "ArrowRight";
  if (key === "ArrowRight") return "ArrowLeft";
  return key;
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
  isDateUnavailable?: (date: Date) => boolean,
  rtl = false,
): Date | null {
  const effectiveKey = resolveRtlHorizontalKey(key, rtl);
  let next: Date | null = null;
 
  switch (effectiveKey) {
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
 
  const min = minDate ? startOfDay(minDate) : undefined;
  const max = maxDate ? startOfDay(maxDate) : undefined;
  next = clampCalendarDate(next, min, max);
 
  if (isCalendarDateDisabled(next, min, max, isDateUnavailable)) {
    const direction =
      effectiveKey === "ArrowLeft" ||
      effectiveKey === "ArrowUp" ||
      effectiveKey === "Home" ||
      effectiveKey === "PageUp"
        ? -1
        : 1;
    let cursor = next;
    for (let i = 0; i < 366; i++) {
      cursor = addCalendarDays(cursor, direction);
      cursor = clampCalendarDate(cursor, min, max);
      if (!isCalendarDateDisabled(cursor, min, max, isDateUnavailable)) return cursor;
      if (
        (direction < 0 && min && isSameDay(cursor, min)) ||
        (direction > 0 && max && isSameDay(cursor, max))
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
  rtl = false,
): number | null {
  const effectiveKey = resolveRtlHorizontalKey(key, rtl);
  switch (effectiveKey) {
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
  rtl = false,
): number | null {
  const effectiveKey = resolveRtlHorizontalKey(key, rtl);
  switch (effectiveKey) {
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
 
 
 