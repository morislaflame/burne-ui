import {
  forwardRef,
  memo,
  useCallback,
  useRef,
  type PointerEvent,
  type ReactNode,
} from "react";

import { Text, type TextVariant } from "@/components/core/Text";
import { useToggleButtonFillAnimation } from "@/components/core/ToggleButton/useToggleButtonFillAnimation";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  hoverVariant,
  SURFACE_COLOR_TRANSITION,
} from "@/components/core/utils/hoverVariant";
import { cn } from "@/utils/cn";

type CalendarSize = ComponentSize;

const DAY_TEXT: Record<CalendarSize, TextVariant> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "mid",
};

const DAY_BTN: Record<CalendarSize, string> = {
  small: "mx-auto aspect-square w-full max-w-control-small",
  base: "mx-auto aspect-square w-full max-w-control-base",
  mid: "mx-auto aspect-square w-full max-w-control-mid",
  large: "mx-auto aspect-square w-full max-w-control-large",
};

const PICKER_TEXT: Record<CalendarSize, TextVariant> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "mid",
};

const PICKER_BTN: Record<CalendarSize, string> = {
  small: "min-h-control-small w-full px-small py-xsmall",
  base: "min-h-control-base w-full px-plus py-small",
  mid: "min-h-control-mid w-full px-mid py-plus",
  large: "min-h-control-large w-full px-mid py-plus",
};

type CalendarInteractiveCellProps = {
  selected: boolean;
  disabled?: boolean;
  size: CalendarSize;
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

const CalendarInteractiveCellInner = forwardRef<HTMLButtonElement, CalendarInteractiveCellProps>(
  function CalendarInteractiveCell(
    {
      selected,
      disabled = false,
      size,
      ariaLabel,
      ariaSelected,
      rounded = "day",
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
    const btnRef = useRef<HTMLButtonElement>(null);
    const fillRef = useRef<HTMLSpanElement>(null);
    const hoverInsideRef = useRef(false);
    const onPressRef = useRef(onPress);
    const onMouseEnterRef = useRef(onMouseEnter);
    const onMouseLeaveRef = useRef(onMouseLeave);

    onPressRef.current = onPress;
    onMouseEnterRef.current = onMouseEnter;
    onMouseLeaveRef.current = onMouseLeave;

    // Заливку ведёт только `selected` через layout-effect — без optimistic toggle на click
    // (range preview уже поднимает selected до клика).
    const { bindFillRef } = useToggleButtonFillAnimation(selected, fillRef);

    const rounding = "rounded-mid";
    const isDay = rounded === "day";
    const textVariant = isDay ? DAY_TEXT[size] : PICKER_TEXT[size];
    const sizeClass = isDay ? DAY_BTN[size] : PICKER_BTN[size];

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        btnRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const handleClick = useCallback(() => {
      if (disabled) return;
      onPressRef.current();
    }, [disabled]);

    const handlePointerEnter = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onMouseEnterRef.current?.();
        if (disabled || e.defaultPrevented) return;
        hoverInsideRef.current = true;
        const el = btnRef.current;
        if (!el || shouldSkipInteractiveHoverLift()) return;
        animateInteractiveHoverLift(el, true);
      },
      [disabled],
    );

    const handlePointerLeave = useCallback(() => {
      onMouseLeaveRef.current?.();
      hoverInsideRef.current = false;
      const el = btnRef.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, false);
    }, []);

    const handlePointerDown = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        if (disabled || e.defaultPrevented) return;
        const el = btnRef.current;
        if (!el || prefersReducedInteractiveHoverLift()) return;
        void animateInteractivePressSqueeze(el).then(() => {
          const btn = btnRef.current;
          if (!btn || disabled || shouldSkipInteractiveHoverLift()) return;
          if (hoverInsideRef.current) animateInteractiveHoverLift(btn, true);
        });
      },
      [disabled],
    );

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
        onPointerDown={handlePointerDown}
        className={cn(
          "group/calendar-cell relative inline-flex origin-center items-center justify-center overflow-hidden outline-none will-change-transform",
          "focus-ring",
          rounding,
          sizeClass,
          selected
            ? "bg-transparent font-medium text-primary-foreground"
            : isToday || isCurrent
              ? "font-semibold text-primary"
              : "text-foreground",
          !selected && !disabled && hoverVariant(),
          disabled ? "cursor-not-allowed opacity-35" : "cursor-pointer",
          className,
        )}
      >
        <span
          ref={bindFillRef}
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-px z-0 origin-center will-change-transform bg-primary",
            SURFACE_COLOR_TRANSITION,
            "motion-reduce:transition-none group-hover/calendar-cell:bg-primary-hover",
            rounding,
          )}
        />
        <Text
          variant={textVariant}
          as="span"
          inheritColor
          className="relative z-[1] min-w-0 shrink-0 leading-none"
        >
          {children}
        </Text>
        {isToday && !selected && (
          <span
            aria-hidden
            className="absolute bottom-[3px] left-1/2 z-[1] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-primary"
          />
        )}
      </button>
    );
  },
);

function calendarCellPropsEqual(
  prev: CalendarInteractiveCellProps,
  next: CalendarInteractiveCellProps,
): boolean {
  return (
    prev.selected === next.selected &&
    prev.disabled === next.disabled &&
    prev.size === next.size &&
    prev.rounded === next.rounded &&
    prev.isToday === next.isToday &&
    prev.isCurrent === next.isCurrent &&
    prev.ariaLabel === next.ariaLabel &&
    prev.ariaSelected === next.ariaSelected &&
    prev.className === next.className &&
    prev.children === next.children
  );
}

export const CalendarInteractiveCell = memo(CalendarInteractiveCellInner, calendarCellPropsEqual);

CalendarInteractiveCell.displayName = "CalendarInteractiveCell";

export { DAY_BTN, DAY_TEXT };
