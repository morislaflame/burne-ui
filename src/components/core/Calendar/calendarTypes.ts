import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export type CalendarLocale = {
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
export type CalendarVariant = "default" | "secondary" | "outline" | "gloss";
export type CalendarSize = "small" | "base" | "mid" | "large";
export type CalendarRangeValue = { start: Date | null; end: Date | null };

export type CalendarClassNames = {
  root?: string;
  glossContent?: string;
  header?: string;
  navPrev?: string;
  navNext?: string;
  /** Default nav chevron icon (`IoChevronBack` / `IoChevronForward`). */
  navIcon?: string;
  headerTitle?: string;
  grid?: string;
  weekdayGrid?: string;
  weekdayCell?: string;
  daysGrid?: string;
  dayCellWrapper?: string;
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

type CalendarCommonProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CalendarVariant;
  size?: CalendarSize;
  defaultMonth?: Date;
  initialView?: CalendarView;
  locale?: CalendarLocale;
  minDate?: Date;
  maxDate?: Date;
  /** Replaces the default previous-month chevron. Pass `null` to hide. */
  navPrevIcon?: ReactNode;
  /** Replaces the default next-month chevron. Pass `null` to hide. */
  navNextIcon?: ReactNode;
  classNames?: CalendarClassNames;
};

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

export type CalendarHeaderProps = HTMLAttributes<HTMLDivElement>;
export type CalendarGridProps = HTMLAttributes<HTMLDivElement>;
export type CalendarFooterProps = HTMLAttributes<HTMLDivElement>;

export type CalendarContextValue = {
  mode: CalendarMode;
  view: CalendarView;
  setView: (v: CalendarView) => void;
  viewDate: Date;
  navigate: (delta: number) => void;
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
};

export type CalendarProviderProps = {
  value: CalendarContextValue;
  children: ReactNode;
};

export type CalendarClassNamesProviderProps = {
  classNames?: CalendarClassNames;
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
};

export type CalendarInteractiveCellProps = {
  selected: boolean;
  disabled?: boolean;
  size: CalendarSize;
  cellKind?: "day" | "month" | "year";
  ariaLabel?: string;
  ariaSelected?: boolean;
  rounded?: "day" | "picker";
  isToday?: boolean;
  isCurrent?: boolean;
  className?: string;
  onPress: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: ReactNode;
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
