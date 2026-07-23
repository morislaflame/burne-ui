import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { Text } from "@/components/core/Text";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import { optionListItemGridClass } from "@/components/core/utils/optionControlGridLayout";
import { OPTION_CONTROL_SIZE_LAYOUT } from "@/components/core/utils/optionControlSizeLayout";
import { OptionListItemContextProvider, useOptionListItemContext } from "@/components/core/utils/optionListItemContext";
import { OptionListItemHint, OptionListItemIcon, OptionListItemIndicatorShell, OptionListItemLabel } from "@/components/core/utils/optionListItemParts";

import { LISTBOX_EMPTY_DEFAULT_CHILDREN, listBoxActiveOptionId } from "./listBoxA11y";
import {
  listBoxBumpActiveValue,
  listBoxFirstEnabledValue,
  listBoxLastEnabledValue,
  listBoxPreferredInitialActiveValue,
  listBoxTypeaheadLabels,
  resolveListBoxIndicatorSize,
  resolveListBoxItemIndicatorClassNames,
} from "./listBoxAPI";
import { useListBoxItemAnimations, useListBoxRootGlossRef } from "./listBoxAnimations";
import { useListBox, useListBoxClassNames, useListBoxSectionLabelRegister, ListBoxSectionLabelProvider } from "./listBoxContext";
import { listBoxEmptyClass, listBoxHeaderClass, listBoxHeaderTextClass, listBoxItemClass, listBoxRootClass, listBoxSectionClass, listBoxSeparatorClass } from "./listBoxStyles";
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
import {
  createTypeaheadBufferState,
  isTypeaheadPrintableKey,
  typeaheadMatchIndex,
  typeaheadPush,
} from "@/components/core/utils/typeahead";

export function ListBoxRootShell({
  listId,
  variant = "default",
  className,
  ariaLabel,
  ariaLabelledBy,
  children,
  tabIndex: tabIndexProp,
  onKeyDown,
  onFocus,
  ...rest
}: ListBoxRootShellProps) {
  const slotClassNames = useListBoxClassNames();
  const {
    activeValue,
    setActiveValue,
    selectItem,
    multiple,
    disabled,
    standaloneKeyboard,
  } = useListBox("ListBox");
  const isGloss = variant === "gloss";
  const setRootRef = useListBoxRootGlossRef(isGloss);
  const typeaheadRef = useRef(createTypeaheadBufferState());

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || !standaloneKeyboard || disabled) return;

      const root = event.currentTarget;
      const keepFocusOnList = () => {
        if (document.activeElement !== root) root.focus();
      };

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const next = listBoxBumpActiveValue({
          root,
          activeValue,
          delta: 1,
        });
        if (next) setActiveValue(next);
        keepFocusOnList();
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        const next = listBoxBumpActiveValue({
          root,
          activeValue,
          delta: -1,
        });
        if (next) setActiveValue(next);
        keepFocusOnList();
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        const first = listBoxFirstEnabledValue(root);
        if (first) setActiveValue(first);
        keepFocusOnList();
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        const last = listBoxLastEnabledValue(root);
        if (last) setActiveValue(last);
        keepFocusOnList();
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        if (!activeValue) {
          const initial = listBoxPreferredInitialActiveValue(root);
          if (initial) {
            event.preventDefault();
            setActiveValue(initial);
            selectItem(initial);
            keepFocusOnList();
          }
          return;
        }
        event.preventDefault();
        selectItem(activeValue);
        keepFocusOnList();
        return;
      }

      if (isTypeaheadPrintableKey(event.key, event)) {
        event.preventDefault();
        const { values, labels } = listBoxTypeaheadLabels(root);
        const currentIdx = activeValue ? values.indexOf(activeValue) : -1;
        const nextIdx = typeaheadMatchIndex(
          labels,
          typeaheadPush(typeaheadRef.current, event.key),
          currentIdx,
        );
        if (nextIdx < 0) return;
        const next = values[nextIdx];
        if (next) setActiveValue(next);
        keepFocusOnList();
      }
    },
    [
      activeValue,
      disabled,
      onKeyDown,
      selectItem,
      setActiveValue,
      standaloneKeyboard,
    ],
  );

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      onFocus?.(event);
      if (event.defaultPrevented || !standaloneKeyboard || disabled) return;
      if (activeValue) return;
      const initial = listBoxPreferredInitialActiveValue(event.currentTarget);
      if (initial) setActiveValue(initial);
    },
    [activeValue, disabled, onFocus, setActiveValue, standaloneKeyboard],
  );

  const tabIndex =
    tabIndexProp ?? (standaloneKeyboard && !disabled ? 0 : undefined);

  return (
    <div
      ref={setRootRef}
      id={listId}
      role="listbox"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-multiselectable={multiple || undefined}
      aria-activedescendant={
        standaloneKeyboard
          ? listBoxActiveOptionId(listId, activeValue)
          : undefined
      }
      aria-disabled={disabled || undefined}
      tabIndex={tabIndex}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
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
  textClassName,
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
          className: textClassName,
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
      size,
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
          data-value={value}
          aria-selected={isSelected}
          disabled={disabled}
          tabIndex={-1}
          className={cn(
            listBoxItemClass({
              size,
              disabled,
              isActive,
            }),
            optionListItemGridClass(
              hasHint,
              OPTION_CONTROL_SIZE_LAYOUT[size].listItemGapX,
              showIndicatorSlot,
              hasIcon,
            ),
            slotClassNames.item,
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
  const { size } = useListBox("ListBox.Label");
  const slotClassNames = useListBoxClassNames();

  return (
    <OptionListItemLabel
      textVariant={CONTROL_SIZE_LAYOUT[size].controlText}
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
  const { size } = useListBox("ListBox.Icon");
  const slotClassNames = useListBoxClassNames();

  return (
    <OptionListItemIcon
      className={cn(
        `[&_svg]:${CONTROL_SIZE_LAYOUT[size].icon}`,
        slotClassNames.icon,
        className,
      )}
      {...props}
    />
  );
}

ListBoxIcon.displayName = "ListBoxIcon";

export function ListBoxItemIndicator({
  variant = "default",
  size: sizeProp,
  check,
  children,
  className,
  classNames: classNamesProp,
  ...rest
}: ListBoxItemIndicatorProps) {
  const ctx = useOptionListItemContext("ListBox.ItemIndicator");
  const { size: listSize } = useListBox("ListBox.ItemIndicator");
  const slotClassNames = useListBoxClassNames();
  const size = resolveListBoxIndicatorSize(listSize, sizeProp);

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
