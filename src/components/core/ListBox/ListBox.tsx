import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import type {
  SelectionIndicatorSize,
  SelectionIndicatorVariant,
} from "@/components/core/SelectionIndicator";
import { Text } from "@/components/core/Text";
import { Separator } from "@/components/core/Separator";
import { partitionOptionListItemChildren } from "@/components/core/utils/optionListItemChildren";
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
import { cn } from "@/utils/cn";

export type ListBoxSize = "small" | "base" | "mid" | "large";

type ListBoxContextValue = {
  listId: string;
  size: ListBoxSize;
  multiple: boolean;
  selected: Set<string>;
  selectItem: (value: string) => void;
  activeValue: string | null;
  setActiveValue: (value: string | null) => void;
  showIndicator: boolean;
  indicatorMode: "radio" | "multi";
  disabled?: boolean;
};

const ListBoxContext = createContext<ListBoxContextValue | null>(null);

function useListBox(who: string): ListBoxContextValue {
  const ctx = useContext(ListBoxContext);
  if (!ctx) throw new Error(`${who} должен быть внутри <ListBox>.`);
  return ctx;
}

function normalizeValues(v: string | string[] | undefined): string[] {
  if (v == null) return [];
  return Array.isArray(v) ? [...v] : [v];
}

export type ListBoxRootProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> & {
  children?: ReactNode;
  size?: ListBoxSize;
  multiple?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  /** Показывать индикатор выбора слева. По умолчанию `true`. */
  selectionIndicator?: boolean;
  disabled?: boolean;
  /** Управляемый активный пункт (для combobox `aria-activedescendant`). */
  activeValue?: string | null;
  onActiveValueChange?: (value: string | null) => void;
  /** `id` корня listbox; иначе генерируется. */
  listId?: string;
};

export function ListBoxRoot({
  children,
  className,
  size = "base",
  multiple = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  selectionIndicator = true,
  disabled = false,
  activeValue: activeValueProp,
  onActiveValueChange,
  listId: listIdProp,
  ...rest
}: ListBoxRootProps) {
  const autoId = useId();
  const listId = listIdProp ?? `listbox-${autoId}`;

  const isControlledValue = valueProp !== undefined;
  const [internalSelected, setInternalSelected] = useState<string[]>(() =>
    normalizeValues(defaultValue),
  );
  const selectedArr = isControlledValue ? normalizeValues(valueProp) : internalSelected;
  const selected = useMemo(() => new Set(selectedArr), [selectedArr]);

  const [internalActive, setInternalActive] = useState<string | null>(null);
  const isControlledActive = activeValueProp !== undefined;
  const activeValue = isControlledActive ? activeValueProp : internalActive;

  const setActiveValue = useCallback(
    (next: string | null) => {
      if (!isControlledActive) setInternalActive(next);
      onActiveValueChange?.(next);
    },
    [isControlledActive, onActiveValueChange],
  );

  const setSelectedArr = useCallback(
    (next: string[]) => {
      if (!isControlledValue) setInternalSelected(next);
      onValueChange?.(multiple ? next : next[0] ?? "");
    },
    [isControlledValue, multiple, onValueChange],
  );

  const selectItem = useCallback(
    (itemValue: string) => {
      let next: string[];
      if (multiple) {
        next = [...selectedArr];
        const i = next.indexOf(itemValue);
        if (i >= 0) next.splice(i, 1);
        else next.push(itemValue);
      } else {
        next = selected.has(itemValue) ? [] : [itemValue];
      }
      setSelectedArr(next);
    },
    [multiple, selected, selectedArr, setSelectedArr],
  );

  const ctx = useMemo<ListBoxContextValue>(
    () => ({
      listId,
      size,
      multiple,
      selected,
      selectItem,
      activeValue,
      setActiveValue,
      showIndicator: selectionIndicator,
      indicatorMode: multiple ? "multi" : "radio",
      disabled,
    }),
    [
      activeValue,
      disabled,
      listId,
      multiple,
      selectItem,
      selected,
      selectionIndicator,
      setActiveValue,
      size,
    ],
  );

  return (
    <ListBoxContext.Provider value={ctx}>
      <div
        id={listId}
        role="listbox"
        className={cn("flex min-h-0 flex-col gap-xsmall text-left outline-none", className)}
        {...rest}
      >
        {children}
      </div>
    </ListBoxContext.Provider>
  );
}

ListBoxRoot.displayName = "ListBox";

const ListBoxSectionLabelContext = createContext<((id: string | undefined) => void) | null>(null);

export type ListBoxSectionProps = HTMLAttributes<HTMLDivElement>;

export function ListBoxSection({ className, children, ...rest }: ListBoxSectionProps) {
  const [labelId, setLabelId] = useState<string | undefined>();

  const registerLabel = useCallback((id: string | undefined) => {
    setLabelId(id);
  }, []);

  return (
    <ListBoxSectionLabelContext.Provider value={registerLabel}>
      <div
        role="group"
        aria-labelledby={labelId}
        className={cn("flex min-w-0 flex-col gap-xsmall", className)}
        {...rest}
      >
        {children}
      </div>
    </ListBoxSectionLabelContext.Provider>
  );
}

ListBoxSection.displayName = "ListBoxSection";

export type ListBoxHeaderProps = HTMLAttributes<HTMLDivElement>;

