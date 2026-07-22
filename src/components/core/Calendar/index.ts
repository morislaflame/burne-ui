import {
  CalendarDay,
  CalendarFooter,
  CalendarGrid,
  CalendarHeader,
  CalendarNavNext,
  CalendarNavPrev,
  CalendarRoot,
  CalendarTitle,
} from "./Calendar";

export const Calendar = Object.assign(CalendarRoot, {
  Header: CalendarHeader,
  Grid: CalendarGrid,
  Footer: CalendarFooter,
  NavPrev: CalendarNavPrev,
  NavNext: CalendarNavNext,
  Title: CalendarTitle,
  Day: CalendarDay,
});

export { EN_LOCALE } from "./calendarLocale";
export { useCalendar } from "./calendarContext";

export type {
  CalendarProps,
  CalendarHeaderProps,
  CalendarGridProps,
  CalendarFooterProps,
  CalendarNavPrevProps,
  CalendarNavNextProps,
  CalendarTitleProps,
  CalendarDayProps,
  CalendarDayRenderState,
  CalendarRenderDay,
  CalendarMode,
  CalendarView,
  CalendarVariant,
  CalendarSize,
  CalendarRangeValue,
  CalendarLocale,
  CalendarClassNames,
} from "./calendarTypes";
