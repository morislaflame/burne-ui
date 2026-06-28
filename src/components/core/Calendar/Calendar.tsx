import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type PointerEvent,
} from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  useMergedGlossPanelRef,
} from "@/components/core/utils/glossInteractiveMotion";
import "../utils/glossInteractive.css";
import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { motionContentFade } from "@/components/core/utils/motionConfig";
import { hoverVariant, TEXT_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import { cn } from "@/utils/cn";

import { Button } from "@/components/core/Button";
import { CalendarInteractiveCell, DAY_BTN } from "./CalendarInteractiveCell";
import { RU_LOCALE, type CalendarLocale } from "./calendarLocale";


function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthStartOffset(year: number, month: number): number {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}


export type CalendarMode = "single" | "range" | "multiple";
export type CalendarView = "days" | "months" | "years";
export type CalendarVariant = "default" | "secondary" | "outline" | "gloss";
export type CalendarSize = "small" | "base" | "mid" | "large";
export type CalendarRangeValue = { start: Date | null; end: Date | null };

export type { CalendarLocale };


const WEEKDAY_CELL: Record<CalendarSize, string> = {
  small: "mx-auto flex aspect-square w-full max-w-control-small items-center justify-center text-xs",
  base:  "mx-auto flex aspect-square w-full max-w-control-base items-center justify-center text-small",
  mid:   "mx-auto flex aspect-square w-full max-w-control-mid items-center justify-center text-small",
  large: "mx-auto flex aspect-square w-full max-w-control-large items-center justify-center text-base",
};

const NAV_BTN: Record<CalendarSize, string> = {
  small: "h-control-small w-control-small",
  base:  "h-control-base w-control-base",
  mid:   "h-control-mid w-control-mid",
  large: "h-control-large w-control-large",
};

const ROOT_PAD: Record<CalendarSize, string> = {
  small: "p-small gap-xsmall",
  base:  "p-mid gap-small",
  mid:   "p-mid gap-small",
  large: "p-large gap-base",
};

const ROOT_MIN_W: Record<CalendarSize, string> = {
  small: "min-w-[15.5rem]",
  base:  "min-w-[18rem]",
  mid:   "min-w-[21rem]",
  large: "min-w-[24rem]",
};

const HEADER_TEXT: Record<CalendarSize, string> = {
  small: "text-small",
  base:  "text-base",
  mid:   "text-mid",
  large: "text-mid",
};

const ROOT_SURFACE: Record<CalendarVariant, string> = {
  default:   "rounded-large border-token bg-surface shadow-token-sm",
  secondary: "rounded-large border-token bg-secondary shadow-token-sm",
  outline:   "rounded-large bg-transparent border-token shadow-token-sm",
  gloss:     "rounded-large border-0",
};

const MONTH_GRID_GAP: Record<CalendarSize, string> = {
  small: "gap-xsmall",
  base:  "gap-xsmall",
  mid:   "gap-small",
  large: "gap-small",
};

function CalendarRangeHalfFill({
  visible,
  side,
}: {
  visible: boolean;
  side: "left" | "right";
}) {
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
        "pointer-events-none absolute inset-y-0 bg-default-hover",
        side === "left" ? "left-0 right-1/2" : "left-1/2 right-0",
      )}
      style={{ opacity: 0 }}
    />
  );
}


type CalendarCtx = {
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
};

const CalendarContext = createContext<CalendarCtx | null>(null);

function useCalendar(): CalendarCtx {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("Calendar compound parts must be inside <Calendar>.");
  return ctx;
}


type CalendarCommonProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CalendarVariant;
  size?: CalendarSize;
  defaultMonth?: Date;
  initialView?: CalendarView;
  locale?: CalendarLocale;
  minDate?: Date;
  maxDate?: Date;
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


