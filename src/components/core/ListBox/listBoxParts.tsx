import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";

import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { Text } from "@/components/core/Text";
import { optionListItemGridClass } from "@/components/core/utils/optionControlGridLayout";
import {
  OptionListItemContextProvider,
  useOptionListItemContext,
} from "@/components/core/utils/optionListItemContext";
import {
  OptionListItemHint,
  OptionListItemIcon,
  OptionListItemIndicatorShell,
  OptionListItemLabel,
} from "@/components/core/utils/optionListItemParts";

import {
  LISTBOX_EMPTY_DEFAULT_CHILDREN,
} from "./listBoxA11y";
import { resolveListBoxItemIndicatorClassNames } from "./listBoxAPI";
import { useListBoxItemAnimations, useListBoxRootGlossRef } from "./listBoxAnimations";
import {
  useListBoxClassNames,
  useListBoxSectionLabelRegister,
  ListBoxSectionLabelProvider,
} from "./listBoxContext";
import {
  listBoxEmptyClass,
  listBoxHeaderClass,
  listBoxHeaderTextClass,
  listBoxItemClass,
  listBoxRootClass,
  listBoxSectionClass,
  listBoxSeparatorClass,
} from "./listBoxStyles";
import type {
  ListBoxEmptyProps,
  ListBoxHeaderProps,
  ListBoxHintProps,
  ListBoxIconProps,
  ListBoxItemIndicatorProps,
  ListBoxItemProps,
  ListBoxLabelProps,
  ListBoxRootShellProps,
  ListBoxSectionProps,
  ListBoxSeparatorProps,
} from "./listBoxTypes";
import { useListBoxItemState } from "./useListBoxItemState";

import { cn } from "@/utils/cn";

export function ListBoxRootShell({
  listId,
  variant = "default",
  className,
  ariaLabel,
  ariaLabelledBy,
  children,
  ...rest
}: ListBoxRootShellProps) {
  const slotClassNames = useListBoxClassNames();
  const isGloss = variant === "gloss";
  const setRootRef = useListBoxRootGlossRef(isGloss);

  return (
    <div
      ref={setRootRef}
      id={listId}
      role="listbox"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={listBoxRootClass({
        isGloss,
        slotClass: slotClassNames.root,
        className,
      })}
      {...rest}
    >
      {children}
    </div>
  );
}

ListBoxRootShell.displayName = "ListBox";

export function ListBoxSection({ className, children, ...rest }: ListBoxSectionProps) {
  const slotClassNames = useListBoxClassNames();
  const [labelId, setLabelId] = useState<string | undefined>();

  const registerLabel = useCallback((id: string | undefined) => {
    setLabelId(id);
  }, []);

  return (
    <ListBoxSectionLabelProvider value={registerLabel}>
      <div
        role="group"
        aria-labelledby={labelId}
        className={listBoxSectionClass({
          slotClass: slotClassNames.section,
          className,
        })}
        {...rest}
      >
        {children}
      </div>
    </ListBoxSectionLabelProvider>
  );
}

ListBoxSection.displayName = "ListBoxSection";

export function ListBoxHeader({
  className,
  children,
  id: idProp,
  ...rest
}: ListBoxHeaderProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const slotClassNames = useListBoxClassNames();
  const registerLabel = useListBoxSectionLabelRegister();

  useEffect(() => {
    registerLabel?.(id);
    return () => registerLabel?.(undefined);
  }, [id, registerLabel]);

  return (
    <div
      id={id}
      className={listBoxHeaderClass({
        slotClass: slotClassNames.header,
        className,
      })}
      {...rest}
    >
      <Text
        as="span"
        variant="small"
        className={listBoxHeaderTextClass({
          slotClass: slotClassNames.headerText,
        })}
      >
        {children}
      </Text>
    </div>
  );
}

ListBoxHeader.displayName = "ListBoxHeader";

export function ListBoxSeparator({ className, ...rest }: ListBoxSeparatorProps) {
  const slotClassNames = useListBoxClassNames();

  return (
    <div
      role="presentation"
      aria-hidden
      className={listBoxSeparatorClass({
        slotClass: slotClassNames.separator,
        className,
      })}
      {...rest}
    />
  );
}

ListBoxSeparator.displayName = "ListBoxSeparator";

export function ListBoxEmpty({
  className,
  children,
  ...rest
}: ListBoxEmptyProps) {
  const slotClassNames = useListBoxClassNames();

  return (
    <Text
      as="p"
      variant="base"
      className={listBoxEmptyClass({
        slotClass: slotClassNames.empty,
        className,
      })}
      {...rest}
    >
      {children ?? LISTBOX_EMPTY_DEFAULT_CHILDREN}
    </Text>
  );
}

