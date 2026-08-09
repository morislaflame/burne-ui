import type { TextVariant } from "@/components/core/Text";
import { hoverVariant, SURFACE_COLOR_TRANSITION, TEXT_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import { cn } from "@/utils/cn";

import type { CalendarSize, CalendarVariant } from "./calendarTypes";

export const CALENDAR_WEEKDAY_CELL: Record<CalendarSize, string> = {
  small: "mx-auto flex aspect-square w-full max-w-control-small items-center justify-center text-xsmall",
  base: "mx-auto flex aspect-square w-full max-w-control-base items-center justify-center text-small",
  mid: "mx-auto flex aspect-square w-full max-w-control-mid items-center justify-center text-base",
  large: "mx-auto flex aspect-square w-full max-w-control-large items-center justify-center text-mid",
};

export const CALENDAR_NAV_BTN: Record<CalendarSize, string> = {
  small: "h-control-small w-control-small",
  base: "h-control-base w-control-base",
  mid: "h-control-mid w-control-mid",
  large: "h-control-large w-control-large",
};

export const CALENDAR_ROOT_PAD: Record<CalendarSize, string> = {
  small: "p-small gap-xsmall",
  base: "p-large gap-small",
  mid: "p-large gap-small",
  large: "p-xlarge gap-base",
};

export const CALENDAR_ROOT_MIN_W: Record<CalendarSize, string> = {
  small: "min-w-component-small",
  base: "min-w-component-base",
  mid: "min-w-component-mid",
  large: "min-w-component-large",
};

export const CALENDAR_HEADER_TEXT: Record<CalendarSize, string> = {
  small: "text-small",
  base: "text-base",
  mid: "text-mid",
  large: "text-mid",
};

export const CALENDAR_ROOT_SURFACE: Record<CalendarVariant, string> = {
  default: "rounded-large border-token bg-surface shadow-token-base",
  secondary: "rounded-large border-token bg-secondary shadow-token-base",
  outline: "rounded-large bg-transparent border-token-outline shadow-token-base",
  gloss: "rounded-large border-0",
};

export const CALENDAR_MONTH_GRID_GAP: Record<CalendarSize, string> = {
  small: "gap-xsmall",
  base: "gap-xsmall",
  mid: "gap-small",
  large: "gap-small",
};

export const CALENDAR_DAY_TEXT: Record<CalendarSize, TextVariant> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "mid",
};

export const CALENDAR_DAY_BTN: Record<CalendarSize, string> = {
  small: "mx-auto aspect-square w-full max-w-control-small",
  base: "mx-auto aspect-square w-full max-w-control-base",
  mid: "mx-auto aspect-square w-full max-w-control-mid",
  large: "mx-auto aspect-square w-full max-w-control-large",
};

export const CALENDAR_PICKER_TEXT: Record<CalendarSize, TextVariant> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "mid",
};

export const CALENDAR_PICKER_BTN: Record<CalendarSize, string> = {
  small: "min-h-control-small w-full px-small py-xsmall",
  base: "min-h-control-base w-full px-mid py-small",
  mid: "min-h-control-mid w-full px-large py-mid",
  large: "min-h-control-large w-full px-large py-mid",
};

export const CALENDAR_ROOT_SHELL_CLASS =
  "inline-flex flex-col select-none text-left text-foreground";

export const CALENDAR_GLOSS_ROOT_CLASS = "gloss-panel gloss-deep rounded-large";

export const CALENDAR_GLOSS_CONTENT_CLASS = "gloss-content flex flex-col";

export const CALENDAR_RANGE_HALF_FILL_CLASS =
  "pointer-events-none absolute inset-y-0 bg-default-hover";

export const CALENDAR_HEADER_CLASS = "flex items-center gap-xsmall";

export const CALENDAR_HEADER_TITLE_CLASS =
  "flex-1 rounded-base py-xsmall text-center font-w-mid";

export const CALENDAR_HEADER_TITLE_INTERACTIVE_CLASS =
  "cursor-pointer hover:text-primary focus-ring";

export const CALENDAR_HEADER_TITLE_STATIC_CLASS = "cursor-default";

export const CALENDAR_GRID_CLASS = "min-w-0";

export const CALENDAR_DAYS_WEEKDAY_GRID_CLASS = "grid grid-cols-7 gap-xsmall";

export const CALENDAR_DAYS_CELL_GRID_CLASS = "grid grid-cols-7 gap-xsmall";

export const CALENDAR_WEEKDAY_LABEL_CLASS = "flex items-center justify-center font-w-mid text-muted";

export const CALENDAR_DAY_CELL_WRAPPER_CLASS = "relative flex items-center justify-center";

export const CALENDAR_DAY_CELL_LAYER_CLASS = "relative z-10";

export const CALENDAR_MONTHS_GRID_CLASS = "grid grid-cols-3";

export const CALENDAR_YEARS_GRID_CLASS = "grid grid-cols-4";

export const CALENDAR_FOOTER_CLASS =
  "flex items-center justify-between border-t-token pt-small";

export const CALENDAR_NAV_BUTTON_CLASS = cn(
  hoverVariant(),
  "flex shrink-0 origin-center items-center justify-center rounded-base",
  "text-muted focus-ring",
  "disabled:cursor-not-allowed disabled:opacity-40",
);

export const CALENDAR_CELL_BUTTON_CLASS =
  "group/calendar-cell relative inline-flex origin-center items-center justify-center overflow-hidden outline-none focus-ring rounded-mid";

export const CALENDAR_CELL_FILL_CLASS = cn(
  "pointer-events-none absolute -inset-px z-0 origin-center bg-primary",
  SURFACE_COLOR_TRANSITION,
  "motion-reduce:transition-none group-hover/calendar-cell:bg-primary-hover rounded-mid",
);