export const CalendarRoot = forwardRef<HTMLDivElement, CalendarProps>(
  function CalendarRoot(rawProps, ref) {
    const props = rawProps as CalendarCommonProps & {
      mode?: CalendarMode;
      value?: unknown;
      defaultValue?: unknown;
      onValueChange?: (v: unknown) => void;
    };

    const {
      mode = "single",
      variant = "default",
      size = "base",
      defaultMonth,
      initialView = "days",
      locale = RU_LOCALE,
      minDate,
      maxDate,
      value,
      defaultValue,
      onValueChange,
      children,
      className = "",
      ...rest
    } = props;

    const isGloss = variant === "gloss";
    const setRootRef = useMergedGlossPanelRef(ref, isGloss);

    const today = useMemo(() => startOfDay(new Date()), []);
    const isControlled = value !== undefined;

    const [internalValue, setInternalValue] = useState<unknown>(() => {
      if (defaultValue !== undefined) return defaultValue;
      if (mode === "range") return { start: null, end: null } satisfies CalendarRangeValue;
      if (mode === "multiple") return [] as Date[];
      return null;
    });

    const resolvedValue = isControlled ? value : internalValue;
    const resolvedValueRef = useRef(resolvedValue);
    resolvedValueRef.current = resolvedValue;

    const setValue = useCallback(
      (newValOrUpdater: unknown | ((prev: unknown) => unknown)) => {
        const current = resolvedValueRef.current;
        const newVal =
          typeof newValOrUpdater === "function"
            ? newValOrUpdater(current)
            : newValOrUpdater;
        resolvedValueRef.current = newVal;
        if (!isControlled) setInternalValue(newVal);
        onValueChange?.(newVal);
      },
      [isControlled, onValueChange],
    );

    const [view, setView] = useState<CalendarView>(initialView);
    const [viewDate, setViewDateRaw] = useState<Date>(() => {
      if (defaultMonth) return new Date(defaultMonth.getFullYear(), defaultMonth.getMonth(), 1);
      let anchor: Date | null = null;
      if (mode === "single" && resolvedValue instanceof Date) anchor = resolvedValue;
      else if (mode === "range") anchor = (resolvedValue as CalendarRangeValue)?.start ?? null;
      else if (mode === "multiple") anchor = (resolvedValue as Date[])?.[0] ?? null;
      if (anchor) return new Date(anchor.getFullYear(), anchor.getMonth(), 1);
      return new Date(today.getFullYear(), today.getMonth(), 1);
    });

    const [rangePending, setRangePending] = useState<Date | null>(null);
    const [hoverDate, setHoverDate] = useState<Date | null>(null);

    const selectedDates = useMemo((): Date[] => {
      if (mode === "single") {
        const v = resolvedValue as Date | null;
        return v ? [v] : [];
      }
      if (mode === "multiple") {
        const v = resolvedValue;
        return Array.isArray(v) ? v : [];
      }
      return [];
    }, [mode, resolvedValue]);

    const rangeStart = useMemo((): Date | null => {
      if (mode !== "range") return null;
      if (rangePending) return rangePending;
      return (resolvedValue as CalendarRangeValue)?.start ?? null;
    }, [mode, rangePending, resolvedValue]);

    const rangeEnd = useMemo((): Date | null => {
      if (mode !== "range") return null;
      if (rangePending) return null;
      return (resolvedValue as CalendarRangeValue)?.end ?? null;
    }, [mode, rangePending, resolvedValue]);

    const navigate = useCallback(
      (delta: number) => {
        setViewDateRaw((prev) => {
          if (view === "days") return new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
          if (view === "months") return new Date(prev.getFullYear() + delta, prev.getMonth(), 1);
          return new Date(prev.getFullYear() + delta * 10, prev.getMonth(), 1);
        });
      },
      [view],
    );

    const onDayPress = useCallback(
      (d: Date) => {
        const day = startOfDay(d);
        if (mode === "single") {
          setValue((current: unknown) => {
            const prev = current instanceof Date ? current : null;
            return prev && isSameDay(prev, day) ? null : day;
          });
        } else if (mode === "multiple") {
          setValue((current: unknown) => {
            const prev = Array.isArray(current) ? current : [];
            const i = prev.findIndex((x) => isSameDay(x, day));
            return i >= 0 ? prev.filter((_, j) => j !== i) : [...prev, day];
          });
        } else {
          if (!rangePending) {
            setRangePending(day);
            setValue({ start: null, end: null } satisfies CalendarRangeValue);
          } else if (isSameDay(day, rangePending)) {
            setRangePending(null);
          } else {
            const s = day <= rangePending ? day : rangePending;
            const e = day <= rangePending ? rangePending : day;
            setRangePending(null);
            setHoverDate(null);
            setValue({ start: s, end: e } satisfies CalendarRangeValue);
          }
        }
      },
      [mode, rangePending, setValue],
    );

    const onMonthPress = useCallback(
      (month: number) => {
        setViewDateRaw(new Date(viewDate.getFullYear(), month, 1));
        setView("days");
      },
      [viewDate],
    );

    const onYearPress = useCallback(
      (year: number) => {
        setViewDateRaw(new Date(year, viewDate.getMonth(), 1));
        setView("months");
      },
      [viewDate],
    );

    const onClear = useCallback(() => {
      setRangePending(null);
      setHoverDate(null);
      if (mode === "single") setValue(null);
      else if (mode === "multiple") setValue([]);
      else setValue({ start: null, end: null } satisfies CalendarRangeValue);
    }, [mode, setValue]);

    const onToday = useCallback(() => {
      setViewDateRaw(new Date(today.getFullYear(), today.getMonth(), 1));
      setView("days");
    }, [today]);

    const ctx: CalendarCtx = useMemo(
      () => ({
        mode,
        view,
        setView,
        viewDate,
        navigate,
        selectedDates,
        rangeStart,
        rangeEnd,
        hoverDate,
        setHoverDate,
        onDayPress,
        onMonthPress,
        onYearPress,
        onClear,
        onToday,
        size,
        variant,
        locale,
        minDate,
        maxDate,
      }),
      [
        mode, view, viewDate, navigate,
        selectedDates, rangeStart, rangeEnd, hoverDate,
        onDayPress, onMonthPress, onYearPress, onClear, onToday,
        size, variant, locale, minDate, maxDate,
      ],
    );

    return (
      <CalendarContext.Provider value={ctx}>
        <div
          ref={setRootRef}
          className={cn(
            "inline-flex flex-col select-none text-left text-foreground",
            isGloss
              ? "gloss-panel gloss-deep rounded-large"
              : ROOT_SURFACE[variant],
            ROOT_PAD[size],
            ROOT_MIN_W[size],
            className,
          )}
          {...rest}
        >
          {isGloss ? (
            <div className="gloss-content flex flex-col">
              {children ?? (
                <>
                  <CalendarHeader />
                  <CalendarGrid />
                </>
              )}
            </div>
          ) : (
            (children ?? (
              <>
                <CalendarHeader />
                <CalendarGrid />
              </>
            ))
          )}
        </div>
      </CalendarContext.Provider>
    );
  },
);


