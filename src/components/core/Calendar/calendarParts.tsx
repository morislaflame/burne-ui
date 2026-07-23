import { forwardRef, memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { motionContentFade } from "@/components/core/utils/motionConfig";

import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import { useToggleButtonFillAnimation, SELECTION_FILL_DATA_ATTR } from "@/components/core/ToggleButton/useToggleButtonFillAnimation";
import { cn } from "@/utils/cn";

import {
  calendarDaysGridLabel,
  calendarFocusDayKey,
  calendarMonthsGridLabel,
  calendarNavBackLabel,
  calendarNavForwardLabel,
  calendarYearsGridLabel,
} from "./calendarA11y";
import {
  chunkCalendarCells,
  isSameDay,
  moveCalendarFocusDate,
  moveCalendarMonthFocusIndex,
  moveCalendarYearFocusIndex,
} from "./calendarAPI";
import { useCalendarInteractiveCellAnimations, useCalendarNavButtonAnimations } from "./calendarAnimations";
import { useCalendar, useCalendarClassNames } from "./calendarContext";
import { CALENDAR_CELL_FILL_CLASS, CALENDAR_CELL_TEXT_CLASS, CALENDAR_CELL_TODAY_DOT_CLASS, CALENDAR_DAY_CELL_LAYER_CLASS, CALENDAR_DAY_CELL_WRAPPER_CLASS, CALENDAR_DAYS_CELL_GRID_CLASS, CALENDAR_DAYS_WEEKDAY_GRID_CLASS, CALENDAR_FOOTER_CLASS, CALENDAR_FOOTER_TODAY_BUTTON_CLASS, CALENDAR_GRID_CLASS, CALENDAR_HEADER_CLASS, CALENDAR_NAV_ICON_CLASS, CALENDAR_RANGE_HALF_FILL_CLASS, CALENDAR_RANGE_HALF_FILL_INITIAL_STYLE, calendarDayEmptyClass, calendarHeaderTitleClass, calendarInteractiveCellClass, calendarInteractiveCellTextVariant, calendarMonthsGridClass, calendarNavButtonClass, calendarRangeHalfFillSideClass, calendarWeekdayLabelClass, calendarYearCellClass, calendarYearsGridClass } from "./calendarStyles";
import type {
  CalendarDayProps,
  CalendarFooterProps,
  CalendarGridProps,
  CalendarHeaderProps,
  CalendarInteractiveCellProps,
  CalendarNavButtonProps,
  CalendarNavNextProps,
  CalendarNavPrevProps,
  CalendarRangeHalfFillProps,
  CalendarTitleProps,
} from "./calendarTypes";
import { useCalendarDayCellModels, useCalendarHeaderTitle, useCalendarMonthCellModels, useCalendarYearCellModels } from "./useCalendarViewModels";

function CalendarRangeHalfFill({ visible, side }: CalendarRangeHalfFillProps) {
  const slotClassNames = useCalendarClassNames();
  const ref = useRef<HTMLDivElement>(null);
  const firstLayoutRef = useRef(true);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const applyInstant = (on: boolean) => {
      el.style.opacity = on ? "1" : "0";
    };

    if (prefersReducedInteractiveHoverLift()) {
      killMotion(el);
      applyInstant(visible);
      return;
    }

    if (firstLayoutRef.current) {
      firstLayoutRef.current = false;
      killMotion(el);
      applyInstant(visible);
      return;
    }

    killMotion(el);
    gsap.to(el, {
      autoAlpha: visible ? 1 : 0,
      ...motionContentFade(),
      overwrite: "auto",
    });
  }, [visible]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        cn(CALENDAR_RANGE_HALF_FILL_CLASS, calendarRangeHalfFillSideClass(side)),
        slotClassNames.rangeHalfFill,
      )}
      style={CALENDAR_RANGE_HALF_FILL_INITIAL_STYLE}
    />
  );
}

