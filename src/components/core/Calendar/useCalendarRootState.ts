import { useCallback, useMemo, useRef, useState } from "react";

import { EN_LOCALE } from "./calendarLocale";
import {
  addCalendarMonths,
  addCalendarYears,
  clampCalendarDate,
  createDefaultCalendarValue,
  createInitialViewDate,
  getDaysInMonth,
  isSameDay,
  navigateViewDate,
  resolveInitialFocusDate,
  resolveRangeEnd,
  resolveRangeStart,
  resolveSelectedDates,
  startOfDay,
} from "./calendarAPI";
import type {
  CalendarContextValue,
  CalendarMode,
  CalendarRangeValue,
  CalendarView,
  UseCalendarRootStateProps,
} from "./calendarTypes";

export function useCalendarRootState(rawProps: UseCalendarRootStateProps) {
  const {
    mode = "single",
    variant = "default",
    size = "base",
    defaultMonth,
    initialView = "days",
    locale = EN_LOCALE,
    minDate,
    maxDate,
    navPrevIcon,
    navNextIcon,
    renderDay,
    value,
    defaultValue,
    onValueChange,
  } = rawProps;

  const isGloss = variant === "gloss";
  const today = useMemo(() => startOfDay(new Date()), []);
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState<unknown>(() =>
    createDefaultCalendarValue(mode as CalendarMode, defaultValue),
  );

  const resolvedValue = isControlled ? value : internalValue;
  const resolvedValueRef = useRef(resolvedValue);
  resolvedValueRef.current = resolvedValue;

  const setValue = useCallback(
    (newValOrUpdater: unknown | ((prev: unknown) => unknown)) => {
      const current = resolvedValueRef.current;
      const newVal =
        typeof newValOrUpdater === "function"
          ? newValOrUpdater(current)
          : newValOrUpdater;
      resolvedValueRef.current = newVal;
      if (!isControlled) setInternalValue(newVal);
      onValueChange?.(newVal);
    },
    [isControlled, onValueChange],
  );

  const [view, setView] = useState<CalendarView>(initialView);
  const [viewDate, setViewDateRaw] = useState<Date>(() =>
    createInitialViewDate(defaultMonth, mode as CalendarMode, resolvedValue, today),
  );

  const [rangePending, setRangePending] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [focusedDate, setFocusedDateRaw] = useState<Date>(() =>
    resolveInitialFocusDate({
      mode: mode as CalendarMode,
      resolvedValue,
      today,
      minDate,
      maxDate,
    }),
  );

  const setFocusedDate = useCallback(
    (d: Date) => {
      setFocusedDateRaw(clampCalendarDate(d, minDate, maxDate));
    },
    [minDate, maxDate],
  );

  const moveDayFocus = useCallback(
    (d: Date) => {
      const next = clampCalendarDate(d, minDate, maxDate);
      setFocusedDateRaw(next);
      setViewDateRaw(new Date(next.getFullYear(), next.getMonth(), 1));
    },
    [minDate, maxDate],
  );

  const selectedDates = useMemo(
    () => resolveSelectedDates(mode as CalendarMode, resolvedValue),
    [mode, resolvedValue],
  );

  const rangeStart = useMemo(
    () => resolveRangeStart(mode as CalendarMode, rangePending, resolvedValue),
    [mode, rangePending, resolvedValue],
  );

  const rangeEnd = useMemo(
    () => resolveRangeEnd(mode as CalendarMode, rangePending, resolvedValue),
    [mode, rangePending, resolvedValue],
  );

  const navigate = useCallback(
    (delta: number) => {
      setViewDateRaw((prev) => navigateViewDate(prev, view, delta));
      setFocusedDateRaw((fd) => {
        if (view === "days") {
          return clampCalendarDate(addCalendarMonths(fd, delta), minDate, maxDate);
        }
        if (view === "months") {
          return clampCalendarDate(addCalendarYears(fd, delta), minDate, maxDate);
        }
        return clampCalendarDate(addCalendarYears(fd, delta * 10), minDate, maxDate);
      });
    },
    [view, minDate, maxDate],
  );

  const onDayPress = useCallback(
    (d: Date) => {
      const day = startOfDay(d);
      setFocusedDateRaw(day);
      if (mode === "single") {
        setValue((current: unknown) => {
          const prev = current instanceof Date ? current : null;
          return prev && isSameDay(prev, day) ? null : day;
        });
      } else if (mode === "multiple") {
        setValue((current: unknown) => {
          const prev = Array.isArray(current) ? current : [];
          const i = prev.findIndex((x) => isSameDay(x, day));
          return i >= 0 ? prev.filter((_, j) => j !== i) : [...prev, day];
        });
      } else {
        if (!rangePending) {
          setRangePending(day);
          setValue({ start: null, end: null } satisfies CalendarRangeValue);
        } else if (isSameDay(day, rangePending)) {
          setRangePending(null);
        } else {
          const s = day <= rangePending ? day : rangePending;
          const e = day <= rangePending ? rangePending : day;
          setRangePending(null);
          setHoverDate(null);
          setValue({ start: s, end: e } satisfies CalendarRangeValue);
        }
      }
    },
    [mode, rangePending, setValue],
  );

  const onMonthPress = useCallback(
    (month: number) => {
      const year = viewDate.getFullYear();
      setViewDateRaw(new Date(year, month, 1));
      setFocusedDateRaw((fd) => {
        const maxDay = getDaysInMonth(year, month);
        return clampCalendarDate(
          new Date(year, month, Math.min(fd.getDate(), maxDay)),
          minDate,
          maxDate,
        );
      });
      setView("days");
    },
    [viewDate, minDate, maxDate],
  );

  const onYearPress = useCallback(
    (year: number) => {
      setViewDateRaw(new Date(year, viewDate.getMonth(), 1));
      setFocusedDateRaw((fd) =>
        clampCalendarDate(
          new Date(year, fd.getMonth(), fd.getDate()),
          minDate,
          maxDate,
        ),
      );
      setView("months");
    },
    [viewDate, minDate, maxDate],
  );

  const onClear = useCallback(() => {
    setRangePending(null);
    setHoverDate(null);
    if (mode === "single") setValue(null);
    else if (mode === "multiple") setValue([]);
    else setValue({ start: null, end: null } satisfies CalendarRangeValue);
  }, [mode, setValue]);

  const onToday = useCallback(() => {
    setViewDateRaw(new Date(today.getFullYear(), today.getMonth(), 1));
    setFocusedDateRaw(clampCalendarDate(today, minDate, maxDate));
    setView("days");
  }, [today, minDate, maxDate]);

  const contextValue: CalendarContextValue = useMemo(
    () => ({
      mode: mode as CalendarMode,
      view,
      setView,
      viewDate,
      navigate,
      focusedDate,
      setFocusedDate,
      moveDayFocus,
      selectedDates,
      rangeStart,
      rangeEnd,
      hoverDate,
      setHoverDate,
      onDayPress,
      onMonthPress,
      onYearPress,
      onClear,
      onToday,
      size,
      variant,
      locale,
      minDate,
      maxDate,
      today,
      navPrevIcon,
      navNextIcon,
      renderDay,
    }),
    [
      mode,
      view,
      viewDate,
      navigate,
      focusedDate,
      setFocusedDate,
      moveDayFocus,
      selectedDates,
      rangeStart,
      rangeEnd,
      hoverDate,
      onDayPress,
      onMonthPress,
      onYearPress,
      onClear,
      onToday,
      size,
      variant,
      locale,
      minDate,
      maxDate,
      today,
      navPrevIcon,
      navNextIcon,
      renderDay,
    ],
  );

  return {
    isGloss,
    variant,
    size,
    contextValue,
    today,
  };
}
