import { CalendarFooter, CalendarGrid, CalendarHeader, CalendarRoot } from "./Calendar";

export const Calendar = Object.assign(CalendarRoot, {
  Header: CalendarHeader,
  Grid: CalendarGrid,
  Footer: CalendarFooter,
});

export { RU_LOCALE } from "./calendarLocale";
export { useCalendar } from "./Calendar";

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
} from "./Calendar";