const CalendarNavButton = forwardRef<HTMLButtonElement, CalendarNavButtonProps>(
  function CalendarNavButton(
    { direction, size, onClick, disabled, children, className, ...rest },
    ref,
  ) {
    const { navPrevIcon, navNextIcon } = useCalendar();
    const slotClassNames = useCalendarClassNames();
    const motion = useCalendarNavButtonAnimations(disabled);
    const label = direction === "prev" ? calendarNavBackLabel() : calendarNavForwardLabel();
    const navSlot =
      direction === "prev" ? slotClassNames.navPrev : slotClassNames.navNext;
    const contextIcon = direction === "prev" ? navPrevIcon : navNextIcon;

    const setRef = useCallback(
      (node: HTMLButtonElement | null) => {
        motion.ref.current = node;
        mergeForwardedRef(ref, node);
      },
      [motion.ref, ref],
    );

    const defaultIcon =
      direction === "prev" ? (
        <IoChevronBack
          className={cn(CALENDAR_NAV_ICON_CLASS, slotClassNames.navIcon)}
        />
      ) : (
        <IoChevronForward
          className={cn(CALENDAR_NAV_ICON_CLASS, slotClassNames.navIcon)}
        />
      );

    return (
      <button
        ref={setRef}
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        onPointerEnter={motion.handlePointerEnter}
        onPointerLeave={motion.handlePointerLeave}
        onPointerDown={motion.handlePointerDown}
        className={cn(calendarNavButtonClass(size), navSlot, className)}
        {...rest}
      >
        {children ?? (contextIcon !== undefined ? contextIcon : defaultIcon)}
      </button>
    );
  },
);

CalendarNavButton.displayName = "Calendar.NavButton";

export const CalendarNavPrev = forwardRef<HTMLButtonElement, CalendarNavPrevProps>(
  function CalendarNavPrev({ size: sizeProp, onClick, ...rest }, ref) {
    const { navigate, size } = useCalendar();
    return (
      <CalendarNavButton
        ref={ref}
        direction="prev"
        size={sizeProp ?? size}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) navigate(-1);
        }}
        {...rest}
      />
    );
  },
);

CalendarNavPrev.displayName = "Calendar.NavPrev";

export const CalendarNavNext = forwardRef<HTMLButtonElement, CalendarNavNextProps>(
  function CalendarNavNext({ size: sizeProp, onClick, ...rest }, ref) {
    const { navigate, size } = useCalendar();
    return (
      <CalendarNavButton
        ref={ref}
        direction="next"
        size={sizeProp ?? size}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) navigate(1);
        }}
        {...rest}
      />
    );
  },
);

CalendarNavNext.displayName = "Calendar.NavNext";

const CalendarInteractiveCellInner = forwardRef<
  HTMLButtonElement,
  CalendarInteractiveCellProps
