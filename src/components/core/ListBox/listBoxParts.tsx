import { forwardRef, memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { Text } from "@/components/core/Text";
import { focusElement } from "@/components/core/utils/focusElement";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { mergeMotionSlotMaps, useMotionPart } from "@/components/core/utils/slotMotion";
import { CONTROL_SIZE_LAYOUT, OPTION_CONTROL_SIZE_LAYOUT } from "@/components/core/utils/sizeLayout";
import { optionListItemGridClass } from "@/components/core/utils/optionControlGridLayout";
import { OptionListItemContextProvider, useOptionListItemContext, type OptionListItemContextValue } from "@/components/core/utils/optionListItemContext";
import { OptionListItemHint, OptionListItemIcon, OptionListItemIndicatorShell, OptionListItemLabel } from "@/components/core/utils/optionListItemParts";

import { LISTBOX_EMPTY_DEFAULT_CHILDREN, listBoxActiveOptionId, listBoxOptionId } from "./listBoxA11y";
import {
  listBoxBumpActiveValue,
  listBoxFirstEnabledValue,
  listBoxLastEnabledValue,
  listBoxPreferredInitialActiveValue,
  listBoxTypeaheadLabels,
  resolveListBoxIndicatorSize,
  resolveListBoxItemIndicatorClassNames,
} from "./listBoxAPI";
import {
  playListBoxItemPress,
  resolveListBoxMotionDefaults,
  useListBoxActiveOptionHighlight,
  useListBoxRootGlossRef,
} from "./listBoxAnimations";
import {
  useListBox,
  useListBoxActiveValue,
  useListBoxClassNames,
  useListBoxMotionScope,
  useListBoxSectionLabelRegister,
  useOptionalListBoxMotionScope,
  ListBoxMotionProvider,
  ListBoxSectionLabelProvider,
} from "./listBoxContext";
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
  const motionScope = useListBoxMotionScope();
  const {
    setActiveValue,
    selectItem,
    multiple,
    disabled,
    standaloneKeyboard,
  } = useListBox("ListBox");
  const activeValue = useListBoxActiveValue();
  const isGloss = variant === "gloss";
  const rootRef = useRef<HTMLDivElement | null>(null);
  const setGlossRef = useListBoxRootGlossRef(isGloss);
  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      setGlossRef(node);
    },
    [setGlossRef],
  );
  useListBoxActiveOptionHighlight({ listId, activeValue, rootRef });
  const typeaheadRef = useRef(createTypeaheadBufferState());

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || !standaloneKeyboard || disabled) return;

      const root = event.currentTarget;
      const keepFocusOnList = () => {
        if (document.activeElement !== root) focusElement(root);
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
            const option = document.getElementById(listBoxOptionId(listId, initial));
            if (option) playListBoxItemPress(motionScope, option);
            selectItem(initial);
            keepFocusOnList();
          }
          return;
        }
        event.preventDefault();
        const option = document.getElementById(listBoxOptionId(listId, activeValue));
        if (option) playListBoxItemPress(motionScope, option);
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
      listId,
      motionScope,
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

const ListBoxItemInner = forwardRef<HTMLButtonElement, ListBoxItemProps>(
  function ListBoxItem(
    {
      children,
      className,
      value,
      disabled: disabledProp = false,
      label,
      hint,
      icon,
      indicator = false,
      onClick,
      onPointerDown,
      onPointerEnter,
      onKeyDown,
      motion,
      ...rest
    },
    ref,
  ) {
    const parentScope = useOptionalListBoxMotionScope();
    const motionDefaults = useMemo(() => resolveListBoxMotionDefaults(), []);
    const mergedMotion = mergeMotionSlotMaps(
      parentScope?.getRootMotion(),
      motion ? { item: motion } : undefined,
    );

    return (
      <ListBoxMotionProvider motion={mergedMotion} defaults={motionDefaults}>
        <ListBoxItemSurface
          forwardedRef={ref}
          className={className}
          value={value}
          disabled={disabledProp}
          label={label}
          hint={hint}
          icon={icon}
          indicator={indicator}
          onClick={onClick}
          onPointerDown={onPointerDown}
          onPointerEnter={onPointerEnter}
          onKeyDown={onKeyDown}
          itemPartMotion={motion}
          rest={rest}
        >
          {children}
        </ListBoxItemSurface>
      </ListBoxMotionProvider>
    );
  },
);

