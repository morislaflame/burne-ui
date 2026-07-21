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
      today,
    ],
  );
}

export function useCalendarMonthCellModels() {
  const { viewDate, selectedDates, locale, today } = useCalendar();

  return useMemo(
    () => buildMonthCellModels(viewDate, selectedDates, locale, today),
    [viewDate, selectedDates, locale, today],
  );
}

export function useCalendarYearCellModels() {
  const { viewDate, selectedDates, today } = useCalendar();

  return useMemo(
    () => buildYearCellModels(viewDate, selectedDates, today),
    [viewDate, selectedDates, today],
  );
}

export function useCalendarHeaderTitle() {
  const { view, viewDate, locale } = useCalendar();

  return useMemo(
    () => formatCalendarHeaderTitle(view, viewDate, locale),
    [view, viewDate, locale],
  );
}
