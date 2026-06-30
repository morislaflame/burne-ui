import { createContext, useContext, useMemo } from "react";

import type {
  CalendarClassNames,
  CalendarClassNamesProviderProps,
  CalendarContextValue,
  CalendarProviderProps,
} from "./calendarTypes";

const CalendarContext = createContext<CalendarContextValue | null>(null);
const CalendarClassNamesContext = createContext<CalendarClassNames>({});

export function CalendarProvider({ value, children }: CalendarProviderProps) {
  return (
    <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>
  );
}

export function CalendarClassNamesProvider({
  classNames,
  children,
}: CalendarClassNamesProviderProps) {
  const parent = useContext(CalendarClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <CalendarClassNamesContext.Provider value={merged}>
      {children}
    </CalendarClassNamesContext.Provider>
  );
}

export function useCalendar(): CalendarContextValue {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("Calendar compound parts must be inside <Calendar>.");
  return ctx;
}

export function useCalendarClassNames(): CalendarClassNames {
  return useContext(CalendarClassNamesContext);
}
