import { useRef, type HTMLAttributes, type ReactNode, type RefObject } from "react";

import { cn } from "@/utils/cn";

import {
  SELECTION_INDICATOR_FILL_CLASS,
  SELECTION_INDICATOR_ICON_CLASS,
  SELECTION_INDICATOR_SHELL_CLASS,
  type SelectionIndicatorSize,
} from "../SelectionIndicator/selectionIndicatorTokens";
import { useSelectionIndicatorAnimation } from "../SelectionIndicator/useSelectionIndicatorAnimation";

export type SelectionThumbProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** Заливка кружка (checked / active / drag). */
  active: boolean;
  /** Размер иконки внутри (`icon-xsmall` …). */
  size?: SelectionIndicatorSize;
  shellRef?: RefObject<HTMLSpanElement | null>;
  fillRef?: RefObject<HTMLSpanElement | null>;
  children?: ReactNode;
};

/** Кружок-ручка для Slider / Switch: shell + accent-fill; размер от родителя (`size-full`). */
export function SelectionThumb({
  active,
  size = "base",
  shellRef,
  fillRef: fillRefProp,
  className,
  children,
  ...rest
}: SelectionThumbProps) {
  const internalFillRef = useRef<HTMLSpanElement>(null);
  const fillRef = fillRefProp ?? internalFillRef;

  useSelectionIndicatorAnimation(active, fillRef);

  return (
    <span
      ref={shellRef}
      className={cn(
        SELECTION_INDICATOR_SHELL_CLASS,
        "size-full min-h-0 min-w-0 origin-center border border-accent bg-surface",
        className,
      )}
      aria-hidden
      {...rest}
    >
      <span
        ref={fillRef}
        aria-hidden
        className={SELECTION_INDICATOR_FILL_CLASS}
        style={{ transform: "scale(0)", opacity: 0 }}
      />
      {children}
    </span>
  );
}

SelectionThumb.displayName = "SelectionThumb";

export type SelectionThumbIconProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  size?: SelectionIndicatorSize;
  /** `true` — accent-foreground на заливке; `false` — accent в покое (Slider). */
  highlighted?: boolean;
  iconRef?: RefObject<HTMLSpanElement | null>;
  children?: ReactNode;
};

export function SelectionThumbIcon({
  size = "base",
  highlighted = false,
  iconRef,
  className,
  children,
  style,
  ...rest
}: SelectionThumbIconProps) {
  return (
    <span
      ref={iconRef}
      aria-hidden
      className={cn(
        "pointer-events-none z-[1] flex items-center justify-center",
        highlighted ? "text-accent-foreground" : "text-accent",
        className,
      )}
      style={style}
      {...rest}
    >
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center [&_svg]:size-full",
          SELECTION_INDICATOR_ICON_CLASS[size],
        )}
      >
        {children}
      </span>
    </span>
  );
}

SelectionThumbIcon.displayName = "SelectionThumbIcon";