>(function CalendarInteractiveCell(
  {
    selected,
    disabled = false,
    size,
    ariaLabel,
    tabIndex,
    rovingKey,
    rounded = "day",
    cellKind = "day",
    isToday = false,
    isCurrent = false,
    className = "",
    onPress,
    onMouseEnter,
    onMouseLeave,
    children,
  },
  ref,
) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const onPressRef = useRef(onPress);
  const onMouseEnterRef = useRef(onMouseEnter);
  const onMouseLeaveRef = useRef(onMouseLeave);

  onPressRef.current = onPress;
  onMouseEnterRef.current = onMouseEnter;
  onMouseLeaveRef.current = onMouseLeave;

  const { bindFillRef } = useToggleButtonFillAnimation(selected, fillRef);
  const motion = useCalendarInteractiveCellAnimations(disabled);
  const slotClassNames = useCalendarClassNames();

  const kindSlot =
    cellKind === "month"
      ? slotClassNames.monthCell
      : cellKind === "year"
        ? slotClassNames.yearCell
        : slotClassNames.dayCell;

  const textVariant = calendarInteractiveCellTextVariant(size, rounded);

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      motion.btnRef.current = node;
      mergeForwardedRef(ref, node);
    },
    [motion.btnRef, ref],
  );

  const handleClick = useCallback(() => {
    if (disabled) return;
    onPressRef.current();
  }, [disabled]);

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onMouseEnterRef.current?.();
      motion.handlePointerEnter(e);
    },
    [motion],
  );

  const handlePointerLeave = useCallback(() => {
    onMouseLeaveRef.current?.();
    motion.handlePointerLeave();
  }, [motion]);

  return (
    <button
      ref={setRefs}
      type="button"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      tabIndex={disabled ? -1 : tabIndex}
      data-calendar-roving={rovingKey}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={motion.handlePointerDown}
      className={calendarInteractiveCellClass(
        size,
        rounded,
        { selected, disabled, isToday, isCurrent },
        cn(slotClassNames.cell, kindSlot, className),
      )}
    >
      <span
        ref={bindFillRef}
        aria-hidden
        {...{ [SELECTION_FILL_DATA_ATTR]: "" }}
        data-pressed={selected ? "true" : "false"}
        className={cn(CALENDAR_CELL_FILL_CLASS, slotClassNames.cellFill)}
      />
      <Text
        variant={textVariant}
        as="span"
        inheritColor
        className={cn(CALENDAR_CELL_TEXT_CLASS, slotClassNames.cellText)}
      >
        {children}
      </Text>
      {isToday && !selected && (
        <span
          aria-hidden
          className={cn(
            CALENDAR_CELL_TODAY_DOT_CLASS,
            slotClassNames.cellTodayDot,
          )}
        />
      )}
    </button>
  );
});

function calendarCellPropsEqual(
  prev: CalendarInteractiveCellProps,
  next: CalendarInteractiveCellProps,
): boolean {
  return (
    prev.selected === next.selected &&
    prev.disabled === next.disabled &&
    prev.size === next.size &&
    prev.rounded === next.rounded &&
    prev.cellKind === next.cellKind &&
    prev.isToday === next.isToday &&
    prev.isCurrent === next.isCurrent &&
    prev.ariaLabel === next.ariaLabel &&
    prev.tabIndex === next.tabIndex &&
    prev.rovingKey === next.rovingKey &&
    prev.className === next.className &&
    prev.children === next.children
  );
}

const CalendarInteractiveCell = memo(CalendarInteractiveCellInner, calendarCellPropsEqual);

export const CalendarDay = forwardRef<HTMLButtonElement, CalendarDayProps>(
  function CalendarDay({ size: sizeProp, ...props }, ref) {
    const { size } = useCalendar();
    return (
      <CalendarInteractiveCell ref={ref} size={sizeProp ?? size} {...props} />
    );
  },
);

CalendarDay.displayName = "Calendar.Day";