ListBoxEmpty.displayName = "ListBoxEmpty";

export const ListBoxItem = forwardRef<HTMLButtonElement, ListBoxItemProps>(
  function ListBoxItem(
    {
      children,
      className,
      value,
      disabled: disabledProp = false,
      label,
      hint,
      icon,
      onClick,
      onPointerDown,
      onPointerEnter,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = useListBoxClassNames();
    const {
      disabled,
      isSelected,
      isActive,
      optionId,
      indicatorMode,
      isCompound,
      hasHint,
      hasIcon,
      hasLabel,
      showIndicatorSlot,
      selectItem,
      setActiveValue,
    } = useListBoxItemState({
      children,
      label,
      hint,
      icon,
      value,
      disabled: disabledProp,
    });

    const { labelMotionRef, enableLabelMotion, handlePointerDown } =
      useListBoxItemAnimations({
        disabled,
        hasLabel,
        onPointerDown,
      });

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented || disabled) return;
        selectItem(value);
      },
      [disabled, onClick, selectItem, value],
    );

    const handleEnter = useCallback(
      (event: React.PointerEvent<HTMLButtonElement>) => {
        onPointerEnter?.(event);
        if (disabled) return;
        setActiveValue(value);
      },
      [disabled, onPointerEnter, setActiveValue, value],
    );

    const itemCtx = {
      showIndicatorSlot,
      hasHint,
      hasIcon,
      selected: isSelected,
      indicatorMode,
      disabled,
      mutedHint: disabled,
      enableLabelMotion,
      labelMotionRef,
    };

    const itemBody = isCompound ? (
      <>{children}</>
    ) : (
      <>
        {showIndicatorSlot ? <ListBoxItemIndicator /> : null}
        {label != null ? <ListBoxLabel>{label}</ListBoxLabel> : null}
        {hint != null ? <ListBoxHint>{hint}</ListBoxHint> : null}
        {icon != null ? <ListBoxIcon>{icon}</ListBoxIcon> : null}
      </>
    );

    return (
      <OptionListItemContextProvider value={itemCtx}>
        <button
          ref={ref}
          type="button"
          id={optionId}
          role="option"
          aria-selected={isSelected}
          disabled={disabled}
          tabIndex={-1}
          className={cn(
            listBoxItemClass({
              disabled,
              isActive,
              slotClass: slotClassNames.item,
            }),
            optionListItemGridClass(
              hasHint,
              "gap-x-base",
              showIndicatorSlot,
              hasIcon,
            ),
            className,
          )}
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          onPointerEnter={handleEnter}
          {...rest}
        >
          {itemBody}
        </button>
      </OptionListItemContextProvider>
    );
  },
);

ListBoxItem.displayName = "ListBoxItem";

export function ListBoxLabel({ className, ...props }: ListBoxLabelProps) {
  const slotClassNames = useListBoxClassNames();

  return (
    <OptionListItemLabel
      className={cn(slotClassNames.label, className)}
      {...props}
    />
  );
}

ListBoxLabel.displayName = "ListBoxLabel";

export function ListBoxHint({ className, ...props }: ListBoxHintProps) {
  const slotClassNames = useListBoxClassNames();

  return (
    <OptionListItemHint
      className={cn(slotClassNames.hint, className)}
      {...props}
    />
  );
}

ListBoxHint.displayName = "ListBoxHint";

export function ListBoxIcon({ className, ...props }: ListBoxIconProps) {
  const slotClassNames = useListBoxClassNames();

  return (
    <OptionListItemIcon
      className={cn(slotClassNames.icon, className)}
      {...props}
    />
  );
}

ListBoxIcon.displayName = "ListBoxIcon";

export function ListBoxItemIndicator({
  variant = "default",
  size = "small",
  check,
  children,
  className,
  classNames: classNamesProp,
  ...rest
}: ListBoxItemIndicatorProps) {
  const ctx = useOptionListItemContext("ListBox.ItemIndicator");
  const slotClassNames = useListBoxClassNames();

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
        classNames={resolveListBoxItemIndicatorClassNames({
          slotClassNames,
          classNames: classNamesProp,
        })}
      >
        {children}
      </SelectionIndicator>
    </OptionListItemIndicatorShell>
  );
}

ListBoxItemIndicator.displayName = "ListBoxItemIndicator";
