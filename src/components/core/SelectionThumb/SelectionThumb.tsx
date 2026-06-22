import { useRef, type HTMLAttributes, type ReactNode, type RefObject } from "react";

import "../utils/glossPanel.css";
import { cn } from "@/utils/cn";

import {
  SELECTION_INDICATOR_FILL_CLASS,
  SELECTION_INDICATOR_FILL_GLOSS_CLASS,
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
  /** Gloss-вариант: стеклянный кружок с gloss-заливкой и иконкой foreground цвета. */
  gloss?: boolean;
  children?: ReactNode;
};

/** Кружок-ручка для Slider / Switch: shell + primary-fill; размер от родителя (`size-full`). */
export function SelectionThumb({
  active,
  size = "base",
  gloss = false,
  shellRef,
  fillRef: fillRefProp,
  className,
  children,
  ...rest
}: SelectionThumbProps) {
  const internalFillRef = useRef<HTMLSpanElement>(null);
  const fillRef = fillRefProp ?? internalFillRef;

  useSelectionIndicatorAnimation(active, fillRef);

  const shellClass = gloss
    ? cn(SELECTION_INDICATOR_SHELL_CLASS, "gloss-indicator size-full min-h-0 min-w-0 origin-center border-0", className)
    : cn(SELECTION_INDICATOR_SHELL_CLASS, "size-full min-h-0 min-w-0 origin-center border border-primary bg-surface", className);

  const fillClass = gloss ? SELECTION_INDICATOR_FILL_GLOSS_CLASS : SELECTION_INDICATOR_FILL_CLASS;

  return (
    <span
      ref={shellRef}
      className={shellClass}
      aria-hidden
      {...rest}
    >
      <span
        ref={fillRef}
        aria-hidden
        className={fillClass}
        style={{ transform: "scale(0)", opacity: 0 }}
      />
      {children}
    </span>
  );
}

SelectionThumb.displayName = "SelectionThumb";

export type SelectionThumbIconProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  size?: SelectionIndicatorSize;
  /** `true` — indicator-foreground на заливке; `false` — primary в покое (Slider/Switch off). */
  highlighted?: boolean;
  /** `true` — всегда foreground (gloss-режим). */
  gloss?: boolean;
  iconRef?: RefObject<HTMLSpanElement | null>;
  children?: ReactNode;
};

export function SelectionThumbIcon({
  size = "base",
  highlighted = false,
  gloss = false,
  iconRef,
  className,
  children,
  style,
  ...rest
}: SelectionThumbIconProps) {
  const colorClass = gloss
    ? "text-foreground"
    : highlighted
      ? "text-indicator-foreground"
      : "text-primary";

  return (
    <span
      ref={iconRef}
      aria-hidden
      className={cn(
        "pointer-events-none z-[2] flex items-center justify-center",
        colorClass,
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
