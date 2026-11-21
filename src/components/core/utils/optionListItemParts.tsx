import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
 
import { Text, type TextVariant } from "@/components/core/Text";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { cn } from "@/utils/cn";
 
import { optionListItemHintCellClass, optionListItemIconCellClass, optionListItemIndicatorCellClass, optionListItemLabelCellClass } from "./optionControlGridLayout";
import { useOptionListItemContext } from "./optionListItemContext";
import { OPTION_LIST_ITEM_ICON_WRAP_CLASS, OPTION_LIST_ITEM_INDICATOR_SHELL_CLASS, OPTION_LIST_ITEM_LABEL_MIN_WIDTH_CLASS, OPTION_LIST_ITEM_LABEL_MOTION_CLASS, OPTION_LIST_ITEM_LABEL_TEXT_FILL_CLASS, OPTION_LIST_ITEM_LABEL_WRAP_CLASS, OPTION_LIST_ITEM_STRING_LABEL_CLASS, optionListItemHintToneClass, optionListItemLabelTextClass } from "./optionListItemStyles";
 
export type OptionListItemLabelProps = HTMLAttributes<HTMLSpanElement> & {
  /** Typography for the label text. @default "base" */
  textVariant?: TextVariant;
};

export const OptionListItemLabel = forwardRef<HTMLSpanElement, OptionListItemLabelProps>(
  function OptionListItemLabel({
  className,
  children,
  textVariant = "base",
  ...rest
}, ref) {
  const ctx = useOptionListItemContext("ItemLabel");
  return (
    <span
      ref={(node) => {
        if (ctx.enableLabelMotion && ctx.labelMotionRef) {
          ctx.labelMotionRef.current = node;
        }
        if (ref != null) mergeForwardedRef(ref, node);
      }}
      className={cn(
        OPTION_LIST_ITEM_LABEL_WRAP_CLASS,
        optionListItemLabelCellClass(ctx.showIndicatorSlot),
        ctx.hasHint && OPTION_LIST_ITEM_LABEL_MIN_WIDTH_CLASS,
        ctx.enableLabelMotion && OPTION_LIST_ITEM_LABEL_MOTION_CLASS,
        className,
      )}
      {...rest}
    >
      <Text
        as="span"
        textStyle={textVariant}
        inheritColor
        className={cn(
          OPTION_LIST_ITEM_LABEL_TEXT_FILL_CLASS,
          optionListItemLabelTextClass(Boolean(ctx.disabled)),
        )}
      >
        {children}
      </Text>
    </span>
  );
});

export type OptionListItemHintProps = HTMLAttributes<HTMLSpanElement>;

export const OptionListItemHint = forwardRef<HTMLElement, OptionListItemHintProps>(
  function OptionListItemHint({ className, children, ...rest }, ref) {
  const ctx = useOptionListItemContext("ItemHint");
  return (
    <Text
      ref={ref}
      as="span"
      textStyle="xsmall"
      inheritColor
      className={cn(
        optionListItemHintCellClass(ctx.showIndicatorSlot),
        optionListItemHintToneClass(Boolean(ctx.mutedHint || ctx.disabled)),
        className,
      )}
      {...rest}
    >
      {children}
    </Text>
  );
});
 
function OptionListItemStringLabel({ children }: { children: string }) {
  return (
    <Text as="span" textStyle="base" inheritColor className={OPTION_LIST_ITEM_STRING_LABEL_CLASS}>
      {children}
    </Text>
  );
}
 
export type OptionListItemIconProps = HTMLAttributes<HTMLSpanElement>;
 
export function OptionListItemIconText({ children }: { children: string }) {
  return <OptionListItemStringLabel>{children}</OptionListItemStringLabel>;
}
 
export const OptionListItemIcon = forwardRef<HTMLSpanElement, OptionListItemIconProps>(
  function OptionListItemIcon({ className, children, ...rest }, ref) {
  const ctx = useOptionListItemContext("ItemIcon");
  return (
    <span
      ref={ref}
      className={cn(
        OPTION_LIST_ITEM_ICON_WRAP_CLASS,
        optionListItemIconCellClass(ctx.showIndicatorSlot),
        optionListItemHintToneClass(Boolean(ctx.mutedHint || ctx.disabled)),
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
});
 
export type OptionListItemIndicatorShellProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};
 
export const OptionListItemIndicatorShell = forwardRef<HTMLSpanElement, OptionListItemIndicatorShellProps>(
  function OptionListItemIndicatorShell({ className, children, ...rest }, ref) {
    return (
      <span
        className={cn(
          OPTION_LIST_ITEM_INDICATOR_SHELL_CLASS,
          optionListItemIndicatorCellClass(),
          className,
        )}
        {...rest}
        ref={ref}
      >
        {children}
      </span>
    );
  },
);
 