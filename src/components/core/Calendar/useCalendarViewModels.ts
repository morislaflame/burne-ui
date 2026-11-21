import { useMemo } from "react";
 
import { buildDayCellModels, buildMonthCellModels, buildYearCellModels, formatCalendarHeaderTitle } from "./calendarAPI";
import { useCalendar } from "./calendarContext";
 
export function useCalendarDayCellModels() {
  const {
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
  } = useCalendar();
 
  return useMemo(
    () =>
      buildDayCellModels({
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
      }),
    [
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
    ],
  );
}
 
export function useCalendarMonthCellModels() {
  const { viewDate, selectedDates, locale, today, minDate, maxDate } = useCalendar();
 
  return useMemo(
    () => buildMonthCellModels(viewDate, selectedDates, locale, today, minDate, maxDate),
    [viewDate, selectedDates, locale, today, minDate, maxDate],
  );
}
 
export function useCalendarYearCellModels() {
  const { viewDate, selectedDates, today, minDate, maxDate } = useCalendar();
 
  return useMemo(
    () => buildYearCellModels(viewDate, selectedDates, today, minDate, maxDate),
    [viewDate, selectedDates, today, minDate, maxDate],
  );
}
 
export function useCalendarHeaderTitle() {
  const { view, viewDate, locale } = useCalendar();
 
  return useMemo(
    () => formatCalendarHeaderTitle(view, viewDate, locale),
    [view, viewDate, locale],
  );
}
 