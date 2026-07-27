import {
  forwardRef,
  memo,
  useCallback,
  type HTMLAttributes,
  type Ref,
} from "react";

import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { animateInteractivePressSqueeze } from "@/components/core/utils/hoverInteractiveLift";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { OptionListItemContextProvider, useOptionListItemContext } from "@/components/core/utils/optionListItemContext";
import { OptionListItemHint, OptionListItemIcon, OptionListItemIndicatorShell, OptionListItemLabel } from "@/components/core/utils/optionListItemParts";

import { useDropdownClassNames } from "./dropdownContext";
import { dropdownItemRowClass, resolveDropdownItemIndicatorClassNames } from "./dropdownStyles";
import type {
  DropdownItemHintProps,
  DropdownItemIconProps,
  DropdownItemIndicatorProps,
  DropdownItemLabelProps,
  DropdownItemProps,
} from "./dropdownTypes";
import { useDropdownItemState } from "./useDropdownItemState";

import { cn } from "@/utils/cn";

export function DropdownItemLabel({
  className,
  ...props
}: DropdownItemLabelProps) {
  const slotClassNames = useDropdownClassNames();

  return (
    <OptionListItemLabel
      className={cn(slotClassNames.itemLabel, className)}
      {...props}
    />
  );
}

DropdownItemLabel.displayName = "DropdownItemLabel";

export function DropdownItemHint({ className, ...props }: DropdownItemHintProps) {
  const slotClassNames = useDropdownClassNames();

  return (
    <OptionListItemHint
      className={cn(slotClassNames.itemHint, className)}
      {...props}
    />
  );
}

DropdownItemHint.displayName = "DropdownItemHint";

export function DropdownItemIcon({
  className,
  ...props
}: DropdownItemIconProps) {
  const slotClassNames = useDropdownClassNames();

  return (
    <OptionListItemIcon
      className={cn(slotClassNames.itemIcon, className)}
      {...props}
    />
  );
}

DropdownItemIcon.displayName = "DropdownItemIcon";

export function DropdownItemIndicator({
  variant = "default",
  size = "small",
  check,
  children,
  className,
  classNames: classNamesProp,
  ...rest
}: DropdownItemIndicatorProps) {
  const ctx = useOptionListItemContext("Dropdown.ItemIndicator");
  const slotClassNames = useDropdownClassNames();

  if (!ctx.showIndicatorSlot) return null;

  const showCheck = check ?? ctx.indicatorMode === "multi";

  return (
    <OptionListItemIndicatorShell
      className={cn(
        slotClassNames.itemIndicator,
        classNamesProp?.itemIndicator,
        className,
      )}
      {...rest}
    >
      <SelectionIndicator
        variant={variant}
        size={size}
        selected={ctx.selected}
        check={showCheck}
        classNames={resolveDropdownItemIndicatorClassNames({
          slotClassNames,
          classNames: classNamesProp,
        })}
      >
        {children}
      </SelectionIndicator>
    </OptionListItemIndicatorShell>
  );
}

DropdownItemIndicator.displayName = "DropdownItemIndicator";

const DropdownItemInner = forwardRef<HTMLElement, DropdownItemProps>(
  function DropdownItem(
    {
      children,
      className,
      value,
      href,
      disabled = false,
      selection: selectionProp,
      status = "default",
      onClick,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = useDropdownClassNames();
    const {
      parts,
      selectItem,
      setOpen,
      hasItemIndicator,
      hasHint,
      hasIcon,
      isLink,
      isSelectionItem,
      showIndicatorSlot,
      itemRole,
      isSelected,
      itemCtx,
    } = useDropdownItemState({
      children,
      href,
      selection: selectionProp,
      value,
      disabled,
      status,
    });

    const setRefs = useCallback(
      (node: HTMLElement | null) => {
        mergeForwardedRef(ref, node);
      },
      [ref],
    );

    const rowClass = dropdownItemRowClass({
      status,
      disabled,
      hasHint,
      showIndicatorSlot,
      hasIcon,
      className,
      slotClass: slotClassNames.item,
    });

    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLElement>) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || disabled) return;
        const el = e.currentTarget;
        if (!el || prefersReducedMotion()) return;
        void animateInteractivePressSqueeze(el);
      },
      [disabled, onPointerDown],
    );

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || disabled) return;
        if (!isSelectionItem) {
          setOpen(false);
          return;
        }
        if (value == null) return;
        selectItem(value);
      },
      [disabled, isSelectionItem, onClick, selectItem, setOpen, value],
    );

    const itemBody = (
      <>
        {showIndicatorSlot && !hasItemIndicator ? <DropdownItemIndicator /> : null}
        {parts.indicator}
        {parts.label}
        {parts.hint}
        {parts.icon}
        {parts.rest}
      </>
    );

    if (isLink) {
      return (
        <OptionListItemContextProvider value={itemCtx}>
          <a
            ref={setRefs as Ref<HTMLAnchorElement>}
            role={itemRole}
            href={disabled ? undefined : href}
            tabIndex={-1}
            aria-disabled={disabled || undefined}
            className={rowClass}
            onClick={handleClick}
            onPointerDown={handlePointerDown}
            {...(rest as HTMLAttributes<HTMLAnchorElement>)}
          >
            {itemBody}
          </a>
        </OptionListItemContextProvider>
      );
    }

    return (
      <OptionListItemContextProvider value={itemCtx}>
        <button
          ref={setRefs as Ref<HTMLButtonElement>}
          type="button"
          role={itemRole}
          disabled={disabled}
          tabIndex={-1}
          aria-checked={showIndicatorSlot ? isSelected : undefined}
          className={rowClass}
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          {...(rest as HTMLAttributes<HTMLButtonElement>)}
        >
          {itemBody}
        </button>
      </OptionListItemContextProvider>
    );
  },
);

export const DropdownItem = memo(DropdownItemInner);

DropdownItem.displayName = "Dropdown.Item";