function CalendarNavButton({
  label,
  size,
  onClick,
  disabled,
}: {
  label: string;
  size: CalendarSize;
  onClick: () => void;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const hoverInsideRef = useRef(false);

  const handlePointerEnter = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      if (disabled || e.defaultPrevented) return;
      hoverInsideRef.current = true;
      const el = ref.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, true);
    },
    [disabled],
  );

  const handlePointerLeave = useCallback(() => {
    hoverInsideRef.current = false;
    const el = ref.current;
    if (!el || shouldSkipInteractiveHoverLift()) return;
    animateInteractiveHoverLift(el, false);
  }, []);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      if (disabled || e.defaultPrevented) return;
      const el = ref.current;
      if (!el || prefersReducedInteractiveHoverLift()) return;
      void animateInteractivePressSqueeze(el).then(() => {
        const btn = ref.current;
        if (!btn || disabled || shouldSkipInteractiveHoverLift()) return;
        if (hoverInsideRef.current) animateInteractiveHoverLift(btn, true);
      });
    },
    [disabled],
  );

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      className={cn(
        hoverVariant(),
        "flex shrink-0 origin-center items-center justify-center rounded-base will-change-transform",
        "text-muted focus-ring",
        "disabled:cursor-not-allowed disabled:opacity-40",
        NAV_BTN[size],
      )}
    >
      {label === "Назад" ? (
        <IoChevronBack className="icon-xsmall" />
      ) : (
        <IoChevronForward className="icon-xsmall" />
      )}
    </button>
  );
}

