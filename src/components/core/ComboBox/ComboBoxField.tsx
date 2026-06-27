import { useCallback, useEffect, useId, useMemo, useRef, useState, type HTMLAttributes, type ReactNode } from "react";

import { FieldRoot } from "@/components/core/Field";
import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import { FieldLabelContext } from "@/components/core/Label/fieldLabelContext";
import { Label } from "@/components/core/Label";
import type { InputSize, InputStatus, InputVariant } from "@/components/core/Input";
import { useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { cn } from "@/utils/cn";

import {
  ComboBoxInput,
  ComboBoxInputGroup,
  ComboBoxPopover,
  ComboBoxTrigger,
} from "./ComboBox";
import type { ComboBoxOption } from "./comboBoxContext";

const EMPTY_COMBOBOX_OPTIONS: ComboBoxOption[] = [];
import { comboBoxFilteredValues } from "./comboBoxOptionFilter";
import {
  ComboBoxContext,
  ComboBoxFieldContext,
  type ComboBoxContextValue,
} from "./comboBoxContext";
import { ComboBoxError } from "./comboBoxError";
import { ComboBoxHint } from "./comboBoxHint";

export type { ComboBoxErrorProps } from "./comboBoxError";
export type { ComboBoxHintProps } from "./comboBoxHint";
export { ComboBoxError } from "./comboBoxError";
export { ComboBoxHint } from "./comboBoxHint";

export type ComboBoxRootProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  id?: string;
  isRequired?: boolean;
  status?: InputStatus;
  size?: InputSize;
  /** Варианты для simple API и дефолтного `<ComboBox.Popover>`. */
  options?: ComboBoxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: InputVariant;
  disabled?: boolean;
  placeholder?: string;
  menuMaxHeight?: string;
};

export type ComboBoxSimpleProps = ComboBoxRootProps & {
  options: ComboBoxOption[];
};

export function ComboBoxRoot({
  children,
  label,
  hint,
  error,
  className,
  id: idProp,
  isRequired = false,
  status = "default",
  size = "base",
  options = EMPTY_COMBOBOX_OPTIONS,
  value: valueProp,
  defaultValue,
  onValueChange,
  variant: variantProp,
  disabled = false,
  placeholder = "Выберите значение",
  menuMaxHeight = "min(24rem, 70vh)",
  ...rest
}: ComboBoxRootProps) {
  const autoId = useId();
  const buttonGroupCtx = useOptionalButtonGroupSegment();
  const variant: InputVariant = variantProp ?? (buttonGroupCtx?.variant === "gloss" ? "gloss" : "default");
  const comboBoxId = idProp ?? `combobox-${autoId}`;
  const hintId = fieldHintId(comboBoxId);
  const errorId = fieldErrorId(comboBoxId);
  const labelId = `${comboBoxId}-label`;
  const listId = `${comboBoxId}-listbox`;

  const isCompound = hasCompoundChildren(children);
  const hasHint = hint != null || (isCompound && hasCompoundChild(children, "ComboBoxHint"));
  const hasError = error != null || (isCompound && hasCompoundChild(children, "ComboBoxError"));

  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const value = isControlled ? (valueProp ?? "") : internalValue;

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const [open, setOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [activeValue, setActiveValue] = useState<string | null>(null);

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open || !activeValue) return;
    document.getElementById(`${listId}-opt-${activeValue}`)?.scrollIntoView({ block: "nearest" });
  }, [activeValue, listId, open]);

  const filteredValues = useMemo(
    () => comboBoxFilteredValues(options, filterQuery),
    [filterQuery, options],
  );

  const fieldCtx = useMemo(
    () => ({
      comboBoxId,
      hintId,
      errorId,
      labelId,
      hintConnected: hasHint,
      errorConnected: hasError,
      isRequired,
      status,
      size,
    }),
    [comboBoxId, errorId, hasError, hasHint, hintId, isRequired, labelId, size, status],
  );

  const comboCtx = useMemo<ComboBoxContextValue>(
    () => ({
      ...fieldCtx,
      open,
      setOpen,
      value,
      setValue,
      filterQuery,
      setFilterQuery,
      listId,
      activeValue,
      setActiveValue,
      anchorRef,
      inputRef,
      variant,
      disabled,
      placeholder,
      menuMaxHeight,
      options,
      filteredValues,
    }),
    [
      activeValue,
      anchorRef,
      disabled,
      fieldCtx,
      filterQuery,
      filteredValues,
      inputRef,
      listId,
      menuMaxHeight,
      open,
      options,
      placeholder,
      setValue,
      value,
      variant,
    ],
  );

  const body = isCompound ? (
    children
  ) : (
    <>
      {label != null ? <Label id={labelId}>{label}</Label> : null}
      <ComboBoxInputGroup>
        <ComboBoxInput />
        <ComboBoxTrigger />
      </ComboBoxInputGroup>
      <ComboBoxPopover />
      {hint != null ? <ComboBoxHint>{hint}</ComboBoxHint> : null}
      {error != null ? <ComboBoxError>{error}</ComboBoxError> : null}
    </>
  );

  const fieldLabelCtx = useMemo(
    () => ({ controlId: comboBoxId, labelId, isRequired }),
    [comboBoxId, isRequired, labelId],
  );

  return (
    <ComboBoxFieldContext.Provider value={fieldCtx}>
      <ComboBoxContext.Provider value={comboCtx}>
        <FieldLabelContext.Provider value={fieldLabelCtx}>
          <FieldRoot className={cn(className)} {...rest}>
            {body}
          </FieldRoot>
        </FieldLabelContext.Provider>
      </ComboBoxContext.Provider>
    </ComboBoxFieldContext.Provider>
  );
}

ComboBoxRoot.displayName = "ComboBox";
