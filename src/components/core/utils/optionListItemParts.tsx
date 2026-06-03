import type { HTMLAttributes, ReactNode } from "react";

import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import {
  optionListItemHintCellClass,
  optionListItemIconCellClass,
  optionListItemIndicatorCellClass,
  optionListItemLabelCellClass,
} from "./optionControlGridLayout";
import { useOptionListItemContext } from "./optionListItemContext";

export type OptionListItemLabelProps = HTMLAttributes<HTMLSpanElement>;

export function OptionListItemLabel({ className, children, ...rest }: OptionListItemLabelProps) {
  const ctx = useOptionListItemContext("ItemLabel");
  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center",
        optionListItemLabelCellClass(ctx.showIndicatorSlot),
        ctx.hasHint && "min-w-0",
        className,
      )}
      {...rest}
    >
      <Text
        as="span"
        variant="base"
        inheritColor
        className={cn("font-medium", ctx.disabled && "text-muted")}
      >
        {children}
      </Text>
    </span>
  );
}

export type OptionListItemHintProps = HTMLAttributes<HTMLSpanElement>;

export function OptionListItemHint({ className, children, ...rest }: OptionListItemHintProps) {
  const ctx = useOptionListItemContext("ItemHint");
  return (
    <Text
      as="span"
      variant="tools"
      inheritColor
      className={cn(
        optionListItemHintCellClass(ctx.showIndicatorSlot),
        ctx.mutedHint || ctx.disabled ? "text-muted" : "opacity-80",
        className,
      )}
      {...rest}
    >
      {children}
    </Text>
  );
}

export type OptionListItemIconProps = HTMLAttributes<HTMLSpanElement>;

export function OptionListItemIcon({ className, children, ...rest }: OptionListItemIconProps) {
  const ctx = useOptionListItemContext("ItemIcon");
  return (
    <span
      className={cn(
        "inline-flex items-center [&_svg]:icon-base",
        optionListItemIconCellClass(ctx.showIndicatorSlot),
        ctx.mutedHint || ctx.disabled ? "text-muted" : "opacity-80",
        className,
      )}
      {...rest}
    >
      {typeof children === "string" ? (
        <Text as="span" variant="base" inheritColor className="opacity-90">
          {children}
        </Text>
      ) : (
        children
      )}
    </span>
  );
}

export type OptionListItemIndicatorShellProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export function OptionListItemIndicatorShell({
  className,
  children,
  ...rest
}: OptionListItemIndicatorShellProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        optionListItemIndicatorCellClass(),
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
