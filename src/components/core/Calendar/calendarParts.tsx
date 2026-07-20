import {
  forwardRef,
  memo,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { motionContentFade } from "@/components/core/utils/motionConfig";

import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import { useToggleButtonFillAnimation, SELECTION_FILL_DATA_ATTR } from "@/components/core/ToggleButton/useToggleButtonFillAnimation";
import { cn } from "@/utils/cn";

import { calendarNavBackLabel, calendarNavForwardLabel } from "./calendarA11y";
import {
  useCalendarInteractiveCellAnimations,
  useCalendarNavButtonAnimations,
} from "./calendarAnimations";
import { useCalendar, useCalendarClassNames } from "./calendarContext";
import {
  CALENDAR_CELL_FILL_CLASS,
  CALENDAR_CELL_TEXT_CLASS,
  CALENDAR_CELL_TODAY_DOT_CLASS,
  CALENDAR_DAY_CELL_LAYER_CLASS,
  CALENDAR_DAY_CELL_WRAPPER_CLASS,
  CALENDAR_DAYS_CELL_GRID_CLASS,
  CALENDAR_DAYS_WEEKDAY_GRID_CLASS,
  CALENDAR_DAY_BTN,
  CALENDAR_FOOTER_CLASS,
  CALENDAR_FOOTER_TODAY_BUTTON_CLASS,
  CALENDAR_GRID_CLASS,
  CALENDAR_HEADER_CLASS,
  CALENDAR_NAV_ICON_CLASS,
  CALENDAR_RANGE_HALF_FILL_CLASS,
  CALENDAR_RANGE_HALF_FILL_INITIAL_STYLE,
  calendarHeaderTitleClass,
  calendarInteractiveCellClass,
  calendarInteractiveCellTextVariant,
  calendarMonthsGridClass,
  calendarNavButtonClass,
  calendarRangeHalfFillSideClass,
  calendarWeekdayLabelClass,
  calendarYearCellClass,
  calendarYearsGridClass,
} from "./calendarStyles";
import type {
  CalendarFooterProps,
  CalendarGridProps,
  CalendarHeaderProps,
  CalendarInteractiveCellProps,
  CalendarNavButtonProps,
  CalendarRangeHalfFillProps,
} from "./calendarTypes";
import {
  useCalendarDayCellModels,
  useCalendarHeaderTitle,
  useCalendarMonthCellModels,
  useCalendarYearCellModels,
} from "./useCalendarViewModels";

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

function CalendarNavButton({ direction, size, onClick, disabled }: CalendarNavButtonProps) {
  const slotClassNames = useCalendarClassNames();
  const motion = useCalendarNavButtonAnimations(disabled);
  const label = direction === "prev" ? calendarNavBackLabel() : calendarNavForwardLabel();
  const navSlot =
    direction === "prev" ? slotClassNames.navPrev : slotClassNames.navNext;

  return (
    <button
      ref={motion.ref}
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      onPointerEnter={motion.handlePointerEnter}
      onPointerLeave={motion.handlePointerLeave}
      onPointerDown={motion.handlePointerDown}
      className={cn(calendarNavButtonClass(size), navSlot)}
    >
      {direction === "prev" ? (
        <IoChevronBack className={CALENDAR_NAV_ICON_CLASS} />
      ) : (
        <IoChevronForward className={CALENDAR_NAV_ICON_CLASS} />
      )}
    </button>
  );
}

const CalendarInteractiveCellInner = forwardRef<
  HTMLButtonElement,
  CalendarInteractiveCellProps
>(function CalendarInteractiveCell(
  {
    selected,
    disabled = false,
    size,
    ariaLabel,
    ariaSelected,
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
      aria-pressed={ariaSelected}
      aria-disabled={disabled}
      disabled={disabled}
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
    prev.ariaSelected === next.ariaSelected &&
    prev.className === next.className &&
    prev.children === next.children
  );
}

const CalendarInteractiveCell = memo(CalendarInteractiveCellInner, calendarCellPropsEqual);

function CalendarDaysView() {
  const slotClassNames = useCalendarClassNames();
  const {
    setHoverDate,
    onDayPress,
    size,
    mode,
    locale,
  } = useCalendar();
  const cells = useCalendarDayCellModels();

  return (
    <div>
      <div className={cn(CALENDAR_DAYS_WEEKDAY_GRID_CLASS, slotClassNames.weekdayGrid)}>
        {locale.weekDays.map((wd) => (
          <div
            key={wd}
            className={cn(calendarWeekdayLabelClass(size), slotClassNames.weekdayCell)}
          >
            {wd}
          </div>
        ))}
      </div>

      <div className={cn(CALENDAR_DAYS_CELL_GRID_CLASS, slotClassNames.daysGrid)}>
        {cells.map((cell) => {
          if (cell.day === null) {
            return (
              <div key={cell.key} className={CALENDAR_DAY_BTN[size]} />
            );
          }

          return (
            <div
              key={cell.key}
              className={cn(
                CALENDAR_DAY_CELL_WRAPPER_CLASS,
                slotClassNames.dayCellWrapper,
              )}
            >
              {cell.showLeftBg ? <CalendarRangeHalfFill visible side="left" /> : null}
              {cell.showRightBg ? <CalendarRangeHalfFill visible side="right" /> : null}

              <CalendarInteractiveCell
                selected={!!cell.circleActive}
                disabled={cell.isDisabled}
                isToday={cell.isToday}
                size={size}
                cellKind="day"
                ariaLabel={cell.ariaLabel}
                ariaSelected={cell.circleActive}
                onPress={() => cell.date && onDayPress(cell.date)}
                onMouseEnter={() =>
                  mode === "range" && !cell.isDisabled && cell.date && setHoverDate(cell.date)
                }
                onMouseLeave={() => mode === "range" && setHoverDate(null)}
                className={CALENDAR_DAY_CELL_LAYER_CLASS}
              >
                {cell.day}
              </CalendarInteractiveCell>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarMonthsView() {
  const slotClassNames = useCalendarClassNames();
  const { onMonthPress, size } = useCalendar();
  const months = useCalendarMonthCellModels();

  return (
    <div className={cn(calendarMonthsGridClass(size), slotClassNames.monthsGrid)}>
      {months.map((cell) => (
        <CalendarInteractiveCell
          key={cell.month}
          selected={cell.isSelected}
          isCurrent={cell.isCurrentMonth}
          size={size}
          cellKind="month"
          rounded="picker"
          onPress={() => onMonthPress(cell.month)}
        >
          {cell.name}
        </CalendarInteractiveCell>
      ))}
    </div>
  );
}

function CalendarYearsView() {
  const slotClassNames = useCalendarClassNames();
  const { onYearPress, size } = useCalendar();
  const years = useCalendarYearCellModels();

  return (
    <div className={cn(calendarYearsGridClass(size), slotClassNames.yearsGrid)}>
      {years.map((cell) => (
        <CalendarInteractiveCell
          key={cell.year}
          selected={cell.isSelected}
          isCurrent={cell.isCurrentYear}
          size={size}
          cellKind="year"
          rounded="picker"
          onPress={() => onYearPress(cell.year)}
          className={calendarYearCellClass(cell.outOfDecade, cell.isSelected)}
        >
          {cell.year}
        </CalendarInteractiveCell>
      ))}
    </div>
  );
}

export const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  function CalendarHeader({ className = "", ...rest }, ref) {
    const slotClassNames = useCalendarClassNames();
    const { view, setView, navigate, size } = useCalendar();
    const title = useCalendarHeaderTitle();

    return (
      <div
        ref={ref}
        className={cn(CALENDAR_HEADER_CLASS, slotClassNames.header, className)}
        {...rest}
      >
        <CalendarNavButton direction="prev" size={size} onClick={() => navigate(-1)} />

        <button
          type="button"
          disabled={view === "years"}
          onClick={() => {
            if (view === "days") setView("months");
            else if (view === "months") setView("years");
          }}
          className={cn(
            calendarHeaderTitleClass(size, view),
            slotClassNames.headerTitle,
          )}
        >
          {title}
        </button>

        <CalendarNavButton direction="next" size={size} onClick={() => navigate(1)} />
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