export const CALENDAR_HEADER_TITLE_BASE_CLASS = cn(
  CALENDAR_HEADER_TITLE_CLASS,
  TEXT_COLOR_TRANSITION,
);

export const CALENDAR_CELL_TEXT_CLASS = "relative z-[1] min-w-0 shrink-0 leading-none";

/** Today marker — 3× border-width so it stays a hairline dot on the size scale. */
export const CALENDAR_CELL_TODAY_DOT_CLASS =
  "absolute bottom-[length:calc(var(--border-width)*3)] left-1/2 z-[1] h-[length:calc(var(--border-width)*3)] w-[length:calc(var(--border-width)*3)] -translate-x-1/2 rounded-full bg-primary";

export const CALENDAR_NAV_ICON_CLASS = "icon-xsmall";

export const CALENDAR_CELL_SELECTED_CLASS =
  "bg-transparent font-w-mid text-primary-foreground";

export const CALENDAR_CELL_CURRENT_CLASS = "font-w-mid text-primary";

export const CALENDAR_CELL_DEFAULT_CLASS = "text-foreground";

export const CALENDAR_CELL_DISABLED_CLASS = "cursor-not-allowed opacity-35";

export const CALENDAR_CELL_POINTER_CLASS = "cursor-pointer";

export const CALENDAR_YEAR_OUT_OF_DECADE_CLASS = "text-muted";

export const CALENDAR_FOOTER_TODAY_BUTTON_CLASS = "text-muted";

export const CALENDAR_RANGE_HALF_FILL_INITIAL_STYLE = { opacity: 0 } as const;

export function calendarNavButtonClass(size: CalendarSize): string {
  return cn(CALENDAR_NAV_BUTTON_CLASS, CALENDAR_NAV_BTN[size]);
}

export function calendarDayEmptyClass(
  size: CalendarSize,
  slotClass?: string,
  className?: string,
): string {
  return cn(CALENDAR_DAY_BTN[size], slotClass, className);
}

export function calendarRootClass(
  variant: CalendarVariant,
  size: CalendarSize,
  isGloss: boolean,
  className?: string,
): string {
  return cn(
    CALENDAR_ROOT_SHELL_CLASS,
    isGloss ? CALENDAR_GLOSS_ROOT_CLASS : CALENDAR_ROOT_SURFACE[variant],
    CALENDAR_ROOT_PAD[size],
    CALENDAR_ROOT_MIN_W[size],
    className,
  );
}

export function calendarRangeHalfFillSideClass(side: "left" | "right"): string {
  return side === "left" ? "left-0 right-1/2" : "left-1/2 right-0";
}

export function calendarInteractiveCellSizeClass(
  size: CalendarSize,
  rounded: "day" | "picker",
): string {
  return rounded === "day" ? CALENDAR_DAY_BTN[size] : CALENDAR_PICKER_BTN[size];
}

export function calendarInteractiveCellTextVariant(
  size: CalendarSize,
  rounded: "day" | "picker",
): TextVariant {
  return rounded === "day" ? CALENDAR_DAY_TEXT[size] : CALENDAR_PICKER_TEXT[size];
}

export function calendarInteractiveCellStateClass({
  selected,
  isToday,
  isCurrent,
}: {
  selected: boolean;
  isToday: boolean;
  isCurrent: boolean;
}): string {
  if (selected) return CALENDAR_CELL_SELECTED_CLASS;
  if (isToday || isCurrent) return CALENDAR_CELL_CURRENT_CLASS;
  return CALENDAR_CELL_DEFAULT_CLASS;
}

export function calendarInteractiveCellClass(
  size: CalendarSize,
  rounded: "day" | "picker",
  state: {
    selected: boolean;
    disabled: boolean;
    isToday: boolean;
    isCurrent: boolean;
  },
  className?: string,
): string {
  return cn(
    CALENDAR_CELL_BUTTON_CLASS,
    calendarInteractiveCellSizeClass(size, rounded),
    calendarInteractiveCellStateClass({
      selected: state.selected,
      isToday: state.isToday,
      isCurrent: state.isCurrent,
    }),
    !state.selected && !state.disabled && hoverVariant(),
    state.disabled ? CALENDAR_CELL_DISABLED_CLASS : CALENDAR_CELL_POINTER_CLASS,
    className,
  );
}

export function calendarWeekdayLabelClass(size: CalendarSize): string {
  return cn(CALENDAR_WEEKDAY_LABEL_CLASS, CALENDAR_WEEKDAY_CELL[size]);
}

export function calendarMonthsGridClass(size: CalendarSize): string {
  return cn(CALENDAR_MONTHS_GRID_CLASS, CALENDAR_MONTH_GRID_GAP[size]);
}

export function calendarYearsGridClass(size: CalendarSize): string {
  return cn(CALENDAR_YEARS_GRID_CLASS, CALENDAR_MONTH_GRID_GAP[size]);
}

export function calendarYearCellClass(outOfDecade: boolean, isSelected: boolean): string | undefined {
  return outOfDecade && !isSelected ? CALENDAR_YEAR_OUT_OF_DECADE_CLASS : undefined;
}

export function calendarHeaderTitleClass(
  size: CalendarSize,
  view: "days" | "months" | "years",
): string {
  return cn(
    CALENDAR_HEADER_TITLE_BASE_CLASS,
    CALENDAR_HEADER_TEXT[size],
    view !== "years"
      ? CALENDAR_HEADER_TITLE_INTERACTIVE_CLASS
      : CALENDAR_HEADER_TITLE_STATIC_CLASS,
  );
}