export function ListBoxHeader({ className, children, id: idProp, ...rest }: ListBoxHeaderProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const registerLabel = useContext(ListBoxSectionLabelContext);

  useEffect(() => {
    registerLabel?.(id);
    return () => registerLabel?.(undefined);
  }, [id, registerLabel]);

  return (
    <div id={id} className={cn("px-base text-left", className)} {...rest}>
      <Text as="span" variant="small" className="font-medium text-muted">
        {children}
      </Text>
    </div>
  );
}

ListBoxHeader.displayName = "ListBoxHeader";

export type ListBoxSeparatorProps = HTMLAttributes<HTMLDivElement>;

export function ListBoxSeparator({ className, ...rest }: ListBoxSeparatorProps) {
  return <Separator className={className} {...rest} />;
}

ListBoxSeparator.displayName = "ListBoxSeparator";

export type ListBoxEmptyProps = HTMLAttributes<HTMLParagraphElement>;

export function ListBoxEmpty({ className, children, ...rest }: ListBoxEmptyProps) {
  return (
    <Text
      as="p"
      variant="base"
      className={cn("px-base py-small text-center text-muted", className)}
      {...rest}
    >
      {children ?? "Нет совпадений"}
    </Text>
  );
}

ListBoxEmpty.displayName = "ListBoxEmpty";

export type ListBoxItemProps = Omit<HTMLAttributes<HTMLButtonElement>, "value"> & {
  value: string;
  disabled?: boolean;
  /** Текстовая подпись (simple API). */
  label?: ReactNode;
  /** Подсказка под подписью (simple API). */
  hint?: ReactNode;
  /** Иконка справа (simple API). */
  icon?: ReactNode;
};

export const ListBoxItem = forwardRef<HTMLButtonElement, ListBoxItemProps>(function ListBoxItem(
  {
    children,
    className,
    value,
    disabled: disabledProp = false,
    label,
    hint,
    icon,
    onClick,
    onPointerEnter,
    ...rest
  },
  ref,
) {
  const {
    listId,
    selected,
    selectItem,
    activeValue,
    setActiveValue,
    showIndicator,
    indicatorMode,
    disabled: listDisabled,
  } = useListBox("ListBox.Item");

  const disabled = disabledProp || Boolean(listDisabled);
  const isSelected = selected.has(value);
  const isActive = activeValue === value;
  const optionId = `${listId}-opt-${value}`;

  const parts = partitionOptionListItemChildren(children);
  const hasCompoundIndicator = parts.indicator != null;
  const showIndicatorSlot = showIndicator || hasCompoundIndicator;
  const hasHint = parts.hint != null || hint != null;
  const hasIcon = parts.icon != null || icon != null;
  const isCompound = parts.label != null || parts.hint != null || parts.icon != null;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || disabled) return;
      selectItem(value);
    },
    [disabled, onClick, selectItem, value],
  );

  const handleEnter = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerEnter?.(e);
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
  };

  const itemBody = isCompound ? (
    <>
      {showIndicatorSlot && !hasCompoundIndicator ? <ListBoxItemIndicator /> : null}
      {children}
    </>
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
          "w-full min-w-0 rounded-mid px-base py-small text-left outline-none",
          optionListItemGridClass(hasHint, "gap-x-base", showIndicatorSlot, hasIcon),
          "button-idle-surface-transition motion-reduce:transition-none",
          !disabled &&
            "cursor-pointer text-foreground hover:bg-accent-fill-hover focus-visible:bg-accent-fill-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          disabled &&
            "cursor-not-allowed bg-transparent text-muted opacity-45 hover:bg-transparent",
          isActive && !disabled && "bg-accent-fill-hover",
          className,
        )}
        onClick={handleClick}
        onPointerEnter={handleEnter}
        {...rest}
      >
        {itemBody}
      </button>
    </OptionListItemContextProvider>
  );
});

ListBoxItem.displayName = "ListBoxItem";

export type ListBoxLabelProps = HTMLAttributes<HTMLSpanElement>;

export function ListBoxLabel(props: ListBoxLabelProps) {
  return <OptionListItemLabel {...props} />;
}

ListBoxLabel.displayName = "ListBoxLabel";

export type ListBoxHintProps = HTMLAttributes<HTMLSpanElement>;

export function ListBoxHint(props: ListBoxHintProps) {
  return <OptionListItemHint {...props} />;
}

ListBoxHint.displayName = "ListBoxHint";

export type ListBoxIconProps = HTMLAttributes<HTMLSpanElement>;

export function ListBoxIcon(props: ListBoxIconProps) {
  return <OptionListItemIcon {...props} />;
}

ListBoxIcon.displayName = "ListBoxIcon";

export type ListBoxItemIndicatorProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  variant?: SelectionIndicatorVariant;
  size?: SelectionIndicatorSize;
  check?: boolean;
  children?: ReactNode;
};

export function ListBoxItemIndicator({
  variant = "base",
  size = "small",
  check,
  children,
  className,
  ...rest
}: ListBoxItemIndicatorProps) {
  const ctx = useOptionListItemContext("ListBox.ItemIndicator");

  if (!ctx.showIndicatorSlot) return null;

  const showCheck = check ?? ctx.indicatorMode === "multi";
  const hasCustomIcon = children != null;

  return (
    <OptionListItemIndicatorShell className={className} {...rest}>
      <SelectionIndicator
        variant={variant}
        size={size}
        selected={ctx.selected}
        check={showCheck && !hasCustomIcon}
        icon={children ?? undefined}
      />
    </OptionListItemIndicatorShell>
  );
}

ListBoxItemIndicator.displayName = "ListBoxItemIndicator";

export { useListBox };