function CalendarDaysView() {
  const slotClassNames = useCalendarClassNames();
  const {
    setHoverDate,
    onDayPress,
    size,
    mode,
    locale,
    renderDay,
    focusedDate,
    moveDayFocus,
    viewDate,
    minDate,
    maxDate,
  } = useCalendar();
  const cells = useCalendarDayCellModels();
  const gridRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef(false);
  const focusedKey = calendarFocusDayKey(focusedDate);
  const rows = useMemo(() => chunkCalendarCells(cells, 7), [cells]);
  const gridLabel = calendarDaysGridLabel(
    viewDate.getMonth(),
    viewDate.getFullYear(),
    locale,
  );
  const hasFocusedInView = cells.some(
    (c) => !!c.date && !c.isDisabled && isSameDay(c.date, focusedDate),
  );
  const fallbackRovingDate = hasFocusedInView
    ? null
    : (cells.find((c) => c.date && !c.isDisabled)?.date ?? null);

  useLayoutEffect(() => {
    if (restoreFocusRef.current) {
      restoreFocusRef.current = false;
      const el = gridRef.current?.querySelector<HTMLElement>(
        `[data-calendar-roving="${focusedKey}"]`,
      );
      el?.focus({ preventScroll: true });
      return;
    }

    // After month/year drill-down the previous cell unmounts and focus falls to
    // body — reclaim the roving day so keyboard users stay in the grid.
    const grid = gridRef.current;
    if (!grid) return;
    const active = document.activeElement;
    if (
      active &&
      active !== document.body &&
      active !== document.documentElement &&
      grid.contains(active)
    ) {
      return;
    }
    if (
      active &&
      active !== document.body &&
      active !== document.documentElement
    ) {
      return;
    }
    const el = grid.querySelector<HTMLElement>(
      `[data-calendar-roving="${focusedKey}"]`,
    );
    el?.focus({ preventScroll: true });
  }, [focusedKey, viewDate]);

  const handleGridKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const next = moveCalendarFocusDate(
        focusedDate,
        e.key,
        e.shiftKey,
        minDate,
        maxDate,
      );
      if (!next) return;
      e.preventDefault();
      restoreFocusRef.current = true;
      moveDayFocus(next);
    },
    [focusedDate, minDate, maxDate, moveDayFocus],
  );

  return (
    <div
      ref={gridRef}
      role="grid"
      aria-label={gridLabel}
      onKeyDown={handleGridKeyDown}
    >
      <div
        role="row"
        className={cn(CALENDAR_DAYS_WEEKDAY_GRID_CLASS, slotClassNames.weekdayGrid)}
      >
        {locale.weekDays.map((wd) => (
          <div
            key={wd}
            role="columnheader"
            className={cn(calendarWeekdayLabelClass(size), slotClassNames.weekdayCell)}
          >
            {wd}
          </div>
        ))}
      </div>

      <div className={cn(CALENDAR_DAYS_CELL_GRID_CLASS, slotClassNames.daysGrid)}>
        {rows.map((row, rowIndex) => (
          <div key={`week-${rowIndex}`} role="row" className="contents">
            {row.map((cell) => {
              if (cell.day === null) {
                return (
                  <div
                    key={cell.key}
                    role="gridcell"
                    className={calendarDayEmptyClass(
                      size,
                      slotClassNames.dayEmpty,
                    )}
                  />
                );
              }

              const dayContent =
                renderDay && cell.date
                  ? renderDay(cell.date, {
                      day: cell.day,
                      selected: !!cell.isSelected,
                      disabled: !!cell.isDisabled,
                      isToday: !!cell.isToday,
                      isRangeStart: !!cell.isRangeStart,
                      isRangeEnd: !!cell.isRangeEnd,
                      circleActive: !!cell.circleActive,
                    })
                  : cell.day;

              const isFocused =
                !!cell.date && isSameDay(cell.date, focusedDate);
              const isRovingTarget =
                isFocused ||
                (!!fallbackRovingDate &&
                  !!cell.date &&
                  isSameDay(cell.date, fallbackRovingDate));

              return (
                <div
                  key={cell.key}
                  role="gridcell"
                  aria-selected={cell.circleActive ? true : undefined}
                  className={cn(
                    CALENDAR_DAY_CELL_WRAPPER_CLASS,
                    slotClassNames.dayCellWrapper,
                  )}
                >
                  {cell.showLeftBg ? (
                    <CalendarRangeHalfFill visible side="left" />
                  ) : null}
                  {cell.showRightBg ? (
                    <CalendarRangeHalfFill visible side="right" />
                  ) : null}

                  <CalendarInteractiveCell
                    selected={!!cell.circleActive}
                    disabled={cell.isDisabled}
                    isToday={cell.isToday}
                    size={size}
                    cellKind="day"
                    ariaLabel={cell.ariaLabel}
                    tabIndex={isRovingTarget ? 0 : -1}
                    rovingKey={
                      cell.date ? calendarFocusDayKey(cell.date) : undefined
                    }
                    onPress={() => cell.date && onDayPress(cell.date)}
                    onMouseEnter={() =>
                      mode === "range" &&
                      !cell.isDisabled &&
                      cell.date &&
                      setHoverDate(cell.date)
                    }
                    onMouseLeave={() => mode === "range" && setHoverDate(null)}
                    className={CALENDAR_DAY_CELL_LAYER_CLASS}
                  >
                    {dayContent}
                  </CalendarInteractiveCell>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarMonthsView() {
  const slotClassNames = useCalendarClassNames();
  const { onMonthPress, size, viewDate, focusedDate } = useCalendar();
  const months = useCalendarMonthCellModels();
  const gridRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef(false);
  const [focusedMonth, setFocusedMonth] = useState(() =>
    Math.min(11, Math.max(0, focusedDate.getMonth())),
  );
  const rows = useMemo(() => chunkCalendarCells(months, 3), [months]);

  useLayoutEffect(() => {
    if (!restoreFocusRef.current) return;
    restoreFocusRef.current = false;
    const el = gridRef.current?.querySelector<HTMLElement>(
      `[data-calendar-roving="${focusedMonth}"]`,
    );
    el?.focus({ preventScroll: true });
  }, [focusedMonth]);

  const handleGridKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onMonthPress(focusedMonth);
        return;
      }
      const next = moveCalendarMonthFocusIndex(focusedMonth, e.key);
      if (next == null) return;
      e.preventDefault();
      restoreFocusRef.current = true;
      setFocusedMonth(next);
    },
    [focusedMonth, onMonthPress],
  );

  return (
    <div
      ref={gridRef}
      role="grid"
      aria-label={calendarMonthsGridLabel(viewDate.getFullYear())}
      className={cn(calendarMonthsGridClass(size), slotClassNames.monthsGrid)}
      onKeyDown={handleGridKeyDown}
    >
      {rows.map((row, rowIndex) => (
        <div key={`months-${rowIndex}`} role="row" className="contents">
          {row.map((cell) => (
            <div
              key={cell.month}
              role="gridcell"
              aria-selected={cell.isSelected ? true : undefined}
              className="contents"
            >
              <CalendarInteractiveCell
                selected={cell.isSelected}
                isCurrent={cell.isCurrentMonth}
                size={size}
                cellKind="month"
                rounded="picker"
                tabIndex={focusedMonth === cell.month ? 0 : -1}
                rovingKey={String(cell.month)}
                ariaLabel={cell.name}
                onPress={() => {
                  setFocusedMonth(cell.month);
                  onMonthPress(cell.month);
                }}
              >
                {cell.name}
              </CalendarInteractiveCell>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function CalendarYearsView() {
  const slotClassNames = useCalendarClassNames();
  const { onYearPress, size, viewDate, focusedDate } = useCalendar();
  const years = useCalendarYearCellModels();
  const gridRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef(false);
  const initialIndex = Math.max(
    0,
    years.findIndex((y) => y.year === focusedDate.getFullYear()),
  );
  const [focusedIndex, setFocusedIndex] = useState(
    initialIndex >= 0 ? initialIndex : 1,
  );
  const rows = useMemo(() => chunkCalendarCells(years, 4), [years]);
  const decadeStart = Math.floor(viewDate.getFullYear() / 10) * 10;

  useLayoutEffect(() => {
    if (!restoreFocusRef.current) return;
    restoreFocusRef.current = false;
    const year = years[focusedIndex]?.year;
    if (year == null) return;
    const el = gridRef.current?.querySelector<HTMLElement>(
      `[data-calendar-roving="${year}"]`,
    );
    el?.focus({ preventScroll: true });
  }, [focusedIndex, years]);

  const handleGridKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const year = years[focusedIndex]?.year;
      if ((e.key === "Enter" || e.key === " ") && year != null) {
        e.preventDefault();
        onYearPress(year);
        return;
      }
      const next = moveCalendarYearFocusIndex(focusedIndex, e.key);
      if (next == null) return;
      e.preventDefault();
      restoreFocusRef.current = true;
      setFocusedIndex(next);
    },
    [focusedIndex, onYearPress, years],
  );

  return (
    <div
      ref={gridRef}
      role="grid"
      aria-label={calendarYearsGridLabel(decadeStart)}
      className={cn(calendarYearsGridClass(size), slotClassNames.yearsGrid)}
      onKeyDown={handleGridKeyDown}
    >
      {rows.map((row, rowIndex) => (
        <div key={`years-${rowIndex}`} role="row" className="contents">
          {row.map((cell, cellIndex) => {
            const index = rowIndex * 4 + cellIndex;
            return (
              <div
                key={cell.year}
                role="gridcell"
                aria-selected={cell.isSelected ? true : undefined}
                className="contents"
              >
                <CalendarInteractiveCell
                  selected={cell.isSelected}
                  isCurrent={cell.isCurrentYear}
                  size={size}
                  cellKind="year"
                  rounded="picker"
                  tabIndex={focusedIndex === index ? 0 : -1}
                  rovingKey={String(cell.year)}
                  ariaLabel={String(cell.year)}
                  onPress={() => {
                    setFocusedIndex(index);
                    onYearPress(cell.year);
                  }}
                  className={calendarYearCellClass(cell.outOfDecade, cell.isSelected)}
                >
                  {cell.year}
                </CalendarInteractiveCell>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export const CalendarTitle = forwardRef<HTMLButtonElement, CalendarTitleProps>(
  function CalendarTitle({ className = "", children, onClick, ...rest }, ref) {
    const slotClassNames = useCalendarClassNames();
    const { view, setView, size } = useCalendar();
    const title = useCalendarHeaderTitle();

    return (
      <button
        ref={ref}
        type="button"
        disabled={view === "years"}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented) return;
          if (view === "days") setView("months");
          else if (view === "months") setView("years");
        }}
        className={cn(
          calendarHeaderTitleClass(size, view),
          slotClassNames.headerTitle,
          className,
        )}
        {...rest}
      >
        {children ?? title}
      </button>
    );
  },
);

CalendarTitle.displayName = "Calendar.Title";

export const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  function CalendarHeader({ className = "", children, ...rest }, ref) {
    const slotClassNames = useCalendarClassNames();

    return (
      <div
        ref={ref}
        className={cn(CALENDAR_HEADER_CLASS, slotClassNames.header, className)}
        {...rest}
      >
        {children ?? (
          <>
            <CalendarNavPrev />
            <CalendarTitle />
            <CalendarNavNext />
          </>
        )}
      </div>
    );
  },
);

export const CalendarGrid = forwardRef<HTMLDivElement, CalendarGridProps>(
  function CalendarGrid({ className = "", ...rest }, ref) {
    const slotClassNames = useCalendarClassNames();
    const { view } = useCalendar();

    return (
      <div
        ref={ref}
        className={cn(CALENDAR_GRID_CLASS, slotClassNames.grid, className)}
        {...rest}
      >
        {view === "days" && <CalendarDaysView />}
        {view === "months" && <CalendarMonthsView />}
        {view === "years" && <CalendarYearsView />}
      </div>
    );
  },
);

export const CalendarFooter = forwardRef<HTMLDivElement, CalendarFooterProps>(
  function CalendarFooter({ className = "", ...rest }, ref) {
    const slotClassNames = useCalendarClassNames();
    const { onClear, onToday, locale } = useCalendar();

    return (
      <div
        ref={ref}
        className={cn(CALENDAR_FOOTER_CLASS, slotClassNames.footer, className)}
        {...rest}
      >
        <Button
          variant="ghost"
          size="small"
          className={cn(
            CALENDAR_FOOTER_TODAY_BUTTON_CLASS,
            slotClassNames.footerToday,
          )}
          onClick={onToday}
        >
          {locale.today}
        </Button>
        <Button
          variant="ghost"
          size="small"
          status="danger"
          className={slotClassNames.footerClear}
          onClick={onClear}
        >
          {locale.clear}
        </Button>
      </div>
    );
  },
);

CalendarHeader.displayName = "Calendar.Header";
CalendarGrid.displayName = "Calendar.Grid";
CalendarFooter.displayName = "Calendar.Footer";
CalendarInteractiveCell.displayName = "CalendarInteractiveCell";

export function CalendarDefaultContent() {
  return (
    <>
      <CalendarHeader />
      <CalendarGrid />
    </>
  );
}