function ListBoxItemSurface({
  forwardedRef,
  children,
  className,
  value,
  disabled: disabledProp,
  label,
  hint,
  icon,
  indicator,
  onClick,
  onPointerDown,
  onPointerEnter,
  onKeyDown,
  itemPartMotion,
  rest,
}: {
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  children?: ListBoxItemProps["children"];
  className?: string;
  value: string;
  disabled?: boolean;
  label?: ListBoxItemProps["label"];
  hint?: ListBoxItemProps["hint"];
  icon?: ListBoxItemProps["icon"];
  indicator?: boolean;
  onClick?: ListBoxItemProps["onClick"];
  onPointerDown?: ListBoxItemProps["onPointerDown"];
  onPointerEnter?: ListBoxItemProps["onPointerEnter"];
  onKeyDown?: ListBoxItemProps["onKeyDown"];
  itemPartMotion?: ListBoxItemProps["motion"];
  rest: Omit<
    ListBoxItemProps,
    | "children"
    | "className"
    | "value"
    | "disabled"
    | "label"
    | "hint"
    | "icon"
    | "indicator"
    | "onClick"
    | "onPointerDown"
    | "onPointerEnter"
    | "onKeyDown"
    | "motion"
  >;
}) {
    const slotClassNames = useListBoxClassNames();
    const {
      size,
      disabled,
      isSelected,
      optionId,
      indicatorMode,
      isCompound,
      parts,
      hasCompoundIndicator,
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
      indicator,
      value,
      disabled: disabledProp,
    });

    const { setRef, pointerHandlers } = useMotionPart<HTMLButtonElement>({
      scope: useOptionalListBoxMotionScope(),
      slot: "item",
      motion: itemPartMotion,
      pointerPhases: true,
      pressPhases: true,
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

    const itemCtx: OptionListItemContextValue = useMemo(
      () => ({
        showIndicatorSlot,
        hasHint,
        hasIcon,
        selected: isSelected,
        indicatorMode,
        disabled,
        mutedHint: disabled,
        enableLabelMotion: false,
      }),
      [disabled, hasHint, hasIcon, indicatorMode, isSelected, showIndicatorSlot],
    );

    const autoIndicator =
      showIndicatorSlot && !hasCompoundIndicator ? <ListBoxItemIndicator /> : null;

    // Compound: slots + freeform rest (Dropdown.Item pattern).
    const itemBody = isCompound ? (
      <>
        {parts.indicator}
        {autoIndicator}
        {parts.label}
        {parts.hint}
        {parts.icon}
        {parts.rest}
      </>
    ) : (
      <>
        {autoIndicator}
        {label != null ? <ListBoxLabel>{label}</ListBoxLabel> : null}
        {hint != null ? <ListBoxHint>{hint}</ListBoxHint> : null}
        {icon != null ? <ListBoxIcon>{icon}</ListBoxIcon> : null}
      </>
    );

    const useItemGrid = showIndicatorSlot || hasHint || hasIcon || hasLabel;

    return (
      <OptionListItemContextProvider value={itemCtx}>
        <button
          ref={(node) => {
            mergeForwardedRef(forwardedRef, node);
            setRef(node);
          }}
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
            }),
            useItemGrid
              ? optionListItemGridClass(
                  hasHint,
                  OPTION_CONTROL_SIZE_LAYOUT[size].listItemGapX,
                  showIndicatorSlot,
                  hasIcon,
                )
              : undefined,
            slotClassNames.item,
            className,
          )}
          onClick={handleClick}
          onPointerEnter={handleEnter}
          onKeyDown={onKeyDown}
          {...rest}
          {...pointerHandlers}
        >
          {itemBody}
        </button>
      </OptionListItemContextProvider>
    );
}

export const ListBoxItem = memo(ListBoxItemInner);

ListBoxItem.displayName = "ListBoxItem";

export function ListBoxLabel({ className, motion, ...props }: ListBoxLabelProps) {
  const { size } = useListBox("ListBox.Label");
  const slotClassNames = useListBoxClassNames();
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalListBoxMotionScope(),
    slot: "label",
    motion,
    pointerPhases: true,
    pressPhases: true,
  });

  return (
    <OptionListItemLabel
      ref={setRef}
      textVariant={CONTROL_SIZE_LAYOUT[size].controlText}
      className={cn(slotClassNames.label, className)}
      {...pointerHandlers}
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

export function ListBoxIcon({ className, motion, ...props }: ListBoxIconProps) {
  const { size } = useListBox("ListBox.Icon");
  const slotClassNames = useListBoxClassNames();
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalListBoxMotionScope(),
    slot: "icon",
    motion,
    pointerPhases: true,
    pressPhases: true,
  });

  return (
    <OptionListItemIcon
      ref={setRef}
      className={cn(
        `[&_svg]:${CONTROL_SIZE_LAYOUT[size].icon}`,
        slotClassNames.icon,
        className,
      )}
      {...pointerHandlers}
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
