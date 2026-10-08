import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
export type CalendarLocale = {
  /** BCP 47 tag. `Intl` builds the names and the field date. */
  locale: string;
  /** 7 items: Mon → Sun */
  weekDays: string[];
  /** 12 full month names */
  months: string[];
  /** 12 abbreviated month names */
  monthsShort: string[];
  today: string;
  clear: string;
};
 
export type CalendarMode = "single" | "range" | "multiple";
export type CalendarView = "days" | "months" | "years";
export const KIT_CALENDAR_VARIANTS = ["default", "secondary", "outline"] as const;
export type KitCalendarVariant = (typeof KIT_CALENDAR_VARIANTS)[number];
export type CalendarVariant = KitCalendarVariant | (string & {});
export type CalendarSize = "small" | "base" | "mid" | "large";
export type CalendarRangeValue = { start: Date | null; end: Date | null };
 
export type CalendarDayRenderState = {
  day: number;
  selected: boolean;
  disabled: boolean;
  isToday: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  /** Day circle/fill is active (selected day or range endpoint). */
  circleActive: boolean;
};
 
export type CalendarRenderDay = (
  date: Date,
  state: CalendarDayRenderState,
) => ReactNode;
 
export type CalendarClassNames = {
  root?: string;
  header?: string;
  navPrev?: string;
  navNext?: string;
  /** Wrapper around the default nav chevron. */
  navIconWrap?: string;
  /** Default nav chevron icon (`IoChevronBack` / `IoChevronForward`). */
  navIcon?: string;
  headerTitle?: string;
  grid?: string;
  weekdayGrid?: string;
  weekdayCell?: string;
  daysGrid?: string;
  dayCellWrapper?: string;
  /** Empty padding cell outside the current month. */
  dayEmpty?: string;
  rangeHalfFill?: string;
  dayCell?: string;
  monthsGrid?: string;
  monthCell?: string;
  yearsGrid?: string;
  yearCell?: string;
  cell?: string;
  cellFill?: string;
  cellText?: string;
  cellTodayDot?: string;
  footer?: string;
  footerToday?: string;
  footerClear?: string;
};
 
export type CalendarPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
  check?: MotionValue;
  uncheck?: MotionValue;
};
 
export type CalendarMotion = {
  /** Shell. A skin `mount` (gloss shine) lands here. */
  root?: CalendarPartMotion;
  navPrev?: CalendarPartMotion;
  navNext?: CalendarPartMotion;
  navPrevIcon?: CalendarPartMotion;
  navNextIcon?: CalendarPartMotion;
  header?: CalendarPartMotion;
  headerTitle?: CalendarPartMotion;
  grid?: CalendarPartMotion;
  cell?: CalendarPartMotion;
  cellText?: CalendarPartMotion;
  /** Selected-cell fill. `check` / `uncheck` → `selectionFill`. */
  cellFill?: CalendarPartMotion;
  /** Range band. `enter` / `leave` → `contentFade`. */
  rangeHalfFill?: CalendarPartMotion;
  footer?: CalendarPartMotion;
  footerToday?: CalendarPartMotion;
  footerClear?: CalendarPartMotion;
};
 
type CalendarCommonProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "value"> & {
  variant?: CalendarVariant;
  size?: CalendarSize;
  defaultMonth?: Date;
  initialView?: CalendarView;
  /** BCP 47 tag (`"ru"`, `"en-GB"`) or a ready `CalendarLocale` from `createCalendarLocale`. */
  locale?: string | CalendarLocale;
  minDate?: Date;
  maxDate?: Date;
  /** Replaces the default previous-month chevron. Pass `null` to hide. */
  navPrevIcon?: ReactNode;
  /** Replaces the default next-month chevron. Pass `null` to hide. */
  navNextIcon?: ReactNode;
  /**
   * Custom day cell content. Receives the cell date and selection state.
   * Default content is the day-of-month number.
   */
  renderDay?: CalendarRenderDay;
  classNames?: Prettify<CalendarClassNames>;
  /**
   * Per-slot motion (`navPrev`, `header`, `grid`, `footer`, `cell` …).
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   * There is no `root` slot — `play()` skips; use `playSlot("header")` / `playAll`.
   */
  motion?: Prettify<MotionMapWithEvents<CalendarMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * One handle → this calendar chrome scope (`header` / `navPrev` / `grid` / `footer` …).
   * Nested day/month/year cells are separate scopes — pass a handle on `Calendar.Day`.
   * Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type CalendarProps =
  | (CalendarCommonProps & {
      mode?: "single";
      value?: Date | null;
      defaultValue?: Date | null;
      onValueChange?: (date: Date | null) => void;
    })
  | (CalendarCommonProps & {
      mode: "range";
      value?: CalendarRangeValue;
      defaultValue?: CalendarRangeValue;
      onValueChange?: (range: CalendarRangeValue) => void;
    })
  | (CalendarCommonProps & {
      mode: "multiple";
      value?: Date[];
      defaultValue?: Date[];
      onValueChange?: (dates: Date[]) => void;
    });
 
export type CalendarHeaderProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<CalendarPartMotion>;
};
export type CalendarGridProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<CalendarPartMotion>;
};
export type CalendarFooterProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<CalendarPartMotion>;
};
 
