import {
  forwardRef,
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
} from "@/components/core/utils/hoverInteractiveLift";
import { cn } from "@/utils/cn";

type CalendarSize = ComponentSize;

const DAY_TEXT: Record<CalendarSize, TextVariant> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "mid",
};

const DAY_BTN: Record<CalendarSize, string> = {
  small: "h-control-small w-control-small",
  base: "h-control-base w-control-base",
  mid: "h-control-mid w-control-mid",
  large: "h-control-large w-control-large",
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
  rounded?: "full" | "mid";
  isToday?: boolean;
  isCurrent?: boolean;
  className?: string;
  onPress: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: ReactNode;
};

export const CalendarInteractiveCell = forwardRef<HTMLButtonElement, CalendarInteractiveCellProps>(
  function CalendarInteractiveCell(
    {
      selected,
      disabled = false,
      size,
      ariaLabel,
      ariaSelected,
      rounded = "full",
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

    useToggleButtonFillAnimation(selected, fillRef);

    const rounding = rounded === "full" ? "rounded-full" : "rounded-mid";
    const isDay = rounded === "full";
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

    const handlePointerEnter = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onMouseEnter?.();
        if (disabled || e.defaultPrevented) return;
        hoverInsideRef.current = true;
        const el = btnRef.current;
        if (!el || prefersReducedInteractiveHoverLift()) return;
        animateInteractiveHoverLift(el, true);
      },
      [disabled, onMouseEnter],
    );

    const handlePointerLeave = useCallback(() => {
        onMouseLeave?.();
        hoverInsideRef.current = false;
        const el = btnRef.current;
        if (!el || prefersReducedInteractiveHoverLift()) return;
        animateInteractiveHoverLift(el, false);
    }, [onMouseLeave]);

    const handlePointerDown = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        if (disabled || e.defaultPrevented) return;
        const el = btnRef.current;
        if (!el || prefersReducedInteractiveHoverLift()) return;
        void animateInteractivePressSqueeze(el).then(() => {
          const btn = btnRef.current;
          if (!btn || disabled || prefersReducedInteractiveHoverLift()) return;
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
        aria-selected={ariaSelected}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={onPress}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        className={cn(
          "relative inline-flex origin-center items-center justify-center overflow-hidden outline-none will-change-transform",
          "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
          rounding,
          sizeClass,
          selected
            ? "bg-transparent font-medium text-accent-foreground"
            : isToday || isCurrent
              ? "font-semibold text-accent"
              : "text-foreground",
          !selected && !disabled && "hover:bg-surface-secondary/60",
          disabled ? "cursor-not-allowed opacity-35" : "cursor-pointer",
          className,
        )}
      >
        <span
          ref={fillRef}
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-px z-0 origin-center bg-accent",
            rounding,
          )}
          style={{ transform: "scale(0)", opacity: 0 }}
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
            className="absolute bottom-[3px] left-1/2 z-[1] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-accent"
          />
        )}
      </button>
    );
  },
);

CalendarInteractiveCell.displayName = "CalendarInteractiveCell";

export { DAY_BTN, DAY_TEXT };
