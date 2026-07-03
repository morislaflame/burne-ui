import {
  CalendarFooter,
  CalendarGrid,
  CalendarHeader,
  CalendarRoot,
} from "./Calendar";

export const Calendar = Object.assign(CalendarRoot, {
  Header: CalendarHeader,
  Grid: CalendarGrid,
  Footer: CalendarFooter,
});

export { EN_LOCALE } from "./calendarLocale";
export { useCalendar } from "./calendarContext";

export type {
  CalendarProps,
  CalendarHeaderProps,
  CalendarGridProps,
  CalendarFooterProps,
  CalendarMode,
  CalendarView,
  CalendarVariant,
  CalendarSize,
  CalendarRangeValue,
  CalendarLocale,
  CalendarClassNames,
} from "./calendarTypes";
