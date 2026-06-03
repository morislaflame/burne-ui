import { useRef, type HTMLAttributes, type ReactNode } from "react";
import { IoCheckmarkSharp } from "react-icons/io5";

import { cn } from "@/utils/cn";

import {
  SELECTION_INDICATOR_FILL_CLASS,
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
  /** Галочка при выборе (Checkbox, multi Dropdown). */
  check?: boolean;
  /** Своя иконка поверх заливки вместо галочки. */
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

  const iconContent =
    iconProp ?? (check ? <IoCheckmarkSharp aria-hidden className="size-full" /> : undefined);
  const hasIcon = iconContent != null;

  useSelectionIndicatorAnimation(selected, fillRef, hasIcon ? iconRef : undefined);

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
        className={SELECTION_INDICATOR_FILL_CLASS}
        style={{ transform: "scale(0)", opacity: 0 }}
      />
      {hasIcon ? (
        <span
          ref={iconRef}
          aria-hidden
          className={cn(
            "pointer-events-none relative z-[1] inline-flex items-center justify-center text-accent-foreground [&_svg]:size-full",
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
