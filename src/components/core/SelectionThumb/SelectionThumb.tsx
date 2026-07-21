import { useRef, type HTMLAttributes, type ReactNode, type RefObject } from "react";

import "../utils/glossPanel.css";
import { cn } from "@/utils/cn";

import { SELECTION_INDICATOR_FILL_GLOSS_TINT_CLASS, SELECTION_INDICATOR_ICON_CLASS, SELECTION_INDICATOR_SHELL_CLASS, selectionIndicatorFillClass, type SelectionIndicatorSize } from "../SelectionIndicator/selectionIndicatorTokens";
import { useSelectionIndicatorAnimation } from "../SelectionIndicator/useSelectionIndicatorAnimation";

export type SelectionThumbProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  active: boolean;
  size?: SelectionIndicatorSize;
  shellRef?: RefObject<HTMLSpanElement | null>;
  fillRef?: RefObject<HTMLSpanElement | null>;
  gloss?: boolean;
  children?: ReactNode;
};

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

  const fillClass = gloss
    ? SELECTION_INDICATOR_FILL_GLOSS_TINT_CLASS
    : selectionIndicatorFillClass("default");

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
  highlighted?: boolean;
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