export const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  function CalendarHeader({ className = "", ...rest }, ref) {
    const { view, setView, viewDate, navigate, size, locale } = useCalendar();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const title = useMemo(() => {
      if (view === "days") return `${locale.months[month]} ${year}`;
      if (view === "months") return String(year);
      const ds = Math.floor(year / 10) * 10;
      return `${ds}\u2013${ds + 9}`;
    }, [view, year, month, locale]);

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-xsmall", className)}
        {...rest}
      >
        <CalendarNavButton label="Назад" size={size} onClick={() => navigate(-1)} />

        <button
          type="button"
          disabled={view === "years"}
          onClick={() => {
            if (view === "days") setView("months");
            else if (view === "months") setView("years");
          }}
          className={cn(
            "flex-1 rounded-base py-xsmall text-center font-medium",
            TEXT_COLOR_TRANSITION,
            HEADER_TEXT[size],
            view !== "years"
              ? "cursor-pointer hover:text-primary focus-ring"
              : "cursor-default",
          )}
        >
          {title}
        </button>

        <CalendarNavButton label="Вперёд" size={size} onClick={() => navigate(1)} />
      </div>
    );
  },
);


export const CalendarGrid = forwardRef<HTMLDivElement, CalendarGridProps>(
  function CalendarGrid({ className = "", ...rest }, ref) {
    const { view } = useCalendar();
    return (
      <div ref={ref} className={cn("min-w-0", className)} {...rest}>
        {view === "days" && <CalendarDaysView />}
        {view === "months" && <CalendarMonthsView />}
        {view === "years" && <CalendarYearsView />}
      </div>
    );
  },
);


