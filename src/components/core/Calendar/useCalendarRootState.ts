import { useCallback, useMemo, useRef, useState } from "react";

import { EN_LOCALE } from "./calendarLocale";
import {
  createDefaultCalendarValue,
  createInitialViewDate,
  isSameDay,
  navigateViewDate,
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
    },
    [view],
  );

  const onDayPress = useCallback(
    (d: Date) => {
      const day = startOfDay(d);
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
      setViewDateRaw(new Date(viewDate.getFullYear(), month, 1));
      setView("days");
    },
    [viewDate],
  );

  const onYearPress = useCallback(
    (year: number) => {
      setViewDateRaw(new Date(year, viewDate.getMonth(), 1));
      setView("months");
    },
    [viewDate],
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
    setView("days");
  }, [today]);

  const contextValue: CalendarContextValue = useMemo(
    () => ({
      mode: mode as CalendarMode,
      view,
      setView,
      viewDate,
      navigate,
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
    }),
    [
      mode,
      view,
      viewDate,
      navigate,
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
