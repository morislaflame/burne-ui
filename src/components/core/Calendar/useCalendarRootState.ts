import { useCallback, useMemo, useRef, useState } from "react";

import { useSkinVariant } from "@/skins/skinContext";
 
import { EN_LOCALE, resolveCalendarLocale } from "./calendarLocale";
import {
  addCalendarMonths,
  addCalendarYears,
  clampCalendarDate,
  createDefaultCalendarValue,
  createInitialViewDate,
  getDaysInMonth,
  isSameDay,
  calendarRangeHitsUnavailable,
  isCalendarDateDisabled,
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
    selectionMode: mode = "single",
    variant: variantProp,
    size = "base",
    defaultMonth,
    month,
    onMonthChange,
    view: viewProp,
    defaultView = "days",
    onViewChange,
    locale: localeProp = EN_LOCALE,
    minDate,
    maxDate,
    isDateUnavailable,
    previousIcon,
    nextIcon,
    renderDay,
    value: valueProp,
    values,
    defaultValue,
    defaultValues,
    onValueChange,
    onValuesChange,
  } = rawProps;
  const value = mode === "multiple" ? values : valueProp;
  const resolvedDefault = mode === "multiple" ? defaultValues : defaultValue;
 
  const variant = useSkinVariant(variantProp);
  const locale = useMemo(() => resolveCalendarLocale(localeProp), [localeProp]);
  const today = useMemo(() => startOfDay(new Date()), []);
  const isControlled = value !== undefined;
 
  const [internalValue, setInternalValue] = useState<unknown>(() =>
    createDefaultCalendarValue(mode as CalendarMode, resolvedDefault),
  );
 
  const resolvedValue = isControlled ? value : internalValue;
  const resolvedValueRef = useRef(resolvedValue);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
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
      if (mode === "multiple") onValuesChange?.(newVal as Date[]);
      else onValueChange?.(newVal);
    },
    [isControlled, mode, onValueChange, onValuesChange],
  );
 
  const viewControlled = viewProp !== undefined;
  const [viewInternal, setViewInternal] = useState<CalendarView>(defaultView);
  const view = viewControlled ? viewProp : viewInternal;
  const setView = useCallback(
    (next: CalendarView) => {
      if (!viewControlled) setViewInternal(next);
      onViewChange?.(next);
    },
    [onViewChange, viewControlled],
  );

  const monthControlled = month !== undefined;
  const [viewDateInternal, setViewDateInternal] = useState<Date>(() =>
    createInitialViewDate(month ?? defaultMonth, mode as CalendarMode, resolvedValue, today),
  );
  const viewYear = monthControlled ? month.getFullYear() : viewDateInternal.getFullYear();
  const viewMonthIndex = monthControlled ? month.getMonth() : viewDateInternal.getMonth();
  const viewDate = useMemo(
    () => new Date(viewYear, viewMonthIndex, 1),
    [viewYear, viewMonthIndex],
  );
  const viewDateRef = useRef(viewDate);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest month so navigation sees this render
  viewDateRef.current = viewDate;
  const setViewDateRaw = useCallback(
    (updater: Date | ((prev: Date) => Date)) => {
      const prev = viewDateRef.current;
      const next = typeof updater === "function" ? updater(prev) : updater;
      const normalized = new Date(next.getFullYear(), next.getMonth(), 1);
      if (!monthControlled) setViewDateInternal(normalized);
      onMonthChange?.(normalized);
    },
    [monthControlled, onMonthChange],
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
    [minDate, maxDate, setViewDateRaw],
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
    [view, minDate, maxDate, setViewDateRaw],
  );
 
  const onDayPress = useCallback(
    (d: Date) => {
      const day = startOfDay(d);
      if (isCalendarDateDisabled(day, minDate, maxDate, isDateUnavailable)) return;
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
          if (calendarRangeHitsUnavailable(s, e, isDateUnavailable)) return;
          setRangePending(null);
          setHoverDate(null);
          setValue({ start: s, end: e } satisfies CalendarRangeValue);
        }
      }
    },
    [isDateUnavailable, maxDate, minDate, mode, rangePending, setValue],
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
    [viewDate, minDate, maxDate, setView, setViewDateRaw],
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
    [viewDate, minDate, maxDate, setView, setViewDateRaw],
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
  }, [today, minDate, maxDate, setView, setViewDateRaw]);
 
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
      isDateUnavailable,
      today,
      previousIcon,
      nextIcon,
      renderDay,
    }),
    [
      mode,
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
      isDateUnavailable,
      today,
      previousIcon,
      nextIcon,
      renderDay,
    ],
  );
 
  return {
    variant,
    size,
    contextValue,
    today,
  };
}
 