/** Header month/year drill-up control. `children` replace the default formatted title. */
export type CalendarTitleProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  motion?: Prettify<CalendarPartMotion>;
};
 
export type CalendarContextValue = {
  mode: CalendarMode;
  view: CalendarView;
  setView: (v: CalendarView) => void;
  viewDate: Date;
  navigate: (delta: number) => void;
  /** Roving focus date in the day grid (APG Date Picker). */
  focusedDate: Date;
  setFocusedDate: (d: Date) => void;
  /** Move day-grid focus (and visible month) to a date. */
  moveDayFocus: (d: Date) => void;
  selectedDates: Date[];
  rangeStart: Date | null;
  rangeEnd: Date | null;
  hoverDate: Date | null;
  setHoverDate: (d: Date | null) => void;
  onDayPress: (d: Date) => void;
  onMonthPress: (month: number) => void;
  onYearPress: (year: number) => void;
  onClear: () => void;
  onToday: () => void;
  size: CalendarSize;
  variant: CalendarVariant;
  locale: CalendarLocale;
  minDate?: Date;
  maxDate?: Date;
  today: Date;
  navPrevIcon?: ReactNode;
  navNextIcon?: ReactNode;
  renderDay?: CalendarRenderDay;
};
 
export type CalendarProviderProps = {
  value: CalendarContextValue;
  children: ReactNode;
};
 
export type CalendarClassNamesProviderProps = {
  classNames?: Prettify<CalendarClassNames>;
  children: ReactNode;
};
 
export type UseCalendarRootStateProps = CalendarCommonProps & {
  mode?: CalendarMode;
  value?: unknown;
  defaultValue?: unknown;
  onValueChange?: (v: unknown) => void;
};
 
export type CalendarNavButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  direction: "prev" | "next";
  size: CalendarSize;
  children?: ReactNode;
  motion?: Prettify<CalendarPartMotion>;
};
 
export type CalendarNavPrevProps = Omit<
  CalendarNavButtonProps,
  "direction" | "size" | "onClick"
> & {
  size?: CalendarSize;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
};
 
export type CalendarNavNextProps = CalendarNavPrevProps;
 
export type CalendarInteractiveCellProps = {
  selected: boolean;
  disabled?: boolean;
  size: CalendarSize;
  cellKind?: "day" | "month" | "year";
  ariaLabel?: string;
  /** Roving tabindex: only the focused cell is in the tab order. */
  tabIndex?: number;
  /** Focus restore key (`data-calendar-roving`). */
  rovingKey?: string;
  rounded?: "day" | "picker";
  isToday?: boolean;
  isCurrent?: boolean;
  className?: string;
  onPress: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: ReactNode;
  motion?: Prettify<CalendarPartMotion>;
  /**
   * Handle for this cell's nested scope. `play()` looks for `root` (skip) —
   * use `playSlot("cell")`. `cellText` lives here.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
/** Public `Calendar.Day` — size defaults from Calendar context. */
export type CalendarDayProps = Omit<CalendarInteractiveCellProps, "size"> & {
  size?: CalendarSize;
};
 
export type CalendarRangeHalfFillProps = {
  visible: boolean;
  side: "left" | "right";
};
 
export type CalendarDayCellModel = {
  key: string;
  day: number | null;
  date?: Date;
  isToday?: boolean;
  isSelected?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  showLeftBg?: boolean;
  showRightBg?: boolean;
  isDisabled?: boolean;
  circleActive?: boolean;
  ariaLabel?: string;
};
 
export type CalendarMonthCellModel = {
  month: number;
  name: string;
  isCurrentMonth: boolean;
  isSelected: boolean;
};
 
export type CalendarYearCellModel = {
  year: number;
  isCurrentYear: boolean;
  isSelected: boolean;
  outOfDecade: boolean;
};
 