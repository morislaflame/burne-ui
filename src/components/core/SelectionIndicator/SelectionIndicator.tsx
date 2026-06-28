import { useRef, type HTMLAttributes, type ReactNode } from "react";
import { IoCheckmarkSharp } from "react-icons/io5";

import "../utils/glossPanel.css";
import { cn } from "@/utils/cn";

import {
  SELECTION_INDICATOR_FILL_CLASS,
  SELECTION_INDICATOR_FILL_GLOSS_CLASS,
  SELECTION_INDICATOR_ICON_CLASS,
  selectionIndicatorShellClass,
  selectionIndicatorVariantClass,
  type SelectionIndicatorSize,
  type SelectionIndicatorVariant,
} from "./selectionIndicatorTokens";
import { useSelectionIndicatorAnimation } from "./useSelectionIndicatorAnimation";

export type SelectionIndicatorProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  size?: SelectionIndicatorSize;
  variant?: SelectionIndicatorVariant;
  selected: boolean;
  check?: boolean;
  icon?: ReactNode;
};

export function SelectionIndicator({
  size = "base",
  variant = "base",
  selected,
  check = false,
  icon: iconProp,
  className,
  ...rest
}: SelectionIndicatorProps) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  const isGloss = variant === "gloss";

  const iconContent =
    iconProp ?? (check ? <IoCheckmarkSharp aria-hidden className="size-full" /> : undefined);
  const hasIcon = iconContent != null;

  useSelectionIndicatorAnimation(selected, fillRef, hasIcon ? iconRef : undefined);

  const fillClass = isGloss ? SELECTION_INDICATOR_FILL_GLOSS_CLASS : SELECTION_INDICATOR_FILL_CLASS;
  const iconColorClass = isGloss ? "text-foreground" : "text-indicator-foreground";

  return (
    <span
      className={selectionIndicatorShellClass(
        size,
        cn(selectionIndicatorVariantClass(variant, selected), className),
      )}
      aria-hidden
      {...rest}
    >
      <span
        ref={fillRef}
        className={fillClass}
        style={{ transform: "scale(0)", opacity: 0 }}
      />
      {hasIcon ? (
        <span
          ref={iconRef}
          aria-hidden
          className={cn(
            "pointer-events-none relative z-[2] inline-flex items-center justify-center [&_svg]:size-full",
            iconColorClass,
            SELECTION_INDICATOR_ICON_CLASS[size],
          )}
          style={{ opacity: 0 }}
        >
          {iconContent}
        </span>
      ) : null}
    </span>
  );
}

SelectionIndicator.displayName = "SelectionIndicator";