function CalendarDaysView() {
  const {
    viewDate,
    selectedDates,
    rangeStart,
    rangeEnd,
    hoverDate,
    setHoverDate,
    onDayPress,
    size,
    mode,
    locale,
    minDate,
    maxDate,
  } = useCalendar();

  const today = useMemo(() => startOfDay(new Date()), []);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const offset = getMonthStartOffset(year, month);

  const effectiveRangeEnd = rangeEnd ?? (rangeStart && hoverDate ? hoverDate : null);

  const rLow =
    rangeStart && effectiveRangeEnd
      ? rangeStart <= effectiveRangeEnd
        ? rangeStart
        : effectiveRangeEnd
      : null;
  const rHigh =
    rangeStart && effectiveRangeEnd
      ? rangeStart <= effectiveRangeEnd
        ? effectiveRangeEnd
        : rangeStart
      : null;

  const cells: (number | null)[] = [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const rem = cells.length % 7;
  if (rem !== 0) cells.push(...Array<null>(7 - rem).fill(null));

  return (
    <div>
      <div className={cn("grid grid-cols-7 gap-xsmall")}>
        {locale.weekDays.map((wd) => (
          <div
            key={wd}
            className={cn(
              "flex items-center justify-center font-medium text-muted",
              WEEKDAY_CELL[size],
            )}
          >
            {wd}
          </div>
        ))}
      </div>

      <div className={cn("grid grid-cols-7 gap-xsmall")}>
        {cells.map((day, idx) => {
          if (day === null) {
            return (
              <div
                key={`empty-${year}-${month}-${idx}`}
                className={DAY_BTN[size]}
              />
            );
          }

          const date = new Date(year, month, day);
          const dayKey = `${year}-${month}-${day}`;
          const isToday = isSameDay(date, today);
          const isSel = mode !== "range" && selectedDates.some((s) => isSameDay(s, date));

          const isRangeStart = mode === "range" && !!rangeStart && isSameDay(date, rangeStart);
          const isRangeEnd =
            mode === "range" && !!effectiveRangeEnd && isSameDay(date, effectiveRangeEnd);
          const inRange =
            mode === "range" && !!rLow && !!rHigh ? date > rLow && date < rHigh : false;

          const sameStartEnd =
            mode === "range" &&
            !!rangeStart &&
            !!effectiveRangeEnd &&
            isSameDay(rangeStart, effectiveRangeEnd);

          const showLeftBg = !sameStartEnd && (inRange || isRangeEnd);
          const showRightBg = !sameStartEnd && (inRange || isRangeStart);

          const isDisabled = (!!minDate && date < minDate) || (!!maxDate && date > maxDate);
          const circleActive = isSel || isRangeStart || isRangeEnd;

          return (
            <div key={dayKey} className="relative flex items-center justify-center">
              {showLeftBg ? <CalendarRangeHalfFill visible side="left" /> : null}
              {showRightBg ? <CalendarRangeHalfFill visible side="right" /> : null}

              <CalendarInteractiveCell
                selected={circleActive}
                disabled={isDisabled}
                isToday={isToday}
                size={size}
                ariaLabel={`${day} ${locale.months[month]} ${year}`}
                ariaSelected={circleActive}
                onPress={() => onDayPress(date)}
                onMouseEnter={() => mode === "range" && !isDisabled && setHoverDate(date)}
                onMouseLeave={() => mode === "range" && setHoverDate(null)}
                className="relative z-10"
              >
                {day}
              </CalendarInteractiveCell>
            </div>
          );
        })}
      </div>
    </div>
  );
}


function CalendarMonthsView() {
  const { viewDate, onMonthPress, selectedDates, size, locale } = useCalendar();
  const year = viewDate.getFullYear();
  const today = new Date();

  return (
    <div className={cn("grid grid-cols-3", MONTH_GRID_GAP[size])}>
      {locale.monthsShort.map((name, month) => {
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
        const isSelected = selectedDates.some(
          (d) => d.getFullYear() === year && d.getMonth() === month,
        );

        return (
          <CalendarInteractiveCell
            key={month}
            selected={isSelected}
            isCurrent={isCurrentMonth}
            size={size}
            rounded="picker"
            onPress={() => onMonthPress(month)}
          >
            {name}
          </CalendarInteractiveCell>
        );
      })}
    </div>
  );
}


function CalendarYearsView() {
  const { viewDate, onYearPress, selectedDates, size } = useCalendar();
  const decadeStart = Math.floor(viewDate.getFullYear() / 10) * 10;
  const years = Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i);
  const today = new Date();

  return (
    <div className={cn("grid grid-cols-4", MONTH_GRID_GAP[size])}>
      {years.map((year) => {
        const isCurrentYear = today.getFullYear() === year;
        const isSelected = selectedDates.some((d) => d.getFullYear() === year);
        const outOfDecade = year < decadeStart || year > decadeStart + 9;

        return (
          <CalendarInteractiveCell
            key={year}
            selected={isSelected}
            isCurrent={isCurrentYear}
            size={size}
            rounded="picker"
            onPress={() => onYearPress(year)}
            className={outOfDecade && !isSelected ? "text-muted" : undefined}
          >
            {year}
          </CalendarInteractiveCell>
        );
      })}
    </div>
  );
}


export const CalendarFooter = forwardRef<HTMLDivElement, CalendarFooterProps>(
  function CalendarFooter({ className = "", ...rest }, ref) {
    const { onClear, onToday, locale } = useCalendar();

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between border-t-token pt-small",
          className,
        )}
        {...rest}
      >
        <Button variant="ghost" size="small" className="text-muted" onClick={onToday}>
          {locale.today}
        </Button>
        <Button variant="ghost" size="small" status="danger" onClick={onClear}>
          {locale.clear}
        </Button>
      </div>
    );
  },
);


CalendarRoot.displayName = "Calendar";
CalendarHeader.displayName = "Calendar.Header";
CalendarGrid.displayName = "Calendar.Grid";
CalendarFooter.displayName = "Calendar.Footer";

export { useCalendar };